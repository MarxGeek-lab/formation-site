'use client';
import React, { createContext, useContext, useState } from "react";
import { handleAxiosError } from "../utils/errorHandlers";
import api from "@/configs/api";

export const StatsStore = createContext({
    stats: null,
    mostSoldProducts: null,
    getStatsByOwner: async () => ({ data: null, status: 500 }),
    getBalanceByOwner: async () => ({ data: null, status: 500 }),
    getMostSoldProducts: async () => ({ data: null, status: 500 }),
});

export const useStatsStore = () => useContext(StatsStore);

export const StatsProvider = ({ children }) => {
    const [stats, setStats] = useState(null);
    const [mostSoldProducts, setMostSoldProducts] = useState(null);

    const getStatsByOwner = async () => {
        try {
            const response = await api.get(`stats/owner`);
            setStats(response.data);
            return { data: response.data, status: response.status };
        } catch (error) {
            console.log(error)
            return { data: null, status: handleAxiosError(error) };
        }
    };

    const getBalanceByOwner = async (userId) => {
        try {
            const response = await api.get(`stats/balance/owner/${userId}`);
            return { data: response.data, status: response.status };
        } catch (error) {
            console.log(error)
            return { data: null, status: handleAxiosError(error) };
        }
    };

    const getMostSoldProducts = async (limit = 10) => {
        try {
            const response = await api.get(`stats/most-sold-products?limit=${limit}`);
            setMostSoldProducts(response.data);
            return { data: response.data, status: response.status };
        } catch (error) {
            console.log(error)
            return { data: null, status: handleAxiosError(error) };
        }
    };

    
    const data = { 
        stats,
        mostSoldProducts,
        getStatsByOwner,
        getBalanceByOwner,
        getMostSoldProducts
    };

    return <StatsStore.Provider value={data}>{children}</StatsStore.Provider>;
};
