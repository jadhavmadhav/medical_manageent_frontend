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
import { Doctor } from "@/types/new-sale-entry";

interface DoctorSelectionModalProps {
  doctorModalOpen: boolean;
  setDoctorModalOpen: (open: boolean) => void;
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  setSelectedDoctor: (doctor: Doctor | null) => void;
  setNewDoctorModalOpen: (open: boolean) => void;
}

const DoctorSelectionModal = React.memo(
  ({
    doctorModalOpen,
    setDoctorModalOpen,
    doctors,
    selectedDoctor,
    setSelectedDoctor,
    setNewDoctorModalOpen,
  }: DoctorSelectionModalProps) => {
    return (
      <Dialog open={doctorModalOpen} onOpenChange={setDoctorModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Doctor</DialogTitle>
            <DialogDescription>
              Choose a doctor from the list or add a new one.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select
              value={selectedDoctor?._id?.toString() || ""}
              onValueChange={(value) => {
                const doctor = doctors.find((d) => d._id?.toString() === value);
                if (doctor) {
                  setSelectedDoctor(doctor);
                  setDoctorModalOpen(false);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem
                    key={doctor._id.toString()}
                    value={doctor._id.toString()}
                  >
                    {doctor.name} ({doctor.specialization})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  setDoctorModalOpen(false);
                  setNewDoctorModalOpen(true);
                }}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add New Doctor
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

DoctorSelectionModal.displayName = "DoctorSelectionModal";

export default DoctorSelectionModal;
