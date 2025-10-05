export interface ReturnBillItemPayload {
  _id: string;
  availableQuantity: number;
  batchNumber: string;
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
