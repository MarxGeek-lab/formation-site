'use client'
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { API_URL } from "@/settings";
import api from '@/configs/api';

const SubscriptionContext = createContext({
  subscriptionPlans: [],
  loading: false,
  error: null,
  fetchSubscription: async () => {},
  addSubscription: async () => 500,
  updateSubscription: async () => 500,
  deleteSubscription: async () => 500,
  publishOrUnpublishSubscription: async () => 500
});

export const SubscriptionProvider = ({ children }) => {
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSubscription = async () => {
    try {
      const response = await api.get(`subscription`);
      setSubscriptionPlans(response.data)
    } catch (err) {
      console.log(error)
    } 
  };

  const addSubscription = async (formData) => {
    try {
      const res = await api.post(`subscription`, formData)
      return res.status
    } catch (err) {
      return err.response?.status || 500
    } 
  };

  const updateSubscription = async (formData, id) => {
    try {
      const res = await api.put(`subscription/${id}`, formData);
      return res.status
    } catch (err) {
      return err.response?.status || 500
    } 
  };

  const deleteSubscription = async (id) => {
    try {
      const res = await api.delete(`subscription/${id}`)
      return res.status
    } catch (err) {
      return err.response?.status || 500
    } 
  };

  const publishOrUnpublishSubscription = async (id) => {
    try {
      const res = await api.put(`subscription/${id}/publishOrUnpublish`)
      return res.status
    } catch (err) {
      return err.response?.status || 500
    } 
  };

  return (
    <SubscriptionContext.Provider value={{
      subscriptionPlans,
      loading,
      error,
      fetchSubscription,
      addSubscription,
      updateSubscription,
      deleteSubscription,
      publishOrUnpublishSubscription,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptionContext = () => useContext(SubscriptionContext);
