"use client"
import axios from "axios";
import { API_URL } from "../settings/constant";

const axiosInstanceUser = axios.create({
  baseURL: API_URL, // Mettez votre URL de backend
});

axiosInstanceUser.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const cookies = document.cookie.split("; ").reduce((acc, current) => {
        const [name, value] = current.split("=");
        acc[name] = value;
        return acc;
      }, {});
  
      const token = cookies["accessToken"];
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstanceUser;

