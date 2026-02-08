
// view-bill.tsx
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
import { Product } from "@/types/new-sale-entry";
import { RotateCcw } from "lucide-react";
import { useMemo, memo, useState } from "react";

interface BillItem {
  _id: string;
  name: string;
  quantity: number;
  sellingPrice: number;
  isReturn?: boolean;
}

interface Bill {
  _id: string;
  billNumber?: string;
  items: BillItem[];
  invoiceNo: string;
  discountAmount?: number;
}

interface ViewBillProps {
  bill: Bill;
  open?: boolean;
  close?: () => void;
  children?: React.ReactNode;
}

// Memoized row component
const BillItemRow = memo(({ item, bill, setOpenReturn }: { item: BillItem; bill: Bill; setOpenReturn: (open: boolean) => void }) => {
  const itemTotal = item.quantity * item.sellingPrice;
  const rowClass = item.isReturn
    ? "bg-red-50 text-red-600 border-l-4 border-red-400"
    : "";
  const isReturnBill = bill.items.every(
    (item: any) => item.isReturn
  );
  return (
    <tr className={`border-b last:border-0 ${rowClass}`}>
      <td className="py-2 px-4 font-medium">{item.name}</td>
      <td className="py-2 px-4 text-center">{item.quantity}</td>
      <td className="py-2 px-4 text-right">₹{item.sellingPrice.toFixed(2)}</td>
      <td className="py-2 px-4 text-right font-semibold">₹{itemTotal.toFixed(2)}</td>
      <td className="py-2 px-4 text-center flex items-center justify-center cursor-pointer" onClick={() => setOpenReturn(true)}>
        {/* <RotateCcw /> */}
        {isReturnBill ? "Returned" : "Return Bill"}

      </td>
    </tr>
  );
});

BillItemRow.displayName = "BillItemRow";

export const ViewBill = memo(({ bill, open, close }: ViewBillProps) => {
  const [openReturn, setOpenReturn] = useState(false);

  const billItems = bill?.items || [];

  const { isReturnBill, subtotal, discount, total } = useMemo(() => {
    const isReturn = billItems.length > 0 && billItems.every((i) => i.isReturn);
    const sub = billItems.reduce((acc, i) => acc + i.quantity * i.sellingPrice, 0);
    const disc = bill?.discountAmount || 0;
    const tot = sub - disc;

    return {
      isReturnBill: isReturn,
      subtotal: sub,
      discount: disc,
      total: tot,
    };
  }, [billItems, bill?.discountAmount]);

  return (
    <>
      <AlertDialog open={open} onOpenChange={close}>
        {/* <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger> */}

        <AlertDialogContent className="w-[95vw] min-w-[800px] p-6 rounded-2xl shadow-2xl">
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
                {billItems.length} item{billItems.length !== 1 && "s"}
              </span>
            </AlertDialogTitle>
          </AlertDialogHeader>

          {/* Bill Items */}
          <div className="mt-4 border rounded-lg overflow-hidden">
            {billItems.length > 0 ? (
              <div className="max-h-[400px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0  border-b uppercase text-xs z-10">
                    <tr>
                      <th className="py-2 px-4 text-left">Item</th>
                      <th className="py-2 px-4 text-center">Qty</th>
                      <th className="py-2 px-4 text-right">Unit Price</th>
                      <th className="py-2 px-4 text-right">Total</th>
                      <th className="py-2 px-4 text-center w-[130px]">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billItems.map((item) => (
                      <BillItemRow key={item._id} item={item} bill={bill} setOpenReturn={setOpenReturn} />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-sm p-4 text-center">No items in this bill.</p>
            )}
          </div>

          {/* Summary */}
          <div className="flex justify-end mt-4">
            <div className="w-full max-w-[280px] border rounded-lg p-3 text-sm font-bold shadow-sm">
              <div className="flex justify-between py-1">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Discount:</span>
                <span className="text-red-600">-₹{discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base border-t mt-2 pt-2">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ReturnConfirmationDialog
        bill={{ ...bill, items: billItems }}
        invalidateType="patientBills"
        close={() => setOpenReturn(false)}
        open={openReturn}
      // label={item.isReturn ? "Returned" : "Return"}
      />
    </>
  );
});

ViewBill.displayName = "ViewBill";