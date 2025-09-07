// Utilitaire pour le système de tracking pixel

import { API_URL } from "@/settings/constant";

// Générer un sessionId unique pour les utilisateurs non connectés
export const generateSessionId = () => {
  if (typeof window !== 'undefined') {
    let sessionId = localStorage.getItem('tracking_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('tracking_session_id', sessionId);
    }
    return sessionId;
  }
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Obtenir le sessionId actuel
export const getSessionId = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('tracking_session_id') || generateSessionId();
  }
  return null;
};

// Obtenir l'userId si l'utilisateur est connecté
export const getUserId = () => {
  if (typeof window !== 'undefined') {
    // Essayer de récupérer depuis le localStorage ou le contexte d'authentification
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.user?._id || payload.user?.id || null;
      } catch (error) {
        console.warn('Erreur lors du décodage du token:', error);
        return null;
      }
    }
  }
  return null;
};

// URL de base pour l'API de tracking
const TRACKING_API_BASE = process.env.NEXT_PUBLIC_API_URL || API_URL || 'http://localhost:5000/api';

// Fonction principale pour envoyer un événement de tracking
export const trackEvent = (type, options = {}) => {
  try {
    if (typeof window === 'undefined') return; // Ne pas tracker côté serveur

    const sessionId = getSessionId();
    const userId = getUserId();

    // Paramètres de base
    const params = new URLSearchParams({
      type,
      sessionId
    });

    // Ajouter l'userId si disponible
    if (userId) {
      params.append('userId', userId);
    }

    // Ajouter les paramètres spécifiques selon le type d'événement
    if (type === 'view' || type === 'add_to_cart') {
      if (options.productId) {
        params.append('productId', options.productId);
      }
    }

    if (type === 'purchase') {
      if (options.orderId) {
        params.append('orderId', options.orderId);
      }
      if (options.value) {
        params.append('value', options.value.toString());
      }
    }

    // Créer l'image pixel
    const img = new Image();
    img.style.display = 'none';
    img.src = `${TRACKING_API_BASE}/tracking/pixel?${params.toString()}`;
    
    // Ajouter l'image au DOM temporairement
    document.body.appendChild(img);
    
    // Supprimer l'image après un délai
    setTimeout(() => {
      if (img.parentNode) {
        img.parentNode.removeChild(img);
      }
    }, 1000);

  } catch (error) {
    console.warn('Erreur lors du tracking:', error);
  }
};

// Fonctions spécialisées pour chaque type d'événement

// Tracker une vue de produit
export const trackProductView = (productId) => {
  trackEvent('view', { productId });
};

// Tracker un ajout au panier
export const trackAddToCart = (productId) => {
  trackEvent('add_to_cart', { productId });
};

// Tracker un achat
export const trackPurchase = (orderId, value) => {
  trackEvent('purchase', { orderId, value });
};

// Associer une session à un utilisateur (appelé lors de la connexion)
export const associateSessionToUser = async () => {
  try {
    const sessionId = getSessionId();
    const userId = getUserId();

    if (!sessionId || !userId) return;

    const response = await fetch(`${TRACKING_API_BASE}/tracking/associate-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sessionId,
        userId
      })
    });

    if (response.ok) {
      console.log('Session associée avec succès à l\'utilisateur');
    }
  } catch (error) {
    console.warn('Erreur lors de l\'association session-utilisateur:', error);
  }
};

// Hook React pour le tracking
export const useTracking = () => {
  return {
    trackProductView,
    trackAddToCart,
    trackPurchase,
    associateSessionToUser,
    sessionId: getSessionId(),
    userId: getUserId()
  };
};
