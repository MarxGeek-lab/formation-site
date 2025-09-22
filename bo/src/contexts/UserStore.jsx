'use client'

import api from '@/configs/api'
import { createContext, useContext, useState } from 'react'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/users')
      if (response.data.success) {
        setUsers(response.data.users)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des utilisateurs')
      console.error('Erreur fetchUsers:', err)
    } finally {
      setLoading(false)
    }
  }

  const getUserById = async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`)
      if (response.data.success) {
        return response.data.user
      }
    } catch (err) {
      console.error('Erreur getUserById:', err)
      throw err
    }
  }

  const searchUsers = async (query) => {
    try {
      const response = await api.get(`/users/search?q=${encodeURIComponent(query)}`)
      if (response.data.success) {
        return response.data.users
      }
      return []
    } catch (err) {
      console.error('Erreur searchUsers:', err)
      return []
    }
  }

  const value = {
    users,
    loading,
    error,
    fetchUsers,
    getUserById,
    searchUsers,
    setUsers,
    setError
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserStore = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUserStore must be used within a UserProvider')
  }
  return context
}
