import axios from "axios";
import Cookies from "js-cookie";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const handleError = (error: any) => {
  if (error.response) {
    console.error("Error Response:", error.response);

    switch (error.response.status) {
      case 400:
        return { message: "Bad Request. Please check your input." };
      case 401:
        Cookies.remove("token");
        window.location.href = "/login";
        return { message: "Unauthorized. Please log in again." };
      case 403:
        return { message: "Forbidden. You do not have permission." };
      case 404:
        return { message: "Resource not found." };
      case 500:
        return { message: "Server error. Please try again later." };
      default:
        return { message: "Something went wrong. Please try again." };
    }
  } else if (error.request) {
    return { message: "No response from server. Check your network." };
  } else {
    return { message: error.message || "Unexpected error occurred." };
  }
};

const axiosWithAuth = axios.create({
  baseURL,
  timeout: 50000,
});

axiosWithAuth.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosWithAuth.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("[API Error]", error.message);
    return Promise.reject(handleError(error));
  }
);

const axiosWithoutAuth = axios.create({
  baseURL,
  timeout: 50000,
});

axiosWithoutAuth.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(handleError(error))
);

// --------------------
// Exported API Helpers
// --------------------

export const apiRequestWithAuth = async (
  method: string,
  url: string,
  data?: object,
  params?: object
) => {
  const { data: responseData, status } = await axiosWithAuth({
    method,
    url,
    data,
    params,
  });

  if (status === 403) {
    Cookies.remove("token");
    window.location.href = "/login";
  }

  return responseData;
};

export const apiRequestWithoutAuth = async (
  method: string,
  url: string,
  data?: any
) => {
  const { data: responseData } = await axiosWithoutAuth({
    method,
    url,
    data,
  });
  return responseData;
};

export const downloadFileWithAuth = async (url: string, filename: string) => {
  try {
    const response = await axiosWithAuth.get(url, {
      responseType: "blob",
    });

    const blob = new Blob([response.data]);
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(link.href);

    return { status: 200, message: "File downloaded successfully." };
  } catch (error) {
    throw handleError(error);
  }
};

export { axiosWithAuth, axiosWithoutAuth };
export default axiosWithAuth;
