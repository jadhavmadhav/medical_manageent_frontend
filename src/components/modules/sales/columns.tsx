// import { dateFormatter, numberFormatter } from "@/utils/constants";
// import { ColumnDef } from "@tanstack/react-table";

// interface Sale {
//   id: string;
//   item: string;
//   discount?: number;
//   quantity: number;
//   sellingPrice: number;
//   createdAt: string;
//   name: string;
//   mobile_number: string;
//   buyingPrice?: number;
//   buyingDate?: string;
//   schedule?: string;
//   cost?: number;
//   profit?: number;
// }

// export const columns: ColumnDef<Sale>[] = [
//   { accessorKey: "name", header: "Product Name" },
//   {
//     accessorKey: "invoiceNo",
//     header: "Bill No",
//   },
//   { accessorKey: "discount", header: "Discount" },
//   { accessorKey: "quantity", header: "Quantity",
//     cell:(params:any) =>{
//       const unit = params.row.original?.unit?.baseUnit; 
//       return <div className="capitalize w-[100px]">{params.getValue()} {unit}</div>
//     }
//    },
//   {
//     accessorKey: "sellingPrice",
//     header: "MRP",
//     cell: ({ getValue }) => numberFormatter(Number(getValue()) || 0),
//   },
//   {
//     accessorKey: "createdAt",
//     header: "Selling Date",
//     cell: ({ getValue }) => dateFormatter(getValue() ?? ""),
//   },
//   { accessorKey: "patientName", header: "Patient Name" },
//   { accessorKey: "patientMobileNumber", header: "Patient Mobile" },
//   {
//     accessorKey: "doctorName",
//     header: "Doctor Name",
//     cell: (params: any) => {
//       const value = params.getValue();
//       return <div className="capitalize w-[180px]">{value}</div>;
//     },
//   },

//   {
//     accessorKey: "buyingPrice",
//     header: "Rate",
//     cell: ({ getValue }) => numberFormatter(Number(getValue()) || 0),
//   },
//   {
//     accessorKey: "buyingDate",
//     header: "Buying Date",
//     cell: ({ getValue }) => dateFormatter(getValue() ?? ""),
//   },
//   { accessorKey: "schedule", header: "Schedule" },
//   { accessorKey: "cost", header: "Cost" },
//   { accessorKey: "profit", header: "Profit" },
// ];



// columns.tsx
import { dateFormatter, numberFormatter } from "@/utils/constants";
import { ColumnDef } from "@tanstack/react-table";
import type { Sale } from "./types";

export const columns: ColumnDef<Sale>[] = [
  { accessorKey: "name", header: "Product Name" },
  { accessorKey: "invoiceNo", header: "Bill No" },
  {
    accessorKey: "createdAt",
    header: "Selling Date",
    cell: ({ getValue }) => dateFormatter(getValue() ?? ""),
  },

  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row, getValue }) => (
      <div className="capitalize w-[100px]">
        {getValue()} {row.original.unit?.baseUnit}
      </div>
    ),
  },
  { accessorKey: "discount", header: "Discount" },
  {
    accessorKey: "total",
    header: "Total Price",
    cell: ({ getValue }) => numberFormatter(Number(getValue()) || 0),
  },

  // { accessorKey: "patientName", header: "Patient Name" },
  // { accessorKey: "patientMobileNumber", header: "Patient Mobile" },
  // {
  //   accessorKey: "doctorName",
  //   header: "Doctor Name",
  //   cell: ({ getValue }) => <div className="capitalize w-[180px]">{getValue()}</div>,
  // },
  {
    accessorKey: "buyingPrice",
    header: "Rate",
    cell: ({ getValue }) => numberFormatter(Number(getValue()) || 0),
  },
  // {
  //   accessorKey: "buyingDate",
  //   header: "Buying Date",
  //   cell: ({ getValue }) => dateFormatter(getValue() ?? ""),
  // },
  { accessorKey: "schedule", header: "Schedule" },
  { accessorKey: "cost", header: "Cost" },
  {
    accessorKey: "profit", header: "Profit",
    cell: (params: any) => {
      const profit = params.row.original.total - params.row.original.buyingPrice;
      return numberFormatter(profit);
    }
  },
];