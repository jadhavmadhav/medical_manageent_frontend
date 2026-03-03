"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { User, Phone, MapPin, Plus, Save } from "lucide-react";
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
import { Combobox } from "./Combobox";
import { usePatients, useCreatePatient } from "../hooks/usePatients";
import type { Patient } from "../types";

const DEBOUNCE_MS = 300;

// ── Selected patient display ──────────────────────────────────────────────────

function SelectedPatient({ patient, onClear }: { patient: Patient; onClear: () => void }) {
  return (
    <div className="mt-2 p-3 bg-muted/40 rounded-lg border border-border">
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
            <User size={17} className="text-blue-600" />
          </div>
          <div>
            <p className="font-bold text-sm text-foreground">{patient.patientName}</p>
            {patient.patientMobileNumber && (
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <Phone size={11} />
                {patient.patientMobileNumber}
              </p>
            )}
            {patient.patientAddress && (
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <MapPin size={11} />
                {patient.patientAddress}
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

// ── New patient form ──────────────────────────────────────────────────────────

interface NewPatientFormProps {
  prefill: string;
  enterpriseId: string;
  onSave: (patient: Patient) => void;
  onClose: () => void;
}

function NewPatientForm({ prefill, enterpriseId, onSave, onClose }: NewPatientFormProps) {
  const [name, setName] = useState(prefill);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const { mutate: createPatient, isPending, isError } = useCreatePatient();

  const valid = name.trim().length > 0;

  const handleSave = () => {
    if (!valid) return;
    createPatient(
      {
        patientName: name.trim(),
        patientMobileNumber: phone,
        patientAddress: address,
        // ✅ Fix: comes from prop, not env var
        enterpriseId,
      },
      { onSuccess: (data) => onSave(data.result) }
    );
  };

  return (
    <div className="space-y-4 pt-2">
      <div>
        <Label className="flex items-center gap-1.5 mb-1.5">
          <User size={12} />
          Patient Name <span className="text-destructive">*</span>
        </Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          autoFocus
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="flex items-center gap-1.5 mb-1.5">
            <Phone size={12} />
            Mobile Number
          </Label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="10-digit number"
            maxLength={10}
          />
        </div>
        <div>
          <Label className="flex items-center gap-1.5 mb-1.5">
            <MapPin size={12} />
            Address
          </Label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="City, Area"
          />
        </div>
      </div>
      {isError && (
        <p className="text-xs text-destructive">Failed to save patient. Please try again.</p>
      )}
      <Separator />
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!valid || isPending}>
          {isPending ? "Saving…" : <><Save size={14} className="mr-1.5" />Save Patient</>}
        </Button>
      </div>
    </div>
  );
}

// ── Main PatientCard ──────────────────────────────────────────────────────────

interface PatientCardProps {
  value: Patient | null;
  onChange: (patient: Patient | null) => void;
  // ✅ Fix: enterpriseId received as prop
  enterpriseId: string;
}

export function PatientCard({ value, onChange, enterpriseId }: PatientCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [prefill, setPrefill] = useState("");

  // ✅ Fix: debounced search drives the API, not client-side filterKeys
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

  // ✅ Fix: passes enterpriseId + debouncedSearch to the hook
  const { data: patients = [], isFetching } = usePatients({
    enterpriseId,
    search: debouncedSearch,
  });

  const openModal = (query = "") => {
    setPrefill(query);
    setModalOpen(true);
  };

  const handleSaved = (patient: Patient) => {
    onChange(patient);
    setModalOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-extrabold text-muted-foreground flex items-center gap-1.5">
              <User size={13} />
              Patient <span className="text-destructive ml-0.5">*</span>
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs gap-1 text-sky-600 border-sky-200 bg-sky-50 hover:bg-sky-100"
              onClick={() => openModal()}
            >
              <Plus size={12} />
              New Patient
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {value ? (
            <SelectedPatient patient={value} onClear={() => onChange(null)} />
          ) : (
            // ✅ Fix: onSearchChange drives API search; no filterKeys (client-side)
            <Combobox<Patient>
              items={patients}
              displayKey="patientName"
              value={value}
              onChange={onChange}
              onCreateNew={openModal}
              onSearchChange={handleSearchChange}
              isLoading={isFetching}
              placeholder="Search by name or phone…"
              renderItem={(item) => (
                <div>
                  <p className="font-semibold text-sm">{item.patientName}</p>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                    <Phone size={10} />
                    {item.patientMobileNumber}
                    <MapPin size={10} />
                    {item.patientAddress}
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
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <User size={16} className="text-blue-600" />
              </div>
              Add New Patient
            </DialogTitle>
          </DialogHeader>
          <NewPatientForm
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