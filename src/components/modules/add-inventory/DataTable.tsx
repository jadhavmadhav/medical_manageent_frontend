"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTableProps {
  extraFieldsForProduct: any[];
  data: Record<string, any>[];
  setData: (data: Record<string, any>[]) => void;
}

const DataTable = ({
  extraFieldsForProduct,
  data,
  setData,
}: DataTableProps) => {
  const handleRemoveRow = (rowIndex: number) => {
    setData(data.filter((_, i) => i !== rowIndex));
  };

  const handleCellChange = (
    rowIndex: number,
    fieldLabel: string,
    value: string
  ) => {
    const newData = [...data];
    newData[rowIndex][fieldLabel] = value;
    setData(newData);
  };

  if (data.length === 0) {
    return (
      <div className=" flex flex-1 h-full w-full items-center justify-center">
        <span className="text-lg text-center py-8 text-gray-500">
          No data available. Please add some records.
        </span>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden flex flex-1">
      <Table>
        <TableHeader>
          <TableRow>
            {extraFieldsForProduct.map((field: any) => (
              <TableHead key={field.key} className="text-gray-700">
                {field.label}
              </TableHead>
            ))}
            <TableHead className="w-10">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {extraFieldsForProduct.map((field: any) => (
                <TableCell key={field.key}>
                  {renderCellInput(field, row[field.label] || "", (value) =>
                    handleCellChange(rowIndex, field.label, value)
                  )}
                </TableCell>
              ))}
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveRow(rowIndex)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const renderCellInput = (
  field: any,
  value: string,
  onChange: (value: string) => void
) => {
  switch (field.type) {
    case "select":
      return (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="border-none p-0 h-auto">
            <SelectValue placeholder={field.label} />
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
          className="border-none p-0 h-auto"
        />
      );
    case "date":
      return (
        <Input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border-none p-0 h-auto"
        />
      );
    default:
      return (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border-none p-0 h-auto"
        />
      );
  }
};

export default DataTable;
