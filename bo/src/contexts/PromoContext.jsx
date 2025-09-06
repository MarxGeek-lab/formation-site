"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/configs/api";
import { handleAxiosError } from "@/utils/errorHandlers";
import { useAuthStore } from "@/contexts/AuthContext";

const PromoContext = createContext({
  promoCodes: [],
  fetchPromoCodes: async () => {},
  createPromoCode: async () => {},
  updatePromoCode: async () => {},
  deletePromoCode: async () => {},
});

export const usePromoCodeStore = () => useContext(PromoContext);

export const PromoCodeProvider = ({ children }) => {
  const [promoCodes, setPromoCodes] = useState([]);

  const fetchPromoCodes = async () => {
    try {
      const res = await api.get(`promoCodes`);
      setPromoCodes(res.data);
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const getPromoCodeById = async (promoCodeId) => {
    try {
      const res = await api.get(`/promoCodes/details/${promoCodeId}`);
      return res.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  };

  const createPromoCode = async (promoCodeData) => {
    try {
      const res = await api.post("/promoCodes/create", promoCodeData);
      fetchPromoCodes();
      return res.status;
    } catch (error) {
      return handleAxiosError(error);
    }
  };

  const updatePromoCode = async (promoCodeId, formData) => {
    try {
      const res = await api.put(`/promoCodes/update/${promoCodeId}`, formData);
      fetchPromoCodes();
      return res.status;
    } catch (error) {
      return handleAxiosError(error);
    }
  };

  const deletePromoCode = async (code) => {
    try {
      const res = await api.post(`/promoCodes/delete`, { code });
      fetchPromoCodes();
      return res.status;
    } catch (error) {
      return handleAxiosError(error);
    }
  };

  return (
    <PromoContext.Provider value={{
      promoCodes,
      fetchPromoCodes,
      getPromoCodeById,
      createPromoCode,
      updatePromoCode,
      deletePromoCode,
    }}>
      {children}
    </PromoContext.Provider>
  );
};
