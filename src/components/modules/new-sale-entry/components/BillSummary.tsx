// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// interface BillSummaryProps {
//   subtotal: number;
//   totalTax: number;
//   grandTotal: number;
//   paymentStatus: string;
//   setPaymentStatus: (status: string) => void;
//   paymentMode: string;
//   setPaymentMode: (mode: string) => void;
//   resetForm: () => void;
//   completeSale: () => void;
// }

// const BillSummary = ({
//   subtotal,
//   totalTax,
//   grandTotal,
//   paymentStatus,
//   setPaymentStatus,
//   paymentMode,
//   setPaymentMode,
//   resetForm,
//   completeSale
// }: BillSummaryProps) => {
//   return (
//     <div className="md:w-96 bg-gray-50 p-6 flex flex-col">
//       <h2 className="text-xl font-bold text-gray-900 mb-6">
//         Bill Summary
//       </h2>

//       <div className="space-y-4 mb-6">
//         <div className="flex justify-between">
//           <span className="text-gray-600">Subtotal:</span>
//           <span className="font-medium">₹{subtotal.toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-600">Tax:</span>
//           <span className="font-medium">₹{totalTax.toFixed(2)}</span>
//         </div>
//         <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-bold">
//           <span>Grand Total:</span>
//           <span>₹{grandTotal.toFixed(2)}</span>
//         </div>
//       </div>

//       {/* Payment Status */}
//       <div className="mb-6">
//         <Label className="block text-sm font-medium text-gray-700 mb-2">
//           Payment Status
//         </Label>
//         <div className="flex gap-4">
//           <Button
//             variant={paymentStatus === "unpaid" ? "default" : "outline"}
//             onClick={() => setPaymentStatus("unpaid")}
//             className="flex-1"
//           >
//             Unpaid
//           </Button>
//           <Button
//             variant={paymentStatus === "paid" ? "default" : "outline"}
//             onClick={() => setPaymentStatus("paid")}
//             className="flex-1"
//           >
//             Paid
//           </Button>
//         </div>
//       </div>

//       {/* Payment Mode (only shown when paid) */}
//       {paymentStatus === "paid" && (
//         <div className="mb-6">
//           <Label
//             htmlFor="payment-mode"
//             className="block text-sm font-medium text-gray-700 mb-2"
//           >
//             Payment Mode
//           </Label>
//           <Select value={paymentMode} onValueChange={setPaymentMode}>
//             <SelectTrigger id="payment-mode" className="w-full">
//               <SelectValue placeholder="Select Payment Mode" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="cash">Cash</SelectItem>
//               <SelectItem value="card">Card</SelectItem>
//               <SelectItem value="upi">UPI</SelectItem>
//               <SelectItem value="wallet">Wallet</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       )}

//       <div className="flex space-x-4 mt-auto">
//         <Button variant="outline" onClick={resetForm} className="flex-1">
//           Cancel
//         </Button>
//         <Button
//           onClick={completeSale}
//           className="flex-1 bg-blue-600 hover:bg-blue-700"
//         >
//           Create Bill
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default BillSummary;

// BillSummary.tsx

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
}: BillSummaryProps) => {
  return (
    <div className="md:w-96 bg-gray-50 p-6 flex flex-col shadow-inner">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">
        Order Summary
      </h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-semibold text-gray-800">
            ₹{subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax:</span>
          <span className="font-semibold text-gray-800">
            ₹{totalTax.toFixed(2)}
          </span>
        </div>
        <div className="border-t border-gray-300 pt-4 flex justify-between text-xl font-extrabold text-blue-700">
          <span>Grand Total:</span>
          <span>₹{grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Status */}
      <div className="mb-6">
        <Label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Status
        </Label>
        <div className="flex gap-3">
          <Button
            variant={paymentStatus === "unpaid" ? "destructive" : "outline"} // Red for Unpaid
            onClick={() => setPaymentStatus("unpaid")}
            className="flex-1 transition-all"
          >
            Unpaid
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
            <SelectTrigger id="payment-mode" className="w-full">
              <SelectValue placeholder="Select Payment Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="wallet">Wallet</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex space-x-3 mt-auto pt-6 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={resetForm}
          className="flex-1 cursor-pointer"
        >
          Reset/Cancel
        </Button>
        <Button
          disabled={isDisabled}
          onClick={completeSale}
          className="flex-1  text-lg cursor-pointer"
        >
          Complete Sale
        </Button>
      </div>
    </div>
  );
};

export default BillSummary;
