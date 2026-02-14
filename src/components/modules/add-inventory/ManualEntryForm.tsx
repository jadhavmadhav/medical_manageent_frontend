


"use client";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
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

const ManualEntryForm = ({
  extraFieldsForProduct,
  data,
  setData,
}: ManualEntryFormProps) => {
  const [currentProduct, setCurrentProduct] = useState<Record<string, any>>({});
  const [itemSearch, setItemSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch product list
  const { data: productList, isFetching } = useQuery({
    queryKey: ["productListForPurchase", itemSearch],
    queryFn: () =>
      getProductListForPurchase({
        search: itemSearch,
        limit: 20,
      }),
    enabled: itemSearch.length >= 3,
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get selected category details
  const categoryField = extraFieldsForProduct.find((f) => f.key === "category");
  const selectedCategoryValue = currentProduct["Category"];
  const selectedCategory = categoryField?.options?.find(
    (opt: any) => opt.value === selectedCategoryValue
  );

  // Available units based on category
  const availableUnits = useMemo(() => {
    return selectedCategory?.allowedUnits || [];
  }, [selectedCategory]);

  // Build unit map for conversion calculations
  const unitMap = useMemo(() => {
    const map: Record<string, any> = {};
    availableUnits.forEach((u: any) => {
      map[u.code] = u;
    });
    return map;
  }, [availableUnits]);

  // Check if size field should be shown
  const selectedUnit = currentProduct["unit"];
  const showSizeField = selectedUnit?.label === "Bottle";


  console.log("availableUnits", availableUnits)

  // Resolve final base unit for conversion
  const resolveFinalBaseUnit = (unitCode: string) => {
    let factor = 1;
    let current = unitMap[unitCode];

    if (!current) return null;

    while (current.baseUnit !== current.code) {
      factor *= current.baseUnitSize || 1;
      current = unitMap[current.baseUnit];

      if (!current) {
        console.error("Invalid unit chain for:", unitCode);
        return null;
      }
    }

    return {
      baseUnit: current.code,
      factor,
    };
  };

  // Handle product selection from autocomplete
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

  // Clear autocomplete
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

  // Handle field changes
  const handleFieldChange = (fieldLabel: string, value: any) => {
    setCurrentProduct((prev) => {
      const updated = { ...prev };

      // Category change - reset dependent fields
      if (fieldLabel === "Category") {
        updated.Category = value;
        delete updated["unit"];
        delete updated["baseUnit"];
        delete updated["conversionFactor"];
        return updated;
      }

      // unit change - calculate conversion
      if (fieldLabel === "unit") {
        const resolved = resolveFinalBaseUnit(value.code);

        updated.unit = {
          // code: value.code,
          // label: value.label,
          ...value,
          baseUnitSize: value.baseUnitSize || 1,
        };

        if (resolved) {
          updated.baseUnit = resolved.baseUnit;
          updated.conversionFactor = resolved.factor;
        }

        return updated;
      }

      // Size change for bottles
      if (fieldLabel === "Size") {
        if (prev.unit) {
          const numericValue = parseFloat(value) || 0;
          updated.unit = {
            ...prev.unit,
            baseUnitSize: numericValue,
          };

          // Recalculate conversion
          const resolved = resolveFinalBaseUnit(prev.unit.code);
          if (resolved) {
            updated.baseUnit = resolved.baseUnit;
            updated.conversionFactor = resolved.factor * (numericValue / (prev.unit.baseUnitSize || 1));
          }
        }
        return updated;
      }

      // Default field update
      updated[fieldLabel] = value;
      return updated;
    });
  };

  // Add product validation and submission
  const handleAddProduct = () => {
    const missingFields: string[] = [];

    // Check required fields
    extraFieldsForProduct.forEach((field) => {
      if (field.required && !currentProduct[field.label]) {
        missingFields.push(field.label);
      }
    });

    // Check unit is selected when category is selected
    if (selectedCategoryValue && !currentProduct["unit"]) {
      missingFields.push("unit");
    }

    // Check size is provided for bottles
    if (showSizeField && !currentProduct["unit"]?.baseUnitSize) {
      missingFields.push("Size");
    }

    if (missingFields.length > 0) {
      toast.error(`Missing required fields: ${missingFields.join(", ")}`);
      return;
    }

    // Add product to table
    setData([...data, currentProduct]);
    setCurrentProduct({});
    setItemSearch("");
    toast.success("Product added successfully");
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {extraFieldsForProduct.map((field: any) => {
          // Skip dosage_type as it's not being used
          if (field.key === "dosage_type") {
            return null;
          }

          // Custom autocomplete for Product Name
          if (field.key === "item") {
            return (
              <div key={field.key} className="space-y-1 relative" ref={dropdownRef}>
                <label className="text-sm font-medium text-gray-700">
                  Medicine Name
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div className="relative">
                  <Input
                    value={itemSearch}
                    placeholder="Search by name, SKU, HSN, manufacturer, or category"
                    onChange={(e) => {
                      setItemSearch(e.target.value);
                      setShowDropdown(e.target.value.length >= 3);
                    }}
                    onFocus={() => itemSearch.length >= 3 && setShowDropdown(true)}
                    className="pr-8"
                  />
                  {itemSearch && (
                    <button
                      onClick={handleClearSearch}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Autocomplete Dropdown */}
                {showDropdown && itemSearch.length >= 3 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-auto">
                    {isFetching ? (
                      <div className="px-4 py-3 text-sm text-gray-500">Loading...</div>
                    ) : productList?.data?.length > 0 ? (
                      productList.data.map((product: any) => (
                        <div
                          key={product._id}
                          className="px-4 py-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                          onClick={() => handleProductSelect(product)}
                        >
                          <div className="font-medium text-sm text-gray-900 mb-1">
                            {product.name}
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                            {product.sku && (
                              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                                SKU: {product.sku}
                              </span>
                            )}
                            {product.hsnCode && (
                              <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded">
                                HSN: {product.hsnCode}
                              </span>
                            )}
                            {product.manufacturer && (
                              <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded">
                                {product.manufacturer}
                              </span>
                            )}
                            {product.category && (
                              <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded">
                                {product.category}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        No products found. Try searching by name, SKU, HSN code, manufacturer, or category.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          }

          // Regular fields
          return (
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
          );
        })}

        {/* Conditional unit field */}
        {selectedCategoryValue && availableUnits.length > 0 && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Unit
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Select
              value={currentProduct?.unit?.code}
              onValueChange={(unitCode) => {
                const selectedUnit = availableUnits.find((u: any) => u.code === unitCode);
                if (selectedUnit) {
                  handleFieldChange("unit", selectedUnit);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {availableUnits.map((unit: any) => (
                  <SelectItem key={unit.code} value={unit.code}>
                    {unit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Conditional Size field for bottles */}
        {showSizeField && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Size (in ML)
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              type="number"
              value={currentProduct["unit"]?.baseUnitSize || ""}
              onChange={(e) => handleFieldChange("Size", e.target.value)}
              placeholder="Enter size in ML (e.g., 100, 200)"
              min="0"
              step="1"
            />
          </div>
        )}
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
    case "drop-down":
      return (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-full">
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