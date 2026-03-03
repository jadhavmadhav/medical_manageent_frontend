"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { format, isValid, parseISO } from "date-fns";
import {
  Download,
  Calendar as CalendarIcon,
  Loader2,
  FileSpreadsheet,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  RefreshCw,
  SlidersHorizontal,
  TrendingUp,
  Search,
} from "lucide-react";
import * as XLSX from "xlsx";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

import { useEnterprise } from "@/lib/context/EnterpriseContext";
import { getReports } from "@/services/reports";

// --- Types ---

interface ReportColumn {
  key: string;
  label: string;
  value: boolean;
  position: number;
}

interface ReportConfig {
  key: string;
  reportLabel: string;
  configColumns: ReportColumn[];
}

interface ReportData {
  [key: string]: string | number | null | undefined;
}

interface FetchPayload {
  type: string;
  enterpriseId: string;
  startDate?: string;
  endDate?: string;
}

// --- Utilities ---

const INR_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const formatCurrency = (val: string | number | null | undefined) => {
  if (val === null || val === undefined || val === "") return "-";
  const n = Number(val);
  return isNaN(n) ? "-" : INR_FORMATTER.format(n);
};

const formatDate = (val: string | Date | null | undefined) => {
  if (!val) return "-";
  const d = val instanceof Date ? val : parseISO(String(val));
  return isValid(d) ? format(d, "dd MMM yyyy") : "-";
};

// Quick date preset ranges
const DATE_PRESETS = [
  { label: "Today", days: 0 },
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
];

// --- Component ---

