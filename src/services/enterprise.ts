import { apiRequestWithAuth } from "@/utils/axios";
 import Cookies from "js-cookie";

export const getEnterprise = async (id: string): Promise<any> => {
  try {
    const request = await apiRequestWithAuth(
      "get",
      "/enterprise-details",
      {},
      { id }
    );

    if (request.status === 200) {
      // Stringify the entire response object
       Cookies.set("enterpriseDetails", JSON.stringify(request.data), {
        path: "/",
        secure: true,
      });
    }
    return request.data as any || null;
  } catch (error) {
    console.error("Failed to fetch enterprise:", error);
    throw error;
  }
};
