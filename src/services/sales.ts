import { apiRequestWithAuth } from "@/utils/axios";

export interface GetSalesPayload {
  id?: string;
}

interface GetSalesResponse {
  status: number;
  message: string;
  result: [];
}

export const getSales = async (
  payload: GetSalesPayload | undefined
): Promise<GetSalesResponse | null> => {
  const response = await apiRequestWithAuth(
    "get",
    `/getAllSalesOfUser`,
    {},
    payload
  );
  return response || null;
};
