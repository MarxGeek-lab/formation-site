"use client";
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import axios, { AxiosResponse } from 'axios';
import { handleAxiosError } from "../utils/errorHandlers";
import axiosInstanceUser from "../config/axiosConfig";
import { API_URL } from "../settings/constant";

interface ApiResponse<T> {
  data: T | null | T[];
  status: number;
}

interface CommonStoreContext {
  fetchAnnonces: () => Promise<ApiResponse<any>>;
  fetchNotifications: (id: string, type: string) => Promise<ApiResponse<any>>;
  allCategories: any[];
  allCategories2: any[];
  allLocalisation: any[];
  faqs: any[];
  stats: any;
  siteSettings: any;
  fetchCategories: () => void;
  fetchSiteSettings: () => Promise<ApiResponse<any>>;
  contactUs: (data: any) => Promise<ApiResponse<any>>;
  addReview: (data: any) => Promise<ApiResponse<any>>;
  likeReview: (reviewId: string, userId: string) => Promise<ApiResponse<any>>;
  dislikeReview: (reviewId: string, userId: string) => Promise<ApiResponse<any>>;
  getProductReviews: (id: string) => Promise<ApiResponse<any>>;
  getAllLocalisation: () => Promise<ApiResponse<any>>;
  sendMessages: (formData: any) => Promise<ApiResponse<any>>
  fetchFaqs: () => Promise<ApiResponse<any>>;
  getStatsOwner: (id: string) => Promise<ApiResponse<any>>;
  saveUserVisit: () => Promise<ApiResponse<any>>;
}

const CommonStore = createContext<CommonStoreContext>({
  fetchAnnonces: async () => ({ data: [], status: 500 }),
  fetchNotifications: async () => ({ data: [], status: 500 }),
  fetchCategories: async () => {},
  fetchSiteSettings: async () => ({ data: null, status: 500 }),
  allCategories: [],
  allCategories2: [],
  allLocalisation: [],
  faqs: [],
  stats: null,
  siteSettings: null,
  contactUs: async () => ({ data: null, status: 500 }),
  addReview: async () => ({ data: null, status: 500 }),
  likeReview: async () => ({ data: null, status: 500 }),
  dislikeReview: async () => ({ data: null, status: 500 }),
  getProductReviews: async () => ({ data: [], status: 500 }),
  getAllLocalisation: async () => ({ data: [], status: 500 }),
  sendMessages: async () => ({ data: null, status: 500 }),
  fetchFaqs: async () => ({ data: [], status: 500 }),
  getStatsOwner: async () => ({ data: null, status: 500 }),
  saveUserVisit: async () => ({ data: null, status: 500 }),
});

export const useCommonStore = () => useContext(CommonStore);

interface CommonProviderProps {
  children: ReactNode;
}

