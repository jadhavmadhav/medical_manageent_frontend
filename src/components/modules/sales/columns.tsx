import { dateFormatter, numberFormatter } from "@/utils/constants";
import { ColumnDef } from "@tanstack/react-table";

interface Sale {
  id: string;
  item: string;
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

export const columns: ColumnDef<Sale>[] = [
  { accessorKey: "item", header: "Product Name" },
  { accessorKey: "discount", header: "Discount" },
  { accessorKey: "quantity", header: "Quantity" },
  {
    accessorKey: "sellingPrice",
    header: "MRP",
    cell: ({ getValue }) => numberFormatter(Number(getValue()) || 0),
  },
  {
    accessorKey: "createdAt",
    header: "Selling Date",
    cell: ({ getValue }) => dateFormatter(getValue() ?? ""),
  },
  { accessorKey: "patient.name", header: "Patient Name" },
  { accessorKey: "patient.mobile_number", header: "Patient Mobile Number" },
  {
    accessorKey: "doctor.name",
    header: "Doctor Name",
    cell: (params: any) => {
      const value = params.getValue();
      return <div className="capitalize w-[180px]">{value}</div>;
    },
  },

  {
    accessorKey: "buyingPrice",
    header: "Rate",
    cell: ({ getValue }) => numberFormatter(Number(getValue()) || 0),
  },
  {
    accessorKey: "buyingDate",
    header: "Buying Date",
    cell: ({ getValue }) => dateFormatter(getValue() ?? ""),
  },
  { accessorKey: "schedule", header: "Schedule" },
  { accessorKey: "cost", header: "Cost" },
  { accessorKey: "profit", header: "Profit" },
];
