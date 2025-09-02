"use client";
import axios from "axios";
import React, { type ReactNode, useContext, useState, createContext } from "react";
import { API_URL } from "../settings/constant";
import { handleAxiosError } from "../utils/errorHandlers";
import axiosInstanceUser from "../config/axiosConfig";

interface RentalContextType {
    getRentalByUser: (userId: string) => Promise<{ data: any[], status: number }>;
    getPurchaseByUser: (userId: string) => Promise<{ data: any[], status: number }>;
    getPaymentsByUserTenant: (userId: string) => Promise<{ data: any[], status: number }>;
    getExpensesByUser: (userId: string) => Promise<{ data: any[], status: number }>;
}

export const RentalStore = createContext<RentalContextType>({
    getRentalByUser: async () => ({ data: [], status: 500 }),
    getPurchaseByUser: async () => ({ data: [], status: 500 }),
    getPaymentsByUserTenant: async () => ({ data: [], status: 500 }),
    getExpensesByUser: async () => ({ data: [], status: 500 }),
});

export const useRentalStore = (): RentalContextType => useContext(RentalStore);

export const RentalProvider = ({ children }: { children: ReactNode }) => {

    // Récupérer toutes les propriétés
    const getRentalByUser = async (userId: string): Promise<{ data: any[], status: number }> => {
        try {
            const response = await axios.get(`${API_URL}rental/user/${userId}`);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: [], status: handleAxiosError(error) };
        }
    };

    const getPurchaseByUser = async (userId: string): Promise<{ data: any[], status: number }> => {
        try {
            const response = await axios.get(`${API_URL}purchase/user/${userId}`);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: [], status: handleAxiosError(error) };
        }
    };

    const getPaymentsByUserTenant = async (userId: string): Promise<{ data: any[], status: number }> => {
        try {
            const response = await axios.get(`${API_URL}payments/tenant/${userId}`);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: [], status: handleAxiosError(error) };
        }
    };

    const getExpensesByUser = async (userId: string): Promise<{ data: any[], status: number }> => {
        try {
            const response = await axios.get(`${API_URL}payments/expenses/${userId}`);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: [], status: handleAxiosError(error) };
        }
    };

    const data = { 
        getRentalByUser,
        getPurchaseByUser,
        getPaymentsByUserTenant,
        getExpensesByUser
    };
    return <RentalStore.Provider value={data}>{children}</RentalStore.Provider>;
};