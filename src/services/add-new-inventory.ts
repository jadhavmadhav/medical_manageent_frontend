import { GetProductListForPurchasePayload } from "@/types/purchase";
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




export const getProductListForPurchase = async (params: GetProductListForPurchasePayload) => {
  try {
    const response = await apiRequestWithAuth("get", "/product-master-list", {}, params)
    return response || null;
  } catch (error) {
    console.error("Error in getProductListForPurchase:", error);
    throw error;
  }
}