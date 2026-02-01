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
  batchNo?: string;
  vendorId: string;
  billNumber: string;
  gstPercent: number;
  buyingDate: string;
  locker?: string;
}

export const columns: ColumnDef<inventories>[] = [
  // {
  //   accessorKey: "purchaseBillNumber",
  //   header: "Bill Number",
  // },
  {
    accessorKey: "name",
    header: "Item Name",
  },


 {
    accessorKey: "batchNo",
    header: "Batch Number",
  },
  {
    id: "stockProgress",
    header: "Stock Status",
    cell: ({ row }) =>
      renderStockProgress(row.original),
  },

  {
    accessorKey: "manufacturer",
    header: "Manufacturer	",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: (params: any) => {
      const stock = params.row.original.stock;
      const unit = params.row.original.unit.baseUnit;
      return <div className="text-center">{stock.available} {unit}</div>
    }
  },

  
 

  {
    accessorKey: "buyingPrice",
    header: "Buying Price",
    cell: (params: any) => {
      const buyingPrice = params.row.original.pricing?.buyingPerBaseUnit || 0

      return (
        <div>
          {numberFormatter(Number(buyingPrice) || 0)}
        </div>
      )
    },
  },
  {
    accessorKey: "sellingPrice",
    header: "Selling Price",
    cell: (params: any) => {
      const sellingPrice = params.row.original.pricing?.sellingPerBaseUnit || 0
      return (
        <div>
          {numberFormatter(Number(sellingPrice) || 0)}
        </div>
      )
    },
  },
  {
    accessorKey: "manufacturer",
    header: "Manufacturer",
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
    accessorKey: "gstPercent",
    header: "GST (%)",
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
