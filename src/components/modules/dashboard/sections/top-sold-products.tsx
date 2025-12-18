// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { topSellingProduct } from "@/services/dashboard";
// import { numberFormatter } from "@/utils/constants";
// import { useQuery } from "@tanstack/react-query";
// import { Package } from "lucide-react";

// const TopSoldProducts = ({ enterpriseId }: { enterpriseId: string }) => {
//   const { data } = useQuery({
//     queryKey: ["topSellingProduct", enterpriseId],
//     queryFn: () => topSellingProduct({ enterpriseId }),
//     select: (data) => data.data,
//     enabled: !!enterpriseId,
//   });

//   console.log("topSellingProduct", data);

//   return (
//     <Card className="shadow-sm">
//       <CardHeader>
//         <CardTitle className="flex items-center">
//           <Package className="h-5 w-5 mr-2 text-green-500" />
//           Top Sold Products
//         </CardTitle>
//         <CardDescription>Best performing products this month</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Product</TableHead>
//               <TableHead>Units Sold</TableHead>
//               <TableHead>Revenue</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {data?.map((product: any) => (
//               <TableRow key={product.id}>
//                 <TableCell className="font-medium">{product.item}</TableCell>
//                 <TableCell>{product.totalQuantity}</TableCell>
//                 <TableCell className="font-semibold text-green-600 ">₹ {numberFormatter(product.totalRevenue)}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   );
// };

// export default TopSoldProducts;




import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { topSellingProduct } from "@/services/dashboard";
import { numberFormatter } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import { Package, Eye, TrendingUp } from "lucide-react";
import { useState } from "react";

const TopSoldProducts = ({ enterpriseId }: { enterpriseId: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const MAX_VISIBLE_ROWS = 5; // Show only 5 items in card view

  const { data, isLoading } = useQuery({
    queryKey: ["topSellingProduct", enterpriseId],
    queryFn: () => topSellingProduct({ enterpriseId }),
    select: (data) => data.data,
    enabled: !!enterpriseId,
  });

  console.log("topSellingProduct", data);

  const visibleData = data?.slice(0, MAX_VISIBLE_ROWS) || [];
  const hasMoreItems = (data?.length || 0) > MAX_VISIBLE_ROWS;

  const renderTableRow = (product: any, index?: number) => (
    <TableRow key={product.id}>
      {index !== undefined && (
        <TableCell className="font-bold text-gray-500">
          #{index + 1}
        </TableCell>
      )}
      <TableCell className="font-medium">{product.item}</TableCell>
      <TableCell className="text-center">{product.totalQuantity}</TableCell>
      <TableCell className="font-semibold text-green-600 text-right">
        ₹ {numberFormatter(product.totalRevenue)}
      </TableCell>
    </TableRow>
  );

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2 text-green-500" />
            Top Sold Products
          </CardTitle>
          <CardDescription>
            Best performing products this month
            {data?.length ? ` (${data.length} total)` : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10">
                <TableRow>
                  <TableHead className="font-semibold">Product</TableHead>
                  <TableHead className="text-center font-semibold">Units Sold</TableHead>
                  <TableHead className="text-right font-semibold">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : data?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No sales data available
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleData.map((product: any) => renderTableRow(product))
                )}
              </TableBody>
            </Table>
          </div>

          {hasMoreItems && (
            <div className="mt-4 flex justify-center">
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Eye className="h-4 w-4 mr-2" />
                    View All ({data?.length} products)
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                      All Top Selling Products
                    </DialogTitle>
                    <DialogDescription>
                      Complete list of best performing products this month
                      ({data?.length} products)
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4 max-h-[60vh] overflow-y-auto">
                    <Table>
                      <TableHeader className="sticky top-0 z-10">
                        <TableRow>
                          <TableHead className="w-16 font-semibold">Rank</TableHead>
                          <TableHead className="font-semibold">Product</TableHead>
                          <TableHead className="text-center font-semibold">Units Sold</TableHead>
                          <TableHead className="text-right">Revenue</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data?.map((product: any, index: number) =>
                          renderTableRow(product)
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default TopSoldProducts;