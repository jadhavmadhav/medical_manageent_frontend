"use client";

import { useMemo, useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getAllInventories,
  createPatient,
  createDoctor,
  searchDoctors,
  searchPatients,
  createNewBill,
  getBillById,
  UpdateBill,
  updatePatient,
  updateDoctor,
} from "@/services/new-sale-entry";
import { ReviewSubmit } from "./ReviewSubmit";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { StepPatientDoctor } from "./StepPatientDoctor";
import { MedicineSelection } from "./ MedicineSelection";

const steps = [
  { id: "1", name: "Medicine Selection" },
  { id: "2", name: "Patient & Doctor Details" },
  { id: "3", name: "Review & Submit" },
];

const getEmptyPatient = () => ({ name: "", mobile_number: "", address: "" });
const getEmptyDoctor = () => ({
  name: "",
  hospital: "",
  address: "",
  mobile_number: "",
  specialization: "",
});

const NewSaleEntryView = ({
  enterpriseId,
  bill_id,
}: {
  enterpriseId: string;
  bill_id?: any;
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isCreatingBill, setIsCreatingBill] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [discount, setDiscount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const [patientSearch, setPatientSearch] = useState("");
  const [patient, setPatient] = useState(getEmptyPatient());
  const [doctorSearch, setDoctorSearch] = useState("");
  const [doctor, setDoctor] = useState(getEmptyDoctor());

  const { data: inventories = [] } = useQuery({
    queryKey: ["Inventory-for-bill", enterpriseId],
    queryFn: () => getAllInventories({ enterpriseId }),
    enabled: !!enterpriseId,
    select: (data) => data?.result || [],
  });

  const { data: patients = {} } = useQuery({
    queryKey: ["patients", enterpriseId, patientSearch],
    queryFn: () => searchPatients({ enterpriseId, search: patientSearch }),
    enabled: !!enterpriseId && patientSearch.length > 1,
  });

  const { data: doctors = {} } = useQuery({
    queryKey: ["doctors", enterpriseId, doctorSearch],
    queryFn: () => searchDoctors({ enterpriseId, search: doctorSearch }),
    enabled: !!enterpriseId && doctorSearch.length > 1,
  });

  const handleSuccess = (message: string, reset = false) => {
    toast.success(message);
    if (reset) {
      setItems([]);
      setPatient(getEmptyPatient());
      setDoctor(getEmptyDoctor());
      setActiveStep(0);
    }
    setIsCreatingBill(false);
  };

  const handleError = (message: string) => {
    toast.error(message);
    setIsCreatingBill(false);
  };

  const { mutate: createNewPatient } = useMutation({
    mutationFn: createPatient,
    onSuccess: (data: any) => {
      setPatient(data.result);
      setPatientSearch(data.result?.name || "");
      createNewDoctor({
        ...doctor,
        enterpriseId,
      });
    },
    onError: (e) => handleError(`Error creating patient: ${e.message}`),
  });

  const { mutate: UpdatePatient } = useMutation({
    mutationFn: updatePatient,
    onSuccess: (data) => {
      setPatient(data.patient);
      setPatientSearch(data.patient?.name || "");
      UpdateDoctor({ enterpriseId, ...doctor, ...billData?.doctor });
    },
    onError: (e) => handleError(`Error updating patient: ${e.message}`),
  });

  const { mutate: UpdateDoctor } = useMutation({
    mutationFn: updateDoctor,
    onSuccess: (data: any) => {
      setDoctor(data.doctor);
      setDoctorSearch(data.doctor?.name || "");
      updateBill({
        ...billData,
        items,
        patient,
        doctor: data.doctor,
        discount,
        status: paymentStatus,
        paymentMethod,
      });
    },
    onError: (e) => handleError(`Error updating doctor: ${e.message}`),
  });

  const { mutate: updateBill } = useMutation({
    mutationFn: UpdateBill,
    onSuccess: () => handleSuccess("Bill updated successfully", true),
    onError: (e) => handleError(`Error updating bill: ${e.message}`),
  });

  const { mutate: createNewDoctor } = useMutation({
    mutationFn: createDoctor,
    onSuccess: (data: any) => {
      setDoctor(data.doctor);
      setDoctorSearch(data.doctor?.name || "");
      createBill({
        enterpriseId,
        items,
        patient,
        doctor: data.doctor,
        discount,
        status: "paid",
        paymentMethod: "cash",
        date: new Date(),
      });
    },
    onError: (e) => handleError(`Error creating doctor: ${e.message}`),
  });

  const { mutate: createBill } = useMutation({
    mutationFn: createNewBill,
    onSuccess: () => handleSuccess("Bill created successfully", true),
  });

  const { data: billData = {} } = useQuery({
    queryKey: ["bill", bill_id],
    queryFn: () => getBillById(bill_id),
    enabled: !!bill_id,
    select: (data) => data?.result || {},
  });

  useEffect(() => {
    if (!bill_id || !billData) return;
    setItems(billData.items || []);
    setPatient({ ...getEmptyPatient(), ...billData.patient });
    setPatientSearch(billData.patient?.name || "");
    setDoctor({ ...getEmptyDoctor(), ...billData.doctor });
    setDoctorSearch(billData.doctor?.name || "");
    setDiscount(billData.discountAmount || 0);
    setPaymentStatus(billData.status || "");
    setPaymentMethod(billData.paymentMethod || "");
  }, [billData, bill_id]);

  const hasScheduleItems = useMemo(
    () => items.some((item: any) => ["H", "H1"].includes(item?.schedule)),
    [items]
  );

  const handleNext = () => {
    if (activeStep === 0 && items.length === 0) return;
    if (activeStep === 1 && hasScheduleItems && !patient.name) return;
    if (activeStep === 2 && hasScheduleItems && !doctor.name) return;
    setActiveStep((prev) => prev + 1);
  };

  const handleSubmit = () => {
    setIsCreatingBill(true);
    if (bill_id) {
      UpdatePatient({ enterpriseId, ...billData.patient, ...patient });
    } else {
      createNewPatient({ ...patient, enterpriseId });
    }
    // bill_id
    //   ? UpdatePatient({ enterpriseId, ...billData.patient, ...patient })
    //   : createNewPatient({ ...patient, enterpriseId });
  };

  return (
    <div className="overflow-hidden h-full w-full shadow-lg rounded-xl border flex flex-col">
      <div className="flex-1 p-3 h-full flex flex-col overflow-auto">
        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between space-x-4 overflow-x-auto">
            {steps.map((step, index) => {
              const isActive = index === activeStep;
              const isComplete = index < activeStep;
              return (
                <div
                  key={step.id}
                  className={cn(
                    "flex-1 flex flex-col items-center text-center cursor-pointer transition",
                    isActive
                      ? "text-primary font-semibold"
                      : "text-muted-foreground"
                  )}
                  onClick={() => setActiveStep(index)}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full border-2",
                      isComplete
                        ? "border-green-500 bg-green-100 text-green-600"
                        : isActive
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-gray-300 bg-gray-50"
                    )}
                  >
                    {isComplete ? <CheckCircle size={18} /> : index + 1}
                  </div>
                  <div className="text-xs mt-1">{step.name}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-auto">
          {activeStep === 0 && (
            <MedicineSelection
              inventories={inventories}
              items={items}
              setItems={setItems}
            />
          )}
          {activeStep === 1 && (
            <StepPatientDoctor
              hasScheduleItems={hasScheduleItems}
              patientSearch={patientSearch}
              doctorSearch={doctorSearch}
              patient={patient}
              doctor={doctor}
              patients={patients.result || []}
              doctors={doctors.doctors || []}
              setPatientSearch={setPatientSearch}
              setDoctorSearch={setDoctorSearch}
              setPatient={setPatient}
              setDoctor={setDoctor}
            />
          )}
          {activeStep === 2 && (
            <ReviewSubmit
              items={items}
              patient={patient}
              doctor={doctor}
              discount={discount}
              paymentMethod={paymentMethod}
              paymentStatus={paymentStatus}
              setPaymentStatus={setPaymentStatus}
              setPaymentMethod={setPaymentMethod}
            />
          )}
        </div>
      </div>

      <div className="sticky bottom-0 p-3 bg-white border-t flex justify-between">
        <Button
          variant="outline"
          onClick={() => setActiveStep((prev) => prev - 1)}
          disabled={activeStep === 0}
          className="flex items-center gap-2 px-6 py-2"
        >
          <ChevronLeft size={16} /> Back
        </Button>
        {activeStep < steps.length - 1 ? (
          <Button
            onClick={handleNext}
            disabled={
              (activeStep === 0 && items.length === 0) ||
              (activeStep === 1 &&
                hasScheduleItems &&
                (!patient.name || !doctor.name))
            }
            className="flex items-center gap-2 px-6 py-2"
          >
            Next <ChevronRight size={16} />
          </Button>
        ) : (
          <Button
            disabled={isCreatingBill || !paymentStatus || !paymentMethod}
            onClick={handleSubmit}
            className="px-8 py-2"
          >
            {isCreatingBill
              ? bill_id
                ? "Updating..."
                : "Creating..."
              : bill_id
              ? "Update Bill"
              : "Create Bill"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default NewSaleEntryView;
