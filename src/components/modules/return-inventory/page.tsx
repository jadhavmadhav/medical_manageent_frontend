"use client";
import { DataTable } from "@/components/ui/data-table";
import { getReturnInventories } from "@/services/return-inventory";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";

const ReturnInventoryView = ({ enterpriseId }: { enterpriseId: string }) => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["returnInventory", enterpriseId],
    queryFn: () => getReturnInventories({ enterpriseId }),
    enabled: !!enterpriseId,
  });
  console.log({ enterpriseId, data });
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
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Return Bills</h1>
      </div>
      <DataTable columns={columns} data={data?.data || []} />
    </div>
  );
};

export default ReturnInventoryView;
