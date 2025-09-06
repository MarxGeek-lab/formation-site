'use client';
import axios from "axios";
import React, { useState, useContext, createContext, useEffect } from "react";
import { API_URL } from "@/settings";
import { handleAxiosError } from "@/utils/errorHandlers";
import api from "@/configs/api";

const PropertyStore = createContext({
  product: null,
  allProducts: [],
  getAllProducts: async () => ({ data: [], status: 500 }),
  getProductById: async () => ({ data: null, status: 500 }),
  createProduct: async () => 500,
  updateProduct: async () => 500,
  updateStatusProduct: async () => 500,
  deleteProduct: async () => 500,
  getProductsByUser: async () => ({ data: [], status: 500 }),
  getProductsByCategory: async () => ({ data: [], status: 500 }),
  addToFavorites: async () => 500,
  removeFromFavorites: async () => 500,
  getUserFavorites: async () => ({ data: [], status: 500 }),
  downloadProductExcel: async () => 500,
  
  // paymen
  getPaymentsBySeller: async () => ({ data: [], status: 500 }),
  getPaymentsById: async () => ({ data: any, status: 500 }),
});

export const usePropertyStore = () => useContext(PropertyStore);

export const PropertyProvider = ({ children }) => {
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);

  const getAllProducts = async () => {
    try {
      const response = await api.get(`admin/products`);
      setAllProducts(response.data);
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: [], status: handleAxiosError(error) };
    }
  };

  const getProductById = async (id) => {
    try {
      const response = await api.get(`${API_URL}products/${id}`);
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: null, status: 500 };
    }
  };

  const getProductsByUser = async (userId) => {
    try {
      const response = await api.get(`products/user/${userId}`);
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: [], status: handleAxiosError(error) };
    }
  };

  const getProductsByCategory = async (categoryId) => {
    try {
      const response = await axios.get(`${API_URL}products/category/${categoryId}`);
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: [], status: handleAxiosError(error) };
    }
  };

  const createProduct = async (property) => {
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

  const updateProduct = async (id, property) => {
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

  const updateStatusProduct = async (id) => {
    try {
      const response = await api.put(`products/status/${id}`);
      return response.status;
    } catch (error) {
      return handleAxiosError(error);
    }
  };

  const deleteProduct = async (id) => {
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

  const downloadProductExcel = async (userId) => {
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

  useEffect(() => {
    getAllProducts()
  }, []);

  const data = {
    product,
    allProducts,
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    updateStatusProduct,
    deleteProduct,
    getProductsByUser,
    getProductsByCategory,
    addToFavorites,
    removeFromFavorites,
    getUserFavorites,
    downloadProductExcel,

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
