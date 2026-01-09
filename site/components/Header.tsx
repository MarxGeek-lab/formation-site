"use client";

import Image from "next/image";
import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { Box, Container, Badge } from "@mui/material";
import { ShoppingBag, ShoppingCart } from "@mui/icons-material";
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import { useCart } from '@/contexts/CartContext';
import LoginModal from './LoginModal';

import styles from './Header/Header.module.scss';

import logo from '@/assets/images/logo_academie_marxgeek.png';
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/contexts/GlobalContext";
import { Translate } from "./Translate";

export default function Header({ locale }: { locale: string }) {
  const { user } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { theme, toggleTheme, mounted } = useTheme();
  const router = useRouter();
  const t = useTranslations('Header');
  const { cart, toggleCart } = useCart();

  console.log(locale);

  // Gérer l'ouverture du modal ou la navigation
  const handleAccountClick = () => {
    if (user) {
      router.push(`/${locale}/dashboard`);
    } else {
      router.push(`/${locale}/connexion`);
    }
  };

  return (
    <header className={styles.header}>
      <Box className={styles.headerContainer}>
        <Box className={styles.headerContent}>
          {/* Logo */}
          <Box className={styles.logoWrapper}>
            <a href={`/${locale}`}>
              <Image
                src={logo}
                alt="MarxGeek Academy Logo"
                width={160}
                // className={styles.logo}
              />
            </a>
          </Box>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav}>
            <a href={`/${locale}#tarification`} className={styles.navLink}>
              {/* {t('pricing')} */}
              Accueil
            </a>
            <a href={`/${locale}#formations`} className={styles.navLink}>
              {/* {t('pricing')} */}
              Nos Formations
            </a>
            <a href={`/${locale}#abonnements`} className={styles.navLink}>
              {/* {t('pricing')} */}
              Nos Abonnements
            </a>
            <a href={`/${locale}/a-propos`} className={styles.navLink}>
              {t('about')}
            </a>
          </nav>

          {/* Right Section */}
          <Box className={styles.rightSection}>
            {/* <LanguageSwitcher /> */}

            <button
              onClick={toggleCart}
              className={styles.cartButton}
              aria-label="Panier"
            >
              <Badge badgeContent={cart.totalItems} color="error">
                <ShoppingCart />
              </Badge>
            </button>

            <button className={styles.ctaButton} onClick={handleAccountClick}>
              <Translate text="Mon Compte" lang={locale} />
            </button>

            <button
              className={styles.mobileMenuButton}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={t('menuToggle')}
            >
              {isMobileMenuOpen ? (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </Box>
        </Box>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className={styles.mobileNav}>
            <a href={`/${locale}#tarification`} className={styles.navLink}>
              {/* {t('pricing')} */}
              Accueil
            </a>
            <a href={`/${locale}#formations`} className={styles.navLink}>
              {/* {t('pricing')} */}
              Nos Formations
            </a>
            <a href={`/${locale}#abonnements`} className={styles.navLink}>
              {/* {t('pricing')} */}
              Nos Abonnements
            </a>
            <a href={`/${locale}/a-propos`} className={styles.navLink}>
              {t('about')}
            </a>

            <button className={styles.ctaButtonMobile} onClick={handleAccountClick}>
              <Translate text="Mon Compte" lang={locale} />
            </button>
          </nav>
        )}
      </Box>

      {/* Login Modal */}
      <LoginModal
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        locale={locale}
      />
    </header>
  );
}
