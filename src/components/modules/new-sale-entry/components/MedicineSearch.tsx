import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { Product } from "./NewSaleEntryView";

interface MedicineSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredProducts: Product[];
  highlightedIndex: number;
  handleSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  addProductToBill: (product: Product) => void;
  medicineSearchRef: React.RefObject<HTMLInputElement>;
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
  return (
    <div className="mb-6">
      <Label
        htmlFor="medicine-search"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Add Medicine
      </Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          ref={medicineSearchRef}
          id="medicine-search"
          type="text"
          placeholder="Search medicine by name or composition..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          className="w-full pl-10"
        />
        {filteredProducts.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredProducts.map((product, index) => (
              <div
                key={product._id}
                onClick={() => addProductToBill(product)}
                className={`p-3 cursor-pointer flex justify-between items-center ${
                  index === highlightedIndex
                    ? "bg-blue-100"
                    : "hover:bg-blue-50"
                }`}
              >
                <div>
                  <div className="font-medium">{product.item}</div>
                  <div className="text-sm text-gray-500">
                    {product.saltComposition}
                  </div>
                  <div className="text-xs text-gray-400">
                    Stock: {product.availableQuantity}
                  </div>
                </div>
                <div className="font-semibold">₹{product.sellingPrice}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineSearch;
