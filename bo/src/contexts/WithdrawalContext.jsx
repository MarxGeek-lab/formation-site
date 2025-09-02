'use client';
import { createContext, useContext } from "react";
import api from "@/configs/api";
import { handleAxiosError } from "@/utils/errorHandlers";
import axios from 'axios';
import { API_URL } from "@/settings";


const WithdrawalStore = createContext({
    fetchWithdrawals: async () => ({ data: [], status: 500 }),
    getWithdrawalById: async () => ({ data: null, status: 500 }),
    updateWithdrawalAmount: async () => 500,
});

export const useWithdrawalStore = () => useContext(WithdrawalStore);

export const WithdrawalProvider = ({ children }) => {
    const fetchWithdrawals = async () => {
        try {
          const response = await api.get("admin/withdrawals"); // Remplacez par votre endpoint
          return { data: response.data, status: response.status };
        } catch (err) {
          return { data: [], status: handleAxiosError(err) || 500 }
        } 
    };

    const getWithdrawalById = async (id) => {
      try {
        const response = await api.get(`withdrawal/${id}`); // Remplacez par votre endpoint
        return { data: response.data, status: response.status };
      } catch (err) {
        return { data: null, status: handleAxiosError(err) || 500 }
      } 
    };

    const updateWithdrawalAmount = async (id, formData) => {
        try {
          const response = await api.put(`admin/withdrawal/update-status/${id}`, formData); // Remplacez par votre endpoint
          return response.status;
        } catch (err) {
          return handleAxiosError(err) || 500;
        } 
    };

   
    const data = {
        fetchWithdrawals,
        updateWithdrawalAmount,
        getWithdrawalById
    };

    return (
        <WithdrawalStore.Provider value={data}>
            {children}
        </WithdrawalStore.Provider>
    );
};
