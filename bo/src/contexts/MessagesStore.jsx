'use client';
import { createContext, useContext } from "react";
import api from "@/configs/api";
import { handleAxiosError } from "@/utils/errorHandlers";

const MessagesStore = createContext({
    getMessagesByOwner: async () => ({ data: [], status: 500 }),
    addMessage: async () => ({ data: null, status: 500 }),
    getCustomersLocation: async () => ({ data: [], status: 500 }),
});

export const useMessagesStore = () => useContext(MessagesStore);

export const MessagesProvider = ({ children }) => {
    
    const getMessagesByOwner = async (ownerId) => {
        try {
            const response = await api.get(`messages/owner/${ownerId}`);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: [], status: handleAxiosError(error) };
        }
    };

    const addMessage = async (messageID, formData) => {
        try {
            const response = await api.post(`messages/add-message/${messageID}`, formData);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: null, status: handleAxiosError(error) };
        }
    };

    const getCustomersLocation = async (customerId, formData) => {
        try {
            const response = await api.get(`customers/data/${customerId}/${ownerId}`, formData);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: null, status: handleAxiosError(error) };
        }
    };

    const data = {
        getMessagesByOwner,
        addMessage,
        getCustomersLocation
    };

    return (
        <MessagesStore.Provider value={data}>
            {children}
        </MessagesStore.Provider>
    );
};
