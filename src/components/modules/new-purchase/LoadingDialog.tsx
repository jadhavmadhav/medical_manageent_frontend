"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface LoadingDialogProps {
  isLoading: boolean;
  title: string;
}

const LoadingDialog = ({ isLoading, title }: LoadingDialogProps) => {
  return (
    <Dialog open={isLoading}>
      <DialogContent className="sm:max-w-xs p-0 overflow-hidden rounded-2xl border-0 shadow-2xl">
        <div className="bg-gradient-to-b from-blue-600 to-blue-700 p-8 flex flex-col items-center gap-4 text-center">
          <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-base">{title}</p>
            <p className="text-blue-200 text-sm mt-1">Please wait, do not close this window</p>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
            <div className="bg-white h-full rounded-full animate-pulse w-2/3" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoadingDialog;
