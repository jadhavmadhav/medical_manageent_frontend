import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { numberFormatter } from "@/utils/constants";
import { useEffect } from "react";

interface BillSummaryProps {
  subtotal: number;
  totalTax: number;
  grandTotal: number;
  paymentStatus: string;
  setPaymentStatus: (status: string) => void;
  paymentMode: string;
  setPaymentMode: (mode: string) => void;
  resetForm: () => void;
  completeSale: () => void;
  isDisabled: boolean;
  confirmBtnText: string;
  dueDate: Date | null;
  setDueDate: (date: Date | null) => void; 
  isWalletPatient: boolean;
}

const BillSummary = ({
  subtotal,
  totalTax,
  grandTotal,
  paymentStatus,
  setPaymentStatus,
  paymentMode,
  setPaymentMode,
  resetForm,
  completeSale,
  isDisabled,
  confirmBtnText,
  dueDate,
  setDueDate, 
  isWalletPatient
}: BillSummaryProps) => {
 

  return (
    <div className="md:w-96 p-6 flex flex-col shadow-inner">
      <h2 className="text-lg font-bold mb-6 border-b pb-3">Order Summary</h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className=" ">Subtotal:</span>
          <span className="font-semibold  ">
            ₹{numberFormatter(subtotal)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className=" ">Tax:</span>
          <span className="font-semibold  ">
            ₹{numberFormatter(totalTax)}
          </span>
        </div>
        <div className="border-t border-gray-300 pt-4 flex justify-between text-xl font-extrabold ">
          <span>Grand Total:</span>
          <span className="text-primary">₹{numberFormatter(grandTotal)}</span>
        </div>
      </div>

      {/* Payment Status */}
      <div className="mb-6">
        <Label className="block text-sm font-semibold mb-2">
          Payment Status
        </Label>
        <div className="flex gap-3">
          <Button
            variant={paymentStatus === "pending" ? "destructive" : "outline"} // Red for Unpaid
            onClick={() => {
              setPaymentStatus("pending");
              setPaymentMode("");
            }}
            className="flex-1 transition-all"
            disabled={isWalletPatient} // Disable if wallet patient
          >
            Pending
          </Button>
          <Button
            // Custom style for green 'Paid' button, assuming no 'success' variant is defined
            style={{
              backgroundColor: paymentStatus === "paid" ? "#10B981" : "",
              borderColor: paymentStatus === "paid" ? "#10B981" : "",
              color: paymentStatus === "paid" ? "white" : "",
            }}
            variant={paymentStatus === "paid" ? "default" : "outline"}
            onClick={() => setPaymentStatus("paid")}
            className="flex-1 transition-all"
          >
            Paid
          </Button>
        </div>
      </div>

      {/* Payment Mode (only shown when paid) */}
      {paymentStatus === "paid" && (
        <div className="mb-6">
          <Label
            htmlFor="payment-mode"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Payment Mode
          </Label>
          <Select value={paymentMode} onValueChange={setPaymentMode}>
            <SelectTrigger
              id="payment-mode"
              className={`${paymentMode ? "" : "border-red-400"} w-full`}
            >
              <SelectValue placeholder="Select Payment Mode" />
            </SelectTrigger>
            {!paymentMode && (
              <span className="text-red-400 text-sm">
                Please select payment mode.
              </span>
            )}
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="wallet">Wallet</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {
        paymentStatus === "pending" && (
          <div className="mb-6">
            <Label
              htmlFor="due-date"
              className="block text-sm font-medium mb-2"
            >
              Due Date
            </Label>
            <input
              type="date"
              id="due-date"
              className={`w-full border border-gray-300 rounded-md p-2 ${!dueDate ? "border-red-400" : ""}`}
              value={
                dueDate
                  ? dueDate.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => {
                const selectedDate = e.target.value
                  ? new Date(e.target.value)
                  : null;
                setDueDate(selectedDate);
              }}
            />
            {
              !dueDate && (<span className="text-red-400 text-sm mb-4">
                Please select a due date.
              </span>
              )
            }
          </div>

        )
      }

      <div className="flex space-x-3 mt-auto pt-6 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={resetForm}
          className="flex-1 cursor-pointer"
        >
          Reset/Cancel
        </Button>
        <Button
          disabled={isDisabled || (paymentStatus === "paid" && !paymentMode) || (paymentStatus === "pending" && !dueDate)}
          onClick={completeSale}
          className="flex-1  text-lg cursor-pointer"
        >
          {confirmBtnText}
        </Button>
      </div>
    </div>
  );
};

export default BillSummary;
