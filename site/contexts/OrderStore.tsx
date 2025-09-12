"use client";
import axios from "axios";
import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import { API_URL } from "../settings/constant";
import { handleAxiosError } from "../utils/errorHandlers";
import axiosInstanceUser from "../config/axiosConfig";

interface Order {
  _id?: string;
  customerId?: string;
  products?: any[];
  status?: string;
  isDelivered?: boolean;
  totalAmount?: number;
  createdAt?: Date;
}

interface OrderStore {
  orders: any[];
  createOrder: (order: any) => Promise<{ data: any; status: number }>;
  getUserOrders: (customerId: string) => Promise<{ data: any[] | null; status: number }>;
  getOrderById: (id: string) => Promise<{ data: Order | null; status: number }>;
  updateOrderStatus: (id: string, status: string) => Promise<{ data: any; status: number }>;
  markAsDelivered: (id: string) => Promise<{ data: any; status: number }>;
  cancelOrder: (id: string) => Promise<{ data: any; status: number }>;
  downloadContrat: (id: string) => Promise<{ data: any; status: number }>;
}

const OrderContext = createContext<OrderStore>({
  orders: [],
  createOrder: async () => ({ data: null, status: 500 }),
  getUserOrders: async () => ({ data: null, status: 500 }),
  getOrderById: async () => ({ data: null, status: 500 }),
  updateOrderStatus: async () => ({ data: null, status: 500 }),
  markAsDelivered: async () => ({ data: null, status: 500 }),
  cancelOrder: async () => ({ data: null, status: 500 }),
  downloadContrat: async () => ({ data: null, status: 500 }),
});

export const useOrderStore = () => useContext(OrderContext);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const createOrder = async (order: any): Promise<{ data: any; status: number }> => {
    try {
      const response = await axiosInstanceUser.post(`${API_URL}orders`, order);
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: null, status: handleAxiosError(error) };
    }
  };

  const getUserOrders = async (customerId: string): Promise<{ data: Order[] | null; status: number }> => {
    const affiliateCookie = document.cookie.split(';').find((c) =>
      c.trim().startsWith("affiliate_ref=")
    );
    console.log("affiliateCookie == ", affiliateCookie?.split("=")[1])
    try {
      const response = await axiosInstanceUser.get(`${API_URL}orders/user/${customerId}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Affiliate-Ref': affiliateCookie?.split("=")[1],
        },
      });
      setOrders(response.data);
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: null, status: handleAxiosError(error) };
    }
  };

  const getOrderById = async (id: string): Promise<{ data: Order | null; status: number }> => {
    try {
      const response = await axiosInstanceUser.get(`${API_URL}orders/${id}`);
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: null, status: handleAxiosError(error) };
    }
  };

  const updateOrderStatus = async (id: string, status: string): Promise<{ data: any; status: number }> => {
    try {
      const response = await axiosInstanceUser.patch(`${API_URL}orders/${id}/status`, { status });
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: null, status: handleAxiosError(error) };
    }
  };

  const markAsDelivered = async (id: string): Promise<{ data: any; status: number }> => {
    try {
      const response = await axiosInstanceUser.patch(`${API_URL}orders/${id}/deliver`);
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: null, status: handleAxiosError(error) };
    }
  };

  const cancelOrder = async (id: string): Promise<{ data: any; status: number }> => {
    try {
      const response = await axiosInstanceUser.patch(`${API_URL}orders/${id}/cancel`);
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: null, status: handleAxiosError(error) };
    }
  };

  const downloadContrat = async (id: string): Promise<{ data: any; status: number }> => {
    try {
      const response = await axiosInstanceUser.get(`${API_URL}orders/${id}/contrat`);
      return { data: response.data, status: response.status };
    } catch (error) {
      return { data: null, status: handleAxiosError(error) };
    }
  };

  const data: OrderStore = {
    orders,
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    markAsDelivered,
    cancelOrder,
    downloadContrat,
  };

  return <OrderContext.Provider value={data}>{children}</OrderContext.Provider>;
};
