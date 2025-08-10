import {
  dateFormatter,
  getStatusBadge,
  numberFormatter,
  renderStockProgress,
} from "@/utils/constants";
import { ColumnDef } from "@tanstack/react-table";

export interface inventories {
  item: string;
  cgst: string;
  sgst: string;
  buyingPrice: number;
  sellingPrice: number;
  quantity: number;
  saleQuantity: number;
  status: string;
  expiryDate: string;
  batchNumber?: string;
  vendorId: string;
  billNumber: string;
  gstPercent: number;
  buyingDate: string;
  locker?: string;
}

export const columns: ColumnDef<inventories>[] = [
  {
    accessorKey: "billNumber",
    header: "Bill Number",
  },
  {
    accessorKey: "item",
    header: "Item Name",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "saleQuantity",
    header: "Soled Quantity",
  },
  {
    id: "stockProgress",
    header: "Stock Status",
    cell: ({ row }) =>
      renderStockProgress(row.original.quantity, row.original.saleQuantity),
  },
  {
    accessorKey: "batchNumber",
    header: "Batch Number",
  },

  {
    accessorKey: "buyingPrice",
    header: "Buying Price",
    cell: ({ getValue }) => numberFormatter(Number(getValue()) || 0),
  },
  {
    accessorKey: "sellingPrice",
    header: "Selling Price",
    cell: ({ getValue }) => numberFormatter(Number(getValue()) || 0),
  },
  {
    accessorKey: "expiryDate",
    header: "Expiry Date",
    cell: ({ getValue }) => dateFormatter(getValue()),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (params: any) => {
      const status = params.getValue();
      return <div className="text-center">{getStatusBadge(status)}</div>;
    },
  },

  {
    accessorKey: "buyingDate",
    header: "buying Date",
    cell: ({ getValue }) => dateFormatter(getValue()),
  },
  {
    accessorKey: "sgst",
    header: "SGST (%)",
  },
  {
    accessorKey: "cgst",
    header: "CGST (%)",
  },
  {
    accessorKey: "gstPercent",
    header: "GST (%)",
  },
  {
    accessorKey: "vendorId",
    header: "Vendor ID",
  },
  {
    accessorKey: "locker",
    header: "Locker",
    cell: (params: any) => {
      const value = params.getValue();
      return <div className="min-w-[100px] text-center">{value || "-"}</div>;
    },
  },
];
