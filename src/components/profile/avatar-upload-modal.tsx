"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

const BRAND = "#00BFA5";
const BRAND_DARK = "#00a896";

interface Props {
  open: boolean;
  onClose: () => void;
  currentName: string;
}

export const AvatarUploadModal = ({
  open,
  onClose,
  currentName,
}: Props) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Only image files allowed");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Max file size 2MB");
      return;
    }

    setPreview(URL.createObjectURL(file));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Update Profile Photo</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <Avatar className="h-28 w-28">
            <AvatarImage src={preview ?? undefined} />
            <AvatarFallback className="text-xl">
              {currentName.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <label className="cursor-pointer">
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) =>
                e.target.files && handleFile(e.target.files[0])
              }
            />
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Upload size={16} />
              Choose Image
            </div>
          </label>

          <p className="text-xs text-muted-foreground">
            JPG / PNG • Max 2MB
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="text-white"
            style={{
              background: `linear-gradient(90deg, ${BRAND}, ${BRAND_DARK})`,
            }}
            disabled={!preview}
            onClick={() => {
              console.log("Upload avatar");
              onClose();
            }}
          >
            Save Photo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
