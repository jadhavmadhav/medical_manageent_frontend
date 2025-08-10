"use client";

import * as React from "react";
import { addMonths, format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DateRangePickerModalProps {
  onSelectRange: (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => void;
  initialRange?: { from: Date | undefined; to: Date | undefined };
}

export function DateRangePickerModal({
  onSelectRange,
  initialRange = {
    from: new Date(),
    to: addMonths(new Date(), 1),
  },
}: DateRangePickerModalProps) {
  const [open, setOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>(initialRange);

  const handleConfirm = () => {
    if (dateRange.from && dateRange.to) {
      onSelectRange(dateRange);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          {dateRange.from && dateRange.to
            ? `${format(dateRange.from, "dd MMM yyyy")} → ${format(
                dateRange.to,
                "dd MMM yyyy"
              )}`
            : "Pick a date range"}
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "w-full max-w-[1840px] !sm:max-w-[1840px] p-6",
          "flex flex-col items-center"
        )}
        showCloseButton={true}
      >
        <DialogHeader>
          <DialogTitle>Select Date Range</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={(selected) =>
              setDateRange({
                from: selected?.from,
                to: selected?.to ?? undefined,
              })
            }
            numberOfMonths={2}
            defaultMonth={dateRange.from}
            className="rounded-lg border shadow-sm w-full sm:w-auto"
          />
        </div>
        <div className="flex justify-end gap-2 pt-4 w-full">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!dateRange.from || !dateRange.to}
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
