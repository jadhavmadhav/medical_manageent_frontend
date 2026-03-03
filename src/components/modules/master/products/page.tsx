// "use client";

// import { useState } from "react";
// import { getMasterProductList } from "@/services/master";
// import { useQuery } from "@tanstack/react-query";
// import {
//     Package2,
//     Pill,
//     ChevronLeft,
//     ChevronRight,
//     BadgeCheck,
//     XCircle,
//     Tag,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface DefaultUnit {
//     code: string;
//     baseUnit: string;
//     baseUnitSize: number;
// }

// interface Product {
//     _id: string;
//     name: string;
//     sku: string;
//     category: string;
//     dosageType: string;
//     defaultUnit: DefaultUnit;
//     hsnCode: string;
//     allowLooseSale: boolean;
//     manufacturer: string;
//     brand: string;
//     isActive: boolean;
//     createdAt: string;
//     updatedAt: string;
// }

// interface ApiResponse {
//     status: string;
//     data: Product[];
//     pagination: {
//         currentPage: number;
//         totalPages: number;
//         totalRecords: number;
//         limit: number;
//     };
// }

// // ─── Config ───────────────────────────────────────────────────────────────────

// const CATEGORY_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
//     OTC: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400" },
//     FMCG: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
//     NUTRACEUTICAL: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
//     AYURVEDIC: { bg: "bg-lime-50", text: "text-lime-700", dot: "bg-lime-400" },
//     BABY_CARE: { bg: "bg-pink-50", text: "text-pink-700", dot: "bg-pink-400" },
//     PERSONAL_CARE: { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-400" },
// };
// const getCategoryStyle = (cat: string) =>
//     CATEGORY_STYLES[cat] ?? { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" };



// const LIMIT = 10;

// // ─── Component ────────────────────────────────────────────────────────────────

// export const ProductView = () => {
//     const [page, setPage] = useState(1);

//     const { data: response, isLoading } = useQuery<ApiResponse>({
//         queryKey: ["productMasterList", page],
//         queryFn: () => getMasterProductList({ page, limit: LIMIT }),
//         placeholderData: (prev) => prev, // keep previous page data while fetching next
//     });

//     const products: Product[] = response?.data ?? [];
//     const pagination = response?.pagination;
//     const totalPages = pagination?.totalPages ?? 1;
//     const totalRecords = pagination?.totalRecords ?? 0;

//     const startRecord = (page - 1) * LIMIT + 1;
//     const endRecord = Math.min(page * LIMIT, totalRecords);

//     return (
//         <div className="flex flex-col min-h-full">

//             {/* ── Header ───────────────────────────────────────────────────────── */}

//             <div className="px-6 py-4">
//                 <h1 className="text-lg font-bold">Product Master</h1>
//                 <p className="text-sm text-muted-foreground ">Medicine &amp; product catalogue</p>
//             </div>


//             {/* ── Main ─────────────────────────────────────────────────────────── */}
//             <div className="max-w-screen-2xl mx-auto w-full flex flex-col gap-4 p-4 sm:p-6">
//                 <div className=" border rounded-xl shadow-sm overflow-hidden flex flex-col">

//                     {/* Table toolbar */}
//                     <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
//                         <div className="flex items-center gap-2">
//                             <span className="text-sm font-bold">Products</span>
//                             {!isLoading && (
//                                 <span className="text-xs font-semibold px-2 py-0.5 rounded-full">
//                                     {totalRecords} records
//                                 </span>
//                             )}
//                         </div>

//                         {/* Top pagination */}
//                         {totalPages > 1 && (
//                             <div className="flex items-center gap-1.5">
//                                 <Button
//                                     variant="outline"
//                                     size="icon"
//                                     className="h-7 w-7"
//                                     onClick={() => setPage((p) => Math.max(1, p - 1))}
//                                     disabled={page === 1 || isLoading}
//                                 >
//                                     <ChevronLeft className="h-3.5 w-3.5" />
//                                 </Button>
//                                 <span className="text-xs font-medium min-w-[52px] text-center">
//                                     {page} / {totalPages}
//                                 </span>
//                                 <Button
//                                     variant="outline"
//                                     size="icon"
//                                     className="h-7 w-7"
//                                     onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                                     disabled={page === totalPages || isLoading}
//                                 >
//                                     <ChevronRight className="h-3.5 w-3.5" />
//                                 </Button>
//                             </div>
//                         )}
//                     </div>

