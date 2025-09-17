"use client";

import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios'; // Assurez-vous d'installer axios
import api from '@/configs/api';
import { handleAxiosError } from '@/utils/errorHandlers';

const NewsletterContext = createContext({
  fetchNewsletterData: async () => ({ data: [], status: 500 }),
  addMessage: async () => ({ data: null, status: 500 }),
  updateMessage: async () => ({ data: null, status: 500 }),
  deleteMessage: async () => ({ data: null, status: 500 }),
  sendMessage: async () => ({ data: null, status: 500 }),
});

export const NewsletterProvider = ({ children }) => {

    const fetchNewsletterData = async () => {
      try {
        const response = await api.get('newsletter/messages'); // Remplacez par votre endpoint
        return { data: response.data, status: response.status }
      } catch (err) {
        return handleAxiosError(err) || 500
      } 
    };

  const subscribe = async (email) => {
    try {
      await axios.post('/api/newsletter/subscriptions', { email }); // Remplacez par votre endpoint
      // Mettez à jour la liste des abonnés si nécessaire
    } catch (err) {
      setError(err);
    }
  };

  const unsubscribe = async (email) => {
    try {
      await axios.delete('/api/newsletter/subscriptions', { data: { email } }); // Remplacez par votre endpoint
      // Mettez à jour la liste des abonnés si nécessaire
    } catch (err) {
      setError(err);
    }
  };

  const addMessage = async (formData) => {
    try {
      const response = await api.post('newsletter/messages', formData); // Remplacez par votre endpoint
      return response.status;
    } catch (err) {
      return handleAxiosError(err) || 500
    }
  };

  const updateMessage = async (id, formData) => {
    try {
      const response = await api.patch(`newsletter/messages/${id}`, formData); // Remplacez par votre endpoint
      return response.status;
    } catch (err) {
      return handleAxiosError(err) || 500
    }
  };

  const deleteMessage = async (id) => {
    try {
      const response = await api.delete(`newsletter/messages/${id}`); // Remplacez par votre endpoint
      return response.status;
    } catch (err) {
      return handleAxiosError(err) || 500
    }
  };

  const sendMessage = async (formData) => {
    try {
      const response = await api.post(`newsletter/messages/send`, formData); // Remplacez par votre endpoint
      return response.status;
    } catch (err) {
      return handleAxiosError(err) || 500
    }
  };

  const value = {
    subscribe,
    unsubscribe,
    addMessage,
    updateMessage,
    sendMessage,
    deleteMessage,
    fetchNewsletterData
  };

  return (
    <NewsletterContext.Provider value={value}>
      {children}
    </NewsletterContext.Provider>
  );
};

export const useNewsletterStore = () => useContext(NewsletterContext);