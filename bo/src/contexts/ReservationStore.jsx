'use client';
import axios from "axios";
import { createContext, useContext, useState } from "react";
import api from "@/configs/api";
import { handleAxiosError } from "@/utils/errorHandlers";

const ReservationStore = createContext({
    getAllReservations: async () => ({ data: [], status: 500 }),
    getReservationsByUser: async () => ({ data: [], status: 500 }),
    getReservationsByOwner: async () => ({ data: [], status: 500 }),
    getReservationsByProperty: async () => ({ data: [], status: 500 }),
    getReservationsById: async () => ({ data: null, status: 500 }),
    getReservation: async () => ({ data: null, status: 500 }),
    createReservation: async () => ({ data: null, status: 500 }),
    updateReservation: async () => ({ data: null, status: 500 }),
    deleteReservation: async () => ({ data: null, status: 500 }),
    cancelReservation: async () => ({ data: null, status: 500 }),
    replyToClient: async () => ({ data: null, status: 500 }),
    cancelReservation: async () => ({ data: null, status: 500 }),   
    generateReservationTicket: async () => ({ data: null, status: 500 }),
    reminderReservation: async () => ({ data: null, status: 500 }),
});

export const useReservationStore = () => useContext(ReservationStore);

export const ReservationProvider = ({ children }) => {
    
   /*  const getAllReservations = async () => {
        try {   
            const response = await axios.get(`${API_URL}reservations`);
            setReservations(response.data);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: [], status: handleAxiosError(error) };
        }
    };

    const getReservationsByUser = async (userId) => {
        try {
            const response = await axios.get(`${API_URL}reservations/user/${userId}`);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: [], status: handleAxiosError(error) };
        }
    }; */

    const getReservationsByOwner = async (userId) => {
        try {
            const response = await api.get(`reservations/owner/${userId}`);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: [], status: handleAxiosError(error) };
        }
    };

    const getReservationsById = async (id) => {
        try {
            const response = await api.get(`reservations/${id}`);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: null, status: handleAxiosError(error) };
        }
    };

    const replyToClient = async (id, formData) => {
        try {
            const response = await api.put(`reservations/${id}/reply`, formData);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: null, status: handleAxiosError(error) };
        }
    };

    const cancelReservation = async (id, formData) => {
        try {
            const response = await api.put(`reservations/${id}/cancel`, formData);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: null, status: handleAxiosError(error) };
        }
    };

    const reminderReservation = async (id) => {
        try {
            const response = await api.get(`reservations/${id}/reminder`);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: null, status: handleAxiosError(error) };
        }
    };

    const updateReservation = async (id, reservation) => {
        try {
            const response = await api.put(`reservations/${id}`, reservation);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: null, status: handleAxiosError(error) };
        }
    };

    const generateReservationTicket = async (id) => {
        try {
            const response = await api.get(`reservations/${id}/generate-ticket`);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: null, status: handleAxiosError(error) };
        }
    }
/* 
    const getReservationsByProperty = async (propertyId) => {
        try {
            const response = await axios.get(`${API_URL}reservations/property/${propertyId}`);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: [], status: handleAxiosError(error) };
        }
    };

    const getReservation = async (id) => {
        try {
            const response = await axios.get(`${API_URL}reservations/${id}`);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: null, status: handleAxiosError(error) };
        }
    };

    const createReservation = async (reservation) => {
        try {
            const response = await axios.post(`${API_URL}reservations/create`, reservation);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: null, status: handleAxiosError(error) };
        }
    };

    const deleteReservation = async (id) => {
        try {
            const response = await axios.delete(`${API_URL}reservations/delete/${id}`);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: null, status: handleAxiosError(error) };
        }
    };

   
    }; */

    const data = {
/*         reservations,
        getAllReservations,
        getReservationsByUser,
        getReservationsByProperty,
        getReservation,
        createReservation,
        deleteReservation,
        cancelReservation, */
        updateReservation,
        getReservationsByOwner,
        getReservationsById,
        replyToClient,
        cancelReservation,
        generateReservationTicket,
        reminderReservation
    };

    return (
        <ReservationStore.Provider value={data}>
            {children}
        </ReservationStore.Provider>
    );
};
