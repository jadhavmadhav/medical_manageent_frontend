// import { ReturnConfirmationDialog } from "@/components/return-bill-confirmation";
// import {
//   AlertDialog,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { Button } from "@/components/ui/button";

// // Import Lucide Icon for visual clarity on returned items
// import { RotateCcw } from "lucide-react";

// interface BillItem {
//   _id: string;
//   item: string;
//   quantity: number;
//   sellingPrice: number;
//   isReturn?: boolean;
// }

// interface Bill {
//   _id: string;
//   billNumber: string;
//   items: BillItem[];
//   invoiceNo: string;
//   discountAmount?: number;
// }

// interface ViewBillProps {
//   bill: Bill;
// }

// export function ViewBill({ bill }: ViewBillProps) {
//   const billItems = bill?.items || [];

//   // A bill is considered 'fully returned' if all items are marked as returned
//   const isReturnBill =
//     billItems.length > 0 && billItems.every((i) => i.isReturn);

//   return (
//     <AlertDialog>
//       {/* Trigger Button */}
//       <AlertDialogTrigger asChild>
//         <Button color="primary" variant="outline" className="min-w-[100px]">
//           View
//         </Button>
//       </AlertDialogTrigger>

//       {/* Dialog Content - Larger max-width and subtle shadow */}
//       <AlertDialogContent className=" shadow-2xl !w-[80vw] max-w-[90vw]   p-6">
//         <AlertDialogHeader className="border-b pb-4">
//           <AlertDialogTitle className="flex justify-between items-center text-xl font-bold text-gray-800">
//             <span>
//               Bill #{bill?.invoiceNo || "-"}{" "}
//               {/* Enhanced Returned Status Tag */}
//               {isReturnBill && (
//                 <span className="ml-2 inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700">
//                   <RotateCcw className="h-3 w-3 mr-1" />
//                   FULL RETURNED
//                 </span>
//               )}
//             </span>
//             <span className="text-sm text-gray-500 font-normal">
//               Items: <span className="font-semibold">{billItems.length}</span>
//             </span>
//           </AlertDialogTitle>
//         </AlertDialogHeader>

//         {/* Bill Items Table Container - Cleaned up spacing */}
//         <div className="max-h-[350px] overflow-y-auto border rounded-lg bg-white">
//           {billItems.length > 0 ? (
//             <table className="w-full text-sm">
//               <thead className="sticky top-0 bg-gray-50 border-b text-gray-600 uppercase text-xs">
//                 <tr>
//                   <th className="py-2 px-4 text-left font-medium w-1/3">
//                     Item Description
//                   </th>
//                   <th className="py-2 px-4 text-center font-medium">Qty</th>
//                   <th className="py-2 px-4 text-right font-medium">
//                     Unit Price
//                   </th>
//                   <th className="py-2 px-4 text-right font-medium">
//                     Line Total
//                   </th>
//                   <th className="py-2 px-4 text-center font-medium w-[120px]">
//                     Return Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {billItems.map((item) => {
//                   const itemTotal = item.quantity * item.sellingPrice;
//                   // Use conditional class for returned items
//                   const rowClass = item.isReturn
//                     ? "bg-red-50 text-red-600 border-l-4 border-red-400"
//                     : "hover:bg-gray-50";

