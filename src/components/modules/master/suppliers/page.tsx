"use client";

import { getVendors } from "@/services/master";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Truck, Phone, MapPin, Calendar, Building2, Hash, Mail } from "lucide-react";

import { format, parseISO, isValid } from "date-fns";
import { DataTable } from "@/components/ui/data-table";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Vendor {
    _id: string;
    enterpriseId: string;
    name: string;
    companyName: string;
    mobileNumber: string;
    email: string;
    gstNumber: string;
    address: string;
    country: string;
    status?: string;
    createdAt: string;
}

interface ApiResponse {
    status: number;
    message: string;
    data: Vendor[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalRecords: number;
        limit: number;
    };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (val: string) => {
    if (!val) return "—";
    const d = parseISO(val);
    return isValid(d) ? format(d, "dd MMM yyyy") : "—";
};

// ─── Column Definitions ───────────────────────────────────────────────────────

const columns: ColumnDef<Vendor>[] = [
    {
        id: "index",
        header: "#",
        size: 48,
        cell: ({ table, row }) => {
            const { pagination } = (table.options.meta as any) ?? {};
            const globalIndex = pagination
                ? (pagination.page - 1) * pagination.limit + row.index + 1
                : row.index + 1;
            return (
                <span className="text-xs font-medium tabular-nums pl-1">
                    {globalIndex}
                </span>
            );
        },
    },
    {
        accessorKey: "name",
        header: "Supplier Name",
        size: 180,
        cell: ({ getValue }) => (
            <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">
                    {getValue<string>()}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "companyName",
        header: "Company",
        size: 180,
        cell: ({ getValue }) => (
            <div className="flex items-center gap-1.5">
                <span className="text-xs truncate max-w-[160px]" title={getValue<string>()}>
                    {getValue<string>() || "—"}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "mobileNumber",
        header: "Mobile",
        cell: ({ getValue }) => (
            <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs ">
                    {getValue<string>() || "—"}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ getValue }) => {
            const val = getValue<string>();
            return val ? (
                <div className="flex items-center gap-1.5">
                    <span className="text-xs truncate max-w-[160px]" title={val}>
                        {val}
                    </span>
                </div>
            ) : (
                <span className="text-xs ">—</span>
            );
        },
    },
    {
        accessorKey: "gstNumber",
        header: "GST No.",
        cell: ({ getValue }) => {
            const val = getValue<string>();
            return val ? (
                <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs">{val}</span>
                </div>
            ) : (
                <span className="text-xs">—</span>
            );
        },
    },
    {
        accessorKey: "address",
        header: "Address",
        cell: ({ getValue }) => {
            const val = getValue<string>();
            return val ? (
                <div className="flex items-center gap-1.5">
                    <span className="text-xs  truncate max-w-[160px]" title={val}>
                        {val}
                    </span>
                </div>
            ) : (
                <span className="text-xs ">—</span>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Added On",
        cell: ({ getValue }) => (
            <div className="flex items-center gap-1.5">
                <span className="text-xs tabular-nums whitespace-nowrap">
                    {formatDate(getValue<string>())}
                </span>
            </div>
        ),
    },
];

// ─── Component ────────────────────────────────────────────────────────────────

const DEFAULT_LIMIT = 10;

export const SuppliersView = ({ enterpriseId }: { enterpriseId: string }) => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(DEFAULT_LIMIT);

    const { data: response, isPending } = useQuery<ApiResponse>({
        queryKey: ["all-vendors", page, limit],
        queryFn: () => getVendors({ page, limit }),

        placeholderData: (prev) => prev,
    });

    const vendors = response?.data ?? [];
    const pagination = response?.pagination;
    const totalPages = pagination?.totalPages ?? 1;
    const totalRecords = pagination?.totalRecords ?? 0;

    return (
        <div className="flex flex-col min-h-full bg-background">

            {/* Header */}
            <div className=" px-6 py-4 ">
                <div>
                    <h1 className="text-lg font-bold">Suppliers</h1>
                    <p className="text-xs text-muted-foreground ">Vendor &amp; supplier directory</p>
                </div>

            </div>

            {/* Main */}
            <div className="flex-1 mx-auto w-full p-4 sm:p-6">
                <DataTable
                    columns={columns}
                    data={vendors}
                    isLoading={isPending}
                    skeletonRows={limit}
                    emptyMessage="No suppliers found."
                    meta={{ pagination: { page, limit } }}
                    pagination={{
                        page,
                        totalPages,
                        totalRecords,
                        limit,
                        onPageChange: setPage,
                        onLimitChange: (newLimit) => {
                            setLimit(newLimit);
                            setPage(1);
                        },
                        pageSizeOptions: [10, 20, 50],
                    }}
                />
            </div>
        </div>
    );
};

export default SuppliersView;