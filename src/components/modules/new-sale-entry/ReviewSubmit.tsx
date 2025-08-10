// "use client";

// import { useMemo } from "react";

// interface ReviewSubmitProps {
//   items: any[];
//   patient: any;
//   doctor: any;
//   discount: number;
// }

// export const ReviewSubmit = ({
//   items,
//   patient,
//   doctor,
//   discount,
// }: ReviewSubmitProps) => {
//   const subtotal = useMemo(
//     () => items.reduce((sum, item) => sum + item.total, 0),
//     [items]
//   );

//   const totalDiscount = useMemo(
//     () => subtotal * (discount / 100),
//     [subtotal, discount]
//   );

//   const grandTotal = useMemo(
//     () => subtotal - totalDiscount,
//     [subtotal, totalDiscount]
//   );

//   const totalGST = useMemo(
//     () => items.reduce((sum, item) => sum + item.gstAmount, 0),
//     [items]
//   );

//   console.log({ patient, doctor });
//   return (
//     <div className="space-y-6">
//       <h3 className="text-xl font-semibold text-gray-800">Review & Submit</h3>

//       <div className="border rounded-lg p-4">
//         <h4 className="font-medium text-lg mb-3">Medicines</h4>
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="text-left px-4 py-2">Medicine</th>
//                 <th className="text-right px-4 py-2">Price</th>
//                 <th className="text-right px-4 py-2">Qty</th>
//                 <th className="text-right px-4 py-2">GST %</th>
//                 <th className="text-right px-4 py-2">Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {items?.map((item) => (
//                 <tr key={item._id} className="hover:bg-gray-50">
//                   <td className="px-4 py-2 border-b">{item?.item}</td>
//                   <td className="px-4 py-2 border-b text-right">
//                     ₹{item.sellingPrice.toFixed(2)}
//                   </td>
//                   <td className="px-4 py-2 border-b text-right">
//                     {item.quantity}
//                   </td>
//                   <td className="px-4 py-2 border-b text-right">
//                     {item.gstPercent}%
//                   </td>
//                   <td className="px-4 py-2 border-b text-right">
//                     ₹{item.total.toFixed(2)}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {patient?.name && (
//         <div className="border rounded-lg p-4">
//           <h4 className="font-medium text-lg mb-3">Patient Details</h4>
//           <div className="grid md:grid-cols-2 gap-4">
//             <div>
//               <p className="text-sm text-gray-500">Name</p>
//               <p className="font-medium">{patient?.name}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Mobile</p>
//               <p className="font-medium">{patient?.mobile}</p>
//             </div>
//             {patient?.address && (
//               <div className="md:col-span-2">
//                 <p className="text-sm text-gray-500">Address</p>
//                 <p className="font-medium">{patient?.address}</p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {doctor?.name && (
//         <div className="border rounded-lg p-4">
//           <h4 className="font-medium text-lg mb-3">Doctor Details</h4>
//           <div className="grid md:grid-cols-2 gap-4">
//             <div>
//               <p className="text-sm text-gray-500">Name</p>
//               <p className="font-medium">{doctor?.name}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Hospital</p>
//               <p className="font-medium">{doctor?.hospital}</p>
//             </div>
//             {doctor?.mobile && (
//               <div>
//                 <p className="text-sm text-gray-500">Mobile</p>
//                 <p className="font-medium">{doctor?.mobile}</p>
//               </div>
//             )}
//             {doctor?.registrationNumber && (
//               <div>
//                 <p className="text-sm text-gray-500">Registration No.</p>
//                 <p className="font-medium">{doctor?.registrationNumber}</p>
//               </div>
//             )}
//             {doctor?.address && (
//               <div className="md:col-span-2">
//                 <p className="text-sm text-gray-500">Address</p>
//                 <p className="font-medium">{doctor?.address}</p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       <div className="border rounded-lg p-4">
//         <h4 className="font-medium text-lg mb-3">Payment Summary</h4>
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <p className="text-sm text-gray-500">Subtotal:</p>
//             <p className="text-sm text-gray-500">Discount ({discount}%):</p>
//             <p className="text-sm text-gray-500">Total GST:</p>
//             <p className="font-bold text-lg">Grand Total:</p>
//           </div>
//           <div className="text-right">
//             <p>₹{subtotal.toFixed(2)}</p>
//             <p>-₹{totalDiscount.toFixed(2)}</p>
//             <p>₹{totalGST.toFixed(2)}</p>
//             <p className="font-bold text-lg">₹{grandTotal.toFixed(2)}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

