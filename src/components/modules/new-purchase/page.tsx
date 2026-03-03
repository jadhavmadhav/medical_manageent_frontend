"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
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
import { FileSpreadsheet, ClipboardList, ShoppingCart, Package2 } from "lucide-react";

export default function InventoryPage({
  enterpriseId,
}: {
  enterpriseId: string;
}) {
  const [tabValue, setTabValue] = useState("manual");
  const [vendorDialogOpen, setVendorDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { enterprise } = useEnterprise();

  const extraFieldsForProduct = enterprise?.extraFieldsForProduct || [];

  const [bulkData, setBulkData] = useState<Record<string, any>[]>([]);
  const [manualData, setManualData] = useState<Record<string, any>[]>([]);

  const activeCount = tabValue === "bulk" ? bulkData.length : manualData.length;

  const { mutate: createNewPurchase } = useMutation({
    mutationFn: PurchaseNewProduct,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Purchase bill saved successfully");
      setBulkData([]);
      setManualData([]);
      setVendorDialogOpen(false);
    },
  });

  const handleSave = async (vendorData: any) => {
    setLoading(true);
    try {
      const dataToSave = tabValue === "bulk" ? bulkData : manualData;
      const { paymentMethod, paymentStatus, purchaseDate, ...restVendorData } = vendorData;

      const payload = {
        vendorInfo: restVendorData,
        enterpriseId,
        purchaseDate: vendorData?.purchaseDate,
        paymentMethod: vendorData?.paymentMethod,
        paymentStatus: vendorData?.paymentStatus,
        items: dataToSave?.map((item) => {
          const transformed: Record<string, any> = {};
          extraFieldsForProduct?.forEach((field) => {
            transformed[field.key] =
              field.type === "date" && item[field.label]
                ? new Date(item[field.label]).toISOString()
                : item[field.label] ?? null;
          });
          Object.keys(item).forEach((key) => {
            const isAlreadyMapped = extraFieldsForProduct?.some(
              (field) => field.key === key || field.label === key
            );
            if (!isAlreadyMapped) transformed[key] = item[key] ?? null;
          });
          const itemName = transformed["item"] ?? item["item"];
          const size = transformed["unit"].baseUnitSize ?? item["unit"].baseUnitSize;
          const unit = transformed["unit"].label ?? item["unit"].label;
          transformed["displayItem"] = `${itemName} - ${size} ${unit}`;
          return transformed;
        }),
      };

      await createNewPurchase(payload);
    } catch (error) {
      console.log("errorerror", error)
      toast.error("Failed to save purchase bill");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isPageLoading) return <LoadingSkeleton />;

  return (
    <div className="min-h-full p-4 flex flex-col gap-4 ">
      {/* Top Header Bar */}
      {/* <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-30 shadow-sm"> */}
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold leading-tight">Purchase Bill</h1>
      </div>

      {/* </div> */}

      {/* Main Content */}
      <div className="">
        <Tabs value={tabValue} onValueChange={setTabValue} className="flex flex-col gap-4">
          {/* Tab Switcher */}
          <div className=" rounded-xl border shadow-sm inline-flex self-start">
            <TabsList className="bg-transparent h-auto p-0 gap-1">
              <TabsTrigger
                value="bulk"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-slate-600 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Bulk Import
                {bulkData.length > 0 && (
                  <span className="ml-1 bg-white/30 data-[state=inactive]:bg-primary text-xs rounded-full px-1.5 py-0.5 font-bold">
                    {bulkData.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="manual"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-slate-600 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <ClipboardList className="h-4 w-4" />
                Manual Entry
                {manualData.length > 0 && (
                  <span className="ml-1 bg-white/30 data-[state=inactive]:bg-blue-100 text-xs rounded-full px-1.5 py-0.5 font-bold">
                    {manualData.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="bulk" className="mt-0">
            <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden p-0">
              <div className="px-5 py-3 border-b border-slate-100">
                <h2 className="text-sm font-semibold ">Import from Excel / CSV</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Upload a spreadsheet to batch-add medicines to this purchase bill</p>
              </div>
              <div className="p-5">
                <ImportDataTable
                  extraFieldsForProduct={extraFieldsForProduct}
                  data={bulkData}
                  setData={setBulkData}
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="manual" className="mt-0">
            <Card className="shadow-sm rounded-xl overflow-hidden p-0">
              <div className="p-5 border-b border-slate-100">
                <h2 className="text-sm font-semibold">Add Items Manually</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Search and add medicines one by one to this purchase bill</p>
              </div>
              <div className="p-5">
                <ManualEntryForm
                  extraFieldsForProduct={extraFieldsForProduct}
                  data={manualData}
                  setData={setManualData}
                />
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Save Button — only show when data exists */}
      {activeCount > 0 && (
        <SaveButton
          onClick={() => setVendorDialogOpen(true)}
          tabValue={tabValue}
          itemCount={activeCount}
        />
      )}

      <VendorInfoDialog
        open={vendorDialogOpen}
        onClose={() => setVendorDialogOpen(false)}
        onSave={handleSave}
        enterpriseId={enterpriseId!}
      />

      <LoadingDialog isLoading={loading} title="Saving Purchase Bill..." />
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-5">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-3 w-52" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-11 w-36 rounded-lg" />
        <Skeleton className="h-11 w-36 rounded-lg" />
      </div>
      <Skeleton className="h-[calc(100vh-180px)] w-full rounded-xl" />
    </div>
  );
}
