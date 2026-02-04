// columns.tsx
import {
  dateFormatter,
  getPaymentMethodIcon,
  PaymentStatusBadge,
} from "@/utils/constants";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReturnConfirmationDialog } from "../../return-bill-confirmation";
import { ViewBill } from "./components/view-bill";
import { DownloadInvoice } from "./components/download-invoice";
import { MoreHorizontal, Eye, Download, Edit, RotateCcw } from "lucide-react";
import { PatientBill } from "@/types/patien-bills";
import { Product } from "@/types/new-sale-entry";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";


export const columns: ColumnDef<PatientBill>[] = [
  {
    accessorKey: "invoiceNo",
    header: "Bill ID",
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return <div className="w-[150px]">{value || "-"}</div>;
    },
  },
  {
    accessorKey: "patient.patientName",
    header: "Patient Name",
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return <div className="capitalize w-[150px]">{value || "-"}</div>;
    },
  },
  {
    accessorKey: "patient.patientMobileNumber",
    header: "Patient Mobile Number",
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return <div className="w-[150px]">{value || "-"}</div>;
    },
  },
  {
    accessorKey: "doctor.doctorName",
    header: "Doctor Name",
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return <div className="capitalize max-w-[200px]">{value || "-"}</div>;
    },
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ getValue }) => {
      const items = getValue() as PatientBill["items"];
      return (
        <div className="max-w-[300px] flex flex-wrap gap-1">
          {items.map((item, idx) => (
            <span key={idx}>
              {item.name}
              {idx < items.length - 1 && ","}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Bill Date",
    cell: ({ getValue }) => dateFormatter(getValue() as string),
  },
  { accessorKey: "totalAmount", header: "Amount" },
  { accessorKey: "discountAmount", header: "Discount" },
  {
    accessorKey: "status",
    header: "Payment Status",
    cell: ({ getValue }) => PaymentStatusBadge(getValue() as string),
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
    cell: ({ getValue }) => {
      const value = getValue() as string;
      if (!value) return "-";

      return (
        <div className="flex items-center gap-2 capitalize">
          {getPaymentMethodIcon(value)}
          <span>{value}</span>
        </div>
      );
    },
  },
  // columns.tsx (Updated action column only)
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: { row: any }) => {
      const bill = row.original;
      const isReturnBill = bill.items.every((item: Product) => item.isReturn);
      const [isOpen, setIsOpen] = useState(false);
      const router = useRouter();
      const handleEdit = useCallback(() => {
        setIsOpen(false);
        router.push(`/new-sale-entry?id=${bill._id}`);
      }, [router, bill._id]);
      return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <ViewBill bill={bill}>
              <DropdownMenuItem onSelect={(e) => {
                e.preventDefault();
                setIsOpen(false);
              }}>
                <Eye className="mr-2 h-4 w-4" />
                View Bill
              </DropdownMenuItem>
            </ViewBill>

            <DownloadInvoice id={bill._id}>
              <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setIsOpen(false); }}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
            </DownloadInvoice>

            <DropdownMenuItem
              onClick={handleEdit}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Bill
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <ReturnConfirmationDialog
              bill={bill}
              invalidateType="patientBills"
              label="Return Bill"
            />
            <ReturnConfirmationDialog
              bill={bill}
              invalidateType="patientBills"
              label={isReturnBill ? "Returned" : "Return"}
              onOpenChange={() => setIsOpen(false)}
            >
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                disabled={isReturnBill}
                className={isReturnBill ? "opacity-50 cursor-not-allowed" : "text-red-600"}
              >
                {/* <RotateCcw className="mr-2 h-4 w-4" /> */}
                {/* {isReturnBill ? "Returned" : "Return Bill"} */}
              </DropdownMenuItem>
            </ReturnConfirmationDialog>


          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }
  // {
  //   id: "actions",
  //   header: "Actions",
  //   cell: ({ row }: { row: any }) => {
  //     const bill = row.original;
  //     const isReturnBill = bill.items.every((item: Product) => item.isReturn);

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end" className="w-[160px]">
  //           <ViewBill bill={bill} />

  //           <DropdownMenuSeparator />

  //           <DownloadInvoice id={bill._id!} />

  //           <DropdownMenuSeparator />

  //           <DropdownMenuItem
  //             onClick={() => {
  //               window.location.href = `/new-sale-entry?id=${bill._id}`;
  //             }}
  //           >
  //             <Edit className="mr-2 h-4 w-full" />
  //             Edit
  //           </DropdownMenuItem>

  //           <DropdownMenuSeparator />

  //           <ReturnConfirmationDialog
  //             bill={bill}
  //             invalidateType="patientBills"
  //             label={isReturnBill ? "Returned" : "Return"}
  //           />

  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];