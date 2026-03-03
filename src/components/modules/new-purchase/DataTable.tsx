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
import { Package } from "lucide-react";

interface DataTableProps {
  extraFieldsForProduct: any[];
  data: Record<string, any>[];
  setData: (data: Record<string, any>[]) => void;
}

const DataTable = ({ extraFieldsForProduct, data, setData }: DataTableProps) => {
  const handleRemoveRow = (rowIndex: number) => {
    setData(data.filter((_, i) => i !== rowIndex));
  };

  const handleCellChange = (rowIndex: number, fieldLabel: string, value: string) => {
    const newData = [...data];
    newData[rowIndex][fieldLabel] = value;
    setData(newData);
  };

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 rounded-xl ">
         
        <p className="text-sm font-semibold ">No items added yet</p>
        <p className="text-xs text-muted-foreground mt-1">Import a file or add items manually above</p>
      </div>
    );
  }

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className=" border-b border-slate-200">
              <TableHead className="text-xs font-bold text-slate-500 uppercase tracking-wider w-10 pl-4">#</TableHead>
              {extraFieldsForProduct.map((field: any) => (
                <TableHead key={field.key} className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  {field.label}
                </TableHead>
              ))}
              <TableHead className="w-12 text-xs font-bold text-slate-500 uppercase tracking-wider">Del</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="hover:bg-blue-50/40 transition-colors border-b border-slate-100 last:border-0"
              >
                <TableCell className="pl-4 text-xs text-slate-400 font-medium">{rowIndex + 1}</TableCell>
                {extraFieldsForProduct.map((field: any) => (
                  <TableCell key={field.key} className="py-1.5">
                    {renderCellInput(field, row[field.label] || "", (value) =>
                      handleCellChange(rowIndex, field.label, value)
                    )}
                  </TableCell>
                ))}
                <TableCell className="py-1.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveRow(rowIndex)}
                    className="h-7 w-7 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer summary */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 py-2.5 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">
          {data.length} {data.length === 1 ? "item" : "items"} total
        </span>
        <button
          onClick={() => setData([])}
          className="text-xs text-red-500 hover:text-red-700 font-semibold transition-colors"
        >
          Clear all
        </button>
      </div>
    </div>
  );
};

const renderCellInput = (field: any, value: string, onChange: (value: string) => void) => {
  const baseClass = "border-0 h-7 text-sm bg-transparent focus:ring-1 focus:ring-blue-200 rounded-md px-2";
  switch (field.type) {
    case "select":
      return (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="border-0 h-7 text-sm bg-transparent w-full min-w-[100px]">
            <SelectValue placeholder={field.label} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option: any) => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case "number":
      return <Input type="number" value={value} onChange={(e) => onChange(e.target.value)} className={baseClass} />;
    case "date":
      return <Input type="date" value={value} onChange={(e) => onChange(e.target.value)} className={baseClass} />;
    default:
      return <Input value={value} onChange={(e) => onChange(e.target.value)} className={`${baseClass} min-w-[80px]`} />;
  }
};

export default DataTable;
