"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { handleAxiosError } from "@/utils/errorHandlers";
import axios from "axios";
import { API_URL } from "@/settings/constant";

const PromoContext = createContext({
  applyPromoCode: async (formData) => ({data: null, status: 500}),
});

export const usePromoCodeStore = () => useContext(PromoContext);

export const PromoCodeProvider = ({ children }) => {
  const applyPromoCode = async (formData) => {
    try {
      const res = await axios.post(`${API_URL}promoCodes/apply`, formData);
      return {data: res.data, status: res.status}
    } catch (error) {
      return {data: null, status: handleAxiosError(error)}
    }
  };

  return (
    <PromoContext.Provider value={{
      applyPromoCode,
    }}>
      {children}
    </PromoContext.Provider>
  );
};
