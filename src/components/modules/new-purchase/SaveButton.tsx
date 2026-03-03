"use client";

import { Button } from "@/components/ui/button";
import { Save, ChevronRight } from "lucide-react";
import { memo } from "react";

interface SaveButtonProps {
  tabValue: string;
  onClick: () => void;
  itemCount?: number;
}

const SaveButton = memo(({ tabValue, onClick, itemCount = 0 }: SaveButtonProps) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={onClick}
        className="group flex items-center gap-3 bg-primary active:scale-95 text-white shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-200 px-5 py-3.5 rounded-2xl font-semibold text-sm"
      >
        <span>
          {tabValue === "bulk" ? "Save Purchase Bill" : "Save Purchase Bill"}
        </span>


        {itemCount > 0 && (
          <span className="bg-white/20 text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[22px] text-center">
            {itemCount}
          </span>
        )}

        <ChevronRight className="h-4 w-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
});

SaveButton.displayName = "SaveButton";

export default SaveButton;
