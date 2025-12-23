'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/contexts/GlobalContext';

export function useSessionCheck() {
  const { user, logout } = useAuthStore();

  useEffect(() => {
    // Vérifier la session toutes les 5 minutes
    const checkSession = () => {
      if (typeof window === 'undefined') return;

      const sessionExpiry = localStorage.getItem('sessionExpiry');

      if (sessionExpiry) {
        const expiryTime = parseInt(sessionExpiry, 10);
        const currentTime = Date.now();

        // Si la session a expiré
        if (currentTime > expiryTime) {
          console.log('Session expirée - Déconnexion automatique');

          // Supprimer les données de session
          localStorage.removeItem('sessionExpiry');

          // Déconnecter l'utilisateur
          if (user && logout) {
            logout();
          }
        }
      }
    };

    // Vérifier immédiatement au montage
    checkSession();

    // Vérifier toutes les 5 minutes
    const interval = setInterval(checkSession, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, logout]);
}
