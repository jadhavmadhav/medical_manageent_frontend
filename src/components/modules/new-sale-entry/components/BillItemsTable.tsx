// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { X } from "lucide-react";
// import { BillItem } from "../page";
// import { useEnterprise } from "@/lib/context/EnterpriseContext";

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

//   const TableRows = enterprise?.billTableForCreateBill || [];

//   console.log("billItems", TableRows);

//   const columns = TableRows?.map((i) => i.value === true);

//   return (
//     <div className="flex-grow overflow-auto mb-6">
//       <h3 className="text-lg font-medium text-gray-900 mb-3">Bill Items</h3>
//       {billItems.length === 0 ? (
//         <div className="text-center py-8 bg-gray-50 rounded-md border border-dashed border-gray-300 h-40 flex items-center justify-center">
//           <p className="text-gray-500">No products added to the bill</p>
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Product
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Batch
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Qty
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Price
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Discount
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Total
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {billItems.map((item, index) => (
//                 <tr key={item._id}>
//                   <td className="px-4 py-3">
//                     <div className="font-medium">{item.item}</div>
//                     <div className="text-sm text-gray-500">
//                       {item.saltComposition}
//                     </div>
//                   </td>
//                   <td className="px-4 py-3 text-sm">{item.batchNumber}</td>
//                   <td className="px-4 py-3">
//                     <Input
//                       max={item.stock}
//                       value={item.quantity}
//                       onChange={(e) =>
//                         updateQuantity(item._id, e?.target?.value)
//                       }
//                       className="w-20"
//                     />
//                   </td>
//                   <td className="px-4 py-3 text-sm">₹{item.sellingPrice}</td>
//                   <td className="px-4 py-3">
//                     <Input
//                       max={item.sellingPrice}
//                       value={item.discount}
//                       onChange={(e) => updateDiscount(item._id, e.target.value)}
//                       className="w-20"
//                     />
//                   </td>
//                   <td className="px-4 py-3 font-medium">
//                     ₹{Number(item.total).toFixed(2)}
//                   </td>
//                   <td className="px-4 py-3">
//                     <Button
//                       variant="destructive"
//                       size="sm"
//                       onClick={() => removeItem(item._id)}
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BillItemsTable;

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { BillItem } from "../page";
import { useEnterprise } from "@/lib/context/EnterpriseContext";
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
  updateQuantity: (productId: number, newQuantity: string) => void;
  updateDiscount: (productId: number, newDiscount: string) => void;
  removeItem: (productId: number) => void;
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

  console.log("billItems", billItems);
  // Filter and sort columns based on configuration
  const visibleColumns = tableConfig
    .filter((column) => column.value === true)
    .sort((a, b) => (a.position || 0) - (b.position || 0));

  return (
    <div className="flex-grow overflow-auto mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Bill Items</h3>
      {billItems.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md border border-dashed border-gray-300 h-40 flex items-center justify-center">
          <p className="text-gray-500">No products added to the bill</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {visibleColumns.map((column) => (
                  <TableHead key={column.key}>{column.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {billItems.map((item, index) => (
                <TableRow key={index}>
                  {visibleColumns.map((column) => {
                    // Render each cell based on the column key
                    switch (column.key) {
                      case "item":
                        return (
                          <TableCell key={column.key}>
                            <div className="font-medium">{item.item}</div>
                            <div className="text-sm text-gray-500">
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
                              className="w-20"
                            />
                          </TableCell>
                        );

                      case "sellingPrice":
                        return (
                          <TableCell key={column.key}>
                            ₹{item.sellingPrice}
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
                              className="w-20"
                            />
                          </TableCell>
                        );

                      case "totalAmount":
                        return (
                          <TableCell key={column.key}>
                            ₹{item.total.toFixed(2)}
                          </TableCell>
                        );

                      case "action":
                        return (
                          <TableCell key={column.key}>
                            <Button
                              variant="destructive"
                              size="sm"
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
