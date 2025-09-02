"use client";

// Utilitaire pour synchroniser le token entre localStorage/sessionStorage et les cookies
export const syncTokenToCookies = () => {
  if (typeof window !== 'undefined') {
    // Vérifier d'abord localStorage (Remember Me), puis sessionStorage
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    
    if (token) {
      // Définir la durée du cookie selon le type de stockage
      const isRememberMe = localStorage.getItem('accessToken') !== null;
      const maxAge = isRememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 jours ou 24h
      
      // Définir le cookie avec le token
      document.cookie = `accessToken=${token}; path=/; max-age=${maxAge}; secure; samesite=strict`;
    } else {
      // Supprimer le cookie si pas de token
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }
};

// Supprimer le token des cookies, localStorage et sessionStorage
export const clearTokenFromStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};

// Récupérer le token depuis localStorage, sessionStorage ou cookies
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    // Essayer localStorage d'abord (Remember Me)
    const localToken = localStorage.getItem('accessToken');
    if (localToken) {
      return localToken;
    }
    
    // Essayer sessionStorage ensuite (session temporaire)
    const sessionToken = sessionStorage.getItem('accessToken');
    if (sessionToken) {
      return sessionToken;
    }
    
    // Fallback sur les cookies
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => 
      cookie.trim().startsWith('accessToken=')
    );
    
    if (tokenCookie) {
      return tokenCookie.split('=')[1];
    }
  }
  
  return null;
};
