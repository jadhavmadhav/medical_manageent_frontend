import { apiRequestWithAuth } from "@/utils/axios";

export const getInventoryItems = async ({
  enterpriseId,
}: {
  enterpriseId?: string;
}) => {
  const response = await apiRequestWithAuth(
    "get",
    `/get-all-products/${enterpriseId}`
  );
  return response || null;
};
