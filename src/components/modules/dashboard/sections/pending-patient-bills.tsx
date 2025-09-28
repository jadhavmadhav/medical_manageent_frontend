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
import { paymentPendingOfPatient } from "@/services/dashboard";
import { dateFormatter } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import { CreditCard } from "lucide-react";

const PendingPatientBills = ({ enterpriseId }: { enterpriseId: string }) => {
  const pendingPatientPayments = [
    {
      id: 1,
      patient: "Rajesh Kumar",
      amount: "₹1,245",
      dueDate: "2025-09-10",
      status: "overdue",
    },
    {
      id: 2,
      patient: "Priya Singh",
      amount: "₹2,587",
      dueDate: "2025-09-12",
      status: "due",
    },
    {
      id: 3,
      patient: "Amit Patel",
      amount: "₹3,215",
      dueDate: "2025-09-15",
      status: "due",
    },
    {
      id: 4,
      patient: "Sneha Desai",
      amount: "₹1,850",
      dueDate: "2025-09-18",
      status: "due",
    },
  ];

  const { data } = useQuery({
    queryKey: ["paymentPendingOfPatient", enterpriseId],
    queryFn: () => paymentPendingOfPatient({ enterpriseId }),
    select: (data) => data.data,
    enabled: !!enterpriseId,
  });

  console.log("paymentPendingOfPatient", data);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-purple-500" />
          Pending Patient Payments
        </CardTitle>
        <CardDescription>Outstanding payments from patients</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((payment: any) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">
                  {payment.patientName || "N/A"}
                </TableCell>
                <TableCell className="text-red-500">
                  {payment.pendingPayment}
                </TableCell>
                <TableCell>{dateFormatter(payment.dueDate)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      payment.status === "overdue" ? "destructive" : "outline"
                    }
                  >
                    {payment.status === "overdue" ? "Overdue" : "Due soon"}
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

export default PendingPatientBills;
