'use client';
import { createContext, useContext, useEffect, useState } from "react";
import api from "@/configs/api";
import axios from "axios"
import { handleAxiosError } from "@/utils/errorHandlers";
import { API_URL } from "@/settings";
import { jwtDecode } from "jwt-decode";

const AdminStore = createContext({
    getAllUsers: async () => ({ data: [], status: 500 }),
    getUserDataById: async () => ({ data: nulgl, status: 500 }),
    managedUserStatus: async () => 500,
    
    // Properties
    getAllProperties: async () => ({ data: [], status: 500 }),
    managedPropertyStatus: async () => 500,
    
    // categories
    allCategories: [],
    getAllCategories: async () => ({ data: [], status: 500 }),
    createCategory: async () => 500,
    updateCategory: async () => 500,
    deleteCategory: async () => 500,
    updateStatusCategory: async () => 500,
    
    // payments
    getAllPayments: async () => ({ data: [], status: 500 }),
    getPaymentById: async () => ({ data: null, status: 500 }),
    unlockFunds: async () => 500,
    
    // Supports
    getAllSupportsContact: async () => ({ data: [], status: 500 }),

    // stats
    getGlobalStats: async () => ({ data: null, status: 500 }),

    // admin
    allAdmin: [],
    getAllAdmin: async () => ({ data: [], status: 500 }),
    createAdmin: async () => 500,
    updateAdmin: async () => 500,
    updateStatusAdmin: async () => 500,
    deleteAdmin: async () => 500,
    fetchNotifications: async () => ({ data: null, status: 500 }),
    resetPassword: async () => 500,
    signIn: async () => 500,
    forgotPassword: async () => 500,
    signOut: async () => 500,

    // withdrawals
    getAllWithdrawalsByAdmin: async () => ({ data: [], status: 500 }),
    updateWithdrawalStatus: async () => 500,
    payClient: async () => 500,

    // user
    desactiveUser: async () => 500,
    deleteUser: async () => 500,
});

export const useAdminStore = () => useContext(AdminStore);

