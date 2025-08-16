"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DataTable from "./DataTable";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ManualEntryFormProps {
  extraFieldsForProduct: any[];
  data: Record<string, any>[];
  setData: (data: Record<string, any>[]) => void;
}

const ManualEntryForm = ({
  extraFieldsForProduct,
  data,
  setData,
}: ManualEntryFormProps) => {
  const [currentProduct, setCurrentProduct] = useState<Record<string, any>>({});

  const handleAddProduct = () => {
    // Validate required fields
    const missingFields = extraFieldsForProduct
      .filter((field) => field.required && !currentProduct[field.label])
      .map((field) => field.label);

    if (missingFields.length > 0) {
      toast.error(`Missing required fields: ${missingFields.join(", ")}`);
      return;
    }

    setData([...data, currentProduct]);
    setCurrentProduct({});
    toast.success("Product added");
  };

  const handleFieldChange = (fieldLabel: string, value: string) => {
    setCurrentProduct((prev) => ({
      ...prev,
      [fieldLabel]: value,
    }));
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {extraFieldsForProduct.map((field: any) => (
          <div key={field.key} className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderFieldInput(
              field,
              currentProduct[field.label] || "",
              (value) => handleFieldChange(field.label, value)
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end mb-4">
        <Button
          onClick={handleAddProduct}
          disabled={Object.keys(currentProduct).length === 0}
          className="text-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {data.length > 0 && (
        <DataTable
          extraFieldsForProduct={extraFieldsForProduct}
          data={data}
          setData={setData}
        />
      )}
    </>
  );
};

const renderFieldInput = (
  field: any,
  value: string,
  onChange: (value: string) => void
) => {
  switch (field.type) {
    case "select":
      return (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder={`Select ${field.label}`} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option: any) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case "number":
      return (
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${field.label}`}
        />
      );
    case "date":
      return (
        <Input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    default:
      return (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${field.label}`}
        />
      );
  }
};

export default ManualEntryForm;
