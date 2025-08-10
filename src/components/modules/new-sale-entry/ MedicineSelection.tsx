"use client";

import { useState, useRef, useEffect, KeyboardEvent, useMemo } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Medicine {
  _id: string;
  item: string;
  status: "in_stock" | "out_of_stock";
  availableQuantity: number;
  sellingPrice: number;
  gstPercent: number;
  packSize?: string;
  schedule?: "H" | "H1" | "None";
  category?: string;
}

interface CartItem
  extends Pick<
    Medicine,
    "_id" | "item" | "sellingPrice" | "gstPercent" | "schedule"
  > {
  quantity: number;
  total: number;
  gstAmount: number;
}

interface MedicineSelectionProps {
  inventories: Medicine[];
  items: CartItem[];

  setItems: (data: any[]) => void;
}

export const MedicineSelection = ({
  inventories,
  items,
  setItems,
}: MedicineSelectionProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [searchText, setSearchText] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Memoized filtered options with category grouping
  const filteredOptions = useMemo(() => {
    const filtered = inventories.filter(
      (med) =>
        med.item.toLowerCase().includes(searchText.toLowerCase()) &&
        med.status === "in_stock" &&
        med.availableQuantity > 0
    );

    const grouped = filtered.reduce((acc, med) => {
      const category = med.category || "Uncategorized";
      if (!acc[category]) acc[category] = [];
      acc[category].push(med);
      return acc;
    }, {} as Record<string, Medicine[]>);

    return grouped;
  }, [inventories, searchText]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle dropdown visibility
  useEffect(() => {
    const hasOptions = Object.keys(filteredOptions).length > 0;
    if (searchText && hasOptions && !selectedMedicine) {
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  }, [searchText, filteredOptions, selectedMedicine]);

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen) return;

    const flatOptions = Object.values(filteredOptions).flat();

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < flatOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : flatOptions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < flatOptions.length) {
          handleSelectMedicine(flatOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
      case "Tab":
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };
  console.log("selectedMedicine", selectedMedicine);
  const handleSelectMedicine = (med: Medicine) => {
    setSelectedMedicine(med);
    setSearchText(med.item);
    setSelectedMedicine(med);
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleQuantityChange = (value: string) => {
    const num = parseInt(value) || 0;
    const max = selectedMedicine?.availableQuantity || Infinity;
    setQuantity(Math.min(max, Math.max(0, num)));
  };

  const handleAddItem = () => {
    if (
      !selectedMedicine ||
      quantity <= 0 ||
      quantity > selectedMedicine.availableQuantity
    )
      return;

    const itemTotal = selectedMedicine.sellingPrice * quantity;
    const gstAmount = itemTotal * (selectedMedicine.gstPercent / 100);

    setItems([
      ...items,
      {
        ...selectedMedicine,
        gstPercent: selectedMedicine.gstPercent,
        schedule: selectedMedicine.schedule || "None",
        quantity,
        total: itemTotal,
        gstAmount,
      },
    ]);

    setSelectedMedicine(null);
    setSearchText("");
    setQuantity(1);
  };

  const handleEditItem = (id: string) => {
    const item = items.find((item) => item._id === id);
    if (!item) return;

    // setSearchText(item.item);
    setSelectedMedicine(item);
    setQuantity(item.quantity);
    const filtered = items.filter((i) => i._id !== id);
    setItems(filtered);
  };

  const handleDeleteItem = (id: string) => {
    const filtered = items?.filter((i) => i._id !== id);
    setItems(filtered);
  };

  return (
    <div className="space-y-5 p-5 flex flex-col h-full">
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-3">
        <div className="relative lg:col-span-2" ref={dropdownRef}>
          <Label
            htmlFor="medicine-search"
            className="text-sm font-medium text-gray-600"
          >
            Select Medicine
          </Label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="medicine-search"
              ref={inputRef}
              value={selectedMedicine?.item || searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onFocus={() =>
                setIsDropdownOpen(Object.keys(filteredOptions).length > 0)
              }
              onKeyDown={handleKeyDown}
              placeholder="Enter medicine name..."
              autoComplete="off"
              className="pl-10 w-full rounded-lg border border-gray-300 bg-gray-50 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              aria-autocomplete="list"
            />

            {/* Autocomplete dropdown */}
            {isDropdownOpen && Object.keys(filteredOptions).length > 0 && (
              <div className="absolute z-20 w-full mt-1.5 bg-white shadow-lg rounded-lg border border-gray-300">
                <ScrollArea className="max-h-72 overflow-y-auto rounded-lg">
                  {Object.entries(filteredOptions).map(
                    ([category, medicines]) => (
                      <div
                        key={category}
                        className="border-b border-gray-200 last:border-b-0"
                      >
                        <div className="px-3 py-1.5 bg-gray-100 text-xs font-medium text-gray-600">
                          {category}
                        </div>
                        {medicines.map((med, index) => (
                          <div
                            key={med._id}
                            onClick={() => handleSelectMedicine(med)}
                            onMouseEnter={() => setHighlightedIndex(index)}
                            className={`px-3 py-2.5 cursor-pointer flex justify-between items-center ${
                              highlightedIndex === index
                                ? "bg-blue-50"
                                : "hover:bg-gray-50"
                            }`}
                            role="option"
                            aria-selected={highlightedIndex === index}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-800">
                                {med.item}
                              </span>
                              {med.packSize && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-gray-200 text-gray-700"
                                >
                                  {med.packSize}
                                </Badge>
                              )}
                              {med.schedule && med.schedule !== "None" && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs bg-red-100 text-red-700"
                                >
                                  Schedule {med.schedule}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-blue-600">
                                ₹{med.sellingPrice.toFixed(2)}
                              </span>
                              <Badge
                                variant="outline"
                                className="text-xs border-gray-300 text-gray-600"
                              >
                                {med.availableQuantity} in stock
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </ScrollArea>
              </div>
            )}
          </div>
        </div>

        <div>
          <Label
            htmlFor="quantity"
            className="text-sm font-medium text-gray-600"
          >
            Quantity
          </Label>
          <Input
            id="quantity"
            max={selectedMedicine?.availableQuantity}
            value={quantity || ""}
            onChange={(e) => handleQuantityChange(e.target.value)}
            disabled={!selectedMedicine}
            placeholder={`Max: ${selectedMedicine?.availableQuantity || "N/A"}`}
            className="mt-1 rounded-lg border border-gray-300 bg-gray-50 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            aria-describedby="quantity-hint"
          />
        </div>

        <div className="flex items-end">
          <Button
            onClick={handleAddItem}
            disabled={!selectedMedicine?.item || !quantity}
            className="w-full rounded-lg bg-blue-500 hover:bg-blue-600 text-white py-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Plus size={16} className="mr-1.5" />
            Add to Bill
          </Button>
        </div>
      </div>

      {items.length > 0 && (
        <div className="mt-6 flex-1 rounded-lg border border-gray-300 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="font-medium text-gray-700 py-2.5">
                  Medicine
                </TableHead>
                <TableHead className="text-right font-medium text-gray-700 py-2.5">
                  Price
                </TableHead>
                <TableHead className="text-right font-medium text-gray-700 py-2.5">
                  Qty
                </TableHead>
                <TableHead className="text-right font-medium text-gray-700 py-2.5">
                  GST
                </TableHead>
                <TableHead className="text-right font-medium text-gray-700 py-2.5">
                  Total
                </TableHead>
                <TableHead className="text-center font-medium text-gray-700 py-2.5">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items?.map((item) => (
                <TableRow key={item._id} className="hover:bg-gray-50">
                  <TableCell className="py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">
                        {item?.item}
                      </span>
                      {item.schedule && item.schedule !== "None" && (
                        <Badge
                          variant="destructive"
                          className="text-xs bg-red-100 text-red-700"
                        >
                          Schedule {item?.schedule}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium text-blue-600 py-2.5">
                    ₹{item.sellingPrice.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right py-2.5">
                    {item.quantity}
                  </TableCell>
                  <TableCell className="text-right py-2.5">
                    {item.gstPercent}%
                  </TableCell>
                  <TableCell className="text-right font-medium text-blue-600 py-2.5">
                    ₹{item.total.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center py-2.5">
                    <div className="flex justify-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditItem(item._id)}
                        className="hover:bg-yellow-100 rounded-md"
                        aria-label={`Edit ${item.item}`}
                      >
                        <Edit size={16} className="text-yellow-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteItem(item._id)}
                        className="hover:bg-red-100 rounded-md"
                        aria-label={`Delete ${item.item}`}
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
