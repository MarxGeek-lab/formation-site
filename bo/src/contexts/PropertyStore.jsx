'use client';
import axios from "axios";
import React, { useState, useContext, createContext } from "react";
import { API_URL } from "@/settings";
import { handleAxiosError } from "@/utils/errorHandlers";
import api from "@/configs/api";

const PropertyStore = createContext({
  property: null,
  getAllProducts: async () => ({ data: [], status: 500 }),
  getPropertyById: async () => ({ data: null, status: 500 }),
  createProperty: async () => 500,
  updateProperty: async () => 500,
  deleteProperty: async () => 500,
  getPropertiesByUser: async () => ({ data: [], status: 500 }),
  getPropertiesByCategory: async () => ({ data: [], status: 500 }),
  getPropertiesByFilter: async () => ({ data: [], status: 500 }),
  addToFavorites: async () => 500,
  removeFromFavorites: async () => 500,
  getUserFavorites: async () => ({ data: [], status: 500 }),
  downloadPropertyExcel: async () => 500,
  getRentalByOwner: async () => ({ data: [], status: 500 }),
  getRentalById: async () => ({ data: any, status: 500 }),
  
  // paymen
  getPaymentsBySeller: async () => ({ data: [], status: 500 }),
  getPaymentsById: async () => ({ data: any, status: 500 }),
});

export const usePropertyStore = () => useContext(PropertyStore);

export const PropertyProvider = ({ children }) => {
  const [property, setProperty] = useState(null);

  const getAllProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}products`);
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: [], status: handleAxiosError(error) };
    }
  };

  const getPropertyById = async (id) => {
    try {
      const response = await api.get(`${API_URL}products/${id}`);
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: null, status: 500 };
    }
  };

  const getPropertiesByUser = async (userId) => {
    try {
      const response = await api.get(`products/user/${userId}`);
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: [], status: handleAxiosError(error) };
    }
  };

  const getPropertiesByCategory = async (categoryId) => {
    try {
      const response = await axios.get(`${API_URL}products/category/${categoryId}`);
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: [], status: handleAxiosError(error) };
    }
  };

  const getPropertiesByFilter = async (filter) => {
    try {
      const response = await api.get(`${API_URL}products/search`, { params: filter });
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: [], status: handleAxiosError(error) };
    }
  };

  const createProperty = async (property) => {
    try {
      const response = await api.post(`products/create`,
        property,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.status;
    } catch (error) {
      console.log(error);
      return handleAxiosError(error);
    }
  };

  const updateProperty = async (id, property) => {
    try {
      const response = await api.put(`products/update/${id}`,
        property,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.status;
    } catch (error) {
      return handleAxiosError(error);
    }
  };

  const deleteProperty = async (id) => {
    try {
      const response = await api.delete(`${API_URL}products/delete/${id}`);
      return response.status;
    } catch (error) {
      return handleAxiosError(error);
    }
  };

  const addToFavorites = async (formData) => {
    try {
      const response = await api.post(`${API_URL}products/favorites`, formData);
      return response.status;
    } catch (error) {
      return handleAxiosError(error);
    }
  };

  const removeFromFavorites = async (propertyId, userId) => {
    try {
      const response = await axios.delete(`${API_URL}products/favorites/remove/${propertyId}`, { data: { userId } });
      return response.status;
    } catch (error) {
      return handleAxiosError(error);
    }
  };

  const getUserFavorites = async (userId) => {
    try {
      const response = await api.get(`${API_URL}products/favorites/user/${userId}`);
      return { data: response.data.data, status: response.status };
    } catch (error) {
      return { data: [], status: handleAxiosError(error) };
    }
  };

  const downloadPropertyExcel = async (userId) => {
    try {
      const response = await api.get(`${API_URL}products/download-products/${userId}`, {
        responseType: "blob",
        headers: { "Content-Type": "application/json" }
      });
      if (response.status === 200) {
        const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "transactions.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Erreur lors du téléchargement du fichier Excel");
      }
      return response.status;
    } catch (error) {
      return handleAxiosError(error);
    }
  };

  // récupérer les locations
  const getRentalByOwner = async (userId) => {
    try {
        const response = await api.get(`rental/owner/${userId}`);
        return { data: response.data, status: response.status };
    } catch (error) {
        return { data: [], status: handleAxiosError(error) };
    }
  };

  const getRentalById = async (rentalId) => {
    try {
        const response = await api.get(`rental/${rentalId}`);
        return { data: response.data, status: response.status };
    } catch (error) {
        return { data: null, status: handleAxiosError(error) };
    }
  };


  // get payment
  const getPaymentsBySeller = async () => {
    try {
      const response = await api.get(`payments/owner`);
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: [], status: handleAxiosError(error) };
    }
  };

  const getPaymentsById = async (paymentId) => {
    try {
      const response = await api.get(`payments/${paymentId}`);
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: [], status: handleAxiosError(error) };
    }
  };

  const data = {
    property,
    getAllProducts,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
    getPropertiesByUser,
    getPropertiesByCategory,
    getPropertiesByFilter,
    addToFavorites,
    removeFromFavorites,
    getUserFavorites,
    downloadPropertyExcel,

    // Rental
    getRentalByOwner,
    getRentalById,

    //payments
    getPaymentsBySeller,
    getPaymentsById
  };

  return (
    <PropertyStore.Provider value={data}>
      {children}
    </PropertyStore.Provider>
  );
};
