export interface createDoctorPayload {
  enterpriseId: string;
  name: string;
  specialization?: string;
  mobile_number: string;
  email?: string;
  hospital?: string;
  address: string;
}

export interface createDoctorResponse {
  message: string;
  doctor: Doctor;
}

export interface Doctor {
  enterpriseId: string;
  name: string;
  specialization: string;
  mobile_number: string;
  email: string;
  hospital: string;
  address: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface updateDoctorPayload {
  _id: string;
  enterpriseId: string;
  name: string;
  specialization: string;
  mobile_number: string;
  email: string;
  hospital: string;
  address: string;
}

export interface updateDoctorResponse {
  message: string;
  status: number;
  doctor: Doctor;
}

export interface searchDoctorPayload {
  enterpriseId: string;
  search?: string;
}

export interface Patient {
  id: number;
  _id: string;
  name: string;
  phone: string;
  address?: string;
  age: number;
  gender: string;
  mobile_number: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  contact: string;
}

export interface Product {
  _id: string;
  item: string;
  cgst: string;
  sgst: string;
  buyingPrice: number;
  sellingPrice: number;
  status: string;
  expiryDate: string;
  vendorId: string;
  billNumber: string;
  gstPercent: number;
  buyingDate: string;
  availableQuantity: number;
  schedule?: string;
  locker?: string;
  batchNo?: string;
  highlightedIndex?: any;
  manufacturer?: string;
}

export interface BillItem {
  // product: Product;
  quantity: number;
  discount: number;
  total: number;
}

export interface SaleData {
  enterpriseId: string;
  patient: Patient | null;
  doctor: Doctor | null;
  items: BillItem[];
  status: string;
  paymentMethod: string;
  subtotal: number;
  totalTax: number;
  grandTotal: number;
  billNumber?: string;
  date: any;
  dueDate?:Date | null;
}
