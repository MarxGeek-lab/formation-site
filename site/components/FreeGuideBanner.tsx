'use client';

import { useState } from 'react';
import { Box, Typography, Button, IconButton, Slide } from '@mui/material';
import { Download, Close } from '@mui/icons-material';
import styles from './FreeGuideBanner.module.scss';

const FREE_GUIDE_ID = '693ebeaecf4689a490d71cda';

export default function FreeGuideBanner() {
  const [visible, setVisible] = useState(true);

  const handleDownload = () => {
    // Ouvrir le lien de téléchargement dans un nouvel onglet
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/uploads/download-pages/download_${FREE_GUIDE_ID}.html`, '_blank');
  };

  const handleClose = () => {
    setVisible(false);
    // Sauvegarder dans localStorage pour ne pas réafficher
    localStorage.setItem('freeGuideBannerDismissed', 'true');
  };

  // Vérifier si la bannière a été fermée précédemment
  if (typeof window !== 'undefined') {
    const dismissed = localStorage.getItem('freeGuideBannerDismissed');
    if (dismissed === 'true' && visible) {
      setVisible(false);
    }
  }

  return (
    <Slide direction="up" in={visible} mountOnEnter unmountOnExit>
      <Box className={styles.banner}>
        <Box className={styles.content}>
          <Box className={styles.textSection}>
            <Typography variant="h6" className={styles.title}>
              📘 Guide de Démarrage GRATUIT
            </Typography>
            <Typography variant="body2" className={styles.description}>
              Commencez votre aventure en programmation web - Téléchargement immédiat
            </Typography>
          </Box>

          <Box className={styles.actions}>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={handleDownload}
              className={styles.downloadButton}
            >
              Télécharger gratuitement
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