export default function ReportsView() {
  const { enterprise } = useEnterprise();

  const [selectedReport, setSelectedReport] = useState<string>("");
  const [data, setData] = useState<ReportData[]>([]);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const ITEMS_PER_PAGE = 20;
  const abortControllerRef = useRef<AbortController | null>(null);

  const tableConfig = enterprise?.reportConfigurations || [];

  useEffect(() => {
    if (tableConfig.length > 0 && !selectedReport) {
      setSelectedReport(tableConfig[0].key);
    }
  }, [tableConfig, selectedReport]);

  const currentConfig = useMemo(
    () => tableConfig.find((c) => c.key === selectedReport),
    [tableConfig, selectedReport]
  );

  const columns = useMemo(() => {
    if (!currentConfig?.configColumns) return [];
    return currentConfig.configColumns
      .filter((col: any) => col.value === true)
      .sort((a: any, b: any) => a.position - b.position);
  }, [currentConfig]);



  // --- Fetch ---

  const fetchData = useCallback(async () => {
    if (!enterprise?.enterpriseId || !selectedReport) return;
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setCurrentPage(1);

    try {
      const payload: FetchPayload = {
        type: selectedReport,
        enterpriseId: enterprise.enterpriseId,
      };
      if (dateRange?.from) payload.startDate = format(dateRange.from, "yyyy/MM/dd");
      if (dateRange?.to) payload.endDate = format(dateRange.to, "yyyy/MM/dd");

      const res = await getReports(payload);
      if (!controller.signal.aborted) setData(res?.Reports || []);
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Failed to fetch reports:", err);
        setData([]);
      }
    } finally {
      if (!controller.signal.aborted) setIsLoading(false);
    }
  }, [selectedReport, enterprise?.enterpriseId, dateRange]);

  useEffect(() => {
    fetchData();
    return () => { abortControllerRef.current?.abort(); };
  }, [fetchData]);

  // --- Search filter ---

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const q = searchQuery.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((v) =>
        String(v ?? "").toLowerCase().includes(q)
      )
    );
  }, [data, searchQuery]);

  // --- Pagination ---

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  // Reset page when search changes
  useEffect(() => { setCurrentPage(1); }, [searchQuery]);

  // --- Preset date setter ---

  const applyPreset = (days: number) => {
    const to = new Date();
    if (days === 0) {
      setDateRange({ from: to, to });
    } else {
      const from = new Date();
      from.setDate(from.getDate() - days);
      setDateRange({ from, to });
    }
    setCalendarOpen(false);
  };

  const clearDateRange = () => {
    setDateRange({ from: undefined, to: undefined });
    setCalendarOpen(false);
  };

  // --- Export ---

  const exportToExcel = async () => {
    if (filteredData.length === 0) return;
    setIsExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const exportRows = filteredData.map((row) => {
        const cleanRow: Record<string, any> = {};
        columns.forEach((col) => { cleanRow[col.label] = row[col.key]; });
        return cleanRow;
      });
      const ws = XLSX.utils.json_to_sheet(exportRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, currentConfig?.reportLabel || "Sheet1");
      XLSX.writeFile(wb, `${currentConfig?.reportLabel || "Report"}_${format(new Date(), "dd-MMM-yyyy")}.xlsx`);
    } catch (e) {
      console.error("Export failed", e);
    } finally {
      setIsExporting(false);
    }
  };

  // --- Cell Renderer ---

  const renderCell = useCallback((key: string, value: any) => {
    const lk = key.toLowerCase();
    console.log("column  =>", key, "----", value)
    if (lk.includes("date") || lk.includes("at")) {
      return (
        <span className="text-slate-500 text-xs whitespace-nowrap tabular-nums">
          {formatDate(value)}
        </span>
      );
    }

    const isMoneyKey = ["price", "amount", "profit", "cost", "total", "revenue", "balance"].some(
      (k) => lk.includes(k)
    ) && !lk.includes("id");

    if (isMoneyKey && (typeof value === "number" || typeof value === "string")) {
      return (
        <span className="font-mono text-sm text-emerald-700 font-semibold">
          {formatCurrency(value)}
        </span>
      );
    }

    // if (value === null || value === undefined || value === "") {
    //   return <span className="text-slate-300">—</span>;
    // }

    return (
      <span className="truncate block max-w-[220px] text-slate-700 text-sm" title={String(value)}>
        {value}
      </span>
    );
  }, []);

  // --- Date range label ---

  const dateLabel = useMemo(() => {
    if (dateRange?.from && dateRange?.to) {
      if (format(dateRange.from, "yyyy-MM-dd") === format(dateRange.to, "yyyy-MM-dd")) {
        return format(dateRange.from, "dd MMM yyyy");
      }
      return `${format(dateRange.from, "dd MMM")} – ${format(dateRange.to, "dd MMM, yy")}`;
    }
    if (dateRange?.from) return format(dateRange.from, "dd MMM yyyy");
    return null;
  }, [dateRange]);



  // console.log("columns", { columns, paginatedData })


  return (
    <div className="flex flex-col h-full p-4 ">

      {/* ── Top Header ─────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 ">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">Reports</h1>
            <p className="text-xs text-slate-500 leading-tight">Real-time data &amp; exports</p>
          </div>


          <div className="flex items-center gap-2">
            {/* Record count pill */}
            {!isLoading && data.length > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                <TrendingUp className="h-3.5 w-3.5" />
                {data.length.toLocaleString()} records
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={exportToExcel}
              disabled={isExporting || isLoading || filteredData.length === 0}
              className="gap-2 h-8 text-xs font-semibold border-slate-200"
            >
              {isExporting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
              )}
              Export Excel
            </Button>
          </div>
        </div>
      </div>

      <div className=" w-full flex flex-col gap-4 p-4 sm:p-6 flex-1">

        {/* ── Filter Bar ────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex flex-wrap gap-3 items-end">

            {/* Report Type */}
            <div className="flex flex-col gap-1.5 min-w-[200px] flex-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Report Type
              </label>
              <Select value={selectedReport} onValueChange={(v) => { setSelectedReport(v); setSearchQuery(""); }}>
                <SelectTrigger className="h-9 text-sm border-slate-200">
                  <SlidersHorizontal className="h-3.5 w-3.5 mr-2 text-slate-400" />
                  <SelectValue placeholder="Select report" />
                </SelectTrigger>
                <SelectContent>
                  {tableConfig.map((c) => (
                    <SelectItem key={c.key} value={c.key}>{c.reportLabel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="flex flex-col gap-1.5 min-w-[220px] flex-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Date Range
              </label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal h-9 text-sm border-slate-200 ${!dateLabel ? "text-slate-400" : "text-slate-800"}`}
                  >
                    <CalendarIcon className="mr-2 h-3.5 w-3.5 text-slate-400 shrink-0" />
                    {dateLabel ?? "All time"}
                    {dateLabel && (
                      <span
                        className="ml-auto text-slate-400 hover:text-slate-700 cursor-pointer text-xs"
                        onClick={(e) => { e.stopPropagation(); clearDateRange(); }}
                      >
                        ✕
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 shadow-xl rounded-xl border-slate-200" align="start">
                  {/* Presets */}
                  <div className="flex gap-1.5 p-3 border-b border-slate-100 flex-wrap">
                    {DATE_PRESETS.map((p) => (
                      <button
                        key={p.label}
                        onClick={() => applyPreset(p.days)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-teal-100 hover:text-teal-700 text-slate-600 font-medium transition-colors"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange as any}
                    onSelect={(range: any) => setDateRange(range ?? { from: undefined, to: undefined })}
                    numberOfMonths={2}
                    className="p-3"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Search */}
            <div className="flex flex-col gap-1.5 min-w-[180px] flex-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter results..."
                  className="pl-8 h-9 text-sm border-slate-200"
                />
              </div>
            </div>

            {/* Refresh */}
            <Button
              onClick={fetchData}
              disabled={isLoading}
              className="h-9 px-5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold gap-2 shrink-0"
            >
              {isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              Refresh
            </Button>
          </div>
        </div>

        {/* ── Table Card ─────────────────────────────────────────────────── */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden min-h-0">

          {/* Table Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/60 shrink-0">
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm font-bold text-slate-800">
                {currentConfig?.reportLabel || "Report"}
              </h2>
              {!isLoading && (
                <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                  {searchQuery && filteredData.length !== data.length
                    ? `${filteredData.length} of ${data.length}`
                    : `${data.length.toLocaleString()} rows`}
                </span>
              )}
            </div>

            {/* Pagination */}
            {filteredData.length > ITEMS_PER_PAGE && (
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 border-slate-200"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <span className="text-xs font-medium text-slate-500 min-w-[56px] text-center">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 border-slate-200"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>

          {/* Table Body */}
          <div className="flex-1 overflow-auto">
            {isLoading ? (
              <div className="p-5 space-y-2.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-9 w-full rounded-lg"
                    style={{ opacity: 1 - i * 0.07 }}
                  />
                ))}
              </div>
            ) : filteredData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                  <AlertCircle className="h-7 w-7 text-slate-400" />
                </div>
                <p className="text-sm font-semibold text-slate-600">
                  {searchQuery ? "No results match your search" : "No records found"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {searchQuery ? "Try a different keyword" : "Try adjusting the date range or report type"}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-3 text-xs text-teal-600 font-semibold hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader className="sticky top-0 z-10">
                  <TableRow className="bg-slate-50 border-b border-slate-200 hover:bg-slate-50">
                    <TableHead className="w-10 pl-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      #
                    </TableHead>
                    {columns.map((col) => (
                      <TableHead
                        key={col.key}
                        className="whitespace-nowrap text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10 bg-slate-50"
                      >
                        {col.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((row, i) => (
                    <TableRow
                      key={i}
                      className="hover:bg-teal-50/40 transition-colors border-b border-slate-100 last:border-0"
                    >
                      {/* Row number */}
                      <TableCell className="pl-4 text-xs text-slate-300 font-medium tabular-nums">
                        {(currentPage - 1) * ITEMS_PER_PAGE + i + 1}
                      </TableCell>

                      {columns.map((col) => {

                        return (
                          <TableCell key={`${i}-${col.key}`} className="py-2.5">
                            {renderCell(col.key, row[col.key])}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Footer pagination (for when there are many pages) */}
          {!isLoading && totalPages > 1 && (
            <div className="shrink-0 border-t border-slate-100 px-4 py-2.5 flex items-center justify-between bg-slate-50/60">
              <span className="text-xs text-slate-400">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of{" "}
                {filteredData.length.toLocaleString()}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-slate-500 hover:text-slate-800"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 border-slate-200"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <span className="text-xs font-semibold text-slate-600 min-w-[60px] text-center">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 border-slate-200"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-slate-500 hover:text-slate-800"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}