'use client';

import React from 'react';
import {
  Card,
  CardMedia,
  Box,
  Typography,
  Button,
  Chip,
  Rating,
} from '@mui/material';
// import styles from './FeaturedProductCard.module.scss';
import AddToCartButton from '../AddToCartButton/AddToCartButton';
import { FeaturedProduct } from '../../types/product';

interface FeaturedProductCardProps {
  product: FeaturedProduct;
}

const FeaturedProductCard: React.FC<FeaturedProductCardProps> = ({ product }) => {
  const getBadgeColor = (badgeColor: string) => {
    switch (badgeColor) {
      case 'error':
        return '#dc2626';
      case 'success':
        return '#059669';
      case 'warning':
        return '#d97706';
      case 'info':
        return '#0284c7';
      case 'primary':
        return '#3b82f6';
      case 'secondary':
        return '#8b5cf6';
      default:
        return '#d97706';
    }
  };

  return (
    <Card 
      sx={{ 
        height: '400px',
        width: {xs: '100%', sm: '350px'},
        position: 'relative',
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
          '& .product-overlay': {
            background: 'rgba(0, 0, 0, 0.7)',
          },
          '& .product-button': {
            transform: 'translateY(0)',
            opacity: 1,
          }
        }
      }}
    >
      {/* Image pleine hauteur */}
      <CardMedia
        component="img"
        height="400"
        image={product.image}
        alt={product.name}
        sx={{
          objectFit: 'cover',
          width: '100%',
          height: '100%',
        }}
      />
      
      {/* Badge en haut à gauche */}
      <Chip
        label={product.category}
        size="small"
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          fontSize: '0.7rem',
          fontWeight: 600,
          bgcolor: getBadgeColor(product.badgeColor),
          color: 'white',
          zIndex: 2,
        }}
      />
      
      {/* Footer transparent en overlay */}
      <Box
        className="product-overlay"
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '200px',
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(4px)',
          color: 'white',
          p: 3,
          transition: 'all 0.3s ease',
        }}
      >
        <Typography 
          variant="h6" 
          component="h3"
          sx={{ 
            fontWeight: 600,
            mb: 1,
            fontSize: '1.1rem'
          }}
        >
          {product.name}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating 
            value={product.rating || 3} 
            precision={0.1} 
            size="small" 
            readOnly 
            sx={{
              '& .MuiRating-iconFilled': {
                color: '#fbbf24'
              }
            }}
          />
          <Typography 
            variant="body2" 
            sx={{ 
              ml: 1,
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.85rem'
            }}
          >
            ({product.reviews || 45})
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700,
              color: '#ffffff'
            }}
          >
            {product.price} FCFA
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: {xs: 'column', sm: 'row'},
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: {xs: 2, sm: 5},
          position: 'absolute',
          bottom: {xs: 10, sm: 20},
          left: {xs: 10, sm: 15},
          right: {xs: 10, sm: 15},
        }}>
          <Button
            variant="outlined"
            size="medium"
            sx={{
              width: {xs: '100%', sm: 'auto'},
              flex: {xs: 1, sm: 1},
              color: 'white',
              whiteSpace: 'nowrap',
              borderColor: 'rgba(255, 255, 255, 0.5)',
              '&:hover': {
                borderColor: 'white',
                background: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Voir détails
          </Button>
          
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              category: product.category
            }}
            variant="contained"
            size="medium"
            fullWidth={false}
          />
        </Box>
      </Box>
    </Card>
  );
};

export default FeaturedProductCard;
