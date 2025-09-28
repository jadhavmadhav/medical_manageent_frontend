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
import { paymentPendingOfPurchase } from "@/services/dashboard";
import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";

const PendingPurchaseBills = ({ enterpriseId }: { enterpriseId: string }) => {
  const pendingPurchaseBills = [
    {
      id: 1,
      vendor: "MedEquip Ltd",
      amount: "₹8,652",
      dueDate: "2025-09-05",
      status: "overdue",
    },
    {
      id: 2,
      vendor: "PharmaSupplies Inc",
      amount: "₹12,450",
      dueDate: "2025-09-08",
      status: "overdue",
    },
    {
      id: 3,
      vendor: "HealthCare Distributors",
      amount: "₹7,325",
      dueDate: "2025-09-12",
      status: "due",
    },
  ];

  const { data } = useQuery({
    queryKey: ["paymentPendingOfPurchase", enterpriseId],
    queryFn: () => paymentPendingOfPurchase({ enterpriseId }),
    select: (data) => data.data,
    enabled: !!enterpriseId,
  });
  console.log("paymentPendingOfPurchase", data);
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-orange-500" />
          Pending Purchase Bills
        </CardTitle>
        <CardDescription>Bills to be paid to vendors</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Company </TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((bill: any) => (
              <TableRow key={bill.id}>
                <TableCell className="font-medium">{bill.vendorName}</TableCell>
                <TableCell className="text-red-500">
                  {bill.pendingAmount}
                </TableCell>
                <TableCell>{bill.companyName}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      bill.status === "overdue" ? "destructive" : "outline"
                    }
                  >
                    {bill.status === "overdue" ? "Overdue" : "Due soon"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
export default PendingPurchaseBills;
