"use client";

import { Calendar, CheckCircle2, Clock, CreditCard, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { BillStatus, PaymentMethod } from "../types";

const PAYMENT_METHODS: PaymentMethod[] = [
  "CASH",
  "UPI",
  "CARD",
  "BANK_TRANSFER",
  "CHEQUE",
];

interface BillInfoCardProps {
  billDate: string;
  onBillDateChange: (v: string) => void;
  status: BillStatus;
  onStatusChange: (v: BillStatus) => void;
  payMethod: PaymentMethod;
  onPayMethodChange: (v: PaymentMethod) => void;
  dueDate: string;
  onDueDateChange: (v: string) => void;
}

export function BillInfoCard({
  billDate,
  onBillDateChange,
  status,
  onStatusChange,
  payMethod,
  onPayMethodChange,
  dueDate,
  onDueDateChange,
}: BillInfoCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xs font-extrabold text-muted-foreground flex items-center gap-1.5">
          <Receipt size={13} />
          Bill Information
        </CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4">
        {/* Bill Date */}
        <div>
          <Label className="flex w-[180px] items-center gap-1.5 mb-1.5 text-xs">
            <Calendar size={12} />
            Bill Date <span className="text-destructive">*</span>
          </Label>
          <Input
            type="date"
            value={billDate}
            onChange={(e) => onBillDateChange(e.target.value)}
            className="h-9 text-sm"
          />
        </div>

        {/* Status Toggle */}
        <div>
          <Label className="flex items-center gap-1.5 mb-1.5 text-xs">
            <CheckCircle2 size={12} />
            Payment Status <span className="text-destructive">*</span>
          </Label>
          <div className="flex w-[200px] rounded-lg overflow-hidden border border-border h-9">
            {(["paid", "pending"] as BillStatus[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => onStatusChange(v)}
                className={cn(
                  "flex-1 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors",
                  status === v
                    ? v === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                    : "bg-white text-muted-foreground hover:bg-muted/50"
                )}
              >
                {v === "paid" ? (
                  <CheckCircle2 size={12} />
                ) : (
                  <Clock size={12} />
                )}
                {v === "paid" ? "Paid" : "Pending"}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Method OR Due Date */}
        {status === "paid" ? (
          <div>
            <Label className="flex items-center gap-1.5 mb-1.5 text-xs">
              <CreditCard size={12} />
              Payment Method
            </Label>
            <Select
              value={payMethod}
              onValueChange={(v) => onPayMethodChange(v as PaymentMethod)}
            >
              <SelectTrigger className="h-9 w-[180px] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div>
            <Label className="flex items-center gap-1.5 mb-1.5 text-xs">
              <Calendar size={12} />
              Due Date <span className="text-destructive">*</span>
            </Label>
            <Input
              type="date"
              value={dueDate}
              min={billDate}
              onChange={(e) => onDueDateChange(e.target.value)}
              className="h-9 w-[180px] text-sm"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}