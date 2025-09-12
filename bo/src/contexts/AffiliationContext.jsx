"use client";

import React, { createContext, useContext, useState } from "react";
import { handleAxiosError } from "../utils/errorHandlers";
import api from "@/configs/api";

// Contexte admin affiliation
const AdminAffiliationContext = createContext({
  affiliates: [],
  affiliateStats: null,
  payouts: [],
  
  // Fonctions admin
  createAffiliate: async () => ({ data: null, status: 500 }),
  generateAffiliateLink: async () => ({ data: null, status: 500 }),
  getAllAffiliates: async () => ({ data: [], status: 500 }),
  getAffiliateStats: async () => ({ data: null, status: 500 }),
  createPayout: async () => ({ data: null, status: 500 }),
  updatePayout: async () => ({ data: null, status: 500 }),
  deletePayout: async () => ({ data: null, status: 500 }),
  getAllPayouts: async () => ({ data: [], status: 500 }),

  createAffiliate: async () => ({ data: null, status: 500 }),
  getAllActivities: async () => ({ data: [], status: 500 }),
  getAllActivitiesByAffiliate: async () => ({ data: [], status: 500 }),
});

// Hook pour utiliser le store
export const useAdminAffiliationStore = () => useContext(AdminAffiliationContext);

// Provider
export const AdminAffiliationProvider = ({ children }) => {
  const [affiliates, setAffiliates] = useState([]);
  const [affiliateStats, setAffiliateStats] = useState(null);
  const [payouts, setPayouts] = useState([]);

  // Créer un affilié
  const createAffiliate = async (userData) => {
    try {
      const response = await api.post(`admin/affiliates/create`, userData);
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: null, status: handleAxiosError(error) };
    }
  };

  // Générer un lien d’affiliation
  const generateAffiliateLink = async (affiliateId) => {
    try {
      const response = await api.post(`admin/affiliates/link/${affiliateId}`);
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: null, status: handleAxiosError(error) };
    }
  };

  // Récupérer tous les affiliés
  const getAllAffiliates = async () => {
    try {
      const response = await api.get(`admin/affiliates/all`);
      setAffiliates(response.data);
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: [], status: handleAxiosError(error) };
    }
  };

  // Statistiques globales des affiliés
  const getAffiliateStats = async () => {
    try {
      const response = await api.get(`admin/affiliates/stats`);
      setAffiliateStats(response.data);
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: null, status: handleAxiosError(error) };
    }
  };

  const updatePayout = async (payoutId, data) => {
    try {
      const response = await api.put(`admin/affiliates/payout/${payoutId}`, data);
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: null, status: handleAxiosError(error) };
    }
  };

  // Supprimer un paiement
  const deletePayout = async (payoutId) => {
    try {
      const response = await api.delete(`admin/affiliates/payout/${payoutId}`);
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: null, status: handleAxiosError(error) };
    }
  };

  // Récupérer tous les paiements
  const getAllPayouts = async () => {
    try {
      const response = await api.get(`admin/affiliates/payouts/all`);
      setPayouts(response.data);
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: [], status: handleAxiosError(error) };
    }
  };

  // Récupérer toutes les activités
  const getAllActivities = async () => {
    try {
      const response = await api.get(`admin/activities/all`);
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: [], status: handleAxiosError(error) };
    }
  };

  // Récupérer toutes les activités d'un affilié
  const getAllActivitiesByAffiliate = async (affiliateId) => {
    try {
      const response = await api.get(`admin/activities/${affiliateId}`);
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: [], status: handleAxiosError(error) };
    }
  };

  const data = {
    affiliates,
    affiliateStats,
    payouts,
    createAffiliate,
    generateAffiliateLink,
    getAllAffiliates,
    getAffiliateStats,
    deletePayout,
    getAllPayouts,
    getAllActivities,
    getAllActivitiesByAffiliate,
    updatePayout,
  };

  return <AdminAffiliationContext.Provider value={data}>{children}</AdminAffiliationContext.Provider>;
};
