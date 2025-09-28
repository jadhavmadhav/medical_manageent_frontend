import { Button } from "@/components/ui/button";
import { Info, X } from "lucide-react";

interface InstructionsProps {
  showInstructions: boolean;
  setShowInstructions: (show: boolean) => void;
}

const Instructions = ({ showInstructions, setShowInstructions }: InstructionsProps) => {
  if (!showInstructions) return null;

  return (
    <div className="bg-blue-50 p-4 border-b border-blue-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-medium text-blue-800 flex items-center gap-2">
            <Info className="h-5 w-5" /> How to use this system
          </h3>
          <ul className="text-sm text-blue-600 mt-2 list-disc pl-5 space-y-1">
            <li>First select a patient and doctor using the buttons</li>
            <li>Search for medicines by name or composition</li>
            <li>Use arrow keys to navigate search results and press Enter to select</li>
            <li>Adjust quantity and discount for each medicine</li>
            <li>Mark payment as paid to select payment method</li>
            <li>Click "Create Bill" to complete the sale</li>
          </ul>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowInstructions(false)}
          className="text-blue-600 hover:text-blue-800"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Instructions;