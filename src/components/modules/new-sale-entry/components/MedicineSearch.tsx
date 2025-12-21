// MedicineSearch.tsx

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from "@/types/new-sale-entry";
import { dateFormatter } from "@/utils/constants";
import {
  Building2,
  Calendar,
  Hash,
  IndianRupee,
  Package,
  Search,
} from "lucide-react";
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
    // <div className="mb-6">
    //   <Label
    //     htmlFor="medicine-search"
    //     className="block text-sm font-semibold mb-2"
    //   >
    //     Add Medicine (Use $\uparrow/\downarrow/Enter$ for quick entry)
    //   </Label>
    //   <div className="relative">
    //     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
    //     <Input
    //       ref={medicineSearchRef}
    //       id="medicine-search"
    //       type="text"
    //       placeholder="Search by Item, Salt, or Barcode..."
    //       value={searchTerm}
    //       onChange={(e) => setSearchTerm(e.target.value)}
    //       onKeyDown={handleSearchKeyDown} // Attached the keyboard handler
    //       className="w-full pl-10 h-10 text-base border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
    //       autoComplete="off"
    //     />
    //     {filteredProducts.length > 0 && (
    //       <div
    //         ref={listRef} // Attached ref for scrolling
    //         className="absolute z-20 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl max-h-72 overflow-y-auto"
    //       >
    //         {filteredProducts?.map((product, index) => (
    //           <div
    //             key={product._id}
    //             onClick={() => addProductToBill(product)}
    //             // onMouseEnter={() => setHighlightedIndex(index)} // Better hover UX
    //             className={`p-3 cursor-pointer transition-colors flex justify-between items-center ${
    //               index === highlightedIndex
    //                 ? "bg-primary text-white" // Stronger highlight
    //                 : "hover:bg-teal-100 text-gray-900"
    //             }`}
    //           >
    //             <div>
    //               <div
    //                 className={`font-semibold ${
    //                   index === highlightedIndex
    //                     ? "text-white"
    //                     : "text-gray-900"
    //                 }`}
    //               >
    //                 {product?.item}
    //               </div>
    //               <div>
    //                 <h4 className="text-sm ">{product?.manufacturer}</h4>
    //                 <div className="text-xs text-gray-600">
    //                   Exp: {dateFormatter(product?.expiryDate) || "N/A"} | Batch:{" "}
    //                   {product?.batchNo || "N/A"}
    //                 </div>
    //               </div>
    //             </div>
    //             <div className="text-right">
    //               <div
    //                 className={`font-bold ${
    //                   index === highlightedIndex ? "text-white" : ""
    //                 }`}
    //               >
    //                 ₹{product?.sellingPrice}
    //               </div>
    //               <div
    //                 className={`text-xs ${
    //                   index === highlightedIndex ? "text-blue-200" : ""
    //                 }`}
    //               >
    //                 Stock: {product?.availableQuantity}
    //               </div>
    //             </div>
    //           </div>
    //         ))}
    //       </div>
    //     )}
    //   </div>
    // </div>

    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <label
          htmlFor="medicine-search"
          className="text-sm font-semibold  flex items-center gap-2"
        >
          Add Medicine
        </label>
        <span className="text-xs  px-2.5 py-1 font-medium">
          Use ↑/↓/Enter for quick entry
        </span>
      </div>

      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            ref={medicineSearchRef}
            id="medicine-search"
            type="text"
            placeholder="Search by item name, salt, or scan barcode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="w-full pl-10 pr-4 h-12 text-base border-1 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 shadow-sm hover:border-gray-300"
            autoComplete="off"
          />
        </div>

        {filteredProducts.length > 0 && (
          <div
            ref={listRef}
            className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-80 overflow-y-auto"
          >
            {filteredProducts.map((product, index) => {
              const isHighlighted = index === highlightedIndex;
              const isLowStock = product.availableQuantity < 10;

              return (
                <div
                  key={product._id}
                  onClick={() => addProductToBill(product)}
                  className={`p-4 cursor-pointer transition-all duration-150 border-b border-gray-100 last:border-b-0 ${
                    isHighlighted
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white scale-[1.02]"
                      : "hover:bg-blue-50 text-gray-900"
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    {/* Left side - Product info */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-semibold text-base mb-1 truncate ${
                          isHighlighted ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {product.item}
                      </h3>

                      <div className="flex items-center gap-1.5 mb-2">
                        <Building2
                          className={`w-3.5 h-3.5 ${
                            isHighlighted ? "text-blue-100" : "text-gray-500"
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            isHighlighted ? "text-blue-100" : "text-gray-600"
                          }`}
                        >
                          {product.manufacturer}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-3 text-xs">
                        <div className="flex items-center gap-1">
                          <Calendar
                            className={`w-3 h-3 ${
                              isHighlighted ? "text-blue-200" : "text-gray-400"
                            }`}
                          />
                          <span
                            className={
                              isHighlighted ? "text-blue-100" : "text-gray-500"
                            }
                          >
                            Exp: {dateFormatter(product.expiryDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Hash
                            className={`w-3 h-3 ${
                              isHighlighted ? "text-blue-200" : "text-gray-400"
                            }`}
                          />
                          <span
                            className={
                              isHighlighted ? "text-blue-100" : "text-gray-500"
                            }
                          >
                            Batch: {product.batchNo || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Price and stock */}
                    <div className="text-right flex-shrink-0">
                      <div
                        className={`font-bold text-lg mb-1 flex items-center justify-end gap-0.5 ${
                          isHighlighted ? "text-white" : "text-gray-900"
                        }`}
                      >
                        <IndianRupee className="w-4 h-4" />
                        {product.sellingPrice.toFixed(2)}
                      </div>

                      <div
                        className={`text-xs font-medium px-2 py-1 rounded-full inline-block ${
                          isHighlighted
                            ? "bg-white/20 text-white"
                            : isLowStock
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        Stock: {product.availableQuantity}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineSearch;
