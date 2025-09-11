"use client";
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { associateSessionToUser } from '@/utils/trackingPixel';
import { handleAxiosError } from "../utils/errorHandlers";
import axios from "axios";
import axiosInstanceUser from "../config/axiosConfig";
import { syncTokenToCookies, clearTokenFromStorage } from "../utils/tokenSync";
import { API_URL } from '@/settings/constant';
import { country } from '@/data/countries';

// Interface pour définir les types des fonctions d'authentification
interface AuthContextType {
  user: any;
  token: JWTToken | null;
  currency: string;
  login: (formData: any) => Promise<number>;
  register: (formData: any) => Promise<number>;
  logout: () => void;
  getUserById: (userId: string) => Promise<{ data: any, status: number}>;
  updateUser: (userId: string, formData: any, formDataImage?: false) => Promise<number>;
  updatePhoto: (userId: string, formData: any) => Promise<number>;
  activateAccount: (code: string) => Promise<number>;
  verifyEmail: (email: string) => Promise<number>;
  confirmEmail: (code: string) => Promise<number>;
  resetPassword: (formData: any) => Promise<number>;
  resendCodeActivation: (email: string) => Promise<number>;
}

// Add these interfaces above AuthContextType
interface User {
  id: string;
  email: string;
  role: string;
  fullName: string;
  country: string;
}

interface JWTToken {
  exp: number;
  iat: number;
  user: User;
}

// Création du contexte d'authentification
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  currency: 'XOF',
  login: async () => 500,
  register: async () => 500,
  logout: () => {},
  getUserById: async () => ({ data: null, status: 500 }),
  updateUser: async () => 500,
  updatePhoto: async () => 500,
  activateAccount: async () => 500,
  verifyEmail: async () => 500,
  confirmEmail: async () => 500,
  resetPassword: async () => 500,
  resendCodeActivation: async () => 500,
});

// Hook personnalisé pour utiliser le contexte d'authentification dans les composants
export const useAuthStore = (): AuthContextType => useContext(AuthContext);

// Composant fournisseur de contexte d'authentification
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<JWTToken | any>(null);
  const [currency, setCurrency] = useState('XOF');

  const getUserById = async (userId: string): Promise<{ data: null, status: number }> => {
    try {
      const response = await axiosInstanceUser.get(`${API_URL}users/${userId}`);
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: null, status: handleAxiosError(error) };
    }
  };

  const updateUser = async (userId: string, formData: any, formDataImage?: false): Promise<number> => {
    try {
      const response = await axiosInstanceUser.put(`${API_URL}users/update/${userId}`, formData, 
        {
          headers: {
            'Content-Type': formDataImage ? 'multipart/form-data' : 'application/json', // Indique que les données sont au format FormData
          },
        }
      );
      return response.status;
    } catch (error) {
      return handleAxiosError(error);
    }
  };

  const updatePhoto = async (userId: string, formData: any): Promise<number> => {
    try {
      const response = await axiosInstanceUser.put(`${API_URL}users/update-photo/${userId}`, formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Indique que les données sont au format FormData
          },
        }
      );
      return response.status;
    } catch (error) {
      return handleAxiosError(error);
    }
  };

  const register = async (formData: any): Promise<number> => {
    try {
      const response = await axios.post(`${API_URL}users/signup`, formData);
      return response.status;
    } catch (error) {
      return handleAxiosError(error);
    }
  };

  const activateAccount = async (code: string): Promise<number> => {
    try {
      const response = await axios.post(`${API_URL}users/active-account`, { code });
      return response.status;
    } catch (error) {
      return handleAxiosError(error);
    }
  };

  const resendCodeActivation = async (email: string): Promise<number> => {
    try {
      const response = await axios.post(`${API_URL}users/resend-activation-code`, { email });
      return response.status;
    } catch (error) {
      return handleAxiosError(error);
    }
  };

  const verifyEmail = async (email: string): Promise<number> => {
    try {
      const response = await axios.post(`${API_URL}users/verify-email`, { email });
      return response.status;
    } catch (error) {
      return handleAxiosError(error);
    }
  };

  const confirmEmail = async (code: string): Promise<number> => {
    try {
      const response = await axios.post(`${API_URL}users/confirm-email`, { code });
      localStorage.setItem('email__', response.data?.email);
      return response.status;
    } catch (error) {
      return handleAxiosError(error);
    }
  };

  const resetPassword = async (formData: any): Promise<number> => {
    try {
      const response = await axios.post(`${API_URL}users/reset-password`, formData);
      return response.status;
    } catch (error) {
      return handleAxiosError(error);
    }
  };

  const login = async (formData: any): Promise<number> => {
    try {
      const response = await axios.post(`${API_URL}users/signin`, formData);
      
      if (response.status === 200) {
        const data = response.data;
        const decoded: JWTToken = jwtDecode(data.accessToken);
        setUser(decoded.user);
        setToken(decoded);
        console.log(decoded)
        
        localStorage.setItem("accessToken", data.accessToken);
        
        // Synchroniser avec les cookies pour le middleware
        syncTokenToCookies();
        
        // Associer la session anonyme à l'utilisateur connecté
        associateSessionToUser();
      }
      return response.status;
    } catch (error) {
      return handleAxiosError(error);
    }
  };

  const logout = () => {
    clearTokenFromStorage();
    setUser(null);
    setToken(null);
    window.location.href = '/fr'
  };


  useEffect(() => {
    // Vérifier d'abord localStorage (Remember Me activé), puis sessionStorage
    let token: string | null = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => 
      cookie.trim().startsWith('accessToken=')
    );

    if (token === null || token === undefined) {
      token = String(tokenCookie)
    }

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const userDetail = decoded.user;
        // Vérifier si le token n'est pas expiré
        const currentTime = Date.now() / 1000;
        if (decoded.exp > currentTime) {
          setUser(userDetail);
          setToken(token);
          syncTokenToCookies(); // Sync token to cookies for middleware
        } else {
          // Token expiré, nettoyer le stockage
          localStorage.removeItem("accessToken");
          sessionStorage.removeItem("accessToken");
          clearTokenFromStorage();
        }
      } catch (error) {
        // Token invalide, nettoyer le stockage
        console.error('Token invalide:', error);
        clearTokenFromStorage();
      }
    }

    //
    fetch("https://ipinfo.io/json?token=2bd97a10417331")
    .then((response) => response.json())
    .then((jsonResponse) => 
    {
      const countryInfo = country.find((c: any) => c.countryCode === jsonResponse.country);
      const currency = countryInfo?.currencyCode || "USD";
      setCurrency(currency)
    });
  }, []);

  const context = {
    user,
    token,
    currency,
    login,
    register,
    logout,
    activateAccount,
    verifyEmail,
    confirmEmail,
    resetPassword,
    resendCodeActivation,
    getUserById,
    updatePhoto,
    updateUser
  };

  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>;
};
