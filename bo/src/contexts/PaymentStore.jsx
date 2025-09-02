"use client";

import { createContext, useContext } from "react";
import { handleAxiosError } from "../utils/errorHandlers";
import api from "../configs/api";

const PaymentStore = createContext({
    SubmitPayment: async () => ({ data: null, status: 500 }),
    updatePaymentStatus: async () => ({ data: null, status: 500 }),
    getStatusPayment: async () => ({ data: null, status: 500 }),
});

export const usePaymentStore = () => useContext(PaymentStore);

export const PaymentProvider = ({ children }) => {
   
    // Créer une réservation
    const SubmitPayment = async (formData) => {
        try {
            const response = await api.post(`payments/create`, formData);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: null, status: handleAxiosError(error) };
        }
    };

    // Mettre à jour une réservation
    const updatePaymentStatus = async (id, formData) => {
        try {
            const response = await api.put(`payments/update-status/${id}`, formData);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: null, status: handleAxiosError(error) };
        }
    };

    const getStatusPayment = async (transactionId) => {
        try {
            const response = await api.get(`payments/status/${transactionId}`);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: null, status: handleAxiosError(error) };
        }
    };

  
    const data = {
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