"use client";
import React, { createContext, useContext, useState, type ReactNode } from "react";
import axios, { type AxiosError } from "axios";
import { API_URL } from "../settings/constant";
import { handleAxiosError } from "../utils/errorHandlers";

interface NewsletterContextType {
    newsletter: Newsletter | null;
    setNewsletter: (newsletter: Newsletter) => void;
    subscribe: (email: string) => Promise<number>;
    unsubscribe: (email: string) => Promise<number>;
    getActiveSubscribers: () => Promise<{ data: Newsletter[], status: number }>;
    updateLastEmailSent: () => Promise<number>;

    // Admin action
    createMessage: (message: NewsletterMessage) => Promise<number>;
    getAllMessages: () => Promise<{ data: NewsletterMessage[], status: number }>;
    getMessage: (id: string) => Promise<{ data: NewsletterMessage, status: number }>;
    updateMessage: (id: string, message: string) => Promise<number>;
    sendMessage: (id: string) => Promise<number>;
}

interface Newsletter {
    id: string;
    email: string;
    subscriptionDate: Date;
    isActive: boolean;
    lastEmailSent: Date;
}

interface NewsletterMessage {
    _id: string;
    subject: string;
    content: string;
    htmlContent: string;
    status: string;
    scheduledDate: Date;
    sentTo: { email: string, sentAt: Date, status: string }[];
}

const NewsletterStore = createContext<NewsletterContextType>({
    newsletter: null,
    setNewsletter: () => {},
    subscribe: async () => 0,
    unsubscribe: async () => 0,
    getActiveSubscribers: async () => ({ data: [], status: 0 }),
    updateLastEmailSent: async () => 0,

    // Admin action
    createMessage: async () => 0,
    getAllMessages: async () => ({ data: [], status: 0 }),
    getMessage: async () => ({ data: { _id: "", subject: "", content: "", htmlContent: "", status: "", scheduledDate: new Date(), sentTo: [] }, status: 0 }),
    updateMessage: async () => 0,
    sendMessage: async () => 0,
});

export const useNewsletterStore = (): NewsletterContextType => useContext(NewsletterStore);

export const NewsletterProvider = ({ children }: { children: ReactNode }) => {
    const [newsletter, setNewsletter] = useState<Newsletter | null>(null);

    // Abonnement
    const subscribe = async (email: string): Promise<number> => {
        try {
            const response = await axios.post(`${API_URL}newsletter/subscriptions`, { email });
            return response.status;
        } catch (error) {
            console.log("error == ", error);
            return handleAxiosError(error);
        }
    };

    // Désabonnement
    const unsubscribe = async (email: string): Promise<number> => {
        try {   
            const response = await axios.post(`${API_URL}newsletter/unsubscribe`, { email });
            return response.status;
        } catch (error) {
            return handleAxiosError(error);
        }
    };  

    // Liste des abonnés
    const getActiveSubscribers = async (): Promise<{ data: Newsletter[], status: number }> => {
        try {
            const response = await axios.get(`${API_URL}newsletter/subscribers`);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: [], status: handleAxiosError(error) };
        }
    };

    // Dernier email envoyé
    const updateLastEmailSent = async (): Promise<number> => {
        try {
            const response = await axios.patch(`${API_URL}newsletter/update-last-sent`);
            return response.status;
        } catch (error) {
            return handleAxiosError(error);
        }
    };

    // Création d'un message
    const createMessage = async (message: NewsletterMessage): Promise<number> => {
        try {
            const response = await axios.post(`${API_URL}newsletter/messages`, message);
            return response.status;
        } catch (error) {
            return handleAxiosError(error);
        }
    };

    // Liste des messages
    const getAllMessages = async (): Promise<{ data: NewsletterMessage[], status: number }> => {
        try {
            const response = await axios.get(`${API_URL}newsletter/messages`);
            return { data: response.data, status: response.status };
        } catch (error) {
            console.error(error);
            return { data: [], status: (error as AxiosError)?.response?.status || 500 };
        }
    };

    // Récupération d'un message
    const getMessage = async (id: string): Promise<{ data: NewsletterMessage, status: number }> => {
        try {
            const response = await axios.get(`${API_URL}newsletter/messages/${id}`);
            return { data: response.data, status: response.status };
        } catch (error) {
            console.error(error);
            return { data: { _id: "", subject: "", content: "", htmlContent: "", status: "", scheduledDate: new Date(), sentTo: [] }, status: (error as AxiosError)?.response?.status || 500 };
        }
    };

    // Modification d'un message
    const updateMessage = async (id: string, message: string): Promise<number> => {
        try {
            const response = await axios.put(`${API_URL}newsletter/messages/${id}`, message);
            return response.status;
        } catch (error) {
            return handleAxiosError(error);
        }
    };

    // Envoi d'un message
    const sendMessage = async (id: string): Promise<number> => {
        try {
            const response = await axios.post(`${API_URL}newsletter/messages/${id}/send`);
            return response.status;
        } catch (error) {
            return handleAxiosError(error);
        }
    };

    const value = {
        newsletter,
        setNewsletter,
        subscribe,
        unsubscribe,
        getActiveSubscribers,
        updateLastEmailSent,

        // Admin action
        createMessage,
        getAllMessages,
        getMessage,
        updateMessage,
        sendMessage,
    };

    return (
        <NewsletterStore.Provider value={value}>
            {children}
        </NewsletterStore.Provider>
    );
};