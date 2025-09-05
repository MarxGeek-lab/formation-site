'use client';

import React from 'react';
import { 
  Snackbar, 
  Alert, 
  Box, 
  Typography, 
  Avatar,
  Slide,
  SlideProps
} from '@mui/material';
import { CheckCircle, ShoppingCart } from '@mui/icons-material';
import { useNotification } from '@/contexts/NotificationContext';
import styles from './NotificationToast.module.scss';

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

export default function NotificationToast() {
  const { notifications, removeNotification } = useNotification();

  return (
    <Box className={styles.notificationContainer}>
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={notification.duration}
          onClose={() => removeNotification(notification.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          TransitionComponent={SlideTransition}
          className={styles.snackbar}
        >
          <Alert
            onClose={() => removeNotification(notification.id)}
            severity={notification.type}
            className={styles.alert}
            icon={false}
          >
            <Box className={styles.alertContent}>
              {notification.type === 'success' && notification.productImage && (
                <Box className={styles.productInfo}>
                  <Avatar
                    src={notification.productImage?.replace('http://localhost:5000/', 'https://api.rafly.me/')}
                    alt={notification.productName}
                    className={styles.productImage}
                    variant="rounded"
                  >
                    <ShoppingCart />
                  </Avatar>
                  <Box className={styles.textContent}>
                    <Box className={styles.successHeader}>
                      <CheckCircle className={styles.successIcon} />
                      <Typography variant="subtitle2" className={styles.title}>
                        Produit ajouté au panier
                      </Typography>
                    </Box>
                    <Typography variant="body2" className={styles.productName}>
                      {notification.productName}
                    </Typography>
                  </Box>
                </Box>
              )}
              
              {!(notification.type === 'success' && notification.productImage) && (
                <Typography variant="body2">
                  {notification.message}
                </Typography>
              )}
            </Box>
          </Alert>
        </Snackbar>
      ))}
    </Box>
  );
}
