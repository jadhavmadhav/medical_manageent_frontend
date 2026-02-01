// types.ts — single source of truth
export interface Sale {
  id: string;
  name: string;
  item: string;
  status: string;
  invoiceNo?: string;
  discount?: number;
  quantity: number;
  sellingPrice: number;
  createdAt: string;
  mobile_number: string;
  patientName?: string;
  patientMobileNumber?: string;
  doctorName?: string;
  buyingPrice?: number;
  buyingDate?: string;
  schedule?: string;
  cost?: number;
  profit?: number;
  unit?: { baseUnit: string };
}

export interface SalesResponse {
  result: Sale[];
}