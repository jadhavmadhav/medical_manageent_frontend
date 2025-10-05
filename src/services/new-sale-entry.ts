import {
  createDoctorPayload,
  createDoctorResponse,
  searchDoctorPayload,
  updateDoctorPayload,
  updateDoctorResponse,
} from "@/types/new-sale-entry";
import { apiRequestWithAuth } from "@/utils/axios";

export const getAllInventories = async (payload: { enterpriseId: string }) => {
  const response = await apiRequestWithAuth(
    "get",
    `/get-product-list/${payload?.enterpriseId}`
  );
  return response || null;
};

export const getDoctors = async (enterpriseId: string) => {
  try {
    const response = await apiRequestWithAuth(
      "get",
      `/doctors `,
      {},
      { enterpriseId }
    );
    return response || null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createDoctor = async (
  payload: createDoctorPayload
): Promise<createDoctorResponse | null> => {
  try {
    const response = await apiRequestWithAuth("post", `/doctors`, payload);
    return response || null;
  } catch (error) {
    return null;
  }
};

export const updateDoctor = async (
  payload: updateDoctorPayload
): Promise<updateDoctorResponse | null> => {
  const response = await apiRequestWithAuth("put", "/doctors", payload);
  return response || null;
};

export const deleteDoctor = async (id: string) => {
  try {
    const response = await apiRequestWithAuth("delete", `/doctors`, {}, { id });
    return response || null;
  } catch (error) {
    return null;
  }
};

export const searchDoctors = async (payload: searchDoctorPayload) => {
  try {
    const response = await apiRequestWithAuth(
      "post",
      `/search-doctors`,
      payload
    );
    return response || null;
  } catch (error) {
    return null;
  }
};

export const createPatient = async (payload: any) => {
  try {
    const response = await apiRequestWithAuth("post", "/customer", payload);
    return response || null;
  } catch (error) {
    return null;
  }
};

export const updatePatient = async (payload: any) => {
  try {
    const response = await apiRequestWithAuth(
      "put",
      `/updateCustomer`,
      payload
    );
    return response || null;
  } catch (error) {
    return null;
  }
};

export const searchPatients = async (payload: {
  enterpriseId: string;
  search?: string;
}) => {
  try {
    const response = await apiRequestWithAuth(
      "post",
      `/search-patients`,
      payload
    );
    return response || null;
  } catch (error) {
    return null;
  }
};

export const createNewBill = async (payload: any) => {
  try {
    const response = await apiRequestWithAuth(
      "post",
      "/create-new-bill",
      payload
    );
    return response || null;
  } catch (error) {
    return null;
  }
};

export const getBillById = async (billId: string) => {
  try {
    const response = await apiRequestWithAuth("get", `/getBillById/${billId}`);
    return response || null;
  } catch (error) {
    return null;
  }
};

export const UpdateBill = async (payload: any) => {
  try {
    const response = await apiRequestWithAuth("post", "/updateBill", payload);
    return response || null;
  } catch (error) {
    return null;
  }
};
