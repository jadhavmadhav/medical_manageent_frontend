import { Button } from "@/components/ui/button";
import { dateFormatter, PaymentStatusBadge } from "@/utils/constants";

export const columns = [
  { accessorKey: "id", header: "S.No", width: 80, sortable: false },
  { accessorKey: "billNumber", header: "Bill Number", width: 150 },
  { accessorKey: "vendorName", header: "Vendor Name", flex: 1, minWidth: 150 },
  { accessorKey: "vendorMobile", header: "Vendor Mobile", width: 120 },
  {
    accessorKey: "billDate",
    header: "Date",
    width: 150,
    cell: (params: any) => dateFormatter(params.getValue()),
  },
  {
    accessorKey: "totalAmount",
    header: "Total (₹)",
    width: 120,
    cell: (params: any) => params.getValue(),
  },
  {
    accessorKey: "itemCount",
    header: "Items",
    width: 100,
    cell: (params: any) => {
      const length = params.row.original.items.length;
      return length || "-";
    },
  },
  { accessorKey: "vendorAddress", header: "Vendor Address", width: 200 },
  { accessorKey: "vendorGst", header: "Vendor GST", width: 200 },
  {
    accessorKey: "paymentStatus",
    header: "Status",
    width: 200,
    cell: (params: any) => {
      const statusText = params.getValue();
      return PaymentStatusBadge(statusText);
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    width: 250,
    sortable: false,
    cell: (params: any) => (
      <div className="flex gap-2">
        <Button
          color="primary"
          variant="outline"
          //  onClick={() => navigate(`/purchase-bills/${params.row._id}`)}
        >
          View
        </Button>

        <Button
        //   onClick={() => navigate(`/purchase-bills/edit/${params.row._id}`)}
        >
          Edit
        </Button>
        {/* <RiDeleteBin5Fill
            className="text-xl cursor-pointer text-red-600 hover:text-red-800"
            onClick={() => setDeletePrompt({ isOpen: true, billId: params.row._id })}
          /> */}
      </div>
    ),
  },
];
