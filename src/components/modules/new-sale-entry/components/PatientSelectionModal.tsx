// // PatientSelectionModal.tsx
// import React from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { Plus } from "lucide-react";
// import { Patient } from "@/types/new-sale-entry";

// interface PatientSelectionModalProps {
//   patientModalOpen: boolean;
//   setPatientModalOpen: (open: boolean) => void;
//   patients: Patient[];
//   selectedPatient: Patient | null;
//   setSelectedPatient: (patient: Patient | null) => void;
//   setNewPatientModalOpen: (open: boolean) => void;
// }

// const PatientSelectionModal = React.memo(
//   ({
//     patientModalOpen,
//     setPatientModalOpen,
//     patients,
//     selectedPatient,
//     setSelectedPatient,
//     setNewPatientModalOpen,
//   }: PatientSelectionModalProps) => {
//     return (
//       <Dialog open={patientModalOpen} onOpenChange={setPatientModalOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Select Patient</DialogTitle>
//             <DialogDescription>
//               Choose a patient from the list or add a new one.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             <Select
//               value={selectedPatient?._id?.toString() || ""}
//               onValueChange={(value) => {
//                 const patient = patients.find(
//                   (p) => p._id?.toString() === value
//                 );
//                 if (patient) {
//                   setSelectedPatient(patient);
//                   setPatientModalOpen(false);
//                 }
//               }}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select a patient" />
//               </SelectTrigger>
//               <SelectContent>
//                 {patients?.map((patient) => (
//                   <SelectItem
//                     key={patient?._id}
//                     value={patient?._id.toString()}
//                   >
//                     {patient?.name} ({patient?.mobile_number})
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <div className="flex justify-center">
//               <Button
//                 onClick={() => {
//                   setPatientModalOpen(false);
//                   setNewPatientModalOpen(true);
//                 }}
//                 className="flex items-center gap-2"
//               >
//                 <Plus className="h-4 w-4" /> Add New Patient
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     );
//   }
// );
// PatientSelectionModal.displayName = "PatientSelectionModal";
// export default PatientSelectionModal;

"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandInput,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";
import { Patient } from "@/types/new-sale-entry";
import { cn } from "@/lib/utils";
import { searchPatients } from "@/services/new-sale-entry";
import { useDebounce } from "@/hooks/use-debounce";
import { useMutation } from "@tanstack/react-query";

interface PatientSelectionModalProps {
  patientModalOpen: boolean;
  setPatientModalOpen: (open: boolean) => void;
  selectedPatient: Patient | null;
  setSelectedPatient: (patient: Patient | null) => void;
  setNewPatientModalOpen: (open: boolean) => void;
  enterpriseId: string;
}

const PatientSelectionModal = React.memo(
  ({
    patientModalOpen,
    setPatientModalOpen,
    selectedPatient,
    setSelectedPatient,
    setNewPatientModalOpen,
    enterpriseId,
  }: PatientSelectionModalProps) => {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);

    const [patients, setPatients] = useState<Patient[]>([]);

    // ✅ useMutation for patient search
    const { mutate: searchPatientsMutate, isPending: loading } = useMutation({
      mutationFn: searchPatients,
      onSuccess: (res: any) => {
        setPatients(res?.result || []);
      },
      onError: () => {
        setPatients([]);
      },
    });

    // 🔁 Trigger search when typing & modal open
    useEffect(() => {
      if (!patientModalOpen) return;

      searchPatientsMutate({
        enterpriseId,
        search: debouncedSearch,
      });
    }, [debouncedSearch, enterpriseId, searchPatientsMutate]);

    // Reset on close
    useEffect(() => {
      if (!patientModalOpen) {
        setSearch("");
        setPatients([]);
      }
    }, [patientModalOpen]);

    const items = useMemo(
      () =>
        patients.map((p) => ({
          key: p._id.toString(),
          label: `${p.name} (${p.mobile_number})`,
          patient: p,
        })),
      [patients]
    );

    return (
      <Dialog open={patientModalOpen} onOpenChange={setPatientModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Patient</DialogTitle>
            <DialogDescription>
              Search patient by name or mobile number
            </DialogDescription>
          </DialogHeader>

          <Command className="border rounded-lg overflow-hidden">
            {/* Search input */}
            <CommandInput
              placeholder="Type patient name or mobile…"
              value={search}
              onValueChange={setSearch}
              className="border-b"
            />

            {/* Results area */}
            <div className="max-h-60 overflow-y-auto">
              {loading && (
                <div className="p-4 text-sm text-muted-foreground text-center">
                  Searching patients…
                </div>
              )}

              {!loading && search && items.length === 0 && (
                <div className="p-4 text-sm text-muted-foreground text-center">
                  No patients found
                </div>
              )}

              {!loading && items.length > 0 && (
                <CommandGroup>
                  {items.map(({ key, label, patient }) => {
                    const isSelected = selectedPatient?._id === patient._id;

                    return (
                      <CommandItem
                        key={key}
                        value={label}
                        onSelect={() => {
                          setSelectedPatient(patient);
                          setPatientModalOpen(false);
                        }}
                        className={cn(
                          "flex items-center gap-2",
                          isSelected && "bg-accent"
                        )}
                      >
                        <Check
                          className={cn(
                            "h-4 w-4",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span className="truncate">{label}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}
            </div>
          </Command>

          {/* Add new patient */}
          <div className="pt-3 flex justify-end">
            <Button
              onClick={() => {
                setPatientModalOpen(false);
                setNewPatientModalOpen(true);
              }}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Patient
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

PatientSelectionModal.displayName = "PatientSelectionModal";
export default PatientSelectionModal;
