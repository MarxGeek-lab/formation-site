'use client';

import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { ShoppingCart as ShoppingCartIcon, Check as CheckIcon } from '@mui/icons-material';
import styles from '@/components/AddToCartButton/AddToCartButton.module.scss';

interface AddToCartButtonProps {
  product: Omit<any, 'quantity'>;
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  variant = 'contained',
  size = 'medium',
  fullWidth = false,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const handleAddToCart = async (event: React.MouseEvent) => {
    // Empêcher la propagation du clic vers les éléments parents (comme le Link)
    event.stopPropagation();
    event.preventDefault();
    
    setIsAdding(true);
    
    // Simuler un délai pour l'animation
    setTimeout(() => {
      setIsAdding(false);
      setJustAdded(true);
      setShowNotification(true);
      
      // Réinitialiser l'état après 2 secondes
      setTimeout(() => {
        setJustAdded(false);
      }, 2000);
    }, 500);
  };

  return (
    <>
      <Button
        sx={{
          width: {xs: '100%', sm: 'auto'}
        }}
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        disabled={isAdding}
        className={`${styles.addToCartButton} ${justAdded ? styles.added : ''}`}
        startIcon={
          isAdding ? (
            <CircularProgress size={16} color="inherit" />
          ) : justAdded ? (
            <CheckIcon />
          ) : (
            <ShoppingCartIcon />
          )
        }
      >
         Ajouter au panier
      </Button>
    </>
  );
};

export default AddToCartButton;
