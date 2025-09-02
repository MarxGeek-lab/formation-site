"use client"
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/contexts/AuthContext';

const publicRoutes = ['/en/auth/login', '/fr/auth/login', '/en/auth/forgot-password', '/fr/auth/forgot-password', '/en/auth/verify-email', '/fr/auth/verify-email', '/en/auth/reset-password', '/fr/auth/reset-password'];

export default function ProtectedRoute({ children }) {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Attendre un court instant pour permettre l'initialisation de l'authentification
    const timer = setTimeout(() => {
      if (!user && !token && !publicRoutes.includes(pathname)) {
        router.push('/en/auth/login');
      }
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [user, token, router, pathname]);

  // Pendant le chargement, afficher les enfants pour éviter un flash
  if (isLoading) {
    return children;
  }

  // Si on est sur une route publique ou si l'utilisateur est authentifié, afficher le contenu
  if (publicRoutes.includes(pathname) || (user && token)) {
    return children;
  }

  // Dans tous les autres cas, ne rien afficher pendant la redirection
  return null;
}
