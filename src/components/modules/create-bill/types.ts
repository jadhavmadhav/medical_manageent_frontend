// ─── Product & Inventory ──────────────────────────────────────────────────────

export interface ProductUnit {
  code: string;
  label?: string;
  baseUnit?: string;
  baseUnitSize?: number;
}

export interface ProductPricing {
  sellingPerPack: number;
  sellingPerBaseUnit: number;
  buyingPerPack?: number;
  buyingPerBaseUnit?: number;
}

export interface ProductStock {
  baseAvailable?: number;
  fullPacks: number;
  looseQty?: number;
  baseUnit?: string;
  status: "in_stock" | "low_stock" | "out_of_stock";
  reserved?: number;
}

export interface Product {
  inventoryId: string;
  _id: string;
  enterpriseId?: string;
  name: string;
  sku: string;
  category: string;
  dosageType: string;
  hsnCode?: string;
  allowLooseSale: boolean;
  manufacturer: string;
  brand: string;
  isActive?: boolean;
  batchNo: string;
  expiryDate: string;
  manufactureDate?: string | null;
  unit: ProductUnit;
  pricing: ProductPricing;
  stock: ProductStock;
  availableLabel?: string;
  maxQty?: string | number;
  schedule: string | null; // "H" | "H1" | "X" | null
}

// ─── Patient ──────────────────────────────────────────────────────────────────

export interface Patient {
  _id: string;
  enterpriseId?: string;
  patientName: string;
  patientMobileNumber: string;
  patientAddress: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePatientPayload {
  patientName: string;
  patientMobileNumber: string;
  patientAddress: string;
  enterpriseId: string;
}

// ─── Doctor ───────────────────────────────────────────────────────────────────

export interface Doctor {
  _id: string;
  enterpriseId?: string;
  doctorName: string;
  doctorMobileNumber: string;
  doctorSpecialization: string;
  doctorHospital: string;
  doctorAddress: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDoctorPayload {
  doctorName: string;
  doctorMobileNumber: string;
  doctorSpecialization: string;
  doctorHospital: string;
  doctorAddress: string;
  enterpriseId: string;
}

// ─── Bill ─────────────────────────────────────────────────────────────────────

export interface BillItem {
  /** Internal UI-only row identifier — stripped before submission */
  _rowId: string;
  inventoryId: string;
  productId: string;
  name: string;
  batchNo: string;
  sellingPrice: number;
  buyingPrice: number;
  quantity: number;
  discount: number;
  total: number;
  unit: ProductUnit;
  schedule: string | null;
  /** Full product reference — stripped before submission */
  _product: Product;
}

export type BillStatus = "paid" | "pending";
export type PaymentMethod = "CASH" | "UPI" | "CARD" | "BANK_TRANSFER" | "CHEQUE";
export type DiscountType = "percent" | "flat";

export interface BillDiscount {
  type: DiscountType;
  value: number;
  amount: number;
}

export interface CreateBillPayload {
  date: string;
  patient: Patient;
  doctor?: Doctor;
  status: BillStatus;
  paymentMethod: PaymentMethod | "-";
  dueDate?: string;
  items: Omit<BillItem, "_rowId" | "_product">[];
  subtotal: number;
  billDiscount: BillDiscount;
  totalTax: number;
  grandTotal: number;
  enterpriseId: string;
}

// ─── API Response wrapper ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
  status: number;
  message: string;
  result: T;
}