export const CommonProvider = ({ children }: CommonProviderProps) => {
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [allCategories2, setAllCategories2] = useState<any[]>([]);
  const [allLocalisation, setAllLocalisation] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>();
  const [siteSettings, setSiteSettings] = useState<any>();

  const fetchAnnonces = async (): Promise<ApiResponse<any>> => {
    try {
      const response: AxiosResponse<any> = await axios.get(`${API_URL}annonces`);
      return { data: response.data, status: response.status };
    } catch (err) {
      return { data: [], status: handleAxiosError(err) || 500 };
    }
  };

  const fetchNotifications = async (id: string, type: string): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstanceUser.get(`messages/notification/${id}/${type}`);
      return {data: response.data, status: response.status };
    } catch (err) {
      return {data: [], status: handleAxiosError(err) || 500};
    } 
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}categories`);
      setAllCategories(response.data);
    } catch (err) {
      console.log(err)
    } 
  };

  const fetchSiteSettings = async (): Promise<ApiResponse<any>> => {
    try {
      const response: AxiosResponse<any> = await axios.get(`${API_URL}settings`);
      return { data: response.data, status: response.status };
    } catch (err) {
      console.error('Error fetching site settings:', err);
      return { data: null, status: handleAxiosError(err) || 500 };
    }
  };

  const contactUs = async (data: any): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstanceUser.post('/contact-us', data);
      return { data: response.data, status: response.status };
    } catch (err) {
      return { data: null, status: handleAxiosError(err) || 500 };
    }
  };

  const addReview = async (data: any): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstanceUser.post('/reviews', data);
      return { data: response.data, status: response.status };
    } catch (err) {
      return { data: null, status: handleAxiosError(err) || 500 };
    }
  };

  const likeReview = async (reviewId: string, userId: string): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstanceUser.post(`/reviews/${reviewId}/like`, { userId });
      return { data: response.data, status: response.status };
    } catch (err) {
      return { data: null, status: handleAxiosError(err) || 500 };
    }
  };

  const dislikeReview = async (reviewId: string, userId: string): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstanceUser.post(`/reviews/${reviewId}/dislike`, { userId });
      return { data: response.data, status: response.status };
    } catch (err) {
      return { data: null, status: handleAxiosError(err) || 500 };
    }
  };

  const getProductReviews = async (id: string): Promise<ApiResponse<any>> => {
    try {
      const response = await axios.get(`${API_URL}reviews/product/${id}`);
      return { data: response.data, status: response.status };
    } catch (err) {
      return { data: [], status: handleAxiosError(err) || 500 };
    }
  };

  const getAllLocalisation = async (): Promise<ApiResponse<any>> => {
    try {
      const response = await axios.get(`${API_URL}localisation`);
      setAllLocalisation(response.data);
      return { data: response.data, status: response.status };
    } catch (err) {
      return { data: [], status: handleAxiosError(err) || 500 };
    }
  };

  const sendMessages = async (formData: any): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstanceUser.post('/messages/create-message', formData);
      return { data: response.data, status: response.status };
    } catch (err) {
      return { data: null, status: handleAxiosError(err) || 500 };
    }
  };

  const fetchFaqs = async (): Promise<ApiResponse<any>> => {
    try {
      const response = await axios.get(`${API_URL}faqs`);
      setFaqs(response.data);
      return { data: response.data, status: response.status };
    } catch (err) {
      return { data: [], status: handleAxiosError(err) || 500 };
    }
  };

   const getStatsOwner = async (userId: string): Promise<ApiResponse<any>>  => {
    try {
        const response = await axiosInstanceUser.get(`stats/buyer/${userId}`);
        setStats(response.data);
        return { data: response.data, status: response.status };
    } catch (error) {
        return { data: null, status: handleAxiosError(error) };
    }
  };

  const saveUserVisit = async (): Promise<ApiResponse<any>> => {
    try {
      const response = await axios.post(`${API_URL}save-user-visit`);
      return { data: response.data, status: response.status };
    } catch (err) {
      return { data: null, status: handleAxiosError(err) || 500 };
    }
  };

  useEffect(() => {
    fetchCategories()
    const initData = async () => {
      try {
        const [categoriesRes, localisationRes, faqsRes, siteSettingsRes] = await Promise.all([
          fetchCategories(), getAllLocalisation(), fetchFaqs(), fetchSiteSettings()
        ]);
        
       
        if (localisationRes.status === 200) {
          setAllLocalisation(localisationRes.data);
        }
        if (faqsRes.status === 200) {
          setFaqs(faqsRes.data);
        }
        if (siteSettingsRes.status === 200) {
          setSiteSettings(siteSettingsRes.data);
        }

        
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    };
    
    initData();
  }, []);

  const data: CommonStoreContext = {
    fetchAnnonces,
    fetchNotifications,
    allCategories,
    allCategories2,
    allLocalisation,
    stats,
    siteSettings,
    fetchCategories,
    fetchSiteSettings,
    contactUs,
    addReview,
    getProductReviews,
    likeReview,
    dislikeReview,
    getAllLocalisation,
    sendMessages,
    fetchFaqs,
    faqs,
    getStatsOwner,
    saveUserVisit
  };

  return (
    <CommonStore.Provider value={data}>
      {children}
    </CommonStore.Provider>
  );
};