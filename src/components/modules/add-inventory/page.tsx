"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Pill } from "lucide-react";
import ImportDataTable from "./ImportDataTable";
import ManualEntryForm from "./ManualEntryForm";
import SaveButton from "./SaveButton";
import VendorInfoDialog from "./VendorInfoDialog";
import LoadingDialog from "./LoadingDialog";
import { useEnterprise } from "@/lib/context/EnterpriseContext";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { PurchaseNewProduct } from "@/services/add-new-inventory";
import { useMutation } from "@tanstack/react-query";

export default function InventoryPage({
  enterpriseId,
}: {
  enterpriseId: string;
}) {
  const [tabValue, setTabValue] = useState("bulk");
  const [vendorDialogOpen, setVendorDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [vendorInfo, setVendorInfo] = useState<any>(null);
  const { enterprise } = useEnterprise();

  const extraFieldsForProduct = enterprise?.extraFieldsForProduct || [];

  // State for both bulk and manual data
  const [bulkData, setBulkData] = useState<Record<string, any>[]>([]);
  const [manualData, setManualData] = useState<Record<string, any>[]>([]);

  const { mutate: createNewPurchase } = useMutation({
    mutationFn: PurchaseNewProduct,
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
    onSuccess: (data) => {
      console.log("success", data);
    },
  });

  const handleSave = async (vendorData: any) => {
    setLoading(true);
    try {
      const dataToSave = tabValue === "bulk" ? bulkData : manualData;

      const { paymentMethod, paymentStatus, purchaseDate, ...restVendorData } =
        vendorData;
      const payload = {
        vendorInfo: restVendorData,
        enterpriseId,
        purchaseDate: vendorData.purchaseDate,
        paymentMethod: vendorData.paymentMethod,
        paymentStatus: vendorData.paymentStatus,
        inventories: dataToSave.map((item) => {
          const transformed: Record<string, any> = {};
          extraFieldsForProduct.forEach((field) => {
            transformed[field.key] =
              field.type === "date" && item[field.label]
                ? new Date(item[field.label]).toISOString()
                : item[field.label] ?? null;
          });
          return transformed;
        }),
      };

      // Call your API here
      console.log("Saving payload:", payload);
      await createNewPurchase(payload);

      toast.success("Inventory saved successfully");
      setBulkData([]);
      setManualData([]);
      setVendorDialogOpen(false);
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1000); // Adjust the delay as needed
    return () => clearTimeout(timer);
  }, []);

  if (isPageLoading) {
    return (
      <div className="h-[100%]">
        <LoadingSkeleton />
      </div>
    );
  }
  return (
    <div className="p-4 sm:p-6 flex flex-col h-full">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold">Medical Inventory Management</h1>
      </div>

      <Tabs
        value={tabValue}
        onValueChange={setTabValue}
        className="mb-6 flex flex-1"
      >
        <TabsList className="h-9 flex gap-4">
          <TabsTrigger
            value="bulk"
            className=" cursor-pointer text-sm px-4 py-1 rounded-md border data-[state=active]:bg-secondary"
          >
            Bulk Import
          </TabsTrigger>
          <TabsTrigger
            value="manual"
            className=" cursor-pointer text-sm px-4 py-1 rounded-md border-1  data-[state=active]:bg-secondary"
          >
            Manual Entry
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bulk">
          <Card className="p-4 h-full">
            <ImportDataTable
              extraFieldsForProduct={extraFieldsForProduct}
              data={bulkData}
              setData={setBulkData}
            />
          </Card>
        </TabsContent>

        <TabsContent value="manual">
          <Card className="p-4">
            <ManualEntryForm
              extraFieldsForProduct={extraFieldsForProduct}
              data={manualData}
              setData={setManualData}
            />
          </Card>
        </TabsContent>
      </Tabs>

      {/* {(bulkData.length > 0 || manualData.length > 0) && (
        <SaveButton
          onClick={() => setVendorDialogOpen(true)}
          tabValue={tabValue}
        />
      )} */}

      {(bulkData.length > 0 || manualData.length > 0) && (
        <SaveButton
          onClick={() => setVendorDialogOpen(true)}
          tabValue={tabValue}
        />
      )}

      <VendorInfoDialog
        open={vendorDialogOpen}
        onClose={() => setVendorDialogOpen(false)}
        onSave={(vendorData) => {
          handleSave(vendorData); // Pass vendorData to your save function
        }}
        enterpriseId={enterpriseId!}
      />

      <LoadingDialog isLoading={loading} title="Saving Inventory..." />
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="flex flex-col h-full p-4 space-y-4 ">
      <div className="flex items-center">
        <Skeleton className="h-8 w-[400px]" />
      </div>
      <div className="flex space-x-2">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-[calc(100%-4rem)] w-full rounded-md" />
    </div>
  );
}
