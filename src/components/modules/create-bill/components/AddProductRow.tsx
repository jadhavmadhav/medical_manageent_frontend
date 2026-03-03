//  "use client";

// import { useState, useCallback, useEffect, useRef } from "react";
// import { Plus, Package, Tag, IndianRupee, Percent, ShieldAlert, Info } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { cn } from "@/lib/utils";
// import { Combobox } from "./Combobox";
// import { useInventories } from "../hooks/useProducts";
// import type { BillItem, Product, ProductUnit } from "../types";

// const fmt = (n: number) => Number(n || 0).toFixed(2);
// const DEBOUNCE_MS = 300;

// type SelectedUnit = "pack" | "base";

// // ─── Derived values from product + selected unit ──────────────────────────────

// function getUnitDetails(product: Product, unit: SelectedUnit) {
//   if (unit === "base") {
//     return {
//       sellingPrice: product.pricing.sellingPerBaseUnit,
//       buyingPrice: product.pricing.buyingPerBaseUnit ?? 0,
//       // Unit object passed to the bill item
//       unitObj: {
//         code: product.unit.baseUnit ?? product.unit.code,
//         label: product.unit.baseUnit,
//         baseUnit: product.unit.baseUnit,
//         baseUnitSize: product.unit.baseUnitSize,
//       } satisfies ProductUnit,
//       // Display label in the select
//       label: product.unit.baseUnit ?? "Base unit",
//       // Max qty the user can add
//       maxQty: product.stock.looseQty ?? product.stock.baseAvailable ?? Infinity,
//       availableLabel: product.stock.looseQty != null
//         ? `${product.stock.looseQty} available`
//         : undefined,
//     };
//   }

//   // pack (purchase unit / default)
//   return {
//     sellingPrice: product.pricing.sellingPerPack,
//     buyingPrice: product.pricing.buyingPerPack ?? 0,
//     unitObj: product.unit,
//     label: product.unit.label ?? product.unit.code,
//     maxQty: product.stock.fullPacks,
//     availableLabel: `${product.stock.fullPacks} packs available`,
//   };
// }

// // ─────────────────────────────────────────────────────────────────────────────

// interface AddProductRowProps {
//   onAdd: (item: Omit<BillItem, "_rowId">) => void;
//   enterpriseId: string;
// }

