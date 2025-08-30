"use client";
import { columns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import { getPurchaseBills } from "@/services/purchase-bills";
import { DataTable } from "@/components/ui/data-table";
import { DateRangePickerModal } from "@/components/date-range";
import { useState } from "react";
import { dateFormatForApi } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const PurchaseBills = ({ enterpriseId }: { enterpriseId: string }) => {
  const [dateRange, setDateRange] = useState<
    { from: Date | undefined; to: Date | undefined } | undefined
  >(undefined);
  const { data, isLoading } = useQuery({
    queryKey: ["purchaseData"],
    queryFn: () =>
      getPurchaseBills({
        enterpriseId,
        startDate: "2025/05/01",
        endDate: dateFormatForApi(new Date()),
        page: "1",
        limit: "200",
      }),
    enabled: !!enterpriseId,
  });

  const rows = data?.data?.map((i: any, index: number) => {
    return { ...i, id: index + 1 };
  });

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
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Purchase Bill's</h1>
        <div className="flex items-center gap-2">
          <DateRangePickerModal
            onSelectRange={setDateRange}
            initialRange={dateRange}
          />
        </div>
      </div>
      <div>
        <DataTable columns={columns} data={rows || []} />
      </div>
    </div>
  );
};

export default PurchaseBills;
