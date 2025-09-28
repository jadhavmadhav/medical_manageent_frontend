import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Package } from "lucide-react";

const TopSoldProducts = ({ enterpriseId }: { enterpriseId: string }) => {
  const { data } = useQuery({
    queryKey: ["topSellingProduct", enterpriseId],
    queryFn: () => topSellingProduct({ enterpriseId }),
    select: (data) => data.data,
    enabled: !!enterpriseId,
  });

  console.log("topSellingProduct", data);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Package className="h-5 w-5 mr-2 text-green-500" />
          Top Sold Products
        </CardTitle>
        <CardDescription>Best performing products this month</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Units Sold</TableHead>
              <TableHead>Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((product: any) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.item}</TableCell>
                <TableCell>{product.totalQuantity}</TableCell>
                <TableCell>₹ {numberFormatter(product.totalRevenue)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TopSoldProducts;
