import { apiRequestWithAuth } from "@/utils/axios";

export const getPurchaseBills = async (payload: {
  enterpriseId: string;
  startDate: string;
  endDate: string;
  page: string;
  limit: string;
}) => {
  try {
    const response = await apiRequestWithAuth(
      "get",
      "getPurchaseBills",
      {},
      payload
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};



