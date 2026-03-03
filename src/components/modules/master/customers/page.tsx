// "use client"

// import { getCustomersList } from "@/services/master"
// import { useQuery } from "@tanstack/react-query"
// import { useState } from "react";

// const DEFAULT_LIMIT = 10;
// export const CustomersView = ({ enterpriseId }: { enterpriseId: string }) => {

//     const [page, setPage] = useState(1);
//     const [limit, setLimit] = useState(DEFAULT_LIMIT);

//     const { data, isPending } = useQuery({
//         queryKey: ["getCustomers"],
//         queryFn: () => getCustomersList({ enterpriseId: enterpriseId!, page, limit }),
//         enabled: !!enterpriseId
//     })
//     return <div>CustomersView</div>
// }





"use client";

import { getCustomersList } from "@/services/master";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Users, Phone, MapPin, Calendar } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import { DataTable } from "@/components/ui/data-table";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Customer {
    _id: string;
    enterpriseId: string;
    patientName: string;
    patientMobileNumber: string;
    patientAddress: string;
    createdAt: string;
    updatedAt: string;
}

interface ApiResponse {
    status: string;
    data: Customer[];
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

const columns: ColumnDef<Customer>[] = [
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
                <span className="text-xs text-slate-300 font-medium tabular-nums pl-1">
                    {globalIndex}
                </span>
            );
        },
    },
    {
        accessorKey: "patientName",
        header: "Customer Name",
        size: 200,
        cell: ({ getValue }) => (
            <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">
                    {getValue<string>()}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "patientMobileNumber",
        header: "Mobile",
        cell: ({ getValue }) => (
            <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs">
                    {getValue<string>() || "—"}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "patientAddress",
        header: "Address",
        cell: ({ getValue }) => {
            const val = getValue<string>();
            return val ? (
                <div className="flex items-center gap-1.5">
                    <span className="text-xs max-w-[180px] truncate" title={val}>
                        {val}
                    </span>
                </div>
            ) : (
                <span className="text-xs">—</span>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Registered On",
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

export const CustomersView = ({ enterpriseId }: { enterpriseId: string }) => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(DEFAULT_LIMIT);

    const { data: response, isPending } = useQuery<ApiResponse>({
        queryKey: ["getCustomers", enterpriseId, page, limit],
        queryFn: () => getCustomersList({ enterpriseId, page, limit }),
        enabled: !!enterpriseId,
        placeholderData: (prev) => prev,
    });

    const customers = response?.data ?? [];
    const pagination = response?.pagination;
    const totalPages = pagination?.totalPages ?? 1;
    const totalRecords = pagination?.totalRecords ?? 0;

    return (
        <div className="flex flex-col min-h-full">

            {/* ── Header ───────────────────────────────────────────────────────── */}
            <div className="px-6 py-4">
                <h1 className="text-lg font-bold">Customers</h1>
                <p className="text-xs">Patient &amp; customer records</p>
            </div>


            {/* ── Main ─────────────────────────────────────────────────────────── */}
            <div className="flex-1 mx-auto w-full p-4 sm:p-6">
                <DataTable
                    columns={columns}
                    data={customers}
                    isLoading={isPending}
                    skeletonRows={limit}
                    emptyMessage="No customers found."
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

export default CustomersView;