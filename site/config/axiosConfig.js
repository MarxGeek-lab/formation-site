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
  
      if (tokenCookie || token) {
        const value = tokenCookie ? tokenCookie.split("=")[1] : token;
        config.headers.Authorization = `Bearer ${value}`;
      }
      
      // ✅ Ajouter le affiliate_ref dans les headers
      const affiliateCookie = cookies.find((c) =>
        c.trim().startsWith("affiliate_ref=")
      );
      if (affiliateCookie) {
        config.headers["X-Affiliate-Ref"] = affiliateCookie.split("=")[1];
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstanceUser;

