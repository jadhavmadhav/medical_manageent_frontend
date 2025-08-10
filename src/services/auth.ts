import { apiRequestWithoutAuth } from "../utils/axios";
import Cookies from "js-cookie";
export interface LoginCredentials {
  mobile_number: string;
  password: string;
}

interface LoginResponse {
  token?: string;
  message?: string;
  status?: any;
  isConfigured?: boolean;
  user?: {
    id?: string;
    name: string;
    email: string;
  };
  enterprise?: {
    _id: string;
    name: string;
    address: string;
  };
}

export const userLogin = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const response = await apiRequestWithoutAuth("post", "/login", credentials);
  const enterprise = response?.enterprise || {};
  const isConfigured = response?.isConfigured || false;
  Cookies.set("enterpriseDetails", { ...enterprise, isConfigured });
  Cookies.set("enterpriseId", enterprise._id);
  return response;
};
