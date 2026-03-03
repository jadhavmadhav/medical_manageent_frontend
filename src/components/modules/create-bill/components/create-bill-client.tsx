"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Save, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { BillInfoCard } from "./BillInfoCard";
import { ProductsCard } from "./ProductsCard";
import { PatientCard } from "./PatientCard";
import { DoctorCard } from "./DoctorCard";
import { BillSummaryCard } from "./BillSummaryCard";
import { useBillForm } from "../hooks/useBillForm";
import { createNewBill, UpdateBill } from "@/services/new-sale-entry";
import { useGetBill, useUpdateBill } from "../hooks/Usebill";


interface CreateBillClientProps {
  enterpriseId: string;
  bill_id?: string;
}

export function CreateBillClient({ enterpriseId, bill_id }: CreateBillClientProps) {
  const router = useRouter();
  const isEditMode = !!bill_id;

  // ── Fetch existing bill (edit mode only) ──────────────────────────────────
  const { data: existingBill, isLoading: isBillLoading } = useGetBill(bill_id);

  // ── Form state — hydrates from existingBill once it resolves ──────────────
  const {
    billDate, setBillDate,
    status, setStatus,
    payMethod, setPayMethod,
    dueDate, setDueDate,
    items, addItem, removeItem, updateItemDiscount,
    billDiscType, setBillDiscType,
    billDiscValue, setBillDiscValue,
    billDiscAmount,
    patient, setPatient,
    doctor, setDoctor,
    itemsSubtotal, grandTotal, requiresDoctor,
    buildPayload, validate,
  } = useBillForm({ enterpriseId, initialData: existingBill });

  // ── Create mutation ───────────────────────────────────────────────────────
  const { mutate: createBillMutation, isPending: isCreating } = useMutation({
    mutationFn: createNewBill,
    onSuccess: (data) => {
      toast.success(data?.message ?? "Bill created successfully!");
      router.back();
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Failed to create bill.");
    },
  });

  // ── Update mutation ───────────────────────────────────────────────────────



  const { mutate: updateBillMutation, isPending: isUpdating } = useMutation({
    mutationFn: UpdateBill,
    onSuccess: (data) => {
      console.log("data ----->", data)
      if (data.status === 200) {
        toast.success(data?.message ?? "Bill updated successfully!");
        router.back();
      }
      else {
        toast.error(data.message)
      }
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Failed to update bill.");
    }
  });

  const isPending = isCreating || isUpdating;

  // ── Save / Update handler ─────────────────────────────────────────────────
  const handleSave = () => {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    const payload = buildPayload();
    if (!payload) return;

    if (isEditMode && bill_id) {
      // Spread base payload and attach bill_id for the update route
      const updatePayload: any = { ...payload, _id: bill_id };
      updateBillMutation(updatePayload);
    } else {
      createBillMutation(payload);
    }
  };

  // ── Show skeleton while the existing bill is being fetched ────────────────
  if (isEditMode && isBillLoading) {
    return <BillFormSkeleton />;
  }

  return (
    <div className="min-h-full p-6">
      {/* ── Topbar ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-lg font-extrabold tracking-tight">
            {isEditMode ? "Edit Bill" : "Create Bill"}
          </h1>
        </div>
      </div>


      {/* ── Layout ────────────────────────────────────────────────── */}
      <div className="mx-auto py-4 flex gap-4 items-start">
        {/* Main column */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          <BillInfoCard
            billDate={billDate}
            onBillDateChange={setBillDate}
            status={status}
            onStatusChange={setStatus}
            payMethod={payMethod}
            onPayMethodChange={setPayMethod}
            dueDate={dueDate}
            onDueDateChange={setDueDate}
          />
          <ProductsCard
            items={items}
            onAdd={addItem}
            onRemove={removeItem}
            onUpdateDiscount={updateItemDiscount}
            billDiscType={billDiscType}
            onBillDiscTypeChange={setBillDiscType}
            billDiscValue={billDiscValue}
            onBillDiscValueChange={setBillDiscValue}
            billDiscAmount={billDiscAmount}
            itemsSubtotal={itemsSubtotal}
            grandTotal={grandTotal}
            enterpriseId={enterpriseId}
          />
        </div>

        {/* Sidebar */}
        <div className="w-[295px] shrink-0 flex flex-col gap-4">
          <PatientCard
            value={patient}
            onChange={setPatient}
            enterpriseId={enterpriseId}
          />
          <DoctorCard
            value={doctor}
            onChange={setDoctor}
            required={requiresDoctor}
            enterpriseId={enterpriseId}
          />
          <BillSummaryCard
            itemsSubtotal={itemsSubtotal}
            billDiscAmount={billDiscAmount}
            billDiscType={billDiscType}
            billDiscValue={billDiscValue}
            grandTotal={grandTotal}
            status={status}
            dueDate={dueDate}
            onSave={handleSave}
            isPending={isPending}
            isEditMode={isEditMode}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton shown while fetching the existing bill in edit mode ─────────────

function BillFormSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="bg-white border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>
      </div>
      <div className="mx-auto px-6 py-5 flex gap-4 items-start">
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-border p-5 space-y-3">
            <Skeleton className="h-4 w-32" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-9 rounded-lg" />
              <Skeleton className="h-9 rounded-lg" />
              <Skeleton className="h-9 rounded-lg" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-border p-5 space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <div className="space-y-3 mt-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
        <div className="w-[295px] shrink-0 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-border p-5 space-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-16 rounded-lg" />
          </div>
          <div className="bg-white rounded-xl border border-border p-5 space-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-9 rounded-lg" />
          </div>
          <div className="bg-slate-900 rounded-xl p-5 space-y-3">
            <Skeleton className="h-4 w-20 bg-slate-700" />
            <Skeleton className="h-4 w-full bg-slate-700" />
            <Skeleton className="h-4 w-full bg-slate-700" />
            <Skeleton className="h-px w-full bg-slate-700" />
            <Skeleton className="h-8 w-full bg-slate-700" />
            <Skeleton className="h-10 w-full rounded-lg bg-slate-700" />
          </div>
        </div>
      </div>
    </div>
  );
}