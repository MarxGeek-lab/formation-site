'use client';
import axios from "axios";
import { createContext, useContext, useState } from "react";
import api from "@/configs/api";
import { handleAxiosError } from "@/utils/errorHandlers";

const CustomerStore = createContext({
    getCustomersByOwner: async () => ({ data: [], status: 500 }),
    getCustomersById: async () => ({ data: null, status: 500 }),
    getCustomersLocation: async () => ({ data: [], status: 500 }),
});

export const useCustomerStore = () => useContext(CustomerStore);

export const CustomerProvider = ({ children }) => {
    
    const getCustomersByOwner = async (userId) => {
        try {
            const response = await api.get(`customers/owner`);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: [], status: handleAxiosError(error) };
        }
    };

    const getCustomersById = async (customerId) => {
        try {
            const response = await api.get(`customers/${customerId}`);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: null, status: handleAxiosError(error) };
        }
    };

    const getCustomersLocation = async (customerId, ownerId) => {
        try {
            const response = await api.get(`customers/data/${customerId}/${ownerId}`);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: null, status: handleAxiosError(error) };
        }
    };

    const data = {
        getCustomersByOwner,
        getCustomersById,
        getCustomersLocation
    };

    return (
        <CustomerStore.Provider value={data}>
            {children}
        </CustomerStore.Provider>
    );
};
