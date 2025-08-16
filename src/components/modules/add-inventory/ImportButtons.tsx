 "use client";

import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText } from "lucide-react";
import { ChangeEvent, useRef } from "react";

interface ImportButtonsProps {
  onFileUpload: (file: File, type: "excel" | "csv") => void;
}

const ImportButtons = ({ onFileUpload }: ImportButtonsProps) => {
  const excelInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: "excel" | "csv") => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file, type);
      // Reset input to allow selecting the same file again
      e.target.value = "";
    }
  };

  return (
    <>
      <input
        type="file"
        accept=".xlsx,.xls"
        ref={excelInputRef}
        onChange={(e) => handleFileChange(e, "excel")}
        className="hidden"
      />
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => excelInputRef.current?.click()}
      >
        <FileSpreadsheet className="h-4 w-4" />
        Excel
      </Button>

      <input
        type="file"
        accept=".csv"
        ref={csvInputRef}
        onChange={(e) => handleFileChange(e, "csv")}
        className="hidden"
      />
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => csvInputRef.current?.click()}
      >
        <FileText className="h-4 w-4" />
        CSV
      </Button>
    </>
  );
};

export default ImportButtons;