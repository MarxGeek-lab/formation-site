"use client";
import { createContext, type ReactNode, useContext, useState } from "react";
import { handleAxiosError } from "../utils/errorHandlers";
import axiosInstanceUser from "../config/axiosConfig";
import { API_URL } from "../settings/constant";

interface PaymentStore {
    getPaymentByUser: (userId: string) => Promise<{ data: any[], status: number }>;
    SubmitPayment: (formData: any) => Promise<{ data: any, status: number }>;
    updatePaymentStatus: (id: string, formData: any) => Promise<{ data: any, status: number }>;
    getStatusPayment: (formData: any) => Promise<{ data: any, status: number }>;
}

const PaymentStore = createContext<PaymentStore>({
    getPaymentByUser: async () => ({ data: [], status: 500 }),
    SubmitPayment: async () => ({ data: null, status: 500 }),
    updatePaymentStatus: async () => ({ data: null, status: 500 }),
    getStatusPayment: async () => ({ data: null, status: 500 }),
});

export const usePaymentStore = () => useContext(PaymentStore);

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
    
    // Récupérer toutes les réservation
    const getPaymentByUser = async (userId: string): Promise<{ data: any[], status: number }> => {
        try {   
            const response = await axiosInstanceUser.get(`${API_URL}payments/tenant/${userId}`);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: [], status: handleAxiosError(error) };
        }
    };

   
    // Créer une réservation
    const SubmitPayment = async (formData: any): Promise<{ data: any, status: number }> => {
        try {
            const response = await axiosInstanceUser.post(`${API_URL}payments/create`, formData);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: null, status: handleAxiosError(error) };
        }
    };

    // Mettre à jour une réservation
    const updatePaymentStatus = async (id: string, formData: any): Promise<{ data: any, status: number }> => {
        try {
            const response = await axiosInstanceUser.put(`${API_URL}payments/update-status/${id}`, formData);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: null, status: handleAxiosError(error) };
        }
    };

    const getStatusPayment = async (formData: any): Promise<{ data: any, status: number }> => {
        try {
            const response = await axiosInstanceUser.put(`${API_URL}payments/status`, formData);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: null, status: handleAxiosError(error) };
        }
    };

  
    const data = {
        getPaymentByUser,
        SubmitPayment,
        updatePaymentStatus,
        getStatusPayment
    };

    return (
        <PaymentStore.Provider value={data}>
            {children}
        </PaymentStore.Provider>
    );
}