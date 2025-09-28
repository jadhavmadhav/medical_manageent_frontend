import { Badge } from "@/components/ui/badge";
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
import { expiringProduct } from "@/services/dashboard";
import { dateFormatter } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";

const ExpiringProducts = ({ enterpriseId }: { enterpriseId: string }) => {
  const expiringProducts = [
    {
      id: 1,
      name: "Amoxicillin 250mg",
      expiry: "2025-09-15",
      daysLeft: 15,
      quantity: 50,
    },
    {
      id: 2,
      name: "Vitamin B-Complex",
      expiry: "2025-09-20",
      daysLeft: 20,
      quantity: 35,
    },
    {
      id: 3,
      name: "Atorvastatin 10mg",
      expiry: "2025-09-25",
      daysLeft: 25,
      quantity: 20,
    },
    {
      id: 4,
      name: "Cetirizine 10mg",
      expiry: "2025-09-30",
      daysLeft: 30,
      quantity: 45,
    },
  ];

  const { data } = useQuery({
    queryKey: ["expiringProduct", enterpriseId],
    queryFn: () => expiringProduct({ enterpriseId }),
    select: (data) => data.data,
    enabled: !!enterpriseId,
  });

  console.log("expiringProduct", data);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
          Expiring Products
        </CardTitle>
        <CardDescription>Products expiring in the next 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Days Left</TableHead>
              <TableHead>Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((product: any) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product?.item}</TableCell>
                <TableCell>{dateFormatter(product?.expiryDate)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      product?.daysLeft < 20 ? "destructive" : "secondary"
                    }
                  >
                    {product?.daysLeft} days
                  </Badge>
                </TableCell>
                <TableCell>{product?.availableQuantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ExpiringProducts;
