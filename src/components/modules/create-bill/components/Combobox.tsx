"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ComboboxProps<T extends { _id: string }> {
  items: T[];
  displayKey: keyof T;
  value: T | null;
  onChange: (item: T | null) => void;
  onCreateNew?: (query: string) => void;
  /**
   * Called on every keystroke with the raw input value.
   * Use this to drive server-side / API search from the parent.
   * When provided, the Combobox skips its own client-side filtering
   * and trusts the `items` prop to already be filtered by the server.
   */
  onSearchChange?: (query: string) => void;
  filterKeys?: (keyof T)[];
  placeholder?: string;
  renderItem?: (item: T) => React.ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
}

export function Combobox<T extends { _id: string }>({
  items,
  displayKey,
  value,
  onChange,
  onCreateNew,
  onSearchChange,
  filterKeys,
  placeholder,
  renderItem,
  disabled,
  isLoading,
}: ComboboxProps<T>) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQ(value ? String(value[displayKey] ?? "") : "");
  }, [value, displayKey]);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const keys = filterKeys ?? [displayKey];

  // When `onSearchChange` is provided the parent drives filtering via API —
  // trust `items` as-is. Otherwise fall back to local client-side filter.
  const filtered = onSearchChange
    ? items
    : items?.filter((item) =>
      keys?.some((k) =>
        String(item[k] ?? "")?.toLowerCase()?.includes(q.toLowerCase())
      )
    );

  const showCreate =
    !isLoading &&
    q.trim() !== "" &&
    !filtered?.some(
      (i) => String(i[displayKey] ?? "")?.toLowerCase() === q?.toLowerCase()
    );

  const total = filtered?.length + (showCreate ? 1 : 0);

  const selectItem = (item: T) => {
    onChange(item);
    setOpen(false);
  };

  const handleCreateNew = () => {
    onCreateNew?.(q);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <Input
          className="pl-8"
          placeholder={placeholder}
          value={q}
          disabled={disabled}
          onChange={(e) => {
            const val = e.target.value;
            setQ(val);
            setOpen(true);
            onChange(null);
            setHi(0);
            onSearchChange?.(val);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setHi((h) => Math.min(h + 1, total - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHi((h) => Math.max(h - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              if (hi < filtered.length) {
                selectItem(filtered[hi]);
              } else if (showCreate) {
                handleCreateNew();
              }
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
        />
      </div>

      {open && (isLoading || total > 0) && (
        <div className="absolute z-50 top-[calc(100%+4px)] left-0 right-0 bg-white border border-border rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center gap-2 px-3 py-3 text-sm text-muted-foreground">
              <svg className="animate-spin h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Searching…
            </div>
          ) : (
            <>
              {filtered?.map((item, i) => (
                <div
                  key={item._id}
                  className={cn(
                    "px-3 py-2.5 cursor-pointer text-sm select-none",
                    hi === i ? "bg-sky-50" : "hover:bg-muted/50"
                  )}
                  onMouseDown={() => selectItem(item)}
                  onMouseEnter={() => setHi(i)}
                >
                  {renderItem ? renderItem(item) : String(item[displayKey])}
                </div>
              ))}
              {showCreate && onCreateNew && (
                <div
                  className={cn(
                    "px-3 py-2.5 cursor-pointer text-sm font-semibold text-sky-600 flex items-center gap-2 select-none border-t border-border",
                    hi === filtered.length ? "bg-sky-50" : "hover:bg-muted/50"
                  )}
                  onMouseDown={handleCreateNew}
                  onMouseEnter={() => setHi(filtered.length)}
                >
                  <Plus size={14} />
                  Add new &ldquo;{q}&rdquo;
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}