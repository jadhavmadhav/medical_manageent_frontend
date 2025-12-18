// import { Badge } from "@/components/ui/badge";
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
// import { expiringProduct } from "@/services/dashboard";
// import { dateFormatter } from "@/utils/constants";
// import { useQuery } from "@tanstack/react-query";
// import { AlertCircle } from "lucide-react";

// const ExpiringProducts = ({ enterpriseId }: { enterpriseId: string }) => {
   

//   const { data } = useQuery({
//     queryKey: ["expiringProduct", enterpriseId],
//     queryFn: () => expiringProduct({ enterpriseId }),
//     select: (data) => data.data,
//     enabled: !!enterpriseId,
//   });

//   console.log("expiringProduct", data);

//   return (
//     <Card className="shadow-sm">
//       <CardHeader>
//         <CardTitle className="flex items-center">
//           <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
//           Expiring Products
//         </CardTitle>
//         <CardDescription>Products expiring in the next 30 days</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Name</TableHead>
//               <TableHead>Expiry</TableHead>
//               <TableHead>Days Left</TableHead>
//               <TableHead>Quantity</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {data?.map((product: any) => (
//               <TableRow key={product.id}>
//                 <TableCell>{product?.item}</TableCell>
//                 <TableCell>{dateFormatter(product?.expiryDate)}</TableCell>
//                 <TableCell>
//                   <Badge
//                     variant={
//                       product?.daysLeft < 20 ? "destructive" : "secondary"
//                     }
//                     className={` ${
//                           product.daysLeft < 15 ? 'bg-red-100' : 'bg-yellow-100 text-yellow-800'
//                         }`}
//                   >
//                     {product?.daysLeft} days
//                   </Badge>
//                 </TableCell>
//                 <TableCell>{product?.availableQuantity}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   );
// };

// export default ExpiringProducts;



import { Badge } from "@/components/ui/badge";
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
import { expiringProduct } from "@/services/dashboard";
import { dateFormatter } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Eye } from "lucide-react";
import { useState } from "react";

const ExpiringProducts = ({ enterpriseId }: { enterpriseId: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const MAX_VISIBLE_ROWS = 5; // Show only 5 items in card view

  const { data, isLoading } = useQuery({
    queryKey: ["expiringProduct", enterpriseId],
    queryFn: () => expiringProduct({ enterpriseId }),
    select: (data) => data.data,
    enabled: !!enterpriseId,
  });

  console.log("expiringProduct", data);

  const visibleData = data?.slice(0, MAX_VISIBLE_ROWS) || [];
  const hasMoreItems = (data?.length || 0) > MAX_VISIBLE_ROWS;

  const renderTableRow = (product: any) => (
    <TableRow key={product.id}>
      <TableCell className="font-medium">{product?.item}</TableCell>
      <TableCell>{dateFormatter(product?.expiryDate)}</TableCell>
      <TableCell>
        <Badge
          variant={product?.daysLeft < 20 ? "destructive" : "secondary"}
          className={`${
            product.daysLeft < 15
              ? "bg-red-100 text-red-800 border-red-200"
              : "bg-yellow-100 text-yellow-800 border-yellow-200"
          }`}
        >
          {product?.daysLeft} days
        </Badge>
      </TableCell>
      <TableCell>{product?.availableQuantity}</TableCell>
    </TableRow>
  );

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
            Expiring Products
          </CardTitle>
          <CardDescription>
            Products expiring in the next 30 days
            {data?.length ? ` (${data.length} total)` : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10 ">
                <TableRow >
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Expiry</TableHead>
                  <TableHead className="font-semibold">Days Left</TableHead>
                  <TableHead className="font-semibold">Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : data?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No expiring products found
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
                  <Button variant="outline" className="w-full sm:w-auto cursor-pointer">
                    <Eye className="h-4 w-4 mr-2" />
                    View All ({data?.length} items)
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                      All Expiring Products
                    </DialogTitle>
                    <DialogDescription>
                      Complete list of products expiring in the next 30 days
                      ({data?.length} items)
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4 max-h-[60vh] overflow-y-auto">
                    <Table>
                      <TableHeader className="sticky top-0 font-semibold z-10">
                        <TableRow>
                          <TableHead className="font-semibold">Name</TableHead>
                          <TableHead className="font-semibold">Expiry</TableHead>
                          <TableHead className="font-semibold">Days Left</TableHead>
                          <TableHead className="font-semibold">Quantity</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data?.map((product: any) => renderTableRow(product))}
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

export default ExpiringProducts;