"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  Stethoscope, Phone, Building2, MapPin,
  FlaskConical, AlertTriangle, Plus, Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Combobox } from "./Combobox";
import { useDoctors, useCreateDoctor } from "../hooks/useDoctors";
import type { Doctor } from "../types";

const DEBOUNCE_MS = 300;

// ── Selected doctor display ───────────────────────────────────────────────────

function SelectedDoctor({ doctor, onClear }: { doctor: Doctor; onClear: () => void }) {
  return (
    <div className="mt-2 p-3 bg-muted/40 rounded-lg border border-border">
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
            <Stethoscope size={17} className="text-violet-600" />
          </div>
          <div>
            <p className="font-bold text-sm text-foreground">{doctor?.doctorName}</p>
            {(doctor.doctorSpecialization || doctor.doctorHospital) && (
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <Building2 size={11} />
                {doctor.doctorSpecialization}
                {doctor.doctorHospital ? ` · ${doctor.doctorHospital}` : ""}
              </p>
            )}
            {doctor.doctorMobileNumber && (
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <Phone size={11} />
                {doctor.doctorMobileNumber}
              </p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-sky-500 h-auto p-0 text-xs font-semibold"
          onClick={onClear}
        >
          Change
        </Button>
      </div>
    </div>
  );
}

// ── New doctor form ───────────────────────────────────────────────────────────

interface NewDoctorFormProps {
  prefill: string;
  enterpriseId: string;
  onSave: (doctor: Doctor) => void;
  onClose: () => void;
}

function NewDoctorForm({ prefill, enterpriseId, onSave, onClose }: NewDoctorFormProps) {
  const [name, setName] = useState(prefill);
  const [phone, setPhone] = useState("");
  const [spec, setSpec] = useState("");
  const [hospital, setHospital] = useState("");
  const [address, setAddress] = useState("");

  const { mutate: createDoctor, isPending, isError } = useCreateDoctor();

  const valid = name.trim().length > 0;

  const handleSave = () => {
    if (!valid) return;
    createDoctor(
      {
        doctorName: name.trim(),
        doctorMobileNumber: phone,
        doctorSpecialization: spec,
        doctorHospital: hospital,
        doctorAddress: address,
        // ✅ Fix: comes from prop, not env var
        enterpriseId,
      },
      { onSuccess: (data:any) => onSave(data?.doctor) }
    );
  };

  return (
    <div className="space-y-4 pt-2">
      <div>
        <Label className="flex items-center gap-1.5 mb-1.5">
          <Stethoscope size={12} />
          Doctor Name <span className="text-destructive">*</span>
        </Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Dr. Full Name"
          autoFocus
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="flex items-center gap-1.5 mb-1.5">
            <FlaskConical size={12} />
            Specialization
          </Label>
          <Input value={spec} onChange={(e) => setSpec(e.target.value)} placeholder="MBBS, MD, BDS…" />
        </div>
        <div>
          <Label className="flex items-center gap-1.5 mb-1.5">
            <Phone size={12} />
            Mobile Number
          </Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit number" maxLength={10} />
        </div>
        <div>
          <Label className="flex items-center gap-1.5 mb-1.5">
            <Building2 size={12} />
            Hospital / Clinic
          </Label>
          <Input value={hospital} onChange={(e) => setHospital(e.target.value)} placeholder="Hospital name" />
        </div>
        <div>
          <Label className="flex items-center gap-1.5 mb-1.5">
            <MapPin size={12} />
            Address
          </Label>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="City, Area" />
        </div>
      </div>
      {isError && (
        <p className="text-xs text-destructive">Failed to save doctor. Please try again.</p>
      )}
      <Separator />
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!valid || isPending}>
          {isPending ? "Saving…" : <><Save size={14} className="mr-1.5" />Save Doctor</>}
        </Button>
      </div>
    </div>
  );
}

// ── Main DoctorCard ───────────────────────────────────────────────────────────

interface DoctorCardProps {
  value: Doctor | null;
  onChange: (doctor: Doctor | null) => void;
  required: boolean;
  // ✅ Fix: enterpriseId received as prop
  enterpriseId: string;
}

export function DoctorCard({ value, onChange, required, enterpriseId }: DoctorCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [prefill, setPrefill] = useState("");

  // ✅ Fix: debounced search drives the API
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(query.trim());
    }, DEBOUNCE_MS);
  }, []);

  // ✅ Fix: passes enterpriseId + debouncedSearch to the hook (was useDoctors() with no args)
  const { data: doctors = [], isFetching } = useDoctors({
    enterpriseId,
    search: debouncedSearch,
  });

  const openModal = (query = "") => {
    setPrefill(query);
    setModalOpen(true);
  };

  const handleSaved = (doctor: Doctor) => {
    onChange(doctor);
    setModalOpen(false);
  };

  return (
    <>
      <Card className={cn(required && !value && "border-amber-400")}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-extrabold text-muted-foreground flex items-center gap-1.5">
              <Stethoscope size={13} />
              Doctor
              {required && <span className="text-destructive ml-0.5">*</span>}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs gap-1 text-sky-600 border-sky-200 bg-sky-50 hover:bg-sky-100"
              onClick={() => openModal()}
            >
              <Plus size={12} />
              New Doctor
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {required && !value && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3 text-xs text-amber-800">
              <AlertTriangle size={13} className="shrink-0 mt-0.5" />
              Schedule-H drug in cart. Doctor prescription details are mandatory.
            </div>
          )}

          {value ? (
            <SelectedDoctor doctor={value} onClear={() => onChange(null)} />
          ) : (
            // ✅ Fix: onSearchChange drives API; no filterKeys
            <Combobox<Doctor>
              items={doctors}
              displayKey="doctorName"
              value={value}
              onChange={onChange}
              onCreateNew={openModal}
              onSearchChange={handleSearchChange}
              isLoading={isFetching}
              placeholder="Search by name…"
              renderItem={(item) => (
                <div>
                  <p className="font-semibold text-sm">{item.doctorName}</p>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                    <Building2 size={10} />
                    {item.doctorSpecialization} · {item.doctorHospital}
                  </p>
                </div>
              )}
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={(o) => !o && setModalOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                <Stethoscope size={16} className="text-violet-600" />
              </div>
              Add New Doctor
            </DialogTitle>
          </DialogHeader>
          <NewDoctorForm
            prefill={prefill}
            enterpriseId={enterpriseId}
            onSave={handleSaved}
            onClose={() => setModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}