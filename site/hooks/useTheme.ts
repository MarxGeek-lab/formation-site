"use client";

import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Récupérer le thème depuis localStorage ou utiliser 'dark' par défaut
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Appliquer le thème au document
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', theme);
      // Force un re-render en modifiant une propriété CSS
      document.body.style.setProperty('--theme-updated', Date.now().toString());
    }
  }, [theme, mounted]);

  return { theme, toggleTheme, mounted };
}