// export function AddProductRow({ onAdd, enterpriseId }: AddProductRowProps) {
//   const [product, setProduct] = useState<Product | null>(null);
//   const [selectedUnit, setSelectedUnit] = useState<SelectedUnit>("pack");
//   const [qty, setQty] = useState(1);
//   const [disc, setDisc] = useState(0);
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const handleSearchChange = useCallback((query: string) => {
//     if (debounceTimer.current) clearTimeout(debounceTimer.current);
//     debounceTimer.current = setTimeout(() => setDebouncedSearch(query.trim()), DEBOUNCE_MS);
//   }, []);

//   useEffect(() => () => {
//     if (debounceTimer.current) clearTimeout(debounceTimer.current);
//   }, []);

//   const { data: inventories = [], isFetching } = useInventories({
//     enterpriseId,
//     search: debouncedSearch,
//   });

//   // ── Reset unit to "pack" whenever product changes ─────────────────────────
//   const handleProductChange = (p: Product | null) => {
//     setProduct(p);
//     setSelectedUnit("pack");
//     setQty(1);
//     setDisc(0);
//   };

//   // ── All derived values in one place ───────────────────────────────────────
//   const derived = product ? getUnitDetails(product, selectedUnit) : null;
//   const lineTotal = derived ? derived.sellingPrice * qty * (1 - disc / 100) : 0;

//   const reset = () => {
//     setProduct(null);
//     setDebouncedSearch("");
//     setSelectedUnit("pack");
//     setQty(1);
//     setDisc(0);
//   };

//   const handleAdd = () => {
//     if (!product || !derived || qty <= 0) return;
//     onAdd({
//       inventoryId: product.inventoryId,
//       productId: product._id,
//       name: product.name,
//       batchNo: product.batchNo,
//       sellingPrice: derived.sellingPrice,
//       buyingPrice: derived.buyingPrice,
//       quantity: qty,
//       discount: disc,
//       total: lineTotal,
//       unit: derived.unitObj,
//       schedule: product.schedule,
//       _product: product,
//     });
//     reset();
//   };

//   // ── Whether base unit option is available for this product ────────────────
//   const canSelectBase = !!product?.allowLooseSale && !!product.unit.baseUnit;

//   return (
//     <TooltipProvider delayDuration={300}>
//       <div className="flex flex-wrap gap-3 items-end p-3.5 bg-muted/50 rounded-xl border border-dashed border-border">

//         {/* ── Product search ───────────────────────────────────────── */}
//         <div className="flex-[0_0_220px]">
//           <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1 flex items-center gap-1">
//             <Package size={10} />
//             Product
//           </p>
//           <Combobox<Product>
//             items={inventories}
//             displayKey="name"
//             value={product}
//             onChange={handleProductChange}
//             onSearchChange={handleSearchChange}
//             isLoading={isFetching}
//             placeholder="Search product, SKU, batch…"
//             renderItem={(item) => (
//               <div>
//                 <div className="flex items-center gap-2 font-semibold text-xs text-foreground">
//                   {item.name}
//                   {item.schedule && (
//                     <span className="inline-flex items-center gap-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
//                       <ShieldAlert size={9} />
//                       Sch-{item.schedule}
//                     </span>
//                   )}
//                 </div>
//                 <p className="text-[11px] text-muted-foreground mt-0.5">
//                   Batch: {item.batchNo} · Exp: {item.expiryDate.slice(0, 7)} · {item.stock.fullPacks} pks · {item.stock.looseQty ?? 0} loose
//                 </p>
//               </div>
//             )}
//           />
//         </div>

//         {/* ── Unit select ──────────────────────────────────────────── */}
//         <div className="flex-[0_0_130px]">
//           <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
//             <Tag size={10} />
//             Unit
//             {/* Show pack size hint when base is selected */}
//             {product?.unit.baseUnitSize && selectedUnit === "pack" && (
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Info size={10} className="text-muted-foreground cursor-help" />
//                 </TooltipTrigger>
//                 <TooltipContent side="top" className="text-xs">
//                   1 {product.unit.label ?? product.unit.code} = {product.unit.baseUnitSize} {product.unit.baseUnit}
//                 </TooltipContent>
//               </Tooltip>
//             )}
//           </p>
//           <Select
//             value={selectedUnit}
//             onValueChange={(v) => {
//               setSelectedUnit(v as SelectedUnit);
//               setQty(1); // reset qty when unit changes to avoid over-stock
//             }}
//             disabled={!product}
//           >
//             <SelectTrigger className="h-9 text-sm">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               {/* Purchase / pack unit — always shown when a product is selected */}
//               {product && (
//                 <SelectItem value="pack">
//                   <span className="flex flex-col leading-tight">
//                     <span className="font-semibold">{product.unit.label ?? product.unit.code}</span>
//                     <span className="text-[10px] text-muted-foreground">
//                       ₹{fmt(product.pricing.sellingPerPack)} · {product.stock.fullPacks} avail
//                     </span>
//                   </span>
//                 </SelectItem>
//               )}
//               {/* Base unit — only shown when allowLooseSale is true */}
//               {canSelectBase && (
//                 <SelectItem value="base">
//                   <span className="flex flex-col leading-tight">
//                     <span className="font-semibold">{product!.unit.baseUnit}</span>
//                     <span className="text-[10px] text-muted-foreground">
//                       ₹{fmt(product!.pricing.sellingPerBaseUnit)} · {product!.stock.looseQty ?? 0} avail
//                     </span>
//                   </span>
//                 </SelectItem>
//               )}
//             </SelectContent>
//           </Select>
//         </div>

//         {/* ── Qty ─────────────────────────────────────────────────── */}
//         <div className="flex-[0_0_88px]">
//           <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 flex items-center justify-between">
//             <span>Qty</span>
//             {derived?.availableLabel && (
//               <span className={cn(
//                 "text-[9px] font-semibold",
//                 qty > (derived.maxQty ?? Infinity) ? "text-red-500" : "text-muted-foreground/70"
//               )}>
//                 {derived.availableLabel}
//               </span>
//             )}
//           </p>
//           <Input
//             type="number"
//             min={1}
//             max={derived?.maxQty}
//             value={qty}
//             onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
//             disabled={!product}
//             className={cn(
//               "h-9 text-sm",
//               derived && qty > (derived.maxQty ?? Infinity) && "border-red-400 focus-visible:ring-red-300"
//             )}
//           />
//         </div>

//         {/* ── Selling price (read-only, reflects selected unit) ────── */}
//         <div className="flex-[0_0_110px]">
//           <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-0.5">
//             <IndianRupee size={10} />
//             Rate / {derived?.label ?? "Unit"}
//           </p>
//           <div className="relative">
//             <Input
//               value={derived ? fmt(derived.sellingPrice) : ""}
//               readOnly
//               className="h-9 text-sm bg-muted text-muted-foreground pr-2"
//             />
//             {/* Sub-label showing which price field is active */}
//             {product && (
//               <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground/60 pointer-events-none">
//                 {selectedUnit === "pack" ? "pack" : "base"}
//               </span>
//             )}
//           </div>
//         </div>

//         {/* ── Discount ─────────────────────────────────────────────── */}
//         <div className="flex-[0_0_80px]">
//           <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-0.5">
//             <Percent size={10} />
//             Disc %
//           </p>
//           <Input
//             type="number"
//             min={0}
//             max={100}
//             value={disc}
//             onChange={(e) => setDisc(Math.min(100, Math.max(0, Number(e.target.value))))}
//             disabled={!product}
//             className="h-9 text-sm"
//           />
//         </div>

//         {/* ── Line total ───────────────────────────────────────────── */}
//         <div className="flex-[0_0_100px]">
//           <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Line Total</p>
//           <div className={cn(
//             "h-9 flex items-center px-3 rounded-md border text-sm font-bold",
//             product
//               ? "bg-green-50 border-green-200 text-green-700"
//               : "bg-muted text-muted-foreground border-border"
//           )}>
//             {product ? `₹${fmt(lineTotal)}` : "—"}
//           </div>
//         </div>

//         <Button
//           onClick={handleAdd}
//           disabled={!product || !derived || qty > (derived.maxQty ?? Infinity)}
//           className="h-9 shrink-0 self-end gap-1.5"
//         >
//           <Plus size={15} />
//           Add
//         </Button>
//       </div>
//     </TooltipProvider>
//   );
// }















"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Plus, Package, Tag, IndianRupee, Percent, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Combobox } from "./Combobox";
import { useInventories } from "../hooks/useProducts";
import type { BillItem, Product } from "../types";

const fmt = (n: number) => Number(n || 0).toFixed(2);
const DEBOUNCE_MS = 300;

interface AddProductRowProps {
  onAdd: (item: Omit<BillItem, "_rowId">) => void;
  // ✅ Fix: received from parent — no local env var fallback
  enterpriseId: string;
}

export function AddProductRow({ onAdd, enterpriseId }: AddProductRowProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [useBase, setUseBase] = useState(false);
  // String so the field can be fully cleared while typing; validated on blur / submit
  const [qty, setQty] = useState("");
  const [disc, setDisc] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = useCallback((query: string) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(query.trim());
    }, DEBOUNCE_MS);
  }, []);

  useEffect(() => () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
  }, []);

  const { data: inventories = [], isFetching } = useInventories({
    // ✅ Fix: uses prop value, not stale ENTERPRISE_ID env var
    enterpriseId,
    search: debouncedSearch,
  });

  // ✅ Fix: console.log removed

  const price = product
    ? useBase ? product.pricing.sellingPerBaseUnit : product.pricing.sellingPerPack
    : 0;

  const buyPrice = product
    ? useBase ? (product.pricing.buyingPerBaseUnit ?? 0) : (product.pricing.buyingPerPack ?? 0)
    : 0;

  const qtyNum = Math.max(0, parseFloat(qty) || 0);
  const discNum = Math.min(100, Math.max(0, parseFloat(disc) || 0));
  const lineTotal = price * qtyNum * (1 - discNum / 100);

  const reset = () => {
    setProduct(null);
    setDebouncedSearch("");
    setUseBase(false);
    setQty("");
    setDisc("");
  };

  const handleAdd = () => {
    if (!product || qtyNum <= 0) return;
    onAdd({
      inventoryId: product.inventoryId,
      productId: product._id,
      name: product.name,
      batchNo: product.batchNo,
      sellingPrice: price,
      buyingPrice: buyPrice,
      quantity: qtyNum,
      discount: discNum,
      total: lineTotal,
      unit: useBase
        ? { ...product.unit, code: product.unit.baseUnit ?? product.unit.code, label: product.unit.baseUnit }
        : product.unit,
      schedule: product.schedule,
      _product: product,
    });
    reset();
  };

  return (
    <div className="flex flex-wrap gap-3 items-end p-3.5 bg-muted/50 rounded-xl border border-dashed border-border">
      {/* Product search */}
      <div className="flex-[0_0_220px]">
        <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1 flex items-center gap-1">
          <Package size={10} />
          Product
        </p>
        <Combobox<Product>
          items={inventories}
          displayKey="name"
          value={product}
          onChange={(p) => {
            setProduct(p);
            setUseBase(false);
            setQty("1")
          }}
          onSearchChange={handleSearchChange}
          isLoading={isFetching}
          placeholder="Search product, SKU, batch…"
          renderItem={(item) => (
            <div>
              <div className="flex items-center gap-2 font-semibold text-xs text-foreground">
                {item.name}
                {item.schedule && (
                  <span className="inline-flex items-center gap-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    <ShieldAlert size={9} />
                    Sch-{item.schedule}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Batch: {item.batchNo} · Exp: {item.expiryDate.slice(0, 7)} · {item.stock.fullPacks} packs
              </p>
            </div>
          )}
        />
      </div>

      {/* Unit */}
      <div className="flex-[0_0_105px]">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
          <Tag size={10} />
          Unit
        </p>
        <Select
          value={useBase ? "base" : "pack"}
          onValueChange={(v) => setUseBase(v === "base")}
          disabled={!product}

        >
          <SelectTrigger className="h-9 text-sm min-w-[100px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {product && <SelectItem value="pack">{product.unit.label ?? product.unit.code}</SelectItem>}
            {product?.allowLooseSale && product.unit.baseUnit && (
              <SelectItem value="base">{product.unit.baseUnit}</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Qty */}
      <div className="flex-[0_0_72px]">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Qty  {product?.availableLabel && (
          <span className={cn(
            "text-[9px] font-semibold",
            qty > (product.maxQty ?? Infinity) ? "text-red-500" : "text-muted-foreground/70"
          )}>
            {product.availableLabel}
          </span>
        )}</p>
        <Input
          inputMode="numeric"
          placeholder="Qty"
          value={qty}
          disabled={!product}
          className="h-9 min-w-[100px] text-sm"
          onChange={(e) => {
            // Allow only whole digits
            const v = e.target.value.replace(/[^0-9]/g, "");
            setQty(v);
          }}
          onBlur={() => {
            const n = parseInt(qty, 10);
            // Clamp to minimum 1 on blur if empty or zero
            if (!qty || isNaN(n) || n < 1) setQty("1");
          }}
        />
      </div>

      {/* MRP */}
      <div className="flex-[0_0_90px]">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-0.5">
          <IndianRupee size={10} />MRP
        </p>
        <Input value={product ? fmt(price) : ""} readOnly className="h-9 min-w-[100px] text-sm bg-muted text-muted-foreground" />
      </div>

      {/* Disc */}
      <div className="flex-[0_0_80px]">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-0.5">
          <Percent size={10} />Disc
        </p>
        <Input
          inputMode="decimal"
          placeholder="0"
          value={disc}
          disabled={!product}
          className="h-9 min-w-[100px] text-sm"
          onChange={(e) => {
            // Allow digits and at most one decimal point
            const v = e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
            setDisc(v);
          }}
          onBlur={() => {
            const n = parseFloat(disc);
            if (!disc || isNaN(n)) { setDisc(""); return; }
            // Clamp 0–100
            setDisc(String(Math.min(100, Math.max(0, n))));
          }}
        />
      </div>

      {/* Line total */}
      <div className="flex-[0_0_95px]">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Line Total</p>
        <div className={cn(
          "h-9 min-w-[100px] flex items-center px-3 rounded-md border text-sm font-bold",
          product && qtyNum > 0 ? "bg-green-50 border-green-200 text-green-700" : "bg-muted text-muted-foreground border-border"
        )}>
          {product && qtyNum > 0 ? `₹${fmt(lineTotal)}` : "—"}
        </div>
      </div>

      <Button onClick={handleAdd} disabled={!product || qtyNum <= 0} className="h-9 shrink-0 self-end gap-1.5">
        <Plus size={15} />Add
      </Button>
    </div>
  );
}