//                     {/* Table */}
//                     <div className="overflow-auto flex-1">
//                         <Table>
//                             <TableHeader className="sticky top-0 z-10">
//                                 <TableRow className=" border-b border-slate-200">
//                                     <TableHead className="w-10 pl-4 text-[10px] font-bold uppercase tracking-wider">#</TableHead>
//                                     <TableHead className="text-[11px] font-bold uppercase  min-w-[200px]">Product</TableHead>
//                                     <TableHead className="text-[11px] font-bold uppercase ">SKU</TableHead>
//                                     <TableHead className="text-[11px] font-bold uppercase ">Category</TableHead>
//                                     <TableHead className="text-[11px] font-bold uppercase ">Dosage</TableHead>
//                                     <TableHead className="text-[11px] font-bold uppercase ">Default Unit</TableHead>
//                                     <TableHead className="text-[11px] font-bold uppercase ">Manufacturer</TableHead>
//                                     <TableHead className="text-[11px] font-bold uppercase ">Brand</TableHead>
//                                     <TableHead className="text-[11px] font-bold uppercase ">HSN</TableHead>
//                                     <TableHead className="text-[11px] font-bold uppercase ">Loose Sale</TableHead>
//                                     <TableHead className="text-[11px] font-bold uppercase ">Status</TableHead>
//                                 </TableRow>
//                             </TableHeader>

//                             <TableBody>
//                                 {isLoading ? (
//                                     Array.from({ length: LIMIT }).map((_, i) => (
//                                         <TableRow key={i} className="border-b border-slate-100">
//                                             {Array.from({ length: 11 }).map((_, j) => (
//                                                 <TableCell key={j} className="py-3">
//                                                     <Skeleton className="h-4 w-full rounded" style={{ opacity: 1 - i * 0.07 }} />
//                                                 </TableCell>
//                                             ))}
//                                         </TableRow>
//                                     ))
//                                 ) : products.length === 0 ? (
//                                     <TableRow>
//                                         <TableCell colSpan={11} className="py-20 text-center">
//                                             <div className="flex flex-col items-center gap-3">
//                                                 <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center">
//                                                     <Package2 className="h-6 w-6 text-slate-300" />
//                                                 </div>
//                                                 <div>
//                                                     <p className="text-sm font-semibold text-slate-600">No products found</p>
//                                                     <p className="text-xs text-slate-400 mt-0.5">No records available</p>
//                                                 </div>
//                                             </div>
//                                         </TableCell>
//                                     </TableRow>
//                                 ) : (
//                                     products.map((product, i) => {
//                                         const catStyle = getCategoryStyle(product.category);
//                                         return (
//                                             <TableRow
//                                                 key={product._id}
//                                                 className={`border-b border-slate-100 last:border-0 transition-colors ${!product.isActive ? "opacity-55" : ""}`}
//                                             >
//                                                 {/* Row number (global, not just current page) */}
//                                                 <TableCell className="pl-4 text-xs font-medium tabular-nums">
//                                                     {startRecord + i}
//                                                 </TableCell>

//                                                 {/* Product name */}
//                                                 <TableCell className="py-3">
//                                                     <div className="flex items-center gap-2">
//                                                         <span className="text-sm font-semibold  leading-snug">
//                                                             {product.name}
//                                                         </span>
//                                                     </div>
//                                                 </TableCell>

//                                                 {/* SKU */}
//                                                 <TableCell>
//                                                     <span className="font-mono text-xs px-1.5 py-0.5 rounded">
//                                                         {product.sku}
//                                                     </span>
//                                                 </TableCell>

//                                                 {/* Category */}
//                                                 <TableCell>
//                                                     <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 uppercase`}>
//                                                         {/* <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${catStyle.dot}`} /> */}
//                                                         {product.category.replace(/_/g, " ")}
//                                                     </span>
//                                                 </TableCell>

//                                                 {/* Dosage */}
//                                                 <TableCell>
//                                                     <span className="text-xs capitalize">
//                                                         {product.dosageType.charAt(0) + product.dosageType.slice(1).toLowerCase()}
//                                                     </span>
//                                                 </TableCell>

