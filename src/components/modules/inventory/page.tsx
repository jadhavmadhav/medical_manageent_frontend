"use client";

import { DateRangePickerModal } from "@/components/date-range";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { getInventoryItems } from "@/services/inventory";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { columns } from "./columns"; 

interface InventoryProps {
  enterpriseId?: string;
}

const InventoryView = ({ enterpriseId }: InventoryProps) => {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(),
    to: new Date(new Date().setMonth(new Date().getMonth() + 1)),
  });
  const {
    data: inventoryData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["inventoryItems", enterpriseId],
    queryFn: () => getInventoryItems({ enterpriseId }),
    enabled: !!enterpriseId,
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

  if (error) {
    return (
      <div className="flex flex-col h-full p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load sales: {error.message}.{" "}
            <Button
              variant="link"
              onClick={() => refetch()}
              className="p-0 h-auto"
            >
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
        <h1 className="text-2xl font-bold">Inventory</h1>
        <div className="flex items-center gap-2">
          <DateRangePickerModal
            onSelectRange={setDateRange}
            initialRange={dateRange}
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-primary-50 border rounded-md">
        <DataTable columns={columns} data={inventoryData?.result || []} />
      </div>
    </div>
  );
};

export default InventoryView;
