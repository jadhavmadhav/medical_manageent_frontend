"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";
import { Doctor } from "@/types/new-sale-entry";
import { cn } from "@/lib/utils";
import { searchDoctors } from "@/services/new-sale-entry";
import { useDebounce } from "@/hooks/use-debounce";
import { useMutation } from "@tanstack/react-query";

interface Props {
  doctorModalOpen: boolean;
  setDoctorModalOpen: (v: boolean) => void;
  selectedDoctor: Doctor | null;
  setSelectedDoctor: (d: Doctor | null) => void;
  setNewDoctorModalOpen: (v: boolean) => void;
  enterpriseId: string;
}

const DoctorSelectionModal = React.memo(
  ({
    doctorModalOpen,
    setDoctorModalOpen,
    selectedDoctor,
    setSelectedDoctor,
    setNewDoctorModalOpen,
    enterpriseId,
  }: Props) => {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);

    const [doctors, setDoctors] = useState<Doctor[]>([]);

    const {
      mutate: searchDoctorsMutate,
      isPending: loading,
    } = useMutation({
      mutationFn: searchDoctors,
      onSuccess: (res: any) => {
        setDoctors(res?.doctors || []);
      },
      onError: () => {
        setDoctors([]);
      },
    });

    useEffect(() => {
      if (!doctorModalOpen) return;

      searchDoctorsMutate({
        enterpriseId,
        search: debouncedSearch,
      });
    }, [debouncedSearch, enterpriseId, searchDoctorsMutate]);

    // Reset on close
    useEffect(() => {
      if (!doctorModalOpen) {
        setSearch("");
        setDoctors([]);
      }
    }, [doctorModalOpen]);

    const items = useMemo(
      () =>
        doctors.map((d) => ({
          key: d._id.toString(),
          label: `${d.doctorName} - ${d.doctorSpecialization} - ${d.doctorHospital}`,
          doctor: d,
        })),
      [doctors]
    );

    return (
      <Dialog open={doctorModalOpen} onOpenChange={setDoctorModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Doctor</DialogTitle>
            <DialogDescription>
              Search doctor by name or specialization
            </DialogDescription>
          </DialogHeader>

          <Command className="border rounded-lg">
            <CommandInput
              placeholder="Type to search doctor..."
              value={search}
              onValueChange={setSearch}
            />

            {loading && (
              <p className="p-3 text-sm text-muted-foreground">
                Searching doctors…
              </p>
            )}

            {search && !loading && items.length === 0 && (
              <CommandEmpty>No doctor found.</CommandEmpty>
            )}

            <CommandGroup>
              {items.map(({ key, label, doctor }) => {
                const isSelected = selectedDoctor?._id === doctor._id;

                return (
                  <CommandItem
                    key={key}
                    value={label}
                    onSelect={() => {
                      setSelectedDoctor(doctor);
                      setDoctorModalOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>

          <div className="pt-4 flex justify-end">
            <Button
              onClick={() => {
                setDoctorModalOpen(false);
                setNewDoctorModalOpen(true);
              }}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Doctor
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

DoctorSelectionModal.displayName = "DoctorSelectionModal";

export default DoctorSelectionModal;
