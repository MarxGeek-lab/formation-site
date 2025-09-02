"use client";
// contexts/AnnoncesContext.js

import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios'; // Assurez-vous d'installer axios
import { handleAxiosError } from '@/utils/errorHandlers';
import api from '@/configs/api';

const AnnoncesContext = createContext({
  fetchAnnonces: async () => ({ data: [], status: 500 }),
  addAnnonce: async () => ({ data: null, status: 500 }),
  updateAnnonce: async () => ({ data: null, status: 500 }),
  deleteAnnonce: async () => ({ data: null, status: 500 }),
  updateAnnonceStatus: async () => ({ data: null, status: 500 }),
});

export const AnnoncesProvider = ({ children }) => {

  const fetchAnnonces = async () => {
    try {
      const response = await api.get('annonces'); // Remplacez par votre endpoint
      return {data: response.data, status: response.status };
    } catch (err) {
      return {data: [], status: handleAxiosError(err) || 500};
    } 
  };

  const addAnnonce = async (formData) => {
    try {
      const response = await api.post('annonces', formData); // Remplacez par votre endpoint
      return response.status;
    } catch (err) {
      return handleAxiosError(err) || 500;
    }
  };

  const updateAnnonce = async (id, formData) => {
    try {
      const response = await api.patch(`annonces/${id}`, formData); // Remplacez par votre endpoint
      return response.status;
    } catch (err) {
      return handleAxiosError(err) || 500;
    }
  };

  const updateAnnonceStatus = async (id, formData) => {
    try {
      const response = await api.put(`annonces/${id}/status`, formData); // Remplacez par votre endpoint
      return response.status;
    } catch (err) {
      return handleAxiosError(err) || 500;
    }
  };

  const deleteAnnonce = async (id) => {
    try {
      const response = await api.delete(`annonces/${id}`); // Remplacez par votre endpoint
      return response.status;
    } catch (err) {
      return handleAxiosError(err) || 500;
    }
  };

  const value = {
    addAnnonce,
    updateAnnonce,
    deleteAnnonce,
    updateAnnonceStatus, 
    fetchAnnonces
  };

  return (
    <AnnoncesContext.Provider value={value}>
      {children}
    </AnnoncesContext.Provider>
  );
};

export const useAnnoncesStore = () => useContext(AnnoncesContext);