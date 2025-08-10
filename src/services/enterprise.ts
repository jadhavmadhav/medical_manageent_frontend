import { apiRequestWithAuth } from "@/utils/axios";

export const getEnterprise = async (id: string): Promise<any> => {
  try {
    const request = await apiRequestWithAuth(
      "get",
      "/enterprise-details",
      {},
      { id }
    );
    return request.data || null;
  } catch (error) {
    console.error("Failed to fetch enterprise:", error);
    throw error;
  }
};
