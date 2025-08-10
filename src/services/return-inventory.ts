import { apiRequestWithAuth } from "@/utils/axios";


interface ReturnInventoryResponse {
  status: number;
  message: string;
  data: [];
}

interface GetReturnInventoryPayload {
  enterpriseId?: string;
}

export const getReturnInventories = async (
  payload: GetReturnInventoryPayload | undefined
): Promise<ReturnInventoryResponse | null> => {
  const response = await apiRequestWithAuth(
    "get",
    `/get-return-products`,
    {},
    payload
  );
  return response || null;
};
