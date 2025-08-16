 "use client";

import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface SaveButtonProps {
  tabValue: string;
  onClick: () => void;
}

const SaveButton = ({ tabValue, onClick }: SaveButtonProps) => {
  return (
    <div className="fixed bottom-4 right-4">
      <Button className="shadow-md text-sm" onClick={onClick}>
        <Save className="h-4 w-4 mr-2" />
        {tabValue === "bulk" ? "Save Inventory" : "Save Products"}
      </Button>
    </div>
  );
};

export default SaveButton;