"use client";

import Image from "next/image";
import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { Box, Container, Badge } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import { useCart } from '@/contexts/CartContext';

import styles from './Header/Header.module.scss';

import logo from '@/assets/images/logo-1.webp'; 
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/contexts/GlobalContext";
import { Translate } from "./Translate";

export default function Header({ locale }: { locale: string }) {
  const { user } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme, mounted } = useTheme();
  const router = useRouter();
  const t = useTranslations('Header');
  const { cart, toggleCart } = useCart();

  console.log(locale);

  return (
    <Container maxWidth="lg" className="sticky top-0 z-50">
    <header className={`${styles.header} `} style={{ 
      backgroundColor: 'var(--background)', 
      borderColor: theme === 'dark' ? 'var(--primary-border)' : '#f3f4f6' }}
      >
      <Box className="mx-auto"
        sx={{
          py: {xs: 0.6, sm: 1, md: 2}
        }}>
        <Box className="flex items-center justify-between">
          {/* Logo */}
          <Box className="flex items-center">
            <a href={`/${locale}`}>
              <Image 
                src={logo} 
                alt="Rafly Logo" 
                width={99} 
                height={35}
                className={styles.logo}
              />
            </a>
          </Box>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {/* <a href={`/${locale}/catalogue`} className={styles.navLink}>
              {t('catalogue')}
            </a> */}
            
            <a href={`/${locale}#tarification`} className={styles.navLink}>
              {t('pricing')}
            </a>
            <a href={`/${locale}/affiliation`} className={styles.navLink}>
              {t('affiliation')}
            </a>
           
            <a href={`/${locale}#produit-mystere`} className={styles.navLink}>
              {t('mysteryProduct')}
            </a>
            {/* <a href={`/${locale}/support`} className={styles.navLink}>
              {t('support')}
            </a> */}
            <a href={`/${locale}/a-propos`} className={styles.navLink}>
              {t('about')}
            </a>
            <a href={`/${locale}/panier`} className={styles.navLink}>
              {t('cart')}
            </a>
          </nav>

          {/* Language Switcher, Cart, Theme Toggle & CTA Button */}
          <Box className="hidden lg:flex items-center space-x-3">
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Cart Icon */}
            {/* <button 
              onClick={toggleCart}
              className={styles.cartButton}
              aria-label="Panier"
            >
              <Badge badgeContent={cart.totalItems} color="primary">
                <ShoppingCart />
              </Badge>
            </button>
             */}
            {/* Theme Toggle Button */}
            {/* {mounted && (
              <button
                onClick={toggleTheme}
                className={styles.themeToggle}
                aria-label={`Passer au thème ${theme === 'light' ? 'sombre' : 'clair'}`}
              >
                {theme === 'light' ? (
                  // Icône lune pour passer au mode sombre
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                ) : (
                  // Icône soleil pour passer au mode clair
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            )} */}
            
            {/* CTA Button */}
            <button className={styles.ctaButton2} 
              onClick={() => {
                if (user) {
                  router.push(`/${locale}/dashboard`);
                } else {
                  router.push(`/${locale}/connexion`);
                }
              }}>
                <Translate text="Mon Compte" lang={locale} /> 
            </button>
            <button className={styles.ctaButton} 
              onClick={() => router.push(`/${locale}/catalogue`)}>
              {t('viewCatalogue')}
            </button>
          </Box>

          {/* Mobile menu button */}
           {/* Language Switcher & Cart for Mobile */}
          <Box className="lg:hidden flex items-center space-x-3">
            <LanguageSwitcher />
          </Box>
          
          <button
            className={`lg:hidden ${styles.mobileMenuButton}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={t('menuToggle')}
          >
            {isMobileMenuOpen ? (
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </Box>

        {/* Mobile Navigation */}
       
        {isMobileMenuOpen && (
          <nav className={`md:hidden ${styles.mobileNav}`}>
            <div className={styles.mobileNavLinks}>
              <a href={`/${locale}#tarification`} className={styles.mobileNavLink}>
                {t('pricing')}
              </a>
              <a href={`/${locale}/affiliation`} className={styles.mobileNavLink}>
                {t('affiliation')}
              </a>
              <a href={`/${locale}#produit-mystere`} className={styles.mobileNavLink}>
                {t('mysteryProduct')}
              </a>
              <a href={`/${locale}/support`} className={styles.mobileNavLink}>
                {t('support')}
              </a>
              <a href={`/${locale}/a-propos`} className={styles.mobileNavLink}>
                {t('about')}
              </a>
              <a href={`/${locale}/panier`} className={styles.mobileNavLink}>
                {t('cart')}
              </a>
              {/* Theme Toggle Mobile */}
              {/* {mounted && (
                <button
                  onClick={toggleTheme}
                  className={`${styles.themeToggle} ${styles.mobile}`}
                  aria-label={`Passer au thème ${theme === 'light' ? 'sombre' : 'clair'}`}
                >
                  {theme === 'light' ? (
                    <>
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                      Mode sombre
                    </>
                  ) : (
                    <>
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                      </svg>
                      Mode clair
                    </>
                  )}
                </button>
              )} */}
              <button className={styles.ctaButton2} 
              onClick={() => {
                if (user) {
                  router.push(`/${locale}/dashboard`);
                } else {
                  router.push(`/${locale}/connexion`);
                }
              }}>
                <Translate text="Mon Compte" lang={locale} /> 
            </button>
              <button className={`${styles.ctaButton} ${styles.fullWidth}`}
                onClick={() => router.push(`/${locale}/catalogue`)}>
                {t('viewCatalogue')}
              </button>
            </div>
          </nav>
        )}
      </Box>
    </header>
    </Container>
  );
}
