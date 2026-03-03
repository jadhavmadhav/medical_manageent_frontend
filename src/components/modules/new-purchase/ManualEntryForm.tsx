"use client";
import { Button } from "@/components/ui/button";
import { Plus, X, Search, PackagePlus } from "lucide-react";
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
import { useMemo, useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProductListForPurchase } from "@/services/add-new-inventory";

interface ManualEntryFormProps {
  extraFieldsForProduct: any[];
  data: Record<string, any>[];
  setData: (data: Record<string, any>[]) => void;
}

const ManualEntryForm = ({ extraFieldsForProduct, data, setData }: ManualEntryFormProps) => {
  const [currentProduct, setCurrentProduct] = useState<Record<string, any>>({});
  const [itemSearch, setItemSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: productList, isFetching } = useQuery({
    queryKey: ["productListForPurchase", itemSearch],
    queryFn: () => getProductListForPurchase({ search: itemSearch, limit: 20 }),
    enabled: itemSearch.length >= 3,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categoryField = extraFieldsForProduct.find((f) => f.key === "category");
  const selectedCategoryValue = currentProduct["Category"];
  const selectedCategory = categoryField?.options?.find((opt: any) => opt.value === selectedCategoryValue);
  const availableUnits = useMemo(() => selectedCategory?.allowedUnits || [], [selectedCategory]);

  const unitMap = useMemo(() => {
    const map: Record<string, any> = {};
    availableUnits.forEach((u: any) => { map[u.code] = u; });
    return map;
  }, [availableUnits]);

  const selectedUnit = currentProduct["unit"];
  const showSizeField = selectedUnit?.label === "Bottle";

  const resolveFinalBaseUnit = (unitCode: string) => {
    let factor = 1;
    let current = unitMap[unitCode];
    if (!current) return null;
    while (current.baseUnit !== current.code) {
      factor *= current.baseUnitSize || 1;
      current = unitMap[current.baseUnit];
      if (!current) return null;
    }
    return { baseUnit: current.code, factor };
  };

  const handleProductSelect = (product: any) => {
    setItemSearch(product.name);
    setCurrentProduct((prev) => ({
      ...prev,
      "Product Name": product.name,
      productId: product._id,
      Category: product.category,
      Manufacturer: product.manufacturer || "",
    }));
    setShowDropdown(false);
  };

  const handleClearSearch = () => {
    setItemSearch("");
    setCurrentProduct((prev) => {
      const updated = { ...prev };
      delete updated["Product Name"];
      delete updated.productId;
      return updated;
    });
    setShowDropdown(false);
  };

  const handleFieldChange = (fieldLabel: string, value: any) => {
    setCurrentProduct((prev) => {
      const updated = { ...prev };
      if (fieldLabel === "Category") {
        updated.Category = value;
        delete updated["unit"];
        delete updated["baseUnit"];
        delete updated["conversionFactor"];
        return updated;
      }
      if (fieldLabel === "unit") {
        const resolved = resolveFinalBaseUnit(value.code);
        updated.unit = { ...value, baseUnitSize: value.baseUnitSize || 1 };
        if (resolved) {
          updated.baseUnit = resolved.baseUnit;
          updated.conversionFactor = resolved.factor;
        }
        return updated;
      }
      if (fieldLabel === "Size") {
        if (prev.unit) {
          const numericValue = parseFloat(value) || 0;
          updated.unit = { ...prev.unit, baseUnitSize: numericValue };
          const resolved = resolveFinalBaseUnit(prev.unit.code);
          if (resolved) {
            updated.baseUnit = resolved.baseUnit;
            updated.conversionFactor = resolved.factor * (numericValue / (prev.unit.baseUnitSize || 1));
          }
        }
        return updated;
      }
      updated[fieldLabel] = value;
      return updated;
    });
  };

  const handleAddProduct = () => {
    const missingFields: string[] = [];
    extraFieldsForProduct.forEach((field) => {
      if (field.required && !currentProduct[field.label]) missingFields.push(field.label);
    });
    if (selectedCategoryValue && !currentProduct["unit"]) missingFields.push("Unit");
    if (showSizeField && !currentProduct["unit"]?.baseUnitSize) missingFields.push("Size");
    if (missingFields.length > 0) {
      toast.error(`Please fill: ${missingFields.join(", ")}`);
      return;
    }
    setData([...data, currentProduct]);
    setCurrentProduct({});
    setItemSearch("");
    toast.success("Item added to bill");
  };

  const hasInput = Object.keys(currentProduct).length > 0 || itemSearch.length > 0;

  return (
    <div className="space-y-5">
      {/* Entry Form Card */}
      <div className=" border border-slate-200 rounded-xl p-4">
        <p className="text-xs font-bold uppercase tracking-wider mb-4">Item Details</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {extraFieldsForProduct.map((field: any) => {
            if (field.key === "dosage_type") return null;

            // Medicine name autocomplete
            if (field.key === "item") {
              return (
                <div key={field.key} className="space-y-1.5 relative sm:col-span-2 md:col-span-1" ref={dropdownRef}>
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Medicine Name {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                    <Input
                      value={itemSearch}
                      placeholder="Search by name, SKU, HSN..."
                      onChange={(e) => {
                        setItemSearch(e.target.value);
                        setShowDropdown(e.target.value.length >= 3);
                      }}
                      onFocus={() => itemSearch.length >= 3 && setShowDropdown(true)}
                      className="pl-9 pr-9 h-9 text-sm border-slate-200 bg-white"
                    />
                    {itemSearch && (
                      <button
                        onClick={handleClearSearch}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {showDropdown && itemSearch.length >= 3 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-72 overflow-auto">
                      {isFetching ? (
                        <div className="px-4 py-4 text-sm text-slate-500 text-center">
                          <div className="inline-block animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
                          Searching...
                        </div>
                      ) : productList?.data?.length > 0 ? (
                        productList.data.map((product: any) => (
                          <div
                            key={product._id}
                            className="px-4 py-3 cursor-pointer hover:bg-blue-50 border-b last:border-b-0 transition-colors"
                            onClick={() => handleProductSelect(product)}
                          >
                            <div className="font-semibold text-sm text-slate-900">{product.name}</div>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {product.sku && (
                                <span className="bg-blue-50 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-md font-medium">
                                  SKU: {product.sku}
                                </span>
                              )}
                              {product.hsnCode && (
                                <span className="bg-green-50 text-green-700 text-[10px] px-1.5 py-0.5 rounded-md font-medium">
                                  HSN: {product.hsnCode}
                                </span>
                              )}
                              {product.manufacturer && (
                                <span className="bg-purple-50 text-purple-700 text-[10px] px-1.5 py-0.5 rounded-md font-medium">
                                  {product.manufacturer}
                                </span>
                              )}
                              {product.category && (
                                <span className="bg-amber-50 text-amber-700 text-[10px] px-1.5 py-0.5 rounded-md font-medium">
                                  {product.category}
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-4 text-center">
                          <p className="text-sm text-slate-500">No medicines found</p>
                          <p className="text-xs text-slate-400 mt-0.5">Try name, SKU, HSN, or manufacturer</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div key={field.key} className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                {renderFieldInput(field, currentProduct[field.label] || "", (value) => handleFieldChange(field.label, value))}
              </div>
            );
          })}

          {/* Unit field */}
          {selectedCategoryValue && availableUnits.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Unit <span className="text-red-500">*</span>
              </label>
              <Select
                value={currentProduct?.unit?.code}
                onValueChange={(unitCode) => {
                  const unit = availableUnits.find((u: any) => u.code === unitCode);
                  if (unit) handleFieldChange("unit", unit);
                }}
              >
                <SelectTrigger className="h-9 text-sm border-slate-200 bg-white">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {availableUnits.map((unit: any) => (
                    <SelectItem key={unit.code} value={unit.code}>{unit.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Size field for bottles */}
          {showSizeField && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Size (ml) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                value={currentProduct["unit"]?.baseUnitSize || ""}
                onChange={(e) => handleFieldChange("Size", e.target.value)}
                placeholder="e.g. 100, 200, 500"
                min="0"
                className="h-9 text-sm border-slate-200 bg-white"
              />
            </div>
          )}
        </div>

        {/* Add Button */}
        <div className="flex justify-end mt-5 pt-4 border-t border-slate-200">
          <Button
            onClick={handleAddProduct}
            disabled={!hasInput}
            className=" h-9 px-5 gap-2 text-sm font-semibold shadow-sm"
          > 
            Add to Bill
          </Button>
        </div>
      </div>

      {/* Data Table */}
      {data.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-slate-700">
              Items in Bill
              <span className="ml-2 bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {data.length}
              </span>
            </p>
          </div>
          <DataTable extraFieldsForProduct={extraFieldsForProduct} data={data} setData={setData} />
        </div>
      )}
    </div>
  );
};

const renderFieldInput = (field: any, value: string, onChange: (value: string) => void) => {
  const baseClass = "h-9 text-sm border-slate-200 bg-white";
  switch (field.type) {
    case "drop-down":
      return (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className={`w-full ${baseClass}`}>
            <SelectValue placeholder={`Select ${field.label}`} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option: any) => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case "number":
      return <Input type="number" value={value} onChange={(e) => onChange(e.target.value)} placeholder={`Enter ${field.label}`} className={baseClass} />;
    case "date":
      return <Input type="date" value={value} onChange={(e) => onChange(e.target.value)} className={baseClass} />;
    default:
      return <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={`Enter ${field.label}`} className={baseClass} />;
  }
};

export default ManualEntryForm;
