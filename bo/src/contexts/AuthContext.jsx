"use client"
import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import api from "@/configs/api";
import { handleAxiosError } from "@/utils/errorHandlers";
import { API_URL, URL_SITE } from "@/settings";

const AuthContext = createContext({
  user: null,
  token: null,
  profile: null,
  signOut: () => {},
  getUserById: async () => ({ data: null, status: 500 }),
  updateUser: async () => 500,
  updatePhoto: async () => 500,
  resetPassword: async () => 500,
  forgotPassword: async () => 500,
  signIn: async () => 500,
  /*activateAccount: async () => 500,
  verifyEmail: async () => 500,
  confirmEmail: async () => 500,
  resendCodeActivation: async () => 500, */
});

export const useAuthStore = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);

  const updateUser = async (userId, formData) => {
    try {
      const response = await api.put(`users/update/${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.status;
    } catch (error) {
      return handleAxiosError(error);
    }
  };

  const updatePhoto = async (userId, formData) => {
    try {
      const response = await api.put(`users/update-photo/${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.status;
    } catch (error) {
      return handleAxiosError(error);
    }
  };

 
   const resetPassword = async (formData) => {
     try {
       const response = await axios.post(`${API_URL}admin/reset-password`, formData);
       return response.status;
     } catch (error) {
       return handleAxiosError(error);
     }
   };
 
 
   const forgotPassword = async (formData) => {
     try {
       const response = await axios.post(`${API_URL}admin/forgot-password`, formData);
       return response.status;
     } catch (error) {
       return handleAxiosError(error);
     }
   };
   const signIn = async (formData) => {
     try {
       const response = await axios.post(`${API_URL}admin/login`, formData);
       if (response.status === 200) {
         const data = response.data;
         console.log(data)
         const decoded = jwtDecode(data.accessToken);
         setUser(decoded.user);
         setToken(decoded);
         getUserById(decoded.user._id);
         localStorage.setItem("accessToken", data.accessToken);
       }
       return response.status;
     } catch (error) {
       console.log(error)
       return handleAxiosError(error);
     }
   };

  const getUserById = async (userId) => {
    try {
      const response = await api.get(`admin/${userId}`);
      setProfile(response.data);
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: null, status: handleAxiosError(error) };
    }
  };

 const signOut = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    setToken(null);
    window.location.href = '/fr/auth/login';
  }; 

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded.user);
      setToken(token);
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      profile,
      signIn,
      getUserById,
      signOut,
      resetPassword,
      forgotPassword,
      /* 
      signUp,
      activateAccount,
      verifyEmail,
      confirmEmail,
      resendCodeActivation,
       */
      updatePhoto,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
