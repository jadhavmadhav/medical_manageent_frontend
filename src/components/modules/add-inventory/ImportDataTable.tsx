 "use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import ImportButtons from "./ImportButtons";
import TemplateButtons from "./TemplateButtons";
import DataTable from "./DataTable";
import { toast } from "sonner";
import * as XLSX from "xlsx";

interface ImportDataTableProps {
  extraFieldsForProduct: any[];
  data: any[];
  setData: (data:any) => void;
}

const ImportDataTable = ({ extraFieldsForProduct, data, setData }: ImportDataTableProps) => {
  const requiredFields = extraFieldsForProduct
    ?.filter((field: { required: boolean }) => field.required)
    .map((field: { label: string }) => field.label) || [];

   

  // Add this utility function at the top of the file
const parseExcelDate = (excelDate: any, fieldType: string): string => {
  if (fieldType !== "date") return excelDate;
  
  // If it's already a proper date string
  if (typeof excelDate === 'string' && !isNaN(Date.parse(excelDate))) {
    return new Date(excelDate).toISOString().split('T')[0];
  }

  // If it's an Excel serial date number (common in Excel files)
  if (typeof excelDate === 'number') {
    // Excel's epoch starts on January 1, 1900
    const excelEpoch = new Date(1899, 11, 30);
    const date = new Date(excelEpoch.getTime() + excelDate * 24 * 60 * 60 * 1000);
    return date.toISOString().split('T')[0];
  }

  // If it's a Date object (from some Excel parsers)
  if (excelDate instanceof Date) {
    return excelDate.toISOString().split('T')[0];
  }

  // Fallback - try to parse as string
  try {
    return new Date(excelDate).toISOString().split('T')[0];
  } catch {
    return ''; // Return empty string if we can't parse
  }
};

// Then modify the handleFileUpload function:
const handleFileUpload = async (file: File, type: "excel" | "csv") => {
  return new Promise<void>((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const fileData = e.target?.result;
        if (!fileData) {
          toast.error("Failed to read file");
          return reject();
        }

        const workbook = XLSX.read(fileData, {
          type: type === "csv" ? "string" : "array",
          raw: true,
          cellDates: true, // Important for date handling
        });

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          raw: false, // Get formatted values
          dateNF: 'yyyy-mm-dd', // Specify date format
        });
        
        if (jsonData.length === 0) {
          toast.error("No data found in file");
          return reject();
        }

        // Process data with proper date handling
        const processedData = jsonData.map((row: any) => {
          const processedRow: Record<string, any> = {};
          Object.keys(row).forEach(key => {
            const field = extraFieldsForProduct.find(f => f.label === key);
            processedRow[key] = field?.type === 'date' 
              ? parseExcelDate(row[key], field.type)
              : row[key];
          });
          return processedRow;
        });

        setData(processedData);
        toast.success(`Imported ${processedData.length} records`);
        resolve();
      } catch (error) {
        console.error("Error parsing file:", error);
        toast.error("Error parsing file. Please check the format.");
        reject();
      }
    };

    if (type === "csv") {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
};

  return (
    <div className="flex flex-col h-full">
      {requiredFields.length > 0 && (
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-gray-700">
            Required Fields: {requiredFields.join(", ")}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2 mb-4">
        <ImportButtons onFileUpload={handleFileUpload} />
        <TemplateButtons extraFieldsForProduct={extraFieldsForProduct} />
      </div>

      <DataTable 
        extraFieldsForProduct={extraFieldsForProduct} 
        data={data} 
        setData={setData}
      />
    </div>
  );
};

export default ImportDataTable;