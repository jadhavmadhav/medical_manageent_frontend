// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { getSales } from "@/services/sales";
// import { DataTable } from "@/components/ui/data-table";
// import { columns } from "./columns";
// import { useState, useMemo } from "react";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { AlertCircle, RefreshCw } from "lucide-react";
// import { DateRangePickerModal } from "../../date-range";

// // Define interfaces
// interface Sale {
//   id: string;
//   name: string;
//   status: string;
//   createdAt?: string; // Optional for date filtering
// }

// interface SalesResponse {
//   result: Sale[];
// }

// interface SalesListProps {
//   enterpriseId: string;
// }

// export default function SalesList({ enterpriseId }: SalesListProps) {
//   const [dateRange, setDateRange] = useState<{
//     from: Date | undefined;
//     to: Date | undefined;
//   }>({
//     from: new Date(),
//     to: new Date(new Date().setMonth(new Date().getMonth() + 1)),
//   });

//   const {
//     data: sales,
//     isLoading,
//     error,
//     refetch,
//   } = useQuery({
//     queryKey: ["sales", enterpriseId],
//     queryFn: () =>
//       getSales({
//         id: enterpriseId,
//       }),
//     enabled: !!enterpriseId,
//   });

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

//   if (error) {
//     return (
//       <div className="flex flex-col h-full p-4">
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertTitle>Error</AlertTitle>
//           <AlertDescription>
//             Failed to load sales: {error.message}.{" "}
//             <Button
//               variant="link"
//               onClick={() => refetch()}
//               className="p-0 h-auto"
//             >
//               Retry
//             </Button>
//           </AlertDescription>
//         </Alert>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-full p-4">
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="text-2xl font-bold">Sales Dashboard</h1>
//         <div className="flex items-center gap-2">
//           <DateRangePickerModal
//             onSelectRange={setDateRange}
//             initialRange={dateRange}
//           />
//         </div>
//       </div>
//       <div className="flex-1 overflow-auto bg-primary-50 border rounded-md">
//         <DataTable columns={columns} data={sales?.result || []} />
//       </div>
//     </div>
//   );
// }









// SalesList.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { getSales } from "@/services/sales";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { DateRangePickerModal } from "../../date-range";
 

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface SalesListProps {
  enterpriseId: string;
}

// Stable initial range — computed once, not on every render
function getInitialDateRange(): DateRange {
  const from = new Date();
  const to = new Date(from);
  to.setMonth(to.getMonth() + 1);
  return { from, to };
}

export default function SalesList({ enterpriseId }: SalesListProps) {
  const [dateRange, setDateRange] = useState<DateRange>(getInitialDateRange);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["sales", enterpriseId, dateRange.from, dateRange.to],
    queryFn: () => getSales({ id: enterpriseId }),
    enabled: !!enterpriseId,
  });

  // If filtering is client-side, memoize it here:
  // const filteredSales = useMemo(() => {
  //   if (!data?.result) return [];
  //   return data.result.filter((sale) => {
  //     const date = new Date(sale.createdAt);
  //     const afterFrom = !dateRange.from || date >= dateRange.from;
  //     const beforeTo = !dateRange.to || date <= dateRange.to;
  //     return afterFrom && beforeTo;
  //   });
  // }, [data?.result, dateRange.from, dateRange.to]);

  const sales = data?.result ?? [];

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
            Failed to load sales: {error.message}.{" "}
            <Button variant="link" onClick={handleRefetch} className="p-0 h-auto">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Sales Dashboard</h1>
        <DateRangePickerModal onSelectRange={setDateRange} initialRange={dateRange} />
      </div>
      <div className="flex-1 overflow-auto bg-primary-50 border rounded-md">
        <DataTable columns={columns} data={sales} />
      </div>
    </div>
  );
}