'use client';

import { useState } from 'react';
import { Box, Typography, Button, IconButton, Slide, Chip } from '@mui/material';
import { AutoStories, Close, WhatsApp } from '@mui/icons-material';
import styles from './FreeGuideBanner.module.scss';

export default function FreeGuideBanner() {
  const [visible, setVisible] = useState(() => {
    // Vérifier si la bannière a été fermée précédemment au chargement initial
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem('freeGuideBannerDismissed');
      return dismissed !== 'true';
    }
    return true;
  });

  const handleViewFormations = () => {
    // Rediriger vers la section formations
    const formationsSection = document.getElementById('formations');
    if (formationsSection) {
      formationsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Si on n'est pas sur la page d'accueil, rediriger vers #formations
      window.location.href = '/#formations';
    }
  };

  const handleClose = () => {
    setVisible(false);
    // Sauvegarder dans localStorage pour ne pas réafficher
    localStorage.setItem('freeGuideBannerDismissed', 'true');
  };

  return (
    <Slide direction="up" in={visible} mountOnEnter unmountOnExit>
      <Box className={styles.banner}>
        <Box className={styles.content}>
          <Box className={styles.textSection}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
              <Typography variant="h6" className={styles.title}>
                📚 Formations avec Suivi Personnalisé
              </Typography>
              <Chip
                icon={<WhatsApp sx={{ fontSize: 12 }} />}
                label="Suivi WhatsApp inclus"
                size="small"
                sx={{
                  height: '20px',
                  background: '#25D366',
                  color: 'white',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  '& .MuiChip-icon': {
                    color: 'white',
                  },
                }}
              />
            </Box>
            <Typography variant="body2" className={styles.description}>
              Toutes nos formations incluent un accompagnement WhatsApp 24/7
            </Typography>
          </Box>

          <Box className={styles.actions}>
            <Button
              variant="contained"
              startIcon={<AutoStories />}
              onClick={handleViewFormations}
              className={styles.downloadButton}
            >
              Voir les formations
            </Button>

            <IconButton
              onClick={handleClose}
              className={styles.closeButton}
              size="small"
            >
              <Close />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Slide>
  );
}
