"use client";

import { useState } from 'react';
import { Box, Fab, Tooltip, Zoom } from '@mui/material';
import { WhatsApp, ContactMail, Close, ChatBubble } from '@mui/icons-material';
import styles from './FloatingContactButtons.module.scss';

export default function FloatingContactButtons() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleButtons = () => {
    setIsOpen(!isOpen);
  };

  const handleWhatsAppClick = () => {
    // Remplacez par votre numéro WhatsApp
    window.open('https://wa.me/2290169816413', '_blank');
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:mgangbala610@gmail.com';
  };

  return (
    <Box className={styles.floatingContainer}>
      {/* Boutons de contact */}
      <Zoom in={isOpen} style={{ transitionDelay: isOpen ? '50ms' : '0ms' }}>
        <Box>
          <Tooltip title="WhatsApp" placement="left">
            <Fab
              className={styles.contactButton}
              sx={{
                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #128C7E 0%, #25D366 100%)',
                }
              }}
              onClick={handleWhatsAppClick}
            >
              <WhatsApp />
            </Fab>
          </Tooltip>
        </Box>
      </Zoom>

      <Zoom in={isOpen} style={{ transitionDelay: isOpen ? '100ms' : '0ms' }}>
        <Box>
          <Tooltip title="Email" placement="left">
            <Fab
              className={styles.contactButton}
              sx={{
                background: 'linear-gradient(135deg, #FA003F 0%, #C70032 100%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #C70032 0%, #FA003F 100%)',
                }
              }}
              onClick={handleEmailClick}
            >
              <ContactMail />
            </Fab>
          </Tooltip>
        </Box>
      </Zoom>

      {/* Bouton principal */}
      <Fab
        className={styles.mainButton}
        onClick={toggleButtons}
        sx={{
          background: 'linear-gradient(135deg, #FA003F 0%, #C70032 100%)',
          color: 'white',
          boxShadow: '0 8px 24px rgba(250, 0, 63, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #C70032 0%, #FA003F 100%)',
            boxShadow: '0 12px 32px rgba(250, 0, 63, 0.5)',
          }
        }}
      >
        {isOpen ? <Close /> : <WhatsApp />}
      </Fab>
    </Box>
  );
}
