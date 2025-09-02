'use client';
import { createContext, useContext } from "react";
import api from "@/configs/api";
import { handleAxiosError } from "@/utils/errorHandlers";
import axios from 'axios';
import { API_URL } from "@/settings";


const WalletStore = createContext({
    fetchWallet: async () => ({ data: null, status: 500 }),
    getWithdrawalById: async () => ({ data: null, status: 500 }),
    createWallet: async () => 500,
    updateWallet: async () => 500,
    deleteWallet: async () => 500,
});

export const useWalletStore = () => useContext(WalletStore);

export const WalletProvider = ({ children }) => {
    const fetchWallet = async (id) => {
        try {
          const response = await api.get(`withdrawal/owner/${id}`); // Remplacez par votre endpoint
          return { data: response.data, status: response.status };
        } catch (err) {
          return { data: null, status: handleAxiosError(err) || 500 }
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

    const createWallet = async (formData) => {
        try {
          const response = await api.post(`withdrawal`, formData); // Remplacez par votre endpoint
          return response.status;
        } catch (err) {
          return handleAxiosError(err) || 500;
        } 
    };

    const updateWallet = async (id, formData) => {
        try {
          const response = await api.patch(`withdrawal/${id}`, formData); // Remplacez par votre endpoint
          return response.status;
        } catch (err) {
          return handleAxiosError(err) || 500;
        } 
    };

    const deleteWallet = async (id) => {
        try {
          const response = await api.delete(`wallets/${id}`); // Remplacez par votre endpoint
          return response.status;
        } catch (err) {
          return handleAxiosError(err) || 500;
        } 
    };

   
    const data = {
        fetchWallet,
        createWallet,
        updateWallet,
        deleteWallet,
        getWithdrawalById
    };

    return (
        <WalletStore.Provider value={data}>
            {children}
        </WalletStore.Provider>
    );
};
