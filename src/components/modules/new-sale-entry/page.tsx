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

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // UI state
  const [showInstructions, setShowInstructions] = useState(false);
  const [modals, setModals] = useState({
    patient: false,
    doctor: false,
    newPatient: false,
    newDoctor: false,
  });

  const [payment, setPayment] = useState({
    mode: "cash",
    status: "pending",
  });

  const [patientAndDoctorInfo, serPatientAndDoctorInfo] = useState(false);

  const router = useRouter();

  // Queries
  const { data: inventories = [] } = useQuery({
    queryKey: ["inventories", enterpriseId],
    queryFn: () => getAllInventories({ enterpriseId }),
    enabled: !!enterpriseId,
    select: (data) => data?.result || [],
  });

  const { data: patients = [] } = useQuery({
    queryKey: ["patients", enterpriseId],
    queryFn: () => searchPatients({ enterpriseId }),
    enabled: !!enterpriseId,
    select: (data) => data?.result || [],
  });

  const { data: doctors = [] } = useQuery({
    queryKey: ["doctors", enterpriseId],
    queryFn: () => searchDoctors({ enterpriseId }),
    enabled: !!enterpriseId,
    select: (data) => data?.doctors || [],
  });

  const { data: billData } = useQuery<{ result: any }>({
    queryKey: ["billData", bill_id],
    queryFn: () => getBillById(bill_id!),
    select: (data) => data.result, // now billData is Bill | undefined
    enabled: !!bill_id,
  });

  useEffect(() => {
    if (billData) {
      const { doctor, patient, items, paymentMethod, status } = billData as any;

      setSelectedDoctor(doctor);
      setSelectedPatient(patient);
      setBillItems(items);
      setPayment({
        mode: paymentMethod,
        status,
      });
    }
  }, [billData]);

  useEffect(() => {
    if (patients.length > 0) {
      const defaultPatient = patients.find(
        (p: Patient) => p.name === "Walk-in Customer"
      );
      if (!selectedPatient && defaultPatient) {
        setSelectedPatient(defaultPatient);
      }
    }
  }, [patients]);

  // Mutations
  const { mutate: createDoctorMutation } = useMutation({
    mutationFn: createDoctor,
    onSuccess: (newDoctor) => {
      queryClient.invalidateQueries({ queryKey: ["doctors", enterpriseId] });
      setSelectedDoctor(newDoctor?.doctor ?? null);
      setModals((m) => ({ ...m, newDoctor: false }));
    },
    onError: (err) => console.error(err),
  });

  const { mutate: createPatientMutation } = useMutation({
    mutationFn: createPatient,
    onSuccess: (data: any) => {
      const newPatientResponse = data.result;
      queryClient.invalidateQueries({ queryKey: ["patients", enterpriseId] });
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
  console.log("isUpdating", isUpdating);
  // Derived totals
  const subtotal = useMemo(
    () => billItems.reduce((sum, item) => sum + item.total, 0),
    [billItems]
  );

  const totalTax = useMemo(
    () =>
      billItems.reduce(
        (sum, item) => sum + (item.total * (item.taxRate || 0)) / 100,
        0
      ),
    [billItems]
  );

  const grandTotal = useMemo(() => subtotal + totalTax, [subtotal, totalTax]);

  // Product search filter
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts([]);
      setHighlightedIndex(-1);
      return;
    }
    const filtered = inventories?.filter((p: Product) =>
      p.item.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
    setHighlightedIndex(0);
  }, [searchTerm, inventories?.length]);

  // Focus on mount
  useEffect(() => {
    medicineSearchRef.current?.focus();
    if (bill_id) {
    }
  }, [bill_id]);

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
      setFilteredProducts([]);
      setHighlightedIndex(-1);
      medicineSearchRef.current?.focus();
    },
    [billItems]
  );

  const updateQuantity = useCallback(
    (productId: string, newQty: string) => {
      if (isNaN(Number(newQty))) return;
      const product = inventories.find((p: any) => p._id === productId);
      if (product && Number(newQty) > product.availableQuantity) {
        // 💡 UX Improvement: Use a better notification/toast system in a real app
        alert(`Stock limit: ${product.availableQuantity}`);
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
        items.map((i: any) =>
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
      setBillItems((items) => items.filter((i: any) => i._id !== productId)),
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
      status: payment.status,
      paymentMethod: payment.mode,
      subtotal,
      totalTax,
      grandTotal,
      date: new Date(),
    }),
    [
      enterpriseId,
      selectedDoctor,
      billItems,
      payment,
      subtotal,
      totalTax,
      grandTotal,
    ]
  );

  const handleCompleteSale = useCallback(() => {
    // 💡 UX Improvement: Use a better notification/toast system in a real app
    if (billItems.length === 0) {
      alert("Add at least one medicine");
      return;
    }

    const patientAndDoctorDetailsRequired = billItems?.some((i) =>
      ["H1", "H"].includes(i.schedule)
    );

    if (patientAndDoctorDetailsRequired && !selectedPatient) {
      toast.error("Please select a patient.");
      serPatientAndDoctorInfo(true);
      return;
    }
    if (patientAndDoctorDetailsRequired && !selectedDoctor) {
      serPatientAndDoctorInfo(true);
      toast.error("Please select a doctor.");
      return;
    }
    const saleData = collectSaleData(selectedPatient);
    bill_id
      ? updateBill({ ...saleData, _id: bill_id })
      : createBillMutation(saleData);
  }, [billItems, selectedPatient, collectSaleData, createBillMutation]);

  // ✨ NEW: Keyboard Navigation Handler for Search
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
        setFilteredProducts([]);
      }
    },
    [filteredProducts, highlightedIndex, addProductToBill]
  );
  // ✨ END NEW: Keyboard Navigation Handler

  return (
    <div className="h-full p-4 flex flex-col">
      <h1 className="text-3xl font-extrabold text-gray-900">New Sale Entry</h1>

      <Card className="p-0 overflow-hidden w-full mt-6 flex-grow flex flex-col shadow-lg border-2">
        <Instructions
          showInstructions={showInstructions}
          setShowInstructions={setShowInstructions}
        />

        <div className="flex flex-col md:flex-row flex-grow">
          {/* Left panel */}
          <div className="flex-1 p-6 border-r flex flex-col">
            {/* Patient & Doctor Selection Area - Refined UI */}
            <div className="flex flex-wrap gap-4 mb-6 pb-4 border-b">
              {/* Patient Selection */}
              <div
                className={`flex items-center gap-3 p-3  rounded-lg border ${
                  patientAndDoctorInfo && !selectedPatient
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
                    <p className="text-gray-500 italic">No Patient Selected</p>
                  )}
                  <Button
                    onClick={() => setModals((m) => ({ ...m, patient: true }))}
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
                className={`flex items-center gap-3 p-3  rounded-lg border ${
                  patientAndDoctorInfo && !selectedDoctor
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
            {/* End Patient & Doctor Selection Area */}

            <MedicineSearch
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filteredProducts={filteredProducts!}
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
            paymentStatus={payment.status}
            setPaymentStatus={(s) => setPayment((p) => ({ ...p, status: s }))}
            paymentMode={payment.mode}
            setPaymentMode={(m) => setPayment((p) => ({ ...p, mode: m }))}
            resetForm={resetForm}
            completeSale={handleCompleteSale}
          />
        </div>
      </Card>

      {/* Modals */}
      <PatientSelectionModal
        patientModalOpen={modals?.patient}
        setPatientModalOpen={(v) => setModals((m) => ({ ...m, patient: v }))}
        patients={patients}
        selectedPatient={selectedPatient}
        setSelectedPatient={setSelectedPatient}
        setNewPatientModalOpen={(v) =>
          setModals((m) => ({ ...m, newPatient: v }))
        }
      />

      <DoctorSelectionModal
        doctorModalOpen={modals?.doctor}
        setDoctorModalOpen={(v) => setModals((m) => ({ ...m, doctor: v }))}
        doctors={doctors}
        selectedDoctor={selectedDoctor}
        setSelectedDoctor={setSelectedDoctor}
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
