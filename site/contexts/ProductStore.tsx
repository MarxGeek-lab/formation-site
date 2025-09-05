"use client";
import axios from "axios";
import React, { type ReactNode, useContext, useState, createContext, useEffect } from "react";
import { API_URL } from "../settings/constant";
import { handleAxiosError } from "../utils/errorHandlers";
import axiosInstanceUser from "../config/axiosConfig";


interface ProductContextType {
    property: Property | null;
    allProducts: any[];
    getAllProduct: () => void;
    getProductById: (id: string) => Promise<{ data: any, status: number }>;
    getProductsByUser: (userId: string) => Promise<{ data: any[], status: number }>;
    getProductsByCategory: (categoryId: string) => Promise<{ data: any[], status: number }>;
    addToFavorites: (formData: any) => Promise<number>;
    removeFromFavorites: (propertyId: string, userId: string) => Promise<number>;
    getUserFavorites: (userId: string) => Promise<{ data: any[], status: number }>;
    downloadPropertyExcel: (userId: string) => Promise<number>;
    searchProduct: (search: string) => Promise<{ data: any[], status: number }>;
}

interface PropertyFilter {
    location?: string;
    propertyType?: string;
    priceLimit?: number;
    state?: string;
    availableDates?: { start: Date, end: Date };
}

interface Property {
    _id: string;
    name: string;
    description: string;
    photos: string[];
    propertyType: string;
    price: number;
    location: {
        country: string;
        city: string;
        district: string;
    };
    characteristics: string[];
    state: string;
    owner: string;
    availableDates: {
        start: Date;
        end: Date;
    };
    documents: string[];
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    isValidated: boolean;
    validatedAt: Date;
    validatedBy: string;
}

export const ProductStore = createContext<ProductContextType>({
    property: null,
    allProducts: [],
    getAllProduct: () => {},
    getProductById: async () => ({ data: null, status: 500 }),
    getProductsByUser: async () => ({ data: [], status: 500 }),
    getProductsByCategory: async () => ({ data: [], status: 500 }),
    addToFavorites: async () => 500,
    removeFromFavorites: async () => 500,
    getUserFavorites: async () => ({ data: [], status: 500 }),
    downloadPropertyExcel: async () => 500,
    searchProduct: async () => ({ data: [], status: 500 }),
});

export const useProductStore = (): ProductContextType => useContext(ProductStore);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
    const [property, setProperty] = useState<Property | null>(null);
    const [allProducts, setAllProducts] = useState<Property[]>([]);

    // Récupérer toutes les propriétés
    const getAllProduct = async () => {
        try {
            const response = await axios.get(`${API_URL}products`);
            setAllProducts(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    // Récupérer une propriété par ID
    const getProductById = async (id: string): Promise<{ data: any, status: number }> => {
        try {
            const response = await axiosInstanceUser.get(`${API_URL}products/${id}`);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: null, status: 500 };
        }
    };

    // Récupérer les propriétés par utilisateur
    const getProductsByUser = async (userId: string): Promise<{ data: any[], status: number }> => {
        try {
            const response = await axiosInstanceUser.get(`${API_URL}products/user/${userId}`);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: [], status: handleAxiosError(error) };
        }
    };

    // Récupérer les propriétés par catégorie
    const getProductsByCategory = async (categoryId: string): Promise<{ data: Property[], status: number }> => {
        try {
            const response = await axios.get(`${API_URL}products/category/${categoryId}`);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: [], status: handleAxiosError(error) };
        }
    };

    // Ajouter une propriété aux favoris
    const addToFavorites = async (formData: any): Promise<number> => {
        try {
            const response = await axiosInstanceUser.post(`${API_URL}products/favorites`, formData);
            return response.status;
        } catch (error) {
            return handleAxiosError(error);
        }
    };

    // Supprimer une propriété des favoris
    const removeFromFavorites = async (propertyId: string, userId: string): Promise<number> => {
        try {
            const response = await axios.delete(`${API_URL}products/favorites/remove/${propertyId}`, { data: { userId } });
            return response.status;
        } catch (error) {
            return handleAxiosError(error);
        }
    };

    // Récupérer les favoris d'un utilisateur
    const getUserFavorites = async (userId: string): Promise<{ data: any[], status: number }> => {
        try {
            const response = await axiosInstanceUser.get(`${API_URL}products/favorites/${userId}`);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: [], status: handleAxiosError(error) };
        }
    };

    const downloadPropertyExcel = async (userId: string): Promise<number> => {
        try {
          const response = await axiosInstanceUser.get(`${API_URL}products/download-products/${userId}`, {
            responseType: "blob", // Spécification du type de réponse blob
            headers: {
              "Content-Type": "application/json"
            }
          });
      
          if (response.status === 200) {
            const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      
            // Créer un lien de téléchargement et le déclencher
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "transactions.xlsx";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
      
            // Libérer l'URL d'objet
            window.URL.revokeObjectURL(url);
          } else {
            console.error("Erreur lors du téléchargement du fichier Excel");
          }
      
          return response.status;
        } catch (error) {
            return handleAxiosError(error);
        }
    }

    const searchProduct = async (search: string): Promise<{ data: any[], status: number }> => {
        try {
            const response = await axios.get(`${API_URL}products/search/${search}`);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: [], status: handleAxiosError(error) };
        }
    }

    useEffect(() => {
        getAllProduct();
    }, []);
                
    const data = { 
        property, 
        allProducts,
        getAllProduct, 
        getProductById, 
        getProductsByUser, 
        getProductsByCategory,
        addToFavorites,
        removeFromFavorites,
        getUserFavorites,
        downloadPropertyExcel,
        searchProduct
    };
    return <ProductStore.Provider value={data}>{children}</ProductStore.Provider>;
};