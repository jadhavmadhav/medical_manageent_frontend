//  "use client";

// import { Button } from "@/components/ui/button";
// import { Save } from "lucide-react";

// interface SaveButtonProps {
//   tabValue: string;
//   onClick: () => void;
// }

// const SaveButton = ({ tabValue, onClick }: SaveButtonProps) => {
//   return (
//     <div className="fixed bottom-4 right-4">
//       <Button className="shadow-md text-sm" onClick={onClick}>
//         <Save className="h-4 w-4 mr-2" />
//         {tabValue === "bulk" ? "Save Inventory" : "Save Products"}
//       </Button>
//     </div>
//   );
// };

// export default SaveButton;




"use client";

import { Button } from "@/components/ui/button";
import { Save, Package } from "lucide-react";
import { memo } from "react";

interface SaveButtonProps {
  tabValue: string;
  onClick: () => void;
  itemCount?: number;
}

const SaveButton = memo(({ tabValue, onClick, itemCount = 0 }: SaveButtonProps) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={onClick}
        className="group relative bg-primary text-white shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 px-6 py-6 rounded-2xl text-base font-semibold"
        size="lg"
      >
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>

        {/* Icon */}
        <Save className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />

        {/* Text */}
        <span className="relative">
          {tabValue === "bulk" ? "Save Inventory" : "Save Products"}
        </span>


        {/* Pulse animation indicator */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
      </Button>
    </div>
  );
});

SaveButton.displayName = "SaveButton";

export default SaveButton;