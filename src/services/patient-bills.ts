import { apiRequestWithAuth } from "@/utils/axios";

interface GetSalesResponse {
  status: number;
  message: string;
  result: [];
}

export const getPatientBills = async (payload: { enterpriseId: string }):Promise<GetSalesResponse | null> => {
  const response = await apiRequestWithAuth(
    "get",
    "/get-patient-bills",
    {},
    payload
  );
  return response || null;
};
