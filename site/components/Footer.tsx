"use client";

import Image from "next/image";
import { Box, Container, Typography } from "@mui/material";
import { Email, WhatsApp, Facebook, Twitter, Instagram } from "@mui/icons-material";
import { useTheme } from "../hooks/useTheme";
import logo from '@/assets/images/logo-1.webp';
import styles from './Footer.module.scss';

export default function Footer({ locale }: { locale: string }) {
  const { theme } = useTheme();

  return (
    <Box
      component="footer"
      className={styles.footer}
      sx={{
        borderTop: '1px solid rgba(250, 0, 63, 0.1)',
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        {/* Copyright + Politique de confidentialité */}
        <Box
          sx={{
            // pt: 4,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Typography
            sx={{
              fontSize: '0.875rem',
              color: theme === 'dark' ? '#9ca3af' : '#6b7280',
            }}
          >
            © {new Date().getFullYear()} Rafly. Tous droits réservés.
          </Typography>

          <a
            href={`/${locale}/politique-confidentialite`}
            className={styles.footerLink}
            style={{
              fontSize: '0.875rem',
              color: theme === 'dark' ? '#9ca3af' : '#6b7280',
              textDecoration: 'underline',
            }}
          >
            Politique de confidentialité
          </a>
        </Box>
      </Container>
    </Box>
  );
}
