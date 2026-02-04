// "use client";
// import { useState } from "react";
// import { DateRangePickerModal } from "../../date-range";
// import { useQuery } from "@tanstack/react-query";
// import { getPatientBills } from "@/services/patient-bills";

// import { DataTable } from "../../ui/data-table";
// import { columns } from "./columns";
// import { Skeleton } from "@/components/ui/skeleton";

// const PatientBillView = ({ enterpriseId }: { enterpriseId: string }) => {
//   const [dateRange, setDateRange] = useState<
//     { from: Date | undefined; to: Date | undefined } | undefined
//   >(undefined);

//   const {
//     data: BillData,
//     isLoading,
//     error,
//     refetch,
//   } = useQuery({
//     queryKey: ["patientBills", enterpriseId],
//     queryFn: () =>
//       getPatientBills({
//         enterpriseId,
//       }),
//     enabled: !!enterpriseId,
//   });

//   console.log("patientBills", BillData);

//   if (isLoading) {
//     return (
//       <div className="flex flex-col h-full p-4 space-y-4">
//         <div className="flex items-center justify-between">
//           <Skeleton className="h-8 w-48" />
//           <Skeleton className="h-10 w-32" />
//         </div>
//         <Skeleton className="h-[calc(100%-4rem)] w-full rounded-md" />
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-full p-4">
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="text-2xl font-bold">Patient Bill's</h1>
//         <div className="flex items-center gap-2">
//           <DateRangePickerModal
//             onSelectRange={setDateRange}
//             initialRange={dateRange}
//           />
//         </div>
//       </div>
//       <div className="flex-1 overflow-auto bg-primary-50 border rounded-md">
//         <DataTable columns={columns} data={BillData?.result || []} />
//       </div>
//     </div>
//   );
// };

// export default PatientBillView;













// PatientBillView.tsx
"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPatientBills } from "@/services/patient-bills";
import { DataTable } from "../../ui/data-table";
import { columns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";
import { DateRangePickerModal } from "../../date-range";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DateRange } from "./types";

interface PatientBillViewProps {
  enterpriseId: string;
}

const PatientBillView = ({ enterpriseId }: PatientBillViewProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const {
    data: billData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["patientBills", enterpriseId, dateRange?.from, dateRange?.to],
    queryFn: () => getPatientBills({ enterpriseId }),
    enabled: !!enterpriseId,
  });

  const handleRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-[calc(100%-4rem)] w-full rounded-md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load patient bills: {error.message}.{" "}
            <Button variant="link" onClick={handleRefetch} className="p-0 h-auto">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const bills = billData?.result ?? [];

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Patient Bills</h1>
        <DateRangePickerModal onSelectRange={setDateRange} initialRange={dateRange} />
      </div>
      <div className="flex-1 overflow-auto bg-primary-50 border rounded-md">
        <DataTable columns={columns} data={bills} />
      </div>
    </div>
  );
};

export default PatientBillView;