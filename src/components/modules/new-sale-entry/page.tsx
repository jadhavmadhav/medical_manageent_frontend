"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { User, Stethoscope } from "lucide-react";

// Components
import { Card } from "@/components/ui/card";
import BillItemsTable from "./components/BillItemsTable";
import Instructions from "./components/Instructions";
import BillSummary from "./components/BillSummary";
import MedicineSearch from "./components/MedicineSearch";
import NewEntityModal from "./components/NewEntityModal";
import PatientSelectionModal from "./components/PatientSelectionModal";
import DoctorSelectionModal from "./components/DoctorSelectionModal";

// React Query
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDoctor,
  createNewBill,
  createPatient,
  getAllInventories,
  getBillById,
  searchDoctors,
  searchPatients,
  UpdateBill,
} from "@/services/new-sale-entry";

// Interfaces
import type {
  Patient,
  Doctor,
  Product,
  BillItem,
  SaleData,
} from "../../../types/new-sale-entry";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";

const NewSaleEntryView = ({
  enterpriseId,
  bill_id,
}: {
  enterpriseId: string;
  bill_id?: string;
}) => {
  const medicineSearchRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  // Core state
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [billItems, setBillItems] = useState<any[]>([]);
  const [billDate, setBillDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [isWalletPatient, setIsWalletPatient] = useState<boolean>(false);



  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  // FIX 1: Removed filteredProducts useState. We will use useMemo below.

  // UI state
  const [showInstructions, setShowInstructions] = useState(false);
  const [modals, setModals] = useState({
    patient: false,
    doctor: false,
    newPatient: false,
    newDoctor: false,
  });

  const [payment, setPayment] = useState({
    mode: "",
    status: "pending",
  });

  const [patientAndDoctorInfo, serPatientAndDoctorInfo] = useState(false);

  const router = useRouter();

  // FIX 2: Memoize selectors to prevent reference instability
  const selectResultOrEmpty = useCallback(
    (data: any) => data?.result || [],
    []
  );

  const selectBillData = useCallback((data: any) => data?.result, []);

  // Queries
  const { data: inventories = [] } = useQuery({
    queryKey: ["inventories", enterpriseId],
    queryFn: () => getAllInventories({ enterpriseId }),
    enabled: !!enterpriseId,
    select: selectResultOrEmpty, // Using stable selector
  });

  const { data: billData } = useQuery<{ result: any }>({
    queryKey: ["billData", bill_id],
    queryFn: () => getBillById(bill_id!),
    select: selectBillData,
    enabled: Boolean(bill_id),
  });

  // FIX 3: Guard against unnecessary updates
  useEffect(() => {
    if (billData) {
      console.log("billData", billData);
      const { doctor, patient, items, paymentMethod, status, date, dueDate } =
        billData as any;

      // Only update if we haven't loaded items yet or if strictly needed
      // Ideally, check if IDs match, but for now, this prevents basic race conditions

      setSelectedDoctor(doctor);
      setSelectedPatient(patient);
      setBillItems(items);
      setBillDate(new Date(date));
      setDueDate(dueDate ? new Date(dueDate) : null);
      setPayment({
        mode: paymentMethod,
        status,
      });
    }
  }, [billData]); // Removing billItems/selectedPatient from dep array to avoid loops, purely sync from server

  useEffect(() => {
    if (!selectedPatient) {
      const defaultPatient = {
        _id: "68b43d9bf7e9f8c0895400be",
        enterpriseId: "6700d404515345c548d3df49",
        name: "Walk-in Customer",
        mobile_number: "XXXXXXXXXXX",
        address: "Walk-in Customer Address",
      };

      setSelectedPatient(defaultPatient as any);
      setIsWalletPatient(true);
      setPayment({ ...payment, status: "paid" });

    }

  }, [selectedPatient]);

  // Mutations
  const { mutate: createDoctorMutation } = useMutation({
    mutationFn: createDoctor,
    onSuccess: (newDoctor: any) => {
      setSelectedDoctor(newDoctor?.doctor ?? null);
      setModals((m) => ({ ...m, newDoctor: false }));
    },
    onError: (err) => console.error(err),
  });

  const { mutate: createPatientMutation } = useMutation({
    mutationFn: createPatient,
    onSuccess: (data: any) => {
      const newPatientResponse = data?.result;
      setSelectedPatient(newPatientResponse);
      setModals((m) => ({ ...m, newPatient: false }));
      console.log("Patient created and selected:", newPatientResponse);
    },
    onError: (e: any) => console.error(`Error creating patient: ${e.message}`),
  });

  const { mutate: createBillMutation, isPending } = useMutation({
    mutationFn: createNewBill,
    onSuccess: (data) => {
      console.log("Bill created:", data);
      toast.success(data?.message);
      serPatientAndDoctorInfo(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: updateBill, isPending: isUpdating } = useMutation({
    mutationKey: ["update-bill"],
    mutationFn: UpdateBill,
    onSuccess: (data) => {
      console.log("Bill created:", data);
      toast.success(data?.message);
      serPatientAndDoctorInfo(false);
      resetForm();
      router.push(`/patient-bills`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Derived totals
  const subtotal = useMemo(
    () => billItems?.reduce((sum, item) => sum + item.total, 0),
    [billItems]
  );

  const totalTax = useMemo(
    () =>
      billItems.reduce(
        (sum, item) => sum + (item?.total * (item.taxRate || 0)) / 100,
        0
      ),
    [billItems]
  );

  const grandTotal = useMemo(() => subtotal + totalTax, [subtotal, totalTax]);

  // FIX 1 IMPLEMENTATION: Product search filter using useMemo
  // This calculates the filtered list during render, removing the need for a separate effect and state update
  const filteredProducts = useMemo(() => {
    const term = searchTerm?.trim().toLowerCase();

    if (!term || !Array.isArray(inventories) || inventories.length === 0) {
      return [];
    }

    return inventories.filter((p: Product) =>
      p?.item?.toLowerCase().includes(term)
    );
  }, [searchTerm, inventories]);

  // Reset highlight when search results change
  useEffect(() => {
    setHighlightedIndex(filteredProducts.length > 0 ? 0 : -1);
  }, [filteredProducts.length]); // Depend on length to avoid deep object comparison issues

  // Focus on mount
  useEffect(() => {
    medicineSearchRef.current?.focus();
  }, []); // Only run once on mount

  // Memoized handlers
  const addProductToBill = useCallback(
    (product: Product) => {
      const existingIndex = billItems.findIndex(
        (i: any) => i._id === product._id
      );

      if (existingIndex >= 0) {
        const updated = [...billItems];
        const existing = updated[existingIndex];
        updated[existingIndex] = {
          ...existing,
          quantity: existing.quantity + 1,
          total:
            (existing.quantity + 1) *
            (existing.sellingPrice - existing.discount),
        };
        setBillItems(updated);
      } else {
        setBillItems([
          {
            ...product,
            quantity: 1,
            discount: 0,
            total: Number(product.sellingPrice),
          },
          ...billItems,
        ]);
      }

      setSearchTerm("");
      // No need to clear filteredProducts as it is derived from searchTerm
      setHighlightedIndex(-1);
      medicineSearchRef.current?.focus();
    },
    [billItems]
  );

  const updateQuantity = useCallback(
    (productId: string, newQty: string) => {
      if (isNaN(Number(newQty))) return;
      const product = inventories?.find((p: any) => p?._id === productId);
      if (product && Number(newQty) > product?.availableQuantity) {
        // alert(`Stock limit: ${product?.availableQuantity}`);
        toast.warning(`Stock limit: ${product?.availableQuantity}`);
        return;
      }
      setBillItems((items) =>
        items.map((i: any) =>
          i._id === productId
            ? {
              ...i,
              quantity: Number(newQty),
              // Ensure total calculation is correct
              total: Number(newQty) * (i.sellingPrice - i.discount),
            }
            : i
        )
      );
    },
    [inventories]
  );

  const updateDiscount = useCallback(
    (productId: string, newDiscount: string) => {
      if (isNaN(Number(newDiscount))) return;
      setBillItems((items) =>
        items?.map((i: any) =>
          i._id === productId
            ? {
              ...i,
              discount: Number(newDiscount),
              // Ensure total calculation is correct
              total: i.quantity * (i.sellingPrice - Number(newDiscount)),
            }
            : i
        )
      );
    },
    []
  );

  const removeItem = useCallback(
    (productId: string) =>
      setBillItems((items) => items?.filter((i: any) => i._id !== productId)),
    []
  );

  const resetForm = useCallback(() => {
    setSelectedPatient(null);
    setSelectedDoctor(null);
    setBillItems([]);
    setPayment({ mode: "cash", status: "pending" });
    medicineSearchRef.current?.focus();
  }, []);

  const collectSaleData = useCallback(
    (patientResponse: any): SaleData => ({
      enterpriseId,
      patient: patientResponse,
      doctor: selectedDoctor,
      items: billItems,
      status: payment?.status,
      paymentMethod: payment?.status === "paid" ? payment?.mode : "-",
      subtotal,
      totalTax,
      grandTotal,
      date: billDate,
      dueDate: payment?.status === "pending" ? dueDate : null,
    }),
    [
      enterpriseId,
      selectedDoctor,
      billItems,
      payment,
      subtotal,
      totalTax,
      grandTotal,
      billDate,
      dueDate,
    ]
  );

  const handleCompleteSale = useCallback(() => {
    if (!billItems?.length) {
      toast.warning(
        "Please add at least one medicine before completing the sale."
      );
      return;
    }

    const requiresDetails = billItems.some((item) =>
      ["H1", "H"].includes(item.schedule)
    );

    // 🧠 If sale requires patient & doctor info
    if (requiresDetails) {
      if (!selectedPatient) {
        serPatientAndDoctorInfo(true);
        toast.error(
          "Patient details are required for Schedule H/H1 medicines."
        );
        return;
      }

      if (!selectedDoctor) {
        serPatientAndDoctorInfo(true);
        toast.error("Doctor details are required for Schedule H/H1 medicines.");
        return;
      }
    }

    try {
      const saleData = collectSaleData(selectedPatient);
      console.log("saleData", saleData);
      if (!saleData) {
        toast.error("Something went wrong while preparing the bill.");
        return;
      }

      if (bill_id) {
        updateBill({ ...saleData, _id: bill_id });
      } else {
        createBillMutation(saleData);
      }
    } catch (error) {
      console.error("Error completing sale:", error);
      toast.error("Failed to complete sale. Please try again.");
    }
  }, [
    billItems,
    selectedPatient,
    selectedDoctor,
    bill_id,
    collectSaleData,
    createBillMutation,
    updateBill,
  ]);

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (filteredProducts.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredProducts.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredProducts.length - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (highlightedIndex >= 0) {
          addProductToBill(filteredProducts[highlightedIndex]);
        }
      } else if (e.key === "Escape") {
        setSearchTerm("");
        // No need to set filteredProducts manually
      }
    },
    [filteredProducts, highlightedIndex, addProductToBill]
  );

  return (
    <div className="h-full p-4 flex flex-col">
      <h1 className="text-xl font-extrabold">New Sale Entry</h1>

      <Card className="p-0 overflow-hidden w-full mt-6 flex-grow flex flex-col shadow-lg border-2">
        <Instructions
          showInstructions={showInstructions}
          setShowInstructions={setShowInstructions}
        />

        <div className="flex flex-col md:flex-row flex-grow">
          {/* Left panel */}
          <div className="flex-1 p-6 border-r flex flex-col">
            <div className="pb-4 border-b flex justify-between">
              {/* Patient & Doctor Selection Area - Refined UI */}
              <div className="flex flex-wrap gap-4 mb-6 ">
                {/* Patient Selection */}
                <div
                  className={`flex items-center gap-3 p-3  rounded-lg border ${patientAndDoctorInfo && !selectedPatient
                    ? "border-red-400 bg-red-50"
                    : "border-blue-200 bg-blue-50"
                    } min-w-[200px]`}
                >
                  <User className="h-5 w-5 text-blue-600" />
                  <div className="flex flex-col">
                    {selectedPatient ? (
                      <p className="text-blue-800 font-semibold truncate max-w-[150px]">
                        {selectedPatient.name}
                      </p>
                    ) : (
                      <p className="text-gray-500 italic">
                        No Patient Selected
                      </p>
                    )}
                    <Button
                      onClick={() =>
                        setModals((m) => ({ ...m, patient: true }))
                      }
                      variant="link"
                      size="sm"
                      className="p-0 h-auto text-blue-600 hover:text-blue-800 justify-start"
                    >
                      {selectedPatient ? "Change Patient" : "Select Patient"}
                    </Button>
                  </div>
                </div>

                {/* Doctor Selection */}
                <div
                  className={`flex items-center gap-3 p-3  rounded-lg border ${patientAndDoctorInfo && !selectedDoctor
                    ? "border-red-400 bg-red-50"
                    : "bg-green-50 rounded-lg border border-green-200 "
                    } min-w-[200px]`}
                >
                  <Stethoscope className="h-5 w-5 text-green-600" />
                  <div className="flex flex-col">
                    {selectedDoctor ? (
                      <p className="text-green-800 font-semibold truncate max-w-[150px]">
                        {selectedDoctor.name}
                      </p>
                    ) : (
                      <p className="text-gray-500 italic">No Doctor Selected</p>
                    )}
                    <Button
                      onClick={() => setModals((m) => ({ ...m, doctor: true }))}
                      variant="link"
                      size="sm"
                      className="p-0 h-auto text-green-600 hover:text-green-800 justify-start"
                    >
                      {selectedDoctor ? "Change Doctor" : "Select Doctor"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-1 items-start">
                <span>Bill Date:</span>
                <input
                  type="date"
                  className="border border-primary rounded px-2 py-1 text-sm bg-secondary"
                  value={billDate ? billDate.toISOString().slice(0, 10) : ""}
                  onChange={(e) => setBillDate(new Date(e.target.value))}
                />
              </div>
            </div>
            {/* End Patient & Doctor Selection Area */}

            <MedicineSearch
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filteredProducts={filteredProducts}
              highlightedIndex={highlightedIndex}
              addProductToBill={addProductToBill}
              medicineSearchRef={medicineSearchRef}
              handleSearchKeyDown={handleSearchKeyDown}
            />

            <BillItemsTable
              billItems={billItems}
              updateQuantity={updateQuantity}
              updateDiscount={updateDiscount}
              removeItem={removeItem}
            />
          </div>

          {/* Right panel */}
          <BillSummary
            isDisabled={isPending || billItems.length === 0}
            confirmBtnText={
              bill_id
                ? "Update Bill"
                : isUpdating || isPending
                  ? "Processing..."
                  : "Create New Entry"
            }
            subtotal={subtotal}
            totalTax={totalTax}
            grandTotal={grandTotal}
            paymentStatus={payment?.status}
            setPaymentStatus={(s) => setPayment((p) => ({ ...p, status: s }))}
            paymentMode={payment?.mode}
            setPaymentMode={(m) => setPayment((p) => ({ ...p, mode: m }))}
            resetForm={resetForm}
            completeSale={handleCompleteSale}
            dueDate={dueDate}
            setDueDate={setDueDate} 
            isWalletPatient={isWalletPatient}
          />
        </div>
      </Card>

      {/* Modals */}
      <PatientSelectionModal
        patientModalOpen={modals?.patient}
        setPatientModalOpen={(v) => setModals((m) => ({ ...m, patient: v }))}
        selectedPatient={selectedPatient}
        setSelectedPatient={setSelectedPatient}
        enterpriseId={enterpriseId}
        setNewPatientModalOpen={(v) =>
          setModals((m) => ({ ...m, newPatient: v }))
        }
      />

      <DoctorSelectionModal
        doctorModalOpen={modals?.doctor}
        setDoctorModalOpen={(v) => setModals((m) => ({ ...m, doctor: v }))}
        selectedDoctor={selectedDoctor}
        setSelectedDoctor={setSelectedDoctor}
        enterpriseId={enterpriseId}
        setNewDoctorModalOpen={(v) =>
          setModals((m) => ({ ...m, newDoctor: v }))
        }
      />

      <NewEntityModal
        entityType="patient"
        open={modals?.newPatient!}
        setOpen={(v) => setModals((m) => ({ ...m, newPatient: v }))}
        onSubmit={createPatientMutation}
        enterpriseId={enterpriseId}
      />

      <NewEntityModal
        entityType="doctor"
        open={modals?.newDoctor!}
        setOpen={(v) => setModals((m) => ({ ...m, newDoctor: v }))}
        onSubmit={createDoctorMutation}
        enterpriseId={enterpriseId}
      />
    </div>
  );
};

export default NewSaleEntryView;