//                   return (
//                     <tr
//                       key={item._id}
//                       className={`border-b last:border-0 ${rowClass}`}
//                     >
//                       <td className="py-2 px-4 font-medium">{item.item}</td>
//                       <td className="py-2 px-4 text-center">{item.quantity}</td>
//                       <td className="py-2 px-4 text-right">
//                         ₹{item.sellingPrice.toFixed(2)}
//                       </td>
//                       <td className="py-2 px-4 text-right font-semibold">
//                         ₹{itemTotal.toFixed(2)}
//                       </td>
//                       <td className="py-2 px-4 text-center">
//                         <ReturnConfirmationDialog
//                           bill={{ ...bill, items: [item] }}
//                           invalidateType="patientBills"
//                           label={item.isReturn ? "Returned" : "Return"}
//                           // Pass an additional prop to style the button
//                         />
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           ) : (
//             <p className="text-gray-500 text-sm p-4 text-center">
//               No items in this bill.
//             </p>
//           )}
//         </div>

//         {/* Footer */}
//         <AlertDialogFooter className="mt-6">
//           <AlertDialogCancel className="w-24">Close</AlertDialogCancel>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// }

import { ReturnConfirmationDialog } from "@/components/return-bill-confirmation";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface BillItem {
  _id: string;
  item: string;
  quantity: number;
  sellingPrice: number;
  isReturn?: boolean;
}

interface Bill {
  _id: string;
  billNumber: string;
  items: BillItem[];
  invoiceNo: string;
  discountAmount?: number;
}

interface ViewBillProps {
  bill: Bill;
}

export function ViewBill({ bill }: ViewBillProps) {
  const billItems = bill?.items || [];

  const isReturnBill =
    billItems.length > 0 && billItems.every((i) => i.isReturn);

  const subtotal = billItems.reduce(
    (acc, i) => acc + i.quantity * i.sellingPrice,
    0
  );
  const discount = bill?.discountAmount || 0;
  const total = subtotal - discount;

  return (
    <AlertDialog>
      {/* Trigger Button */}
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="min-w-[100px] cursor-pointer">
          View
        </Button>
      </AlertDialogTrigger>

      {/* Custom Wide Dialog */}
      <AlertDialogContent
        className="w-[600px] min-w-[60vw] max-w-[800px] p-6 rounded-2xl shadow-2xl border "   >
        {/* Header */}
        <AlertDialogHeader className="border-b pb-3">
          <AlertDialogTitle className="flex justify-between items-center text-xl font-semibold">
            <div className="flex items-center gap-2">
              <span>Bill #{bill?.invoiceNo || "-"}</span>
              {isReturnBill && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                  <RotateCcw className="h-3 w-3" />
                  FULL RETURNED
                </span>
              )}
            </div>
            <span className="text-sm text-gray-500 font-normal">
              {billItems.length} item{billItems.length > 1 && "s"}
            </span>
          </AlertDialogTitle>
        </AlertDialogHeader>

        {/* Bill Items */}
        <div className="mt-4 border rounded-lg overflow-hidden ">
          {billItems.length > 0 ? (
            <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-100 border-b text-gray-700 uppercase text-xs">
                  <tr>
                    <th className="py-2 px-4 text-left">Item</th>
                    <th className="py-2 px-4 text-center">Qty</th>
                    <th className="py-2 px-4 text-right">Unit Price</th>
                    <th className="py-2 px-4 text-right">Total</th>
                    <th className="py-2 px-4 text-center w-[130px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {billItems.map((item) => {
                    const itemTotal = item.quantity * item.sellingPrice;
                    const rowClass = item.isReturn
                      ? "bg-red-50 text-red-600 border-l-4 border-red-400"
                      : "hover:bg-gray-50";

                    return (
                      <tr
                        key={item._id}
                        className={`border-b last:border-0 ${rowClass}`}
                      >
                        <td className="py-2 px-4 font-medium">{item.item}</td>
                        <td className="py-2 px-4 text-center">
                          {item.quantity}
                        </td>
                        <td className="py-2 px-4 text-right">
                          ₹{item.sellingPrice.toFixed(2)}
                        </td>
                        <td className="py-2 px-4 text-right font-semibold">
                          ₹{itemTotal.toFixed(2)}
                        </td>
                        <td className="py-2 px-4 text-center">
                          <ReturnConfirmationDialog
                            bill={{ ...bill, items: [item] }}
                            invalidateType="patientBills"
                            label={item.isReturn ? "Returned" : "Return"}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-sm p-4 text-center">
              No items in this bill.
            </p>
          )}
        </div>

        {/* Summary */}
        <div className="flex justify-end mt-4">
          <div className="w-full sm:w-1/3 md:w-1/4 bg-white border rounded-lg p-3 text-sm text-gray-700 shadow-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount:</span>
              <span>-₹{discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-900 border-t mt-2 pt-2">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel className="w-28">Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
