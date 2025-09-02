import type { AxiosError } from "axios";
import { HOME_SCREEN } from "../settings/constant";

export const handleAxiosError = (error: unknown): number => {
  const axiosError = error as AxiosError;
  console.error(axiosError);
  if (axiosError?.response?.status === 401) {
    localStorage.removeItem("accessToken")
    // window.location.href = HOME_SCREEN;
  }
  return axiosError?.response?.status || 500;
}; 