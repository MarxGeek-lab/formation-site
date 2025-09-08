'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';
import axiosInstanceUser from "../config/axiosConfig";

interface SubscriptionPlan {
  id: number;
  name: string;
  price: number;
  description?: string;
  published?: boolean;
  [key: string]: any; // Pour les champs supplémentaires éventuels
}

interface SubscriptionContextType {
  subscriptionPlans: any[];
  loading: boolean;
  error: string | null;
  fetchSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  subscriptionPlans: [],
  loading: false,
  error: null,
  fetchSubscription: async () => {},
});

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstanceUser.get<any[]>('subscription/public');
      setSubscriptionPlans(response.data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des abonnements');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptionPlans,
        loading,
        error,
        fetchSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptionContext = () => useContext(SubscriptionContext);
