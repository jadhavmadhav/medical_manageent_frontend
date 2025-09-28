// PatientSelectionModal.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react"; 
import { Patient } from "@/types/new-sale-entry";

interface PatientSelectionModalProps {
  patientModalOpen: boolean;
  setPatientModalOpen: (open: boolean) => void;
  patients: Patient[];
  selectedPatient: Patient | null;
  setSelectedPatient: (patient: Patient | null) => void;
  setNewPatientModalOpen: (open: boolean) => void;
}

const PatientSelectionModal = React.memo(
  ({
    patientModalOpen,
    setPatientModalOpen,
    patients,
    selectedPatient,
    setSelectedPatient,
    setNewPatientModalOpen,
  }: PatientSelectionModalProps) => {
    return (
      <Dialog open={patientModalOpen} onOpenChange={setPatientModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Patient</DialogTitle>
            <DialogDescription>
              Choose a patient from the list or add a new one.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select
              value={selectedPatient?._id?.toString() || ""}
              onValueChange={(value) => {
                const patient = patients.find(
                  (p) => p._id?.toString() === value
                );
                if (patient) {
                  setSelectedPatient(patient);
                  setPatientModalOpen(false);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients?.map((patient) => (
                  <SelectItem
                    key={patient?._id}
                    value={patient?._id.toString()}
                  >
                    {patient?.name} ({patient?.mobile_number})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  setPatientModalOpen(false);
                  setNewPatientModalOpen(true);
                }}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add New Patient
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);
PatientSelectionModal.displayName = "PatientSelectionModal";
export default PatientSelectionModal;
