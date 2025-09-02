'use client';

import { createContext, useContext, useState } from "react";
import api from "@/configs/api";
import { handleAxiosError } from "@/utils/errorHandlers";

const HelpCenterStore = createContext({
    SubmitQuiz: async () => ({ data: null, status: 500 }),
    getDiscussionByUser: async () => ({ data: [], status: 500 }),
});

export const useHelpCenterStore = () => useContext(HelpCenterStore);

export const HelpCenterProvider = ({ children }) => {
    
    const SubmitQuiz = async (formData) => {
        try {   
            const response = await api.post(`helpcenter/submit-quiz`, formData);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: null, status: handleAxiosError(error) };
        }
    };

    const getDiscussionByUser = async (userId) => {
        try {   
            const response = await api.get(`helpcenter/discussions/user/${userId}`);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: [], status: handleAxiosError(error) };
        }
    };

    const data = {
       SubmitQuiz,
       getDiscussionByUser
    };

    return (
        <HelpCenterStore.Provider value={data}>
            {children}
        </HelpCenterStore.Provider>
    );
};