"use client";

import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface ReviewSubmitProps {
  items: any[];
  patient: any;
  doctor: any;
  discount: number;
  paymentStatus: string;
  paymentMethod: string;
  setPaymentStatus: (status: string) => void;
  setPaymentMethod: (method: string) => void;
}

export const ReviewSubmit = ({
  items,
  patient,
  doctor,
  discount,
  paymentStatus,
  paymentMethod,
  setPaymentStatus,
  setPaymentMethod,
}: ReviewSubmitProps) => {
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.total, 0),
    [items]
  );
  const totalDiscount = useMemo(
    () => subtotal * (discount / 100),
    [subtotal, discount]
  );
  const grandTotal = useMemo(
    () => subtotal - totalDiscount,
    [subtotal, totalDiscount]
  );
  const totalGST = useMemo(
    () => items.reduce((sum, item) => sum + item.gstAmount, 0),
    [items]
  );

  const showPaymentMethod = ["paid", "done"].includes(
    paymentStatus?.toLowerCase()
  );

  return (
    <div className="space-y-6 px-4 py-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <h3 className="text-2xl font-semibold text-gray-800">Review & Submit</h3>

      {/* Medicines Table */}
      <div className="border rounded-xl p-4">
        <h4 className="font-semibold text-lg mb-4">Medicines</h4>
        <div className="overflow-x-auto rounded-md">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr className="text-left text-gray-700">
                <th className="px-4 py-2">Medicine</th>
                <th className="px-4 py-2 text-right">Price</th>
                <th className="px-4 py-2 text-right">Qty</th>
                <th className="px-4 py-2 text-right">GST %</th>
                <th className="px-4 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {items?.map((item, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2">{item.item}</td>
                  <td className="px-4 py-2 text-right">
                    ₹{item.sellingPrice.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-right">{item.quantity}</td>
                  <td className="px-4 py-2 text-right">{item.gstPercent}%</td>
                  <td className="px-4 py-2 text-right">
                    ₹{item.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="border rounded-xl p-4">
        <h4 className="font-semibold text-lg mb-4">Payment Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-gray-600 space-y-2">
            <p>Subtotal:</p>
            <p>Discount ({discount}%):</p>
            <p>Total GST:</p>
            <p className="font-semibold text-base text-gray-800">
              Grand Total:
            </p>
          </div>
          <div className="text-right text-gray-800 space-y-2">
            <p>₹{subtotal.toFixed(2)}</p>
            <p>-₹{totalDiscount.toFixed(2)}</p>
            <p>₹{totalGST.toFixed(2)}</p>
            <p className="font-bold text-lg">₹{grandTotal.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Payment Status Select */}
      <div className="border rounded-xl p-4 space-y-4">
        <h4 className="font-semibold text-lg">Payment Details</h4>

        <div className="space-y-2">
          <Label>
            Payment Status <span className="text-red-500">*</span>
          </Label>
          <Select
            value={paymentStatus}
            onValueChange={setPaymentStatus}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Payment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {showPaymentMethod && (
          <div className="space-y-2">
            <Label>
              Payment Method <span className="text-red-500">*</span>
            </Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="netbanking">Net Banking</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Optional validation message */}
        {showPaymentMethod && !paymentMethod && (
          <div className="text-red-500 text-sm flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" /> Please select a payment
            method.
          </div>
        )}
      </div>
    </div>
  );
};
