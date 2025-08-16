import { apiRequestWithAuth } from "@/utils/axios";

export const PurchaseNewProduct = async (data: any) => {
  try {
    const response = apiRequestWithAuth("post", "/createPurchaseBill", data);
    return response || null;
  } catch (error) {
    console.error("Error in PurchaseNewProduct:", error);
    throw error;
  }
};
