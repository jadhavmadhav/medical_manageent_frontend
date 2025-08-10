 import { dateFormatter } from "@/utils/constants";
import { ColumnDef } from "@tanstack/react-table";
import { isDateBeforeType } from "react-day-picker";

interface ReturnBills {
  id: string;
  items: { name: string }[];
  discount?: number;
  quantity: number;
  sellingPrice: number;
  createdAt: string;
  name: string;
  mobileNumber: string;
  buyingPrice?: number;
  buyingDate?: string;
  schedule?: string;
  cost?: number;
  profit?: number;
}

export const columns: ColumnDef<ReturnBills>[] = [
  { accessorKey: "id", header: "S.No" },
  {
    accessorKey: "item",
    header: "Item",
  },
  {
    accessorKey: "returnDate",
    header: "Return Date",
    cell: (params) => {
      const value = params.getValue();
      return dateFormatter(value) || "-";
    },
  },
  {
    accessorKey: "salesDate",
    header: "Bill Date",

    cell: (params) => {
      const value = params.getValue();
      return dateFormatter(value) || "-";
    },
  },
  {
    accessorKey: "sellingPrice",
    header: "Price",
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
  },
  {
    accessorKey: "address",
    header: "Customer Address",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "schedule",
    header: "Schedule",
    cell: (params: any) => {
      const value = params.row["schedule"];
      return value || "-";
    },
  },
];
