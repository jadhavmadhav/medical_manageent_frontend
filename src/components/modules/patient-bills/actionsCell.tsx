// actions-cell.tsx
"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
    MoreHorizontal,
    Eye,
    Download,
    Edit,
    RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ViewBill } from "./components/view-bill";
import { DownloadInvoice } from "./components/download-invoice";
import { ReturnConfirmationDialog } from "../../return-bill-confirmation";

import { Product } from "@/types/new-sale-entry";
import { PatientBill } from "@/types/patien-bills";

export function ActionsCell({ bill }: { bill: any }) {
    const router = useRouter();

    /* -------------------- dropdown -------------------- */
    const [menuOpen, setMenuOpen] = useState(false);

    /* -------------------- modals -------------------- */
    const [viewOpen, setViewOpen] = useState(false);
    const [downloadOpen, setDownloadOpen] = useState(false);
    const [returnOpen, setReturnOpen] = useState(false);

    const isReturnBill = bill.items.every(
        (item: Product) => item.isReturn
    );

    /* -------------------- handlers -------------------- */
    const handleEdit = useCallback(() => {
        setMenuOpen(false);
        router.push(`/new-sale-entry?id=${bill._id}`);
    }, [router, bill._id]);

    return (
        <>
            {/* ==================== DROPDOWN ==================== */}
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-[180px]">
                    {/* View Bill */}
                    <DropdownMenuItem
                        onClick={() => {
                            setMenuOpen(false);
                            setViewOpen(true);
                        }}
                    >
                        <Eye className="mr-2 h-4 w-4" />
                        View Bill
                    </DropdownMenuItem>

                    {/* Download Invoice */}
                    <DropdownMenuItem
                        onClick={() => {
                            setMenuOpen(false);
                            setDownloadOpen(true);
                        }}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                    </DropdownMenuItem>

                    {/* Edit Bill */}
                    <DropdownMenuItem onClick={handleEdit}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Bill
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* Return Bill */}
                    <DropdownMenuItem
                        onClick={() => {
                            setMenuOpen(false);
                            setReturnOpen(true);
                        }}
                        disabled={isReturnBill}
                    >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        {isReturnBill ? "Returned" : "Return Bill"}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* ==================== MODALS (OUTSIDE) ==================== */}

            {/* View Bill Modal */}
            <ViewBill
                bill={bill}
                open={viewOpen}
                close={() => setViewOpen(false)} 
            />

            {/* Download Invoice Modal / Action */}
            <DownloadInvoice
                id={bill._id}
                open={downloadOpen}
                close={() => setDownloadOpen(false)}
            />

            {/* Return Bill Dialog */}
            <ReturnConfirmationDialog
                bill={bill}
                invalidateType="patientBills"
                open={returnOpen}
                close={() => setReturnOpen(false)}
            />
        </>
    );
}