export const AdminProvider = ({ children }) => {
    const [allCategories, setAllCategories] = useState([]);
    const [allAdmin, setAllAdmin] = useState([]);

    const getAllUsers = async () => {
        try {
            const response = await api.get(`admin/users`);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: [], status: handleAxiosError(error) };
        }
    };

    const managedUserStatus = async (formData) => {
        try {
            console.log(formData)
            const response = await api.post("admin/update-user-status", formData);
            return response.status;
        } catch (error) {
            return handleAxiosError(error);
        }
    };

    const getUserDataById = async (userId) => {
        try {
            const response = await api.get(`admin/user-info/${userId}`);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: null, status: handleAxiosError(error) };
        }
    };

    /* Properties */

    const getAllProperties = async () => {
        try {
          const response = await api.get("admin/properties");
          return { data: response.data, status: response.status };
        } catch (error) {
          return { data: [], status: handleAxiosError(error) };
        }
    };

    const managedPropertyStatus = async (formData) => {
        try {
            const response = await api.post("admin/property/update-status", formData);
            return response.status;
        } catch (error) {
            return handleAxiosError(error);
        }
    };

    /* Categories */

    const getAllCategories = async () => {
        try {
          const response = await api.get("admin/category");
          setAllCategories(response.data);
          return { data: response.data, status: response.status };
        } catch (error) {
          return { data: [], status: handleAxiosError(error) };
        }
    };

    const createCategory = async (formData) => {
        try {
          const response = await api.post("admin/category", formData);
          return response.status;
        } catch (error) {
          return handleAxiosError(error);
        }
    };

    const updateCategory = async (id, formData) => {
        try {
          const response = await api.put(`admin/category/${id}`, formData);
          return response.status;
        } catch (error) {
          return handleAxiosError(error);
        }
    };

    const deleteCategory = async (id) => {
        try {
          const response = await api.delete(`admin/category/${id}`);
          return response.status;
        } catch (error) {
          return handleAxiosError(error);
        }
    };

    const updateStatusCategory = async (id, formData) => {
        try {
          const response = await api.put(`admin/category/${id}`, formData);
          return response.status;
        } catch (error) {
          return handleAxiosError(error);
        }
    };


    /* ************payments ****************/
    const getAllPayments = async () => {
      try {
          const response = await api.get(`admin/payments`);
          return { data: response.data, status: response.status };
      } catch (error) {
          return { data: [], status: handleAxiosError(error) };
      }
    };

    const getPaymentById = async (id) => {
      try {
          const response = await api.get(`admin/payment/${id}`);
          return { data: response.data, status: response.status };
      } catch (error) {
          return { data: [], status: handleAxiosError(error) };
      }
    };

    const unlockFunds = async (formData) => {
      try {
        // Si c'est une résolution de litige, on utilise un endpoint différent
        const endpoint = formData.decision ? 'admin/resolve-dispute' : 'admin/unlock-funds';
        const response = await api.put(endpoint, formData);
        return response.status;
      } catch (error) {
        return handleAxiosError(error);
      }
    };

    /***
     * Suports
     */

    const getAllSupportsContact = async () => {
      try {
          const response = await api.get(`admin/supports`);
          return { data: response.data, status: response.status };
      } catch (error) {
          return { data: [], status: handleAxiosError(error) };
      }
    };


    /**
     * Stats
     */
    const getGlobalStats = async () => {
      try {
          const response = await api.get(`admin/sta`);
          return { data: response.data, status: response.status };
      } catch (error) {
          return { data: [], status: handleAxiosError(error) };
      }
    };


    /***
     * Admins
     */
    const getAllAdmin = async () => {
      try {
          const response = await api.get(`admin`);
          setAllAdmin(response.data);
          return { data: response.data, status: response.status };
      } catch (error) {
          return { data: [], status: handleAxiosError(error) };
      }
    };

    const createAdmin = async (formData) => {
      try {
        const response = await api.post("admin", formData);
        return response.status;
      } catch (error) {
        return handleAxiosError(error);
      }
  };

  const updateAdmin = async (id, formData) => {
      try {
        const response = await api.patch(`admin/${id}`, formData);
        return response.status;
      } catch (error) {
        return handleAxiosError(error);
      }
  };

  const updateStatusAdmin = async (id, formData) => {
    try {
      const response = await api.put(`admin/update-status/${id}`, formData);
      return response.status;
    } catch (error) {
      return handleAxiosError(error);
    }
};

  const deleteAdmin = async (id) => {
      try {
        const response = await api.delete(`admin/${id}`);
        return response.status;
      } catch (error) {
        return handleAxiosError(error);
      }
  };

  const getAdminById = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}admin/${userId}`);
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: null, status: handleAxiosError(error) };
    }
  };

  const fetchNotifications = async (id, type) => {
    try {
      const response = await api.get(`messages/notification/${id}/${type}`); // Remplacez par votre endpoint
      return {data: response.data, status: response.status };
    } catch (err) {
      return {data: [], status: handleAxiosError(err) || 500};
    } 
  };


  // Withdrawals
  const getAllWithdrawalsByAdmin = async () => {
    try {
      const response = await api.get("admin/withdrawals");
      return { data: response.data, status: response.status };
    } catch (err) {
      return { data: [], status: handleAxiosError(err) || 500 };
    }
  };


  const updateWithdrawalStatus = async (formData) => {
    try {
      const response = await api.put(`admin/withdrawal/update-status`, formData);
      return response.status;
    } catch (error) {
      return handleAxiosError(error);
    }
  };

  const payClient = async (formData) => {
    try {
      const response = await api.put(`admin/withdrawal/pay-client`, formData, {
        timeout: 120000 // Augmentation du timeout à 120 secondes (2 minutes)
      });
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: null, status: handleAxiosError(error) || 500 };
    }
  };

  const desactiveUser = async (id) => {
    try {
      const response = await api.put(`admin/desactive-user/${id}`);
      return response.status;
    } catch (error) {
      return handleAxiosError(error);
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await api.delete(`admin/delete-user/${id}`);
      return response.status;
    } catch (error) {
      return handleAxiosError(error);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);
  
  const data = {
    getAllUsers,
    managedUserStatus,
    getUserDataById,
    desactiveUser,
    deleteUser,

    // properties
    getAllProperties,
    managedPropertyStatus,

    // categories
    allCategories,
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    updateStatusCategory,

    // payments
    getAllPayments,
    getPaymentById,
    unlockFunds,

    // supports
    getAllSupportsContact,

    // stats
    getGlobalStats,

    // admin
    allAdmin,
    getAllAdmin,
    createAdmin,
    updateAdmin,
    updateStatusAdmin,
    deleteAdmin,
    fetchNotifications,

    // withdrawals
    getAllWithdrawalsByAdmin,
    updateWithdrawalStatus,
    payClient
  };

  return (
      <AdminStore.Provider value={data}>
          {children}
      </AdminStore.Provider>
  );
};