//                                                 {/* Default Unit */}
//                                                 <TableCell>
//                                                     <div className="flex items-center gap-1.5">
//                                                         <span className="text-xs font-semibold">{product.defaultUnit.code}</span>
//                                                         <span className="text-[10px]">
//                                                             {product.defaultUnit.baseUnitSize} {product.defaultUnit.baseUnit}
//                                                         </span>
//                                                     </div>
//                                                 </TableCell>

//                                                 {/* Manufacturer */}
//                                                 <TableCell>
//                                                     <span className="text-xs">{product.manufacturer}</span>
//                                                 </TableCell>

//                                                 {/* Brand */}
//                                                 <TableCell>
//                                                     <span className="text-xs">{product.brand}</span>
//                                                 </TableCell>

//                                                 {/* HSN */}
//                                                 <TableCell>
//                                                     <span className="font-mono text-xs">{product.hsnCode}</span>
//                                                 </TableCell>

//                                                 {/* Loose Sale */}
//                                                 <TableCell>
//                                                     {product.allowLooseSale ? (
//                                                         <span className="inline-flex items-center gap-1 text-[10px] font-semibold">
//                                                             {/* <Tag className="h-3 w-3" /> */}
//                                                             Yes
//                                                         </span>
//                                                     ) : (
//                                                         <span className="text-xs text-slate-300">—</span>
//                                                     )}
//                                                 </TableCell>

//                                                 {/* Status */}
//                                                 <TableCell>
//                                                     {product.isActive ? (
//                                                         <span className="inline-flex items-center gap-1 text-[10px] font-semibold">
//                                                             {/* <BadgeCheck className="h-3 w-3" />  */}
//                                                             Active
//                                                         </span>
//                                                     ) : (
//                                                         <span className="inline-flex items-center gap-1 text-[10px] font-semibold">
//                                                             {/* <XCircle className="h-3 w-3" />  */}
//                                                             Inactive
//                                                         </span>
//                                                     )}
//                                                 </TableCell>
//                                             </TableRow>
//                                         );
//                                     })
//                                 )}
//                             </TableBody>
//                         </Table>
//                     </div>

//                     {/* Footer pagination */}
//                     {!isLoading && totalPages > 1 && (
//                         <div className="shrink-0 border-t border-slate-100 px-4 py-2.5 flex items-center justify-between bg-slate-50/60">
//                             <span className="text-xs text-slate-400">
//                                 Showing {startRecord}–{endRecord} of {totalRecords.toLocaleString()}
//                             </span>
//                             <div className="flex items-center gap-1">
//                                 <Button
//                                     variant="ghost"
//                                     size="sm"
//                                     className="h-7 px-2 text-xs text-slate-500"
//                                     onClick={() => setPage(1)}
//                                     disabled={page === 1 || isLoading}
//                                 >
//                                     First
//                                 </Button>
//                                 <Button
//                                     variant="outline"
//                                     size="icon"
//                                     className="h-7 w-7 border-slate-200"
//                                     onClick={() => setPage((p) => Math.max(1, p - 1))}
//                                     disabled={page === 1 || isLoading}
//                                 >
//                                     <ChevronLeft className="h-3.5 w-3.5" />
//                                 </Button>
//                                 <span className="text-xs font-semibold text-slate-600 min-w-[56px] text-center">
//                                     {page} / {totalPages}
//                                 </span>
//                                 <Button
//                                     variant="outline"
//                                     size="icon"
//                                     className="h-7 w-7 border-slate-200"
//                                     onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                                     disabled={page === totalPages || isLoading}
//                                 >
//                                     <ChevronRight className="h-3.5 w-3.5" />
//                                 </Button>
//                                 <Button
//                                     variant="ghost"
//                                     size="sm"
//                                     className="h-7 px-2 text-xs text-slate-500"
//                                     onClick={() => setPage(totalPages)}
//                                     disabled={page === totalPages || isLoading}
//                                 >
//                                     Last
//                                 </Button>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProductView;




"use client";

import { useState } from "react";
import { getMasterProductList } from "@/services/master";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Package2, Pill, BadgeCheck, XCircle, Tag } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DefaultUnit {
    code: string;
    baseUnit: string;
    baseUnitSize: number;
}

