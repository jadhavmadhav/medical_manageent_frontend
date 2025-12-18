// MedicineSearch.tsx

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from "@/types/new-sale-entry";
import { Search } from "lucide-react";
import React, { useEffect, useRef } from "react";

interface MedicineSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredProducts: Product[];
  highlightedIndex: number;
  // ✨ NEW PROP
  handleSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  addProductToBill: (product: Product) => void;
  medicineSearchRef: React.RefObject<HTMLInputElement | null>;
}

const MedicineSearch = ({
  searchTerm,
  setSearchTerm,
  filteredProducts,
  highlightedIndex,
  handleSearchKeyDown,
  addProductToBill,
  medicineSearchRef,
}: MedicineSearchProps) => {
  // Ref to manage the list container and item scrolling
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current && highlightedIndex >= 0) {
      // Logic to scroll the highlighted item into view
      const highlightedItem = listRef.current.children[
        highlightedIndex
      ] as HTMLElement;
      if (highlightedItem) {
        highlightedItem.scrollIntoView({
          block: "nearest",
          inline: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [highlightedIndex]);

  return (
    <div className="mb-6">
      <Label
        htmlFor="medicine-search"
        className="block text-sm font-semibold mb-2"
      >
        Add Medicine (Use $\uparrow/\downarrow/Enter$ for quick entry)
      </Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
        <Input
          ref={medicineSearchRef}
          id="medicine-search"
          type="text"
          placeholder="Search by Item, Salt, or Barcode..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearchKeyDown} // Attached the keyboard handler
          className="w-full pl-10 h-10 text-base border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
          autoComplete="off"
        />
        {filteredProducts.length > 0 && (
          <div
            ref={listRef} // Attached ref for scrolling
            className="absolute z-20 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl max-h-72 overflow-y-auto"
          >
            {filteredProducts?.map((product, index) => (
              <div
                key={product._id}
                onClick={() => addProductToBill(product)}
                // onMouseEnter={() => setHighlightedIndex(index)} // Better hover UX
                className={`p-3 cursor-pointer transition-colors flex justify-between items-center ${
                  index === highlightedIndex
                    ? "bg-primary text-white" // Stronger highlight
                    : "hover:bg-teal-100 text-gray-900"
                }`}
              >
                <div>
                  <div
                    className={`font-semibold ${
                      index === highlightedIndex
                        ? "text-white"
                        : "text-gray-900"
                    }`}
                  >
                    {product?.item}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-bold ${
                      index === highlightedIndex ? "text-white" : ""
                    }`}
                  >
                    ₹{product?.sellingPrice}
                  </div>
                  <div
                    className={`text-xs ${
                      index === highlightedIndex
                        ? "text-blue-200"
                        : "text-gray-400"
                    }`}
                  >
                    Stock: {product?.availableQuantity}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineSearch;
