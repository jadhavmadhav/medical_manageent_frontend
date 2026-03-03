 import { useState, useCallback, useMemo, useEffect } from "react";
import type {
  BillItem,
  BillStatus,
  PaymentMethod,
  DiscountType,
  Patient,
  Doctor,
  CreateBillPayload,
  FetchedBill,
  FetchedBillItem,
} from "../types";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

/**
 * Converts a FetchedBillItem (plain server shape, no _rowId / _product)
 * into a BillItem the UI expects.
 *
 * _product is reconstructed as a minimal stub using only the fields the table
 * actually reads (sku, expiryDate, stock.fullPacks). The AddProductRow search
 * always fetches fresh inventory so the stub never hits the API.
 */
function hydrateItem(item: FetchedBillItem): BillItem {
  return {
    ...item,
    _rowId: uid(),
    _product: {
      inventoryId: item.inventoryId,
      _id: item.productId,
      name: item.name,
      sku: "",
      category: "",
      dosageType: "",
      allowLooseSale: false,
      manufacturer: "",
      brand: "",
      batchNo: item.batchNo,
      expiryDate: "",
      unit: item.unit,
      pricing: {
        sellingPerPack: item.sellingPrice,
        sellingPerBaseUnit: item.sellingPrice,
        buyingPerPack: item.buyingPrice,
        buyingPerBaseUnit: item.buyingPrice,
      },
      stock: { fullPacks: 0, status: "in_stock" },
      schedule: item.schedule,
    },
  };
}

interface UseBillFormOptions {
  enterpriseId: string;
  /** Provide when editing — pre-populates all form state from the fetched bill */
  initialData?: FetchedBill;
}

export function useBillForm({ enterpriseId, initialData }: UseBillFormOptions) {
  const today = new Date().toISOString().slice(0, 10);

  // ── Bill meta ─────────────────────────────────────────────────────────────
  const [billDate, setBillDate] = useState(
    initialData ? initialData.date.slice(0, 10) : today
  );
  const [status, setStatus] = useState<BillStatus>(
    initialData?.status ?? "paid"
  );
  const [payMethod, setPayMethod] = useState<PaymentMethod>(
    (initialData?.paymentMethod as PaymentMethod) ?? "CASH"
  );
  const [dueDate, setDueDate] = useState(
    initialData?.dueDate ? initialData.dueDate.slice(0, 10) : ""
  );

  // ── Line items ────────────────────────────────────────────────────────────
  const [items, setItems] = useState<BillItem[]>(
    initialData ? initialData.items.map(hydrateItem) : []
  );

  // ── Bill-level discount ───────────────────────────────────────────────────
  const [billDiscType, setBillDiscType] = useState<DiscountType>(
    initialData?.billDiscount?.type ?? "percent"
  );
  const [billDiscValue, setBillDiscValue] = useState(
    initialData?.billDiscount?.value ?? 0
  );

  // ── People ────────────────────────────────────────────────────────────────
  const [patient, setPatient] = useState<Patient | null>(
    initialData?.patient ?? null
  );
  const [doctor, setDoctor] = useState<Doctor | null>(
    initialData?.doctor ?? null
  );

  // ── Hydrate when initialData arrives async (query resolves after mount) ──
  // useState above covers SSR / synchronous initialData.
  // useEffect covers the more common case: component mounts first, then
  // useGetBill resolves and passes data down — without this the form stays empty.
  useEffect(() => {
    if (!initialData) return;
    setBillDate(initialData.date.slice(0, 10));
    setStatus(initialData.status);
    setPayMethod((initialData.paymentMethod as PaymentMethod) ?? "CASH");
    setDueDate(initialData.dueDate ? initialData.dueDate.slice(0, 10) : "");
    setItems(initialData.items.map(hydrateItem));
    setBillDiscType(initialData.billDiscount?.type ?? "percent");
    setBillDiscValue(initialData.billDiscount?.value ?? 0);
    setPatient(initialData.patient ?? null);
    setDoctor(initialData.doctor ?? null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData?._id]); // key off _id — only re-hydrate when a different bill loads

  // ── Item operations ───────────────────────────────────────────────────────
  const addItem = useCallback((item: Omit<BillItem, "_rowId">) => {
    setItems((prev) => [...prev, { ...item, _rowId: uid() }]);
  }, []);

  const removeItem = useCallback((rowId: string) => {
    setItems((prev) => prev.filter((i) => i._rowId !== rowId));
  }, []);

  const updateItemDiscount = useCallback((rowId: string, discount: number) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i._rowId !== rowId) return i;
        const d = Math.min(100, Math.max(0, discount));
        return { ...i, discount: d, total: i.sellingPrice * i.quantity * (1 - d / 100) };
      })
    );
  }, []);

  // ── Derived totals ────────────────────────────────────────────────────────
  const itemsSubtotal = useMemo(
    () => items.reduce((s, i) => s + i.total, 0),
    [items]
  );

  const billDiscAmount = useMemo(() => {
    if (billDiscType === "percent") return itemsSubtotal * (billDiscValue / 100);
    return Math.min(billDiscValue, itemsSubtotal);
  }, [billDiscType, billDiscValue, itemsSubtotal]);

  const grandTotal = useMemo(
    () => Math.max(0, itemsSubtotal - billDiscAmount),
    [itemsSubtotal, billDiscAmount]
  );

  // ── Schedule-H guard ──────────────────────────────────────────────────────
  const requiresDoctor = useMemo(
    () => items.some((i) => ["H", "H1", "X"].includes(i.schedule ?? "")),
    [items]
  );

  // ── Payload builder ───────────────────────────────────────────────────────
  const buildPayload = useCallback((): CreateBillPayload | null => {
    if (!patient) return null;
    return {
      date: new Date(billDate).toISOString(),
      patient,
      doctor: doctor ?? undefined,
      status,
      paymentMethod: status === "pending" ? "-" : payMethod,
      dueDate: status === "pending" ? new Date(dueDate).toISOString() : undefined,
      items: items.map(({ _rowId, _product, ...rest }) => rest),
      subtotal: itemsSubtotal,
      billDiscount: { type: billDiscType, value: billDiscValue, amount: billDiscAmount },
      totalTax: 0,
      grandTotal,
      enterpriseId,
    };
  }, [
    patient, doctor, billDate, status, payMethod, dueDate,
    items, itemsSubtotal, billDiscType, billDiscValue, billDiscAmount,
    grandTotal, enterpriseId,
  ]);

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = useCallback((): string | null => {
    if (!patient) return "Patient is required.";
    if (requiresDoctor && !doctor) return "Doctor is required for Schedule-H drug(s).";
    if (!items.length) return "Add at least one product.";
    if (status === "pending" && !dueDate) return "Set a due date for pending bills.";
    return null;
  }, [patient, requiresDoctor, doctor, items, status, dueDate]);

  return {
    billDate, setBillDate,
    status, setStatus,
    payMethod, setPayMethod,
    dueDate, setDueDate,
    items, addItem, removeItem, updateItemDiscount,
    billDiscType, setBillDiscType,
    billDiscValue, setBillDiscValue,
    billDiscAmount,
    patient, setPatient,
    doctor, setDoctor,
    itemsSubtotal, grandTotal, requiresDoctor,
    buildPayload, validate,
  };
}