interface Product {
    _id: string;
    name: string;
    sku: string;
    category: string;
    dosageType: string;
    defaultUnit: DefaultUnit;
    hsnCode: string;
    allowLooseSale: boolean;
    manufacturer: string;
    brand: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface ApiResponse {
    status: string;
    data: Product[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalRecords: number;
        limit: number;
    };
}

// ─── Config ───────────────────────────────────────────────────────────────────

const CATEGORY_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
    OTC: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400" },
    FMCG: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
    NUTRACEUTICAL: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
    AYURVEDIC: { bg: "bg-lime-50", text: "text-lime-700", dot: "bg-lime-400" },
    BABY_CARE: { bg: "bg-pink-50", text: "text-pink-700", dot: "bg-pink-400" },
    PERSONAL_CARE: { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-400" },
};
 

// ─── Column Definitions ───────────────────────────────────────────────────────

const columns: ColumnDef<Product>[] = [
    {
        id: "index",
        header: "#",
        size: 48,
        cell: ({ table, row }) => {
            const { pagination } = table.options.meta as any;
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
        header: "Product",
        size: 220,
        cell: ({ row }) => (
            <span className="text-sm font-semibold leading-snug">
                {row.getValue("name")}
            </span>
        ),
    },
    {
        accessorKey: "sku",
        header: "SKU",
        cell: ({ getValue }) => (
            <span className="font-mono text-xs border">
                {getValue<string>()}
            </span>
        ),
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ getValue }) => {
            const cat = getValue<string>();
            return (
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase  `}>
                    {cat.replace(/_/g, " ")}
                </span>
            );
        },
    },
    {
        accessorKey: "dosageType",
        header: "Dosage",
        cell: ({ getValue }) => {
            const val = getValue<string>();
            return (
                <span className="text-xs capitalize">
                    {val.charAt(0) + val.slice(1).toLowerCase()}
                </span>
            );
        },
    },
    {
        accessorKey: "defaultUnit",
        header: "Default Unit",
        cell: ({ getValue }) => {
            const unit = getValue<DefaultUnit>();
            return (
                <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold ">{unit.code}</span>
                    <span className="text-[10px]">
                        {unit.baseUnitSize} {unit.baseUnit}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "manufacturer",
        header: "Manufacturer",
        cell: ({ getValue }) => (
            <span className="text-xs">{getValue<string>()}</span>
        ),
    },
    {
        accessorKey: "brand",
        header: "Brand",
        cell: ({ getValue }) => (
            <span className="text-xs">{getValue<string>()}</span>
        ),
    },
    {
        accessorKey: "hsnCode",
        header: "HSN",
        cell: ({ getValue }) => (
            <span className="font-mono text-xs">{getValue<string>()}</span>
        ),
    },
    {
        accessorKey: "allowLooseSale",
        header: "Loose Sale",
        cell: ({ getValue }) =>
            getValue<boolean>() ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold py-0.5">
                    Yes
                </span>
            ) : (
                <span className="text-xs">—</span>
            ),
    },
    {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ getValue }) =>
            getValue<boolean>() ? (
                <span className="inline-flex text-xs items-center gap-1 font-semibold">
                    Active
                </span>
            ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold">
                    Inactive
                </span>
            ),
    },
];

// ─── Component ────────────────────────────────────────────────────────────────

const DEFAULT_LIMIT = 10;

export const ProductView = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(DEFAULT_LIMIT);

    const { data: response, isLoading } = useQuery<ApiResponse>({
        queryKey: ["productMasterList", page, limit],
        queryFn: () => getMasterProductList({ page, limit }),
        placeholderData: (prev) => prev,
    });

    const products = response?.data ?? [];
    const pagination = response?.pagination;
    const totalPages = pagination?.totalPages ?? 1;
    const totalRecords = pagination?.totalRecords ?? 0;

    return (
        <div className="flex flex-col min-h-full relative ">

            {/* ── Header ───────────────────────────────────────────────────────── */}
            <div className=" px-6 py-4 ">
                <h1 className="text-lg font-bold ">Product Master</h1>
                <p className="text-xs text-muted-foreground">Medicine &amp; product catalogue</p>
            </div>



            {/* ── Main ─────────────────────────────────────────────────────────── */}
            <div className="flex-1 mx-auto w-full p-4 sm:p-6">
                <DataTable
                    columns={columns}
                    data={products}
                    isLoading={isLoading}
                    skeletonRows={limit}
                    emptyMessage="No products found."
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

export default ProductView;