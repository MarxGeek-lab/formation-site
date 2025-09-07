"use client"
import axios from "axios";
import { API_URL } from "../settings/constant";

const axiosInstanceUser = axios.create({
  baseURL: API_URL, // Mettez votre URL de backend
});

axiosInstanceUser.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      let token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(cookie => 
        cookie.trim().startsWith('accessToken=')
      );

      console.log("tokenCookie", tokenCookie)
  
      if (tokenCookie || token) {
        config.headers.Authorization = `Bearer ${tokenCookie || token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstanceUser;

