"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { handleAxiosError } from '@/utils/errorHandlers';
import api from '@/configs/api';

const SiteSettingsContext = createContext({
  siteSettings: null,
  fetchSiteSettings: async () => ({ data: null, status: 500 }),
  updateSettings: async () => ({ data: null, status: 500 }),
});

export const SiteSettingsProvider = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState(null)
  const fetchSiteSettings = async () => {
    try {
      const response = await api.get('settings'); // Remplacez par votre endpoint
      setSiteSettings(response.data)
      return { data: response.data, status: response.status };
    } catch (err) {
      return { data: null, status: handleAxiosError(err) || 500 }
    } 
  };

  const updateSettings = async (newSettings) => {
    try {
      const response = await api.put('settings', newSettings, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }); // Remplacez par votre endpoint
      return response.status;
    } catch (err) {
      return handleAxiosError(err) || 500;
    }
  };

  useEffect(() => {
    // fetchSiteSettings()
  }, [])

  const value = {
    siteSettings,
    fetchSiteSettings,
    updateSettings,
  };

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettingsStore = () => useContext(SiteSettingsContext);