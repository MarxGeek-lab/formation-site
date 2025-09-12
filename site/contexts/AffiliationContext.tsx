"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useState,
} from "react";
import { API_URL } from "../settings/constant";
import { handleAxiosError } from "../utils/errorHandlers";
import axiosInstanceUser from "../config/axiosConfig";

// Typage des fonctions dispo dans le store
interface AffiliationStore {
  affiliateProfile: any;
  affiliateStats: any;
  affiliateReferrals: any;
  affiliateEarnings: any[];
  subscribeAffiliate: (userId: string) => Promise<{ data: any; status: number }>;
  getAffiliateProfile: (userId: string) => Promise<{ data: any; status: number }>;
  getAffiliateStats: (userId: string) => Promise<{ data: any; status: number }>;
  getAffiliateReferrals: (userId: string) => Promise<{ data: any; status: number }>;
  withdrawAffiliateEarnings: (userId: string, amount: number) => Promise<{ data: any; status: number }>;

  createPayoutAffiliate: (userId: string, formData: any) => Promise<{ data: any; status: number }>;
  updatePayoutAffiliate: (id: string, formData: any) => Promise<{ data: any; status: number }>;
  deletePayoutAffiliate: (id: string) => Promise<{ data: any; status: number }>;
  getAllPayoutsByAffiliate: (userId: string) => Promise<{ data: any[]; status: number }>;
}

const AffiliationContext = createContext<AffiliationStore>({
  affiliateProfile: null,
  affiliateStats: null,
  affiliateReferrals: null,
  affiliateEarnings: [],
  subscribeAffiliate: async () => ({ data: null, status: 500 }),
  getAffiliateProfile: async () => ({ data: null, status: 500 }),
  getAffiliateStats: async () => ({ data: null, status: 500 }),
  getAffiliateReferrals: async () => ({ data: null, status: 500 }),
  withdrawAffiliateEarnings: async () => ({ data: null, status: 500 }),

  createPayoutAffiliate: async () => ({ data: null, status: 500 }),
  updatePayoutAffiliate: async () => ({ data: null, status: 500 }),
  deletePayoutAffiliate: async () => ({ data: null, status: 500 }),
  getAllPayoutsByAffiliate: async () => ({ data: [], status: 500 }),
});

export const useAffiliationStore = () => useContext(AffiliationContext);

export const AffiliationProvider = ({ children }: { children: ReactNode }) => {
  const [affiliateProfile, setAffiliateProfile] = useState<any>(null);
  const [affiliateStats, setAffiliateStats] = useState<any>(null);
  const [affiliateReferrals, setAffiliateReferrals] = useState<any>(null);
  const [affiliateEarnings, setAffiliateEarnings] = useState<any>(null);
  
  // S’inscrire comme affilié
  const subscribeAffiliate = async (
    userId: string
  ): Promise<{ data: any; status: number }> => {
    try {
      const response = await axiosInstanceUser.put(
        `${API_URL}affiliate/create/${userId}`
      );
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: null, status: handleAxiosError(error) };
    }
  };

  // Récupérer le profil affilié
  const getAffiliateProfile = async (
    userId: string
  ): Promise<{ data: any; status: number }> => {
    try {
      const response = await axiosInstanceUser.get(
        `${API_URL}affiliate/profile/${userId}`
      );
      setAffiliateProfile(response.data);
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: null, status: handleAxiosError(error) };
    }
  };

  // Récupérer les statistiques de l’affilié (revenus, clics, etc.)
  const getAffiliateStats = async (
    userId: string
  ): Promise<{ data: any; status: number }> => {
    try {
      const response = await axiosInstanceUser.get(
        `${API_URL}affiliate/stats/${userId}`
      );
      setAffiliateStats(response.data);
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: null, status: handleAxiosError(error) };
    }
  };

  // Récupérer les filleuls/clients apportés
  const getAffiliateReferrals = async (
    userId: string
  ): Promise<{ data: any; status: number }> => {
    try {
      const response = await axiosInstanceUser.get(
        `${API_URL}affiliate/referralsList/${userId}`
      );
      setAffiliateReferrals(response.data);
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: null, status: handleAxiosError(error) };
    }
  };

  // Retirer ses gains d’affiliation
  const withdrawAffiliateEarnings = async (
    userId: string,
    amount: number
  ): Promise<{ data: any; status: number }> => {
    try {
      const response = await axiosInstanceUser.post(
        `${API_URL}affiliate/withdraw/${userId}`,
        { amount }
      );
      setAffiliateEarnings(response.data);
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: null, status: handleAxiosError(error) };
    }
  };

  // Créer un paiement
  const createPayoutAffiliate = async (
    userId: string,
    formData: any
  ): Promise<{ data: any; status: number }> => {
    try {
      const response = await axiosInstanceUser.post(
        `${API_URL}affiliate/payout/${userId}`,
        formData
      );
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: null, status: handleAxiosError(error) };
    }
  };

  // Mettre à jour un paiement
  const updatePayoutAffiliate = async (
    id: string,
    formData: any
  ): Promise<{ data: any; status: number }> => {
    try {
      const response = await axiosInstanceUser.put(
        `${API_URL}affiliate/payout/${id}`,
        formData
      );
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: null, status: handleAxiosError(error) };
    }
  };

  // Supprimer un paiement
  const deletePayoutAffiliate = async (
    id: string
  ): Promise<{ data: any; status: number }> => {
    try {
      const response = await axiosInstanceUser.delete(
        `${API_URL}affiliate/payout/${id}`
      );
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: null, status: handleAxiosError(error) };
    }
  };

  const getAllPayoutsByAffiliate = async (
    userId: string
  ): Promise<{ data: any[]; status: number }> => {
    try {
      const response = await axiosInstanceUser.get(
        `${API_URL}affiliate/payouts/all/${userId}`
      );
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: [], status: handleAxiosError(error) };
    }
  };

  // Toutes les fonctions dispos dans le contexte
  const data: AffiliationStore = {
    affiliateProfile,
    affiliateStats,
    affiliateReferrals,
    affiliateEarnings,
    subscribeAffiliate,
    getAffiliateProfile,
    getAffiliateStats,
    getAffiliateReferrals,
    withdrawAffiliateEarnings,

    createPayoutAffiliate,
    updatePayoutAffiliate,
    deletePayoutAffiliate,
    getAllPayoutsByAffiliate,
  };

  return (
    <AffiliationContext.Provider value={data}>
      {children}
    </AffiliationContext.Provider>
  );
};
