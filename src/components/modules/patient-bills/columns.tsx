import {
  dateFormatter,
  getPaymentMethodIcon,
  PaymentStatusBadge,
} from "@/utils/constants";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../ui/button";
import { ReturnConfirmationDialog } from "../../return-bill-confirmation";
import { ViewBill } from "./components/view-bill";

interface PatientBills {
  id: string;
  items: { name: string }[];
  discount?: number;
  quantity: number;
  sellingPrice: number;
  createdAt: string;
  name: string;
  mobile_number: string;
  buyingPrice?: number;
  buyingDate?: string;
  schedule?: string;
  cost?: number;
  profit?: number;
}

export const columns: ColumnDef<PatientBills>[] = [
  {
    accessorKey: "patient.name",
    header: "Patient Name",
    cell: (params: any) => {
      const value = params.getValue();
      return <div className="capitalize w-[150px]">{value || "-"}</div>;
    },
  },
  {
    accessorKey: "patient.mobile_number",
    header: "Patient Mobile Number",
    cell: (params: any) => {
      const value = params.getValue();
      return <div className="w-[150px]">{value || "-"}</div>;
    },
  },

  {
    accessorKey: "doctor.name",
    header: "Doctor Name",
    cell: (params: any) => {
      const value = params.getValue();
      return <div className="capitalize max-w-[200px] ">{value || "-"}</div>;
    },
  },
  {
    accessorKey: "items",
    header: "Items",
    // width: 300,
    cell: (params: any) => {
      const value = params.getValue();
      return (
        <div className="max-w-[300px] flex flex-wrap gap-2">
          {value.map((x: any, idx: number) => (
            <span key={idx}>
              {x.item}
              {idx < value.length - 1 && ", "}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Bill Date",
    cell: (params: any) => {
      const value = params.getValue();
      return dateFormatter(value);
    },
  },
  { accessorKey: "totalAmount", header: "Amount" },
  { accessorKey: "discountAmount", header: "Discount" },
  {
    accessorKey: "status",
    header: "Payment Status",
    cell: (params: any) => {
      const status = params?.getValue() as string;

      return PaymentStatusBadge(status);
    },
  },

  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
    cell: (params: any) => {
      const value = params.getValue() as string;
      if (!value) return "-";

      return (
        <div className="flex items-center capitalize">
          {getPaymentMethodIcon(value)}
          {value}
        </div>
      );
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: (params: any) => {
      const value = params.getValue();
      const row = params.row.original;

      const isReturnBill = row?.items?.every((i: any) => i.isReturn);
      console.log("row", row);
      return (
        <div className="flex items-center gap-5 justify-center">
          <Button color="primary">Download</Button>
          {/* <Button
            color="primary"
            variant="outline"
            className="capitalize"
            onClick={() => console.log(value)}
          >
            View
          </Button> */}
          <ViewBill bill={row} />

          <Button
            disabled={isReturnBill}
            onClick={() => {
              // Navigate to edit page with bill ID
              const billId = row._id;
              window.location.href = `/new-sale-entry?id=${billId}`;
            }}
          >
            Edit
          </Button>
          <ReturnConfirmationDialog
            bill={row}
            invalidateType="patientBills"
            label={isReturnBill ? "Returned" : "Return"}
          />
          {/* <Button variant="destructive">Return</Button> */}
        </div>
      );
    },
  },
];
