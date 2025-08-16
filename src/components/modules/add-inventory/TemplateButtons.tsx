 "use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";

interface TemplateButtonsProps {
  extraFieldsForProduct: any[];
}

const TemplateButtons = ({ extraFieldsForProduct }: TemplateButtonsProps) => {
  const downloadTemplate = (type: "excel" | "csv") => {
    try {
      const headers = extraFieldsForProduct.map((field: any) => ({
        label: field.label,
        required: field.required
      }));

      // Create workbook
      const workbook = XLSX.utils.book_new();
      
      // Create worksheet with headers
      const worksheet = XLSX.utils.json_to_sheet(
        [headers.reduce((acc: any, header) => {
          acc[header.label] = header.required ? `REQUIRED: ${header.label}` : header.label;
          return acc;
        }, {})],
        { header: headers.map(h => h.label) }
      );

      XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

      // Generate file
      const fileName = `medical_inventory_template.${type === "excel" ? "xlsx" : "csv"}`;
      XLSX.writeFile(workbook, fileName);

      toast.success(`Downloaded ${fileName}`);
    } catch (error) {
      console.error("Error generating template:", error);
      toast.error("Failed to generate template");
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => downloadTemplate("excel")}
      >
        <Download className="h-4 w-4" />
        Excel Template
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => downloadTemplate("csv")}
      >
        <Download className="h-4 w-4" />
        CSV Template
      </Button>
    </>
  );
};

export default TemplateButtons;