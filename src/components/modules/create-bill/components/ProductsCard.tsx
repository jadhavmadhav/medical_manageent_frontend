"use client";

import {
    Package,
    Trash2,
    Percent,
    IndianRupee,
    Tag,
    ShieldAlert,
    Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { AddProductRow } from "./AddProductRow";
import type { BillItem, DiscountType } from "../types";

const fmt = (n: number) => Number(n || 0).toFixed(2);

interface ProductsCardProps {
    items: BillItem[];
    onAdd: (item: Omit<BillItem, "_rowId">) => void;
    onRemove: (rowId: string) => void;
    onUpdateDiscount: (rowId: string, discount: number) => void;
    billDiscType: DiscountType;
    onBillDiscTypeChange: (v: DiscountType) => void;
    billDiscValue: number;
    onBillDiscValueChange: (v: number) => void;
    billDiscAmount: number;
    itemsSubtotal: number;
    grandTotal: number;
    enterpriseId:string
}

export function ProductsCard({
    items,
    onAdd,
    onRemove,
    onUpdateDiscount,
    billDiscType,
    onBillDiscTypeChange,
    billDiscValue,
    onBillDiscValueChange,
    billDiscAmount,
    itemsSubtotal,
    grandTotal,
    enterpriseId
}: ProductsCardProps) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-xs font-extrabold  text-muted-foreground flex items-center gap-1.5">
                    <Package size={13} />
                    Products
                </CardTitle>
            </CardHeader>
            <CardContent>
                <AddProductRow onAdd={onAdd} enterpriseId={enterpriseId}/>

                {items.length > 0 ? (
                    <>
                        {/* ── Items Table ─────────────────────────────────────── */}
                        <div className="mt-4 overflow-x-auto">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="bg-muted/60">
                                        {[
                                            "#",
                                            "Product",
                                            "Batch",
                                            "Unit",
                                            "Qty",
                                            "MRP",
                                            "Item Disc %",
                                            "Line Total",
                                            "",
                                        ].map((h) => (
                                            <th
                                                key={h}
                                                className="text-left px-3 py-2.5 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border whitespace-nowrap"
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, idx) => (
                                        <tr
                                            key={item._rowId}
                                            className="border-b border-muted hover:bg-muted/30 transition-colors"
                                        >
                                            <td className="px-3 py-3 text-xs text-muted-foreground w-7">
                                                {idx + 1}
                                            </td>

                                            <td className="px-3 py-3">
                                                <div className="flex items-center gap-2.5">
                                                    {/* <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center shrink-0">
                                                        <Package size={12} className="text-muted-foreground" />
                                                    </div> */}
                                                    <div>
                                                        <p className="font-semibold text-[13px] text-foreground leading-tight">
                                                            {item.name}
                                                        </p>
                                                        {/* <p className="text-[11px] text-muted-foreground">
                                                            {item._product.sku}
                                                        </p> */}
                                                    </div>
                                                    {item.schedule && (
                                                        <Badge
                                                            variant="outline"
                                                            className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] gap-0.5 px-1.5 py-0 h-5"
                                                        >
                                                            <ShieldAlert size={9} />
                                                            Sch-{item.schedule}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-3 py-3 text-xs text-muted-foreground">
                                                {item.batchNo}
                                            </td>
                                            <td className="px-3 py-3 text-xs">{item.unit.code}</td>
                                            <td className="px-3 py-3 text-sm font-medium">
                                                {item.quantity}
                                            </td>
                                            <td className="px-3 py-3 text-sm">
                                                ₹{fmt(item.sellingPrice)}
                                            </td>

                                            {/* Item-level discount */}
                                            <td className="px-3 py-3 w-36">
                                                <div className="flex items-center gap-2">
                                                    <div className="relative">
                                                        <Percent
                                                            size={11}
                                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                                                        />
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            max={100}
                                                            value={item.discount}
                                                            onChange={(e) =>
                                                                onUpdateDiscount(
                                                                    item._rowId,
                                                                    Number(e.target.value)
                                                                )
                                                            }
                                                            className="h-8 w-16 text-xs pr-6"
                                                        />
                                                    </div>
                                                    {item.discount > 0 && (
                                                        <span className="text-[10px] text-red-500 font-semibold whitespace-nowrap">
                                                            −₹
                                                            {fmt(
                                                                (item.sellingPrice *
                                                                    item.quantity *
                                                                    item.discount) /
                                                                100
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-3 py-3 font-bold text-foreground">
                                                ₹{fmt(item.total)}
                                            </td>

                                            <td className="px-3 py-3">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => onRemove(item._rowId)}
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* ── Totals Footer ─────────────────────────────────── */}
                        <div className="mt-0 pt-4 border-t border-muted flex justify-between items-start gap-6 flex-wrap">
                            {/* Bill-level discount */}
                            <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <Tag size={13} className="text-muted-foreground" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Bill Discount
                                    </span>
                                </div>
                                <p className="text-[11px] text-muted-foreground mb-2.5">
                                    Applied on subtotal after all item discounts
                                </p>
                                <div className="flex items-center gap-2.5 flex-wrap">
                                    <div className="flex rounded-lg overflow-hidden border border-border h-9">
                                        {(["percent", "flat"] as DiscountType[]).map((v) => (
                                            <button
                                                key={v}
                                                type="button"
                                                onClick={() => {
                                                    onBillDiscTypeChange(v);
                                                    onBillDiscValueChange(0);
                                                }}
                                                className={cn(
                                                    "px-3 text-xs font-semibold flex items-center gap-1 transition-colors",
                                                    billDiscType === v
                                                        ? "bg-foreground text-background"
                                                        : "bg-white text-muted-foreground hover:bg-muted/50"
                                                )}
                                            >
                                                {v === "percent" ? (
                                                    <Percent size={11} />
                                                ) : (
                                                    <IndianRupee size={11} />
                                                )}
                                                {v === "percent" ? "Percent" : "Flat"}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="relative">
                                        {billDiscType === "flat" ? (
                                            <IndianRupee
                                                size={12}
                                                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                                            />
                                        ) : (
                                            <Percent
                                                size={12}
                                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                                            />
                                        )}
                                        <Input
                                            type="number"
                                            min={0}
                                            max={billDiscType === "percent" ? 100 : itemsSubtotal}
                                            value={billDiscValue}
                                            onChange={(e) =>
                                                onBillDiscValueChange(Math.max(0, Number(e.target.value)))
                                            }
                                            placeholder="0"
                                            className={cn(
                                                "h-9 text-sm w-24",
                                                billDiscType === "flat" ? "pl-7" : "pr-7"
                                            )}
                                        />
                                    </div>

                                    {billDiscValue > 0 && (
                                        <span className="text-xs text-red-500 font-semibold flex items-center gap-1">
                                            <Tag size={11} />−₹{fmt(billDiscAmount)} off
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Mini summary */}
                            <div className="bg-muted/50 rounded-xl p-4 border border-border min-w-[220px]">
                                <div className="flex justify-between text-sm py-1">
                                    <span className="text-muted-foreground flex items-center gap-1.5">
                                        <IndianRupee size={12} />
                                        Items subtotal
                                    </span>
                                    <span className="font-semibold">₹{fmt(itemsSubtotal)}</span>
                                </div>
                                {billDiscAmount > 0 && (
                                    <div className="flex justify-between text-sm py-1 text-red-500">
                                        <span className="flex items-center gap-1.5">
                                            <Tag size={12} />
                                            Bill discount
                                        </span>
                                        <span className="font-semibold">
                                            −₹{fmt(billDiscAmount)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm py-1 text-muted-foreground">
                                    <span className="flex items-center gap-1.5">
                                        <Percent size={12} />
                                        Tax
                                    </span>
                                    <span>₹0.00</span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between items-center">
                                    <span className="font-extrabold text-sm flex items-center gap-1.5">
                                        <Receipt size={14} />
                                        Grand Total
                                    </span>
                                    <span className="font-black text-lg text-foreground">
                                        ₹{fmt(grandTotal)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center py-10 text-muted-foreground gap-2">
                        {/* <Package size={40} className="text-muted-foreground/30" /> */}
                        <p className="text-sm">Search and add products to the bill</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}