import { ReturnBillItemsPayload } from "@/types/patien-bills";
import { apiRequestWithAuth } from "@/utils/axios";

interface GetSalesResponse {
  status: number;
  message: string;
  result: [];
}

export const getPatientBills = async (payload: {
  enterpriseId: string;
}): Promise<GetSalesResponse | null> => {
  const response = await apiRequestWithAuth(
    "get",
    "/get-patient-bills",
    {},
    payload
  );
  return response || null;
};

export const returnBillItems = async (payload: ReturnBillItemsPayload) => {
  const response = await apiRequestWithAuth("post", "/return-items", payload);
  return response || null;
};

export const getInvoiceDetails = async (billNo: string) => {
  const response = await apiRequestWithAuth("get", `/getInvoice/${billNo}`);
  return response || null;
};
