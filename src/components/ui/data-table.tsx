
"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowData,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PaginationOptions {
  /** Current page (1-indexed) */
  page: number;
  /** Total number of pages */
  totalPages: number;
  /** Total records across all pages */
  totalRecords: number;
  /** How many rows per page */
  limit: number;
  /** Available page size options (default: [10, 20, 50, 100]) */
  pageSizeOptions?: number[];
  /** Called when user changes page */
  onPageChange: (page: number) => void;
  /** Called when user changes page size */
  onLimitChange?: (limit: number) => void;
  /** Show "First" / "Last" buttons (default: true) */
  showFirstLast?: boolean;
}

interface DataTableProps<TData extends RowData, TValue> {
  /** Arbitrary metadata forwarded to TanStack table.options.meta (e.g. for column renderers) */
  meta?: Record<string, any>;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  /** Shown in the empty state */
  emptyMessage?: string;
  /** Extra classes for the outer wrapper */
  className?: string;
  /** Called on row click */
  onRowClick?: (row: TData) => void;
  /** Render skeleton rows instead of data */
  isLoading?: boolean;
  /** Number of skeleton rows while loading (default: 8) */
  skeletonRows?: number;
  /** Pass to enable server-side pagination footer */
  pagination?: PaginationOptions;
}

// ─── Pagination Footer ────────────────────────────────────────────────────────

function PaginationFooter({
  page,
  totalPages,
  totalRecords,
  limit,
  pageSizeOptions = [10, 20, 50, 100],
  onPageChange,
  onLimitChange,
  showFirstLast = true,
  isLoading,
}: PaginationOptions & { isLoading?: boolean }) {
  const startRecord = totalRecords === 0 ? 0 : (page - 1) * limit + 1;
  const endRecord = Math.min(page * limit, totalRecords);

  return (
    <div className="shrink-0 border-t border-slate-100 px-4 py-2.5 flex items-center justify-between gap-4 flex-wrap">
      {/* Left: record range + page size selector */}
      <div className="flex items-center gap-3">
        <span className="text-xs tabular-nums whitespace-nowrap">
          {totalRecords === 0
            ? "No records"
            : `${startRecord}–${endRecord} of ${totalRecords.toLocaleString()}`}
        </span>

        {onLimitChange && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Rows per page</span>
            <Select
              value={String(limit)}
              onValueChange={(v) => {
                onLimitChange(Number(v));
                onPageChange(1); // reset to first page on size change
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="h-7 w-[80px] text-xs border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)} className="text-xs">
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Right: page navigation */}
      <div className="flex items-center gap-1">
        {showFirstLast && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-slate-500 hover:text-slate-800 hidden sm:inline-flex"
            onClick={() => onPageChange(1)}
            disabled={page === 1 || isLoading}
          >
            First
          </Button>
        )}

        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 border-slate-200"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1 || isLoading}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>

        {/* Page number pills */}
        <div className="flex items-center gap-1">
          {buildPageRange(page, totalPages).map((p, i) =>
            p === "…" ? (
              <span key={`ellipsis-${i}`} className="text-xs text-slate-400 px-1">
                …
              </span>
            ) : (
              <Button
                key={p}
                variant={p === page ? "default" : "outline"}
                size="icon"
                className={cn(
                  "h-7 w-7 text-xs border-slate-200",
                  p === page && "bg-primary text-primary-foreground border-primary"
                )}
                onClick={() => onPageChange(p as number)}
                disabled={isLoading}
              >
                {p}
              </Button>
            )
          )}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 border-slate-200"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages || isLoading || totalPages === 0}
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>

        {showFirstLast && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-slate-500 hover:text-slate-800 hidden sm:inline-flex"
            onClick={() => onPageChange(totalPages)}
            disabled={page === totalPages || isLoading || totalPages === 0}
          >
            Last
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * Build a compact page range with ellipsis.
 * e.g. page=5, total=12 → [1, "…", 4, 5, 6, "…", 12]
 */
function buildPageRange(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "…")[] = [];

  const addRange = (start: number, end: number) => {
    for (let i = start; i <= end; i++) pages.push(i);
  };

  pages.push(1);

  if (current > 3) pages.push("…");

  const rangeStart = Math.max(2, current - 1);
  const rangeEnd = Math.min(total - 1, current + 1);
  addRange(rangeStart, rangeEnd);

  if (current < total - 2) pages.push("…");

  pages.push(total);

  return pages;
}

// ─── Main DataTable ───────────────────────────────────────────────────────────

export function DataTable<TData extends RowData, TValue>({
  columns,
  data,
  emptyMessage = "No results.",
  className,
  onRowClick,
  isLoading = false,
  skeletonRows = 8,
  pagination,
  meta,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta,
  });

  return (
    <div className={cn("w-full h-full overflow-auto border border-slate-200 rounded-xl flex flex-col", className)}>
      {/* ── Table ──────────────────────────────────────────────────── */}
      <div className="overflow-auto flex-1">
        <Table>
          <TableHeader className="sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-slate-200"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-[11px] font-bold uppercase tracking-wider h-10 px-4 whitespace-nowrap"
                    style={{
                      width: header.getSize() !== 150 ? header.getSize() : undefined,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: skeletonRows }).map((_, i) => (
                <TableRow key={`skeleton-${i}`} className="border-b border-slate-100">
                  {columns.map((_, j) => (
                    <TableCell key={j} className="px-4 py-3">
                      <div
                        className="h-4 bg-slate-100 rounded animate-pulse"
                        style={{ opacity: 1 - i * (0.8 / skeletonRows) }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  className={cn(
                    "border-b border-slate-100 last:border-0 transition-colors",
                    onRowClick && "cursor-pointer hover:bg-slate-50"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-2.5 text-sm ">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center">
                      {/* <Package2 className="h-6 w-6 text-slate-300" /> */}
                    </div>
                    <p className="text-sm font-medium text-slate-500">{emptyMessage}</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Pagination Footer ───────────────────────────────────────── */}
      {pagination && (
        <PaginationFooter {...pagination} isLoading={isLoading} />
      )}
    </div>

  );
}