// app/reports/page.tsx

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
} from "lucide-react";
import * as XLSX from "xlsx";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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

// --- Utilities (Static/Stable) ---

// Create formatter once to avoid instantiation cost per cell
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
  // If it's already a Date object, use it; otherwise parse
  const d = val instanceof Date ? val : parseISO(String(val));
  return isValid(d) ? format(d, "dd MMM yyyy") : "-";
};

// --- Component ---

export default function ReportsView() {
  const { enterprise } = useEnterprise();

  // State
  const [selectedReport, setSelectedReport] = useState<string>("");
  const [data, setData] = useState<ReportData[]>([]);
  const [dateRange, setDateRange] = useState<{ from: ""; to: "" }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50;

  // Refs for AbortController
  const abortControllerRef = useRef<AbortController | null>(null);

  // Derived Configuration
  const tableConfig = enterprise?.reportConfigurations || [];

  // Initialize Report Selection
  useEffect(() => {
    if (tableConfig.length > 0 && !selectedReport) {
      setSelectedReport(tableConfig[0].key);
    }
  }, [tableConfig, selectedReport]);

  const currentConfig = useMemo(
    () => tableConfig.find((c) => c.key === selectedReport),
    [tableConfig, selectedReport]
  );

  // Active Columns (Memoized)
  const columns = useMemo(() => {
    if (!currentConfig?.configColumns) return [];
    return currentConfig.configColumns
      .filter((col) => col.value === true)
      .sort((a: any, b: any) => a.position - b.position);
  }, [currentConfig]);

  // --- Fetch Logic ---

  const fetchData = useCallback(async () => {
    if (!enterprise?.enterpriseId || !selectedReport) return;

    // 1. Cancel previous pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    // Reset page on new fetch
    setCurrentPage(1);

    try {
      const payload: FetchPayload = {
        type: selectedReport,
        enterpriseId: enterprise.enterpriseId,
      };

      if (dateRange?.from)
        payload.startDate = format(dateRange.from, "yyyy/MM/dd");
      if (dateRange?.to) payload.endDate = format(dateRange.to, "yyyy/MM/dd");

      // Pass signal if your getReports service supports it (optional but recommended)
      const res = await getReports(payload);

      if (!controller.signal.aborted) {
        setData(res?.Reports || []);
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Failed to fetch reports:", err);
        setData([]);
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [selectedReport, enterprise?.enterpriseId, dateRange]);

  // Trigger fetch on filter change
  useEffect(() => {
    fetchData();
    return () => {
      // Cleanup on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  // --- Export Logic ---

  const exportToExcel = async () => {
    if (data.length === 0) return;
    setIsExporting(true);

    try {
      // Use a timeout to allow the UI to show the loading spinner before the heavy sync operation
      await new Promise((resolve) => setTimeout(resolve, 100));

      const exportRows = data.map((row) => {
        const cleanRow: Record<string, any> = {};
        columns.forEach((col) => {
          cleanRow[col.label] = row[col.key];
        });
        return cleanRow;
      });

      const ws = XLSX.utils.json_to_sheet(exportRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        wb,
        ws,
        currentConfig?.reportLabel || "Sheet1"
      );

      const fileName = `${currentConfig?.reportLabel || "Report"}_${format(
        new Date(),
        "dd-MMM-yyyy"
      )}.xlsx`;

      XLSX.writeFile(wb, fileName);
    } catch (e) {
      console.error("Export failed", e);
    } finally {
      setIsExporting(false);
    }
  };

  // --- Rendering Helpers ---

  // Pagination Logic
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return data.slice(start, start + ITEMS_PER_PAGE);
  }, [data, currentPage]);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const renderCell = useCallback((key: string, value: any) => {
    const lowerKey = key.toLowerCase();

    // Performance: Check explicit types first before string matching
    if (typeof value === "number") {
      if (
        [
          "price",
          "amount",
          "profit",
          "cost",
          "total",
          "revenue",
          "balance",
        ].some((k) => lowerKey.includes(k)) &&
        !lowerKey.includes("id")
      ) {
        return (
          <span className="font-mono text-right block">
            {formatCurrency(value)}
          </span>
        );
      }
    }

    if (lowerKey.includes("date") || lowerKey.includes("at")) {
      return (
        <span className="text-muted-foreground whitespace-nowrap">
          {formatDate(value)}
        </span>
      );
    }

    // Handle Money Strings that might come from API
    if (
      typeof value === "string" &&
      ["price", "amount", "profit"].some((k) => lowerKey.includes(k)) &&
      !lowerKey.includes("id")
    ) {
      return (
        <span className="font-mono text-right block">
          {formatCurrency(value)}
        </span>
      );
    }

    return (
      <span className="truncate block max-w-[250px]" title={String(value)}>
        {value ?? "-"}
      </span>
    );
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] space-y-4 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Reports Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Real-time data analysis and exports
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={exportToExcel}
          disabled={isExporting || isLoading || data.length === 0}
        >
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
          )}
          Export Excel
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-muted/60 shadow-sm shrink-0">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-4 space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase">
                Report Type
              </Label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select a report" />
                </SelectTrigger>
                <SelectContent>
                  {tableConfig.map((c) => (
                    <SelectItem key={c.key} value={c.key}>
                      {c.reportLabel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-4 space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase">
                Date Range
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal h-9 ${
                      !dateRange ? "text-muted-foreground" : ""
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange?.to ? (
                        `${format(dateRange.from, "dd MMM")} - ${format(
                          dateRange.to,
                          "dd MMM, yy"
                        )}`
                      ) : (
                        format(dateRange?.from, "dd MMM yyyy")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from as any}
                    selected={dateRange as any}
                    onSelect={setDateRange as any}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="md:col-span-4 flex items-end gap-2">
              <div className="hidden md:block flex-1 text-xs text-muted-foreground text-center pb-2">
                {columns.length} columns active
              </div>
              <Button
                onClick={fetchData}
                disabled={isLoading}
                className="flex-1 bg-teal-600 hover:bg-teal-700 h-9"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Refresh"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Area */}
      <Card className="flex-1 flex flex-col border-muted/60 shadow-md overflow-hidden min-h-0">
        <CardHeader className="py-3 px-4 border-b bg-muted/5 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold">
                {currentConfig?.reportLabel || "Data"}
              </CardTitle>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {data.length} records
              </span>
            </div>

            {/* Pagination Controls */}
            {data.length > ITEMS_PER_PAGE && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs text-muted-foreground w-16 text-center">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : data.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8">
              <AlertCircle className="h-8 w-8 mb-2 opacity-50" />
              <p>No records found for this period.</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-white shadow-sm">
                <TableRow>
                  {columns.map((col) => (
                    <TableHead
                      key={col.key}
                      className="whitespace-nowrap bg-gray-50/90 backdrop-blur font-semibold text-gray-700 h-10"
                    >
                      {col.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((row, i) => (
                  <TableRow key={i} className="hover:bg-muted/30">
                    {columns.map((col) => (
                      <TableCell
                        key={`${i}-${col.key}`}
                        className="py-2 text-sm"
                      >
                        {renderCell(col.key, row[col.key])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  );
}
