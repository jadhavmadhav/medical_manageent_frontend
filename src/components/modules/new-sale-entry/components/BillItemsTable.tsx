// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { X } from "lucide-react";
// import { BillItem } from "../page";
// import { useEnterprise } from "@/lib/context/EnterpriseContext";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// interface BillItemsTableProps {
//   billItems: BillItem[];
//   updateQuantity: (productId: number, newQuantity: string) => void;
//   updateDiscount: (productId: number, newDiscount: string) => void;
//   removeItem: (productId: number) => void;
// }

// const BillItemsTable = ({
//   billItems,
//   updateQuantity,
//   updateDiscount,
//   removeItem,
// }: BillItemsTableProps) => {
//   const { enterprise } = useEnterprise();

//   // Get the table configuration from enterprise context
//   const tableConfig = enterprise?.billTableForCreateBill || [];

//   console.log("billItems", billItems);
//   // Filter and sort columns based on configuration
//   const visibleColumns = tableConfig
//     .filter((column) => column.value === true)
//     .sort((a, b) => (a.position || 0) - (b.position || 0));

//   return (
//     <div className="flex-grow overflow-auto mb-6">
//       <h3 className="text-lg font-medium text-gray-900 mb-3">Bill Items</h3>
//       {billItems.length === 0 ? (
//         <div className="text-center py-8 bg-gray-50 rounded-md border border-dashed border-gray-300 h-40 flex items-center justify-center">
//           <p className="text-gray-500">No products added to the bill</p>
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 {visibleColumns.map((column) => (
//                   <TableHead key={column.key}>{column.label}</TableHead>
//                 ))}
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {billItems.map((item, index) => (
//                 <TableRow key={index}>
//                   {visibleColumns.map((column) => {
//                     // Render each cell based on the column key
//                     switch (column.key) {
//                       case "item":
//                         return (
//                           <TableCell key={column.key}>
//                             <div className="font-medium">{item.item}</div>
//                             <div className="text-sm text-gray-500">
//                               {item?.saltComposition}
//                             </div>
//                           </TableCell>
//                         );

//                       case "quantity":
//                         return (
//                           <TableCell key={column.key}>
//                             <Input
//                               max={item.availableQuantity}
//                               value={item.quantity}
//                               onChange={(e) =>
//                                 updateQuantity(item._id, e.target.value)
//                               }
//                               className="w-20"
//                             />
//                           </TableCell>
//                         );

//                       case "sellingPrice":
//                         return (
//                           <TableCell key={column.key}>
//                             ₹{item.sellingPrice}
//                           </TableCell>
//                         );

//                       case "discount":
//                         return (
//                           <TableCell key={column.key}>
//                             <Input
//                               max={item.sellingPrice}
//                               value={item.discount}
//                               onChange={(e) =>
//                                 updateDiscount(item._id, e.target.value)
//                               }
//                               className="w-20"
//                             />
//                           </TableCell>
//                         );

//                       case "totalAmount":
//                         return (
//                           <TableCell key={column.key}>
//                             ₹{item.total.toFixed(2)}
//                           </TableCell>
//                         );

//                       case "action":
//                         return (
//                           <TableCell key={column.key}>
//                             <Button
//                               variant="destructive"
//                               size="sm"
//                               onClick={() => removeItem(item._id)}
//                             >
//                               <X className="h-4 w-4" />
//                             </Button>
//                           </TableCell>
//                         );

//                       default:
//                         return <TableCell key={column.key}>-</TableCell>;
//                     }
//                   })}
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BillItemsTable;

// BillItemsTable.tsx

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
// Assuming BillItem is exported from the parent type file. Using 'any' as fallback for demonstration.
interface BillItem {
  _id: string; // Assuming it's a string, not number, from the main file logic
  item: string;
  saltComposition: string;
  availableQuantity: number;
  quantity: number;
  sellingPrice: number;
  discount: number;
  total: number;
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
                {visibleColumns.map((column) => (
                  <TableHead
                    key={column.key}
                    className="font-bold bg-secondary"
                  >
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {billItems.map((item, index) => (
                <TableRow key={index} className="hover:bg-blue-50/50">
                  {visibleColumns.map((column) => {
                    // Render each cell based on the column key
                    switch (column.key) {
                      case "item":
                        return (
                          <TableCell key={column.key}>
                            <div className="font-semibold">
                              {item.item}
                            </div>
                            <div className="text-sm font-medium">
                              {item?.saltComposition}
                            </div>
                          </TableCell>
                        );

                      case "quantity":
                        return (
                          <TableCell key={column.key}>
                            <Input
                              max={item.availableQuantity}
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(item._id, e.target.value)
                              }
                              className="w-20 text-center"
                            />
                            <div className="text-xs text-muted-foreground mt-1">
                              Max: {item.availableQuantity}
                            </div>
                          </TableCell>
                        );

                      case "sellingPrice":
                        return (
                          <TableCell key={column.key} className="">
                            ₹{item.sellingPrice.toFixed(2)}
                          </TableCell>
                        );

                      case "discount":
                        return (
                          <TableCell key={column.key}>
                            <Input
                              max={item.sellingPrice}
                              value={item.discount}
                              onChange={(e) =>
                                updateDiscount(item._id, e.target.value)
                              }
                              className="w-20 text-center"
                            />
                          </TableCell>
                        );

                      case "totalAmount":
                        return (
                          <TableCell
                            key={column.key}
                            className="font-bold"
                          >
                            ₹{item.total.toFixed(2)}
                          </TableCell>
                        );

                      case "action":
                        return (
                          <TableCell key={column.key}>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => removeItem(item._id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        );

                      default:
                        return <TableCell key={column.key}>-</TableCell>;
                    }
                  })}
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
