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
import { AlertCircle, Clock, CreditCard } from "lucide-react";

const PendingPatientBills = ({ enterpriseId }: { enterpriseId: string }) => {
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
            {data?.map((payment: any, index: number) => {
              const isOverdue = new Date(payment.dueDate) < new Date();
              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {payment.patientName || "N/A"}
                  </TableCell>
                  <TableCell className="text-red-500 font-semibold">
                    ₹ {payment.pendingPayment}
                  </TableCell>
                  <TableCell>{dateFormatter(payment.dueDate)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={isOverdue ? "destructive" : "outline"}
                      className={`${isOverdue
                          ? "bg-red-100   border-red-200"
                          : "bg-orange-100 text-orange-800  border-orange-200"
                        } font-medium`}
                    >
                      {isOverdue ? (
                        <>
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Overdue
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 mr-1" />
                          Due Soon
                        </>
                      )}
                    </Badge>

                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PendingPatientBills;
