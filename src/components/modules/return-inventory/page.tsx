"use client";
import { DataTable } from "@/components/ui/data-table";
import { getReturnInventories } from "@/services/return-inventory";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";

const ReturnInventoryView = ({ enterpriseId }: { enterpriseId: string }) => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["returnInventory", enterpriseId],
    queryFn: () => getReturnInventories({ enterpriseId }),
    enabled: !!enterpriseId,
  });
  console.log({ enterpriseId, data });
  return <DataTable columns={columns} data={data?.data || []} />;
};

export default ReturnInventoryView;
