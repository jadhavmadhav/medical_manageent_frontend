"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Pill } from "lucide-react";
import ImportDataTable from "./ImportDataTable";
import ManualEntryForm from "./ManualEntryForm";
import SaveButton from "./SaveButton";

const AddNewInventories = () => {
  const [tabValue, setTabValue] = useState("bulk");

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center mb-6">
        <Pill className="h-6 w-6 text-blue-600" />
        <h1 className="ml-2 text-2xl font-semibold text-gray-800">
          Medical Inventory Management
        </h1>
      </div>

      <Tabs value={tabValue} onValueChange={setTabValue} className="mb-6">
        <TabsList className="h-9">
          <TabsTrigger value="bulk" className="text-sm px-4 py-1">
            Bulk Import
          </TabsTrigger>
          <TabsTrigger value="manual" className="text-sm px-4 py-1">
            Manual Entry
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bulk">
          <Card className="p-4">
            <ImportDataTable extraFieldsForProduct={[]} data={[]} setData={function (data: any): void {
              throw new Error("Function not implemented.");
            } } />
          </Card>
        </TabsContent>

        <TabsContent value="manual">
          <Card className="p-4">
            <ManualEntryForm extraFieldsForProduct={[]} data={[]} setData={function (data: Record<string, any>[]): void {
              throw new Error("Function not implemented.");
            } } />
          </Card>
        </TabsContent>
      </Tabs>

      <SaveButton tabValue={tabValue} onClick={function (): void {
        throw new Error("Function not implemented.");
      } } />
    </div>
  );
};

export default AddNewInventories;