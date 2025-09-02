"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/configs/api";
import { handleAxiosError } from "@/utils/errorHandlers";
import { useAuthStore } from "@/contexts/AuthContext";

const OrderContext = createContext({
  orders: [],
  fetchOrders: async () => {},
  getOrderById: async () => null,
  createOrder: async () => 500,
  updateOrderStatus: async () => 500,
  deleteOrder: async () => 500,
  reminderOrder: async () => 500,
  cancelOrder: async () => 500,
  sendInvoice: async () => 500,
  downloadInvoice: async () => ({data: null, status: 500}),
});

export const useOrderStore = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await api.get(`admin/orders`);
      setOrders(res.data);
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const getOrderById = async (orderId) => {
    try {
      const res = await api.get(`orders/${orderId}`);
      return res.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  };

  const createOrder = async (orderData) => {
    try {
      const res = await api.post("orders", orderData);
      fetchOrders();
      return res.status;
    } catch (error) {
      return handleAxiosError(error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await api.put(`orders/status/${orderId}`, { status: newStatus });
      fetchOrders();
      return res.status;
    } catch (error) {
      return handleAxiosError(error);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const res = await api.delete(`orders/${orderId}`);
      fetchOrders();
      return res.status;
    } catch (error) {
      return handleAxiosError(error);
    }
  };

  const reminderOrder = async (id) => {
    try {
      const response = await api.patch(`orders/${id}/reminder`);
      return response.status;
    } catch (error) {
      return handleAxiosError(error);
    }
  };

  const cancelOrder = async (id, formData) => {
    try {
        const response = await api.patch(`orders/${id}/cancel`, formData);
        return response.status;
    } catch (error) {
        return handleAxiosError(error);
    }
  };

  const sendInvoice = async (id) => {
    try {
      const response = await api.patch(`orders/${id}/invoice`);
      return response.status;
    } catch (error) {
      return handleAxiosError(error);
    }
  };

  const downloadInvoice = async (id) => {
    try {
      const response = await api.get(`orders/${id}/invoice`);
      return {data: response.data, status: response.status};
    } catch (error) {
      return {data: null, status: handleAxiosError(error)};
    }
  };    

  return (
    <OrderContext.Provider value={{
      orders,
      fetchOrders,
      getOrderById,
      createOrder,
      updateOrderStatus,
      deleteOrder,
      reminderOrder,
      cancelOrder,
      sendInvoice,
      downloadInvoice 
    }}>
      {children}
    </OrderContext.Provider>
  );
};
