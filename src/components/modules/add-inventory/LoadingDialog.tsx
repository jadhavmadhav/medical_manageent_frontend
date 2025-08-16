"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface LoadingDialogProps {
  isLoading: boolean;
  title: string;
}

const LoadingDialog = ({ isLoading, title }: LoadingDialogProps) => {
  return (
    <Dialog open={isLoading}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-800">{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          <p className="mt-2 text-sm text-gray-600">
            Processing your request...
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoadingDialog;