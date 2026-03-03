"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, FileSpreadsheet } from "lucide-react";  
import DataTable from "./DataTable";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { memo, useCallback, useMemo } from "react";
import ImportButtons from "../add-inventory/ImportButtons";
import TemplateButtons from "../add-inventory/TemplateButtons";

interface ImportDataTableProps {
  extraFieldsForProduct: any[];
  data: any[];
  setData: (data: any) => void;
}

const ImportDataTable = memo(({ extraFieldsForProduct, data, setData }: ImportDataTableProps) => {
  const requiredFields = useMemo(
    () =>
      extraFieldsForProduct
        ?.filter((field) => field.required)
        .map((field) => field.label) || [],
    [extraFieldsForProduct]
  );

  const parseExcelDate = useCallback((excelDate: any, fieldType: string): string => {
    if (fieldType !== "date") return excelDate;
    if (typeof excelDate === "string" && !isNaN(Date.parse(excelDate)))
      return new Date(excelDate).toISOString().split("T")[0];
    if (typeof excelDate === "number") {
      const excelEpoch = new Date(1899, 11, 30);
      const date = new Date(excelEpoch.getTime() + excelDate * 24 * 60 * 60 * 1000);
      return date.toISOString().split("T")[0];
    }
    if (excelDate instanceof Date) return excelDate.toISOString().split("T")[0];
    try {
      return new Date(excelDate).toISOString().split("T")[0];
    } catch {
      return "";
    }
  }, []);

  const handleFileUpload = useCallback(
    async (file: File, type: "excel" | "csv") => {
      return new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const fileData = e.target?.result;
            if (!fileData) { toast.error("Failed to read file"); return reject(); }
            const workbook = XLSX.read(fileData, {
              type: type === "csv" ? "string" : "array",
              raw: true,
              cellDates: true,
            });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false, dateNF: "yyyy-mm-dd" });
            if (jsonData.length === 0) { toast.error("No data found in file"); return reject(); }
            const processedData = jsonData.map((row: any) => {
              const processedRow: Record<string, any> = {};
              Object.keys(row).forEach((key) => {
                const field = extraFieldsForProduct.find((f) => f.label === key);
                processedRow[key] = field?.type === "date" ? parseExcelDate(row[key], field.type) : row[key];
              });
              return processedRow;
            });
            setData(processedData);
            toast.success(`Imported ${processedData.length} records successfully`);
            resolve();
          } catch (error) {
            toast.error("Error parsing file — check format and try again");
            reject();
          }
        };
        reader.onerror = () => { toast.error("Failed to read file"); reject(); };
        type === "csv" ? reader.readAsText(file) : reader.readAsArrayBuffer(file);
      });
    },
    [extraFieldsForProduct, setData, parseExcelDate]
  );

  return (
    <div className="space-y-4">
      {/* Instructions + Required Fields */}
      {requiredFields.length > 0 && (
        <Alert className="border-blue-200 rounded-xl py-3">
          <Info className="h-4 w-4 mt-0.5" />
          <AlertDescription className=" text-sm">
            <span className="font-bold">Required columns:</span>{" "}
            <span className="font-mono text-xs px-1.5 py-0.5 rounded">
              {requiredFields.join("</span>, <span className=\"font-mono text-xs px-1.5 py-0.5 rounded\">")}
            </span>
            <p className="mt-1 text-xs">Download the template to ensure correct column headers.</p>
          </AlertDescription>
        </Alert>
      )}

      {/* Action Row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wide">Import</span>
          <div className="h-4 w-px" />
          <ImportButtons onFileUpload={handleFileUpload} />
        </div>

        <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wide">Templates</span>
          <div className="h-4 w-px" />
          <TemplateButtons extraFieldsForProduct={extraFieldsForProduct} />
        </div>
      </div>

      {/* Table */}
      <DataTable extraFieldsForProduct={extraFieldsForProduct} data={data} setData={setData} />
    </div>
  );
});

ImportDataTable.displayName = "ImportDataTable";

export default ImportDataTable;
