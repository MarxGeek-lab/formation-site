'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Drawer, 
  Box, 
  Typography, 
  IconButton, 
  Button, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText,
  Avatar,
  Divider,
  Badge
} from '@mui/material';
import { 
  Close, 
  Add, 
  Remove, 
  Delete, 
  ShoppingCart 
} from '@mui/icons-material';
import { useCart } from '@/contexts/CartContext';
import styles from './CartSidebar.module.scss';

export default function CartSidebar({ params }: { params: { locale: string } }) {
  const { cart, removeFromCart, updateQuantity, clearCart, toggleCart } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    toggleCart(); // Close the cart
    router.push(`/${params.locale}/paiement`);
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const formatPrice = (price: number) => {
    return `${price?.toLocaleString('fr-FR')} FCFA`;
  };

  return (
    <Drawer
      anchor="right"
      open={cart.isOpen}
      onClose={toggleCart}
      className={styles.cartDrawer}
    >
      <Box className={styles.cartSidebar}>
        {/* Header */}
        <Box className={styles.header}>
          <Box className={styles.headerTitle}>
            
            <Typography variant="h6" component="h2">
            <ShoppingCart />
              Panier
            </Typography>
            <Badge badgeContent={cart.totalItems} color="primary">
              <Box />
            </Badge>
          </Box>
          <IconButton onClick={toggleCart} className={styles.closeButton}>
            <Close />
          </IconButton>
        </Box>

        <Divider />

        {/* Cart Items */}
        <Box className={styles.cartContent}>
          {cart.items.length === 0 ? (
            <Box className={styles.emptyCart}>
              <ShoppingCart className={styles.emptyIcon} />
              <Typography variant="body1" color="textSecondary">
                Votre panier est vide
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Ajoutez des produits pour commencer vos achats
              </Typography>
            </Box>
          ) : (
            <List className={styles.cartItems}>
              {cart.items.map((item) => (
                <ListItem key={item.id} className={styles.cartItem}>
                  <ListItemAvatar>
                    <Avatar
                      src={item.image?.replace('http://localhost:5000/', 'https://api.rafly.me/')}
                      alt={item.name}
                      variant="rounded"
                      className={styles.productImage}
                    >
                      {/* <ShoppingCart /> */}
                    </Avatar>
                  </ListItemAvatar>
                  
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" className={styles.productName}>
                        {item.name}
                      </Typography>
                    }
                    secondary={
                      <Box className={styles.productDetails}>
                        <Typography variant="body2" color="textSecondary">
                          {item.category}
                        </Typography>
                        <Typography variant="subtitle2" className={styles.productPrice}>
                          {formatPrice(item.price)}
                        </Typography>
                      </Box>
                    }
                  />
                  
                  {/* <Box className={styles.quantityControls}>
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className={styles.quantityButton}
                    >
                      <Remove fontSize="small" />
                    </IconButton>
                    
                    <Typography variant="body2" className={styles.quantity}>
                      {item.quantity}
                    </Typography>
                    
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className={styles.quantityButton}
                    >
                      <Add fontSize="small" />
                    </IconButton>
                  </Box>
                   */}
                  <IconButton
                    size="small"
                    onClick={() => removeFromCart(item.id)}
                    className={styles.deleteButton}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
        <Divider />
        {/* Footer */}
        {cart.items.length > 0 && (
          <>
            
            <Box className={styles.cartFooter}>
              <Box className={styles.totalSection}>
                <Typography variant="body2" color="textSecondary">
                  Total ({cart.totalItems} article{cart.totalItems > 1 ? 's' : ''})
                </Typography>
                <Typography variant="h6" className={styles.totalPrice}>
                  {formatPrice(cart.totalPrice)}
                </Typography>
              </Box>
              
              <Box className={styles.actionButtons}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={clearCart}
                  className={styles.clearButton}
                  startIcon={<Delete />}
                >
                  Vider le panier
                </Button>
                
                <Button
                  variant="contained"
                  color="primary"
                  className={styles.checkoutButton}
                  size="large"
                  onClick={handleCheckout}
                >
                  Passer commande
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
}
