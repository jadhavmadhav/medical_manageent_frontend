"use client";
import { useState } from "react";
import { DateRangePickerModal } from "../../date-range";
import { useQuery } from "@tanstack/react-query";
import { getPatientBills } from "@/services/patient-bills";

import { DataTable } from "../../ui/data-table";
import { columns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";

const PatientBillView = ({ enterpriseId }: { enterpriseId: string }) => {
  const [dateRange, setDateRange] = useState<
    { from: Date | undefined; to: Date | undefined } | undefined
  >(undefined);

  const {
    data: BillData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["patientBills", enterpriseId],
    queryFn: () =>
      getPatientBills({
        enterpriseId,
      }),
    enabled: !!enterpriseId,
  });

  console.log("patientBills", BillData);

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

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Patient Bill's</h1>
        <div className="flex items-center gap-2">
          <DateRangePickerModal
            onSelectRange={setDateRange}
            initialRange={dateRange}
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-primary-50 border rounded-md">
        <DataTable columns={columns} data={BillData?.result || []} />
      </div>
    </div>
  );
};

export default PatientBillView;
