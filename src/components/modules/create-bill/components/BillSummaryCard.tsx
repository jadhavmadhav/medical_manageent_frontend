 "use client";

import { Receipt, IndianRupee, Tag, Percent, Clock, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { BillStatus, DiscountType } from "../types";

const fmt = (n: number) => Number(n || 0).toFixed(2);

interface BillSummaryCardProps {
  itemsSubtotal: number;
  billDiscAmount: number;
  billDiscType: DiscountType;
  billDiscValue: number;
  grandTotal: number;
  status: BillStatus;
  dueDate: string;
  onSave: () => void;
  isPending?: boolean;
  isEditMode?: boolean;
}

export function BillSummaryCard({
  itemsSubtotal,
  billDiscAmount,
  billDiscType,
  billDiscValue,
  grandTotal,
  status,
  dueDate,
  onSave,
  isPending = false,
  isEditMode = false,
}: BillSummaryCardProps) {
  return (
    <Card className="bg-slate-900 border-slate-900 text-slate-50">
      <CardHeader>
        <CardTitle className="text-xs font-extrabold text-slate-400 flex items-center gap-1.5">
          Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-1.5">
        <div className="flex justify-between text-sm text-slate-300">
          <span className="flex items-center gap-1.5">
            <IndianRupee size={12} />
            Items subtotal
          </span>
          <span>₹{fmt(itemsSubtotal)}</span>
        </div>

        {billDiscAmount > 0 && (
          <div className="flex justify-between text-sm text-red-300">
            <span className="flex items-center gap-1.5">
              <Tag size={12} />
              Bill discount ({billDiscType === "percent" ? `${billDiscValue}%` : `₹${billDiscValue}`})
            </span>
            <span>−₹{fmt(billDiscAmount)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <Percent size={12} />
            Tax
          </span>
          <span>₹0.00</span>
        </div>

        <Separator className="bg-slate-700 !my-3" />

        <div className="flex justify-between items-center">
          <span className="font-bold text-sm flex items-center gap-1.5">
            <Receipt size={14} />
            Grand Total
          </span>
          <span className="font-black text-2xl text-emerald-400">
            ₹{fmt(grandTotal)}
          </span>
        </div>

        {status === "pending" && (
          <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-2 text-xs text-amber-400 mt-2">
            <Clock size={13} />
            Due:{" "}
            {dueDate
              ? new Date(dueDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "Not set"}
          </div>
        )}

        <Button
          className="w-full !mt-4 bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-extrabold gap-2"
          onClick={onSave}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {isEditMode ? "Updating…" : "Saving…"}
            </>
          ) : (
            <>
              <Save size={16} />
              {isEditMode ? "Update Bill" : "Save Bill"}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}