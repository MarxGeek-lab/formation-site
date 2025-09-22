'use client'

import api from '@/configs/api'
import { createContext, useContext, useState } from 'react'

const ProductContext = createContext()

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/products')
      if (response.data.success) {
        setProducts(response.data.products)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des produits')
      console.error('Erreur fetchProducts:', err)
    } finally {
      setLoading(false)
    }
  }

  const getProductById = async (productId) => {
    try {
      const response = await api.get(`/products/${productId}`)
      if (response.data.success) {
        return response.data.product
      }
    } catch (err) {
      console.error('Erreur getProductById:', err)
      throw err
    }
  }

  const searchProducts = async (query) => {
    try {
      const response = await api.get(`/products/search?q=${encodeURIComponent(query)}`)
      if (response.data.success) {
        return response.data.products
      }
      return []
    } catch (err) {
      console.error('Erreur searchProducts:', err)
      return []
    }
  }

  const value = {
    products,
    loading,
    error,
    fetchProducts,
    getProductById,
    searchProducts,
    setProducts,
    setError
  }

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}

export const useProductStore = () => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProductStore must be used within a ProductProvider')
  }
  return context
}
