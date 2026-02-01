 

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
// Assuming BillItem is exported from the parent type file. Using 'any' as fallback for demonstration.
interface BillItem {
  inventoryId: string; // Assuming it's a string, not number, from the main file logic
  name: string;
  saltComposition: string;
  availableQuantity: number;
  quantity: number;
  sellingPrice: number;
  discount: number;
  total: number;
  batchNo?: string;
  // Add other properties as needed
}

// Assuming Enterprise Context and its type for table config
interface BillTableColumn {
  key: string;
  label: string;
  value: boolean;
  position: number;
}
interface EnterpriseContextType {
  enterprise: {
    billTableForCreateBill: BillTableColumn[];
    // ... other enterprise properties
  } | null;
}
// Placeholder for Enterprise Context hook
const useEnterprise = (): EnterpriseContextType => ({
  enterprise: {
    billTableForCreateBill: [
      { key: "item", label: "Medicine", value: true, position: 1 },
      { key: "quantity", label: "Qty", value: true, position: 2 },
      { key: "sellingPrice", label: "MRP", value: true, position: 3 },
      { key: "discount", label: "Disc. (₹)", value: true, position: 4 },
      { key: "totalAmount", label: "Total", value: true, position: 5 },
      { key: "action", label: "Remove", value: true, position: 6 },
    ] as BillTableColumn[],
  },
});

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { numberFormatter } from "@/utils/constants";

interface BillItemsTableProps {
  billItems: BillItem[];
  updateQuantity: (productId: string, newQuantity: string) => void;
  updateDiscount: (productId: string, newDiscount: string) => void;
  removeItem: (productId: string) => void;
}

const BillItemsTable = ({
  billItems,
  updateQuantity,
  updateDiscount,
  removeItem,
}: BillItemsTableProps) => {
  const { enterprise } = useEnterprise();

  // Get the table configuration from enterprise context
  const tableConfig = enterprise?.billTableForCreateBill || [];

  // Filter and sort columns based on configuration
  const visibleColumns = tableConfig
    .filter((column) => column.value === true)
    .sort((a, b) => (a.position || 0) - (b.position || 0));

  return (
    <div className="flex-grow overflow-auto mb-6">
      <h3 className="text-lg font-bold mb-4 pt-4 border-t border-gray-100">
        Bill Items
      </h3>
      {billItems.length === 0 ? (
        <div className="text-center py-12 rounded-lg border border-dashed border-gray-300 h-40 flex items-center justify-center">
          <p className="text-gray-500 text-lg">
            Start by searching and adding a product above 👆
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <Table>
            <TableHeader className="">
              <TableRow>

                <TableHead
                  className="font-bold bg-secondary"
                >
                  Name
                </TableHead>

                <TableHead
                  className="font-bold bg-secondary"
                >
                  Batch
                </TableHead>
                <TableHead
                  className="font-bold bg-secondary"
                >
                  Qty
                </TableHead>
                <TableHead
                  className="font-bold bg-secondary"
                >
                  Price
                </TableHead>
                <TableHead
                  className="font-bold bg-secondary"
                >
                  Discount
                </TableHead>
                <TableHead
                  className="font-bold bg-secondary"
                >
                  Total
                </TableHead>
                <TableHead
                  className="font-bold bg-secondary"
                >
                  Action
                </TableHead>

              </TableRow>
            </TableHeader>
            <TableBody>
              {billItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell  >
                    <div className="font-semibold">
                      {item.name}
                    </div>
                    <div className="text-sm font-medium">
                      {item?.saltComposition}
                    </div>
                  </TableCell>
                  <TableCell  >
                    {item.batchNo || "N/A"}
                  </TableCell>
                  <TableCell  >
                    <Input
                      max={item.availableQuantity}
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.inventoryId, e.target.value)
                      }
                      className="w-20 text-center"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      Max: {item.availableQuantity}
                    </div>
                  </TableCell>
                  <TableCell className="">
                    ₹{numberFormatter(item.sellingPrice)}
                  </TableCell>

                  <TableCell  >
                    <Input
                      max={item.sellingPrice}
                      value={item.discount}
                      onChange={(e) =>
                        updateDiscount(item.inventoryId, e.target.value)
                      }
                      className="w-20 text-center"
                    />
                  </TableCell>
                  <TableCell
                    className="font-bold"
                  >
                    ₹{numberFormatter(item.total)}
                  </TableCell>

                  <TableCell  >
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeItem(item.inventoryId)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default BillItemsTable;
