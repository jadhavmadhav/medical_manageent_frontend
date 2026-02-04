export interface ReturnBillItemPayload {
  _id: string;
  availableQuantity: number;
  batchNo: string;
  billId: string;
  billNumber: string;
  buyingDate: string;
  buyingPrice: number;
  cgst: string;
  discount: number;
  enterpriseId: string;
  expiryDate: string;
  gstPercent: number;
  item: string;
  locker: string;
  quantity: number;
  sellingPrice: number;
  sgst: string;
  status: string;
  total: number;
  vendorId: string;
}

export type ReturnBillItemsPayload = ReturnBillItemPayload[];




// types.ts
export interface PatientBillItem {
  name: string;
  isReturn?: boolean;
}

export interface PatientBill {
  _id: string;
  id: string;
  invoiceNo?: string;
  patient?: {
    patientName?: string;
    patientMobileNumber?: string;
  };
  doctor?: {
    doctorName?: string;
  };
  items: PatientBillItem[];
  date: string;
  totalAmount: number;
  discountAmount?: number;
  status: string;
  paymentMethod?: string;
}

export interface PatientBillsResponse {
  result: PatientBill[];
}

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}
