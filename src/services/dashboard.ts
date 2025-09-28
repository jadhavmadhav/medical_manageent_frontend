import { statsOverviewPayload } from "@/types/dashboard";
import { apiRequestWithAuth } from "@/utils/axios";

export const statsOverview = async (payload: statsOverviewPayload) => {
  try {
    console.log("payload", payload);
    const response = await apiRequestWithAuth("get", "/stats", {}, payload);
    return response;
  } catch (error) {
    return null;
  }
};

export const expiringProduct = async (payload: any) => {
  try {
    const response = await apiRequestWithAuth(
      "get",
      "/inventory/expiring",
      {},
      payload
    );
    return response || null;
  } catch (error) {
    return null;
  }
};

export const topSellingProduct = async (payload: any) => {
  try {
    const response = await apiRequestWithAuth(
      "get",
      "/sales/top-products",
      {},
      payload
    );
    return response || null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const paymentPendingOfPatient = async (payload: any) => {
  try {
    const response = await apiRequestWithAuth(
      "get",
      "/patient-pending",
      {},
      payload
    );
    return response || null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const paymentPendingOfPurchase = async (payload: any) => {
  try {
    const response = await apiRequestWithAuth(
      "get",
      "/purchase-bills-pending",
      {},
      payload
    );
    return response || null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const salesPerformance = async (payload: any) => {
  try {
    const response = await apiRequestWithAuth(
      "get",
      "/sales-for-chart",
      {},
      payload
    );
    return response || null;
  } catch (error) {
    return null;
  }
};

export const profitTrend = async (payload: any) => {
  try {
    const response = await apiRequestWithAuth(
      "get",
      "/profit-trend",
      {},
      payload
    );
    return response || null;
  } catch (error) {
    console.log(error);
  }
};
