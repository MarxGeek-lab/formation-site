'use client';
import axios from "axios";
import { createContext, useContext, useState } from "react";
import api from "@/configs/api";
import { handleAxiosError } from "@/utils/errorHandlers";

const ReviewStore = createContext({
    getProductReviews: async () => ({ data: [], status: 500 }),
    getReviewById: async () => ({ data: null, status: 500 }),
    deleteReview: async () => ({ data: null, status: 500 }),
});

export const useReviewStore = () => useContext(ReviewStore);

export const ReviewProvider = ({ children }) => {
    
    const getProductReviews = async () => {
        try {
            const response = await api.get(`reviews/owner`);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: [], status: handleAxiosError(error) };
        }
    };

    const getReviewById = async (id) => {
        try {
            const response = await api.get(`reviews/${id}`);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: [], status: handleAxiosError(error) };
        }
    };

    const deleteReview = async (id) => {
        try {
            const response = await api.delete(`reviews/${id}`);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: [], status: handleAxiosError(error) };
        }
    };

    const data = {
        getProductReviews,
        getReviewById,
        deleteReview
    };

    return (
        <ReviewStore.Provider value={data}>
            {children}
        </ReviewStore.Provider>
    );
};
