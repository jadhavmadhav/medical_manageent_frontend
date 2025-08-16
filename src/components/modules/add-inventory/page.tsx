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

export default function InventoryPage() {
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

  const handleSave = async (vendorData: any) => {
    setLoading(true);
    try {
      const dataToSave = tabValue === "bulk" ? bulkData : manualData;

      const payload = {
        vendor: {
          id: vendorData.isNew ? undefined : vendorData.id,
          name: vendorData.name,
          companyName: vendorData.companyName,
          mobileNumber: vendorData.mobileNumber,
          email: vendorData.email,
          address: vendorData.address,
          gstNumber: vendorData.gstNumber,
        },
        purchaseInfo: {
          purchaseDate: vendorData.purchaseDate,
          paymentMethod: vendorData.paymentMethod,
          paymentStatus: vendorData.paymentStatus,
        },
        products: dataToSave.map((item) => {
          const transformed: Record<string, any> = {};
          extraFieldsForProduct.forEach((field) => {
            transformed[field.key] =
              field.type === "date" && item[field.label]
                ? new Date(item[field.label]).toISOString()
                : item[field.label] ?? null;
          });
          return transformed;
        }),
        enterpriseId,
      };

      // Call your API here
      console.log("Saving payload:", payload);
      // await PurchaseNewProduct(payload);

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
        <h1 className="ml-2 text-2xl font-semibold text-muted-foreground">
          Medical Inventory Management
        </h1>
      </div>

      <Tabs
        value={tabValue}
        onValueChange={setTabValue}
        className="mb-6 flex flex-1"
      >
        <TabsList className="h-9">
          <TabsTrigger value="bulk" className="text-sm px-4 py-1">
            Bulk Import
          </TabsTrigger>
          <TabsTrigger value="manual" className="text-sm px-4 py-1">
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
          setVendorInfo(vendorData);
          handleSave(vendorData); // Pass vendorData to your save function
        }}
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
