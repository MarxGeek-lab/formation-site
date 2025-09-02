import axios from 'axios';

import { API_URL } from '@/settings';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 secondes
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour la configuration des requêtes
api.interceptors.request.use(
  async (config) => {
    try {
      // Récupérer le token depuis localStorage
      const token = await localStorage.getItem('accessToken');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Si c'est une requête FormData, ajuster le Content-Type
      if (config.data instanceof FormData) {
        config.headers['Content-Type'] = 'multipart/form-data';
      }

      return config;
    } catch (error) {
      console.error('Request Interceptor Error:', error);
      
return Promise.reject(error);
    }
  },
  (error) => {
    console.error('Request Error:', error);
    
return Promise.reject(error);
  }
);

// Intercepteur pour le logging des réponses
api.interceptors.response.use(
  (response) => {
   /*  console.log('Response:', {
      status: response.status,
      headers: response.headers,
      data: response.data
    }); */
    
return response;
  },
  (error) => {
    // Gérer les erreurs d'authentification
    console.log('Response Error:', error)
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('accessToken');
      // Rediriger vers la page de connexion ou rafraîchir le token
    }

   /*  console.log('Response Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    }); */
    
return Promise.reject(error);
  }
);

export default api;
