import { apiRequestWithAuth } from "@/utils/axios";

interface getReportPayload {
  type: string;
  startDate?: string;
  endDate?: string;
  enterpriseId: string;

  selectedCategories?: {
    paymentStatus?: string;
    paymentMethod?: string;
    schedule?: string;
  };
}

export const getReports = async (payload: getReportPayload) => {
  try {
    const response = await apiRequestWithAuth(
      "post",
      `/get-sales-reports`,
      payload
    );
    return response || null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
