import {
  createNewVendorPayload,
  createNewVendorResponse,
} from "@/types/vendors";
import { apiRequestWithAuth } from "@/utils/axios";

export const getAllVendors = async (payload: { enterpriseId: string }) => {
  try {
    const response = await apiRequestWithAuth("get", "getVendors", {}, payload);
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createNewVendor = async (
  payload: createNewVendorPayload
): Promise<createNewVendorResponse | null> => {
  try {
    const response = await apiRequestWithAuth(
      "post",
      "createNewVendor",
      payload
    );
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};
