"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/contexts/GlobalContext';
import { CircularProgress, Box } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  redirectTo = '/fr/connexion' ,
  // params: { locale }
}: ProtectedRouteProps) => {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // Vérifier si l'utilisateur est authentifié
      const token: string | null = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(cookie => 
        cookie.trim().startsWith('accessToken=')
      );
    
      const isAuthenticated = tokenCookie || token;
      
      if (requireAuth && !isAuthenticated) {
        // Sauvegarder l'URL actuelle pour redirection après connexion
        const currentPath = window.location.pathname;
        const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
        router.push(redirectUrl);
        return;
      }
      
      if (!requireAuth && isAuthenticated) {
        // Si l'utilisateur est connecté et essaie d'accéder à une page d'auth
        router.push('/fr/dashboard');
        return;
      }
      
      setIsLoading(false);
    };

    // Attendre un peu pour que le contexte d'auth se charge
    const timer = setTimeout(checkAuth, 100);
    
    return () => clearTimeout(timer);
  }, [requireAuth, redirectTo, router]);

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
