'use client';
import { createContext, useContext, useEffect, useState } from "react";
import api from "@/configs/api";
import { handleAxiosError } from "@/utils/errorHandlers";
import axios from 'axios';
import { API_URL } from "@/settings";


const CommonStore = createContext({
    fetchSiteSettings: async () => ({ data: null, status: 500 }),
    fetchAnnonces: async () => ({ data: [], status: 500 }),
    fetchNotifications: async () => ({ data: [], status: 500 }),
    fetchCategories: async () => ({ data: [], status: 500 }),
    allCategories: []
});

export const useCommonStore = () => useContext(CommonStore);

export const CommonProvider = ({ children }) => {
    const [allCategories, setAllCategories] = useState([]);

    const fetchSiteSettings = async () => {
        try {
          const response = await api.get('settings'); // Remplacez par votre endpoint
          return { data: response.data, status: response.status };
        } catch (err) {
          return { data: null, status: handleAxiosError(err) || 500 }
        } 
    };

    const fetchAnnonces = async () => {
      try {
        const response = await axios.get(`${API_URL}annonces`); // Remplacez par votre endpoint
        return {data: response.data, status: response.status };
      } catch (err) {
        return {data: [], status: handleAxiosError(err) || 500};
      } 
    };

    const fetchNotifications = async (id, type) => {
      try {
        const response = await api.get(`messages/notification/${id}/${type}`); // Remplacez par votre endpoint
        return {data: response.data, status: response.status };
      } catch (err) {
        return {data: [], status: handleAxiosError(err) || 500};
      } 
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}categories`); // Remplacez par votre endpoint
        setAllCategories(response.data);
        return {data: response.data, status: response.status };
      } catch (err) {
        return {data: [], status: handleAxiosError(err) || 500};
      } 
    };

    const data = {
        fetchAnnonces,
        fetchSiteSettings,
        fetchNotifications,
        fetchCategories,
        allCategories
    };

    return (
        <CommonStore.Provider value={data}>
            {children}
        </CommonStore.Provider>
    );
};

/* const [ annonces, setAnnonces ] = useState([]);

 const fetchAnnonce = async () => {
    console.log(user)
    if (user) {
      try {
        const { data, status } = await fetchAnnonces();
        console.log("annonce == ", data.filter(item => item.typeUser.includes(user.role)))
        console.log("annonce == ", status)
        setAnnonces(data.filter(item => item.typeUser.includes(user.role)) || []);
      } catch (error) {
        console.log(error);
      }
    }
  } */
