"use client";

import Image from "next/image";
import { useTheme } from "../hooks/useTheme";
import styles from './ProductCard.module.scss';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { generateSlug } from "@/utils/utils";
import { Box, Typography } from "@mui/material";
import { AddShoppingCart } from "@mui/icons-material";
import { useCart } from '@/contexts/CartContext';
import { useNotification } from '@/contexts/NotificationContext';
import { useTracking } from '@/utils/trackingPixel';

interface ProductCardProps {
  product: any;
  locale: string;
}

export default function ProductCard({ 
  product, 
  locale 
}: ProductCardProps) {
  const router = useRouter();
  const t = useTranslations('Home');
  const { addToCart, cart } = useCart();
  const { addNotification } = useNotification();
  const { trackProductView, trackAddToCart } = useTracking();

  const handleClick = () => {
    if (product.name) {
      const slug = generateSlug(product.name);
      router.push(`/${locale}/produit/${product._id}`);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const finalPrice = product?.pricePromo && product?.pricePromo !== 0 ? product.pricePromo : product.price;
      
      // Tracker l'ajout au panier
      trackAddToCart(product._id);
      
      // Ajouter au panier (synchronisation automatique avec backend)
      await addToCart({
        id: product._id,
        name: product.name,
        price: finalPrice,
        image: product?.photos?.[0] || '',
        category: product.category
      });

      // Show success notification
      addNotification({
        type: 'success',
        message: 'Produit ajouté au panier',
        productName: product.name,
        productImage: product?.photos?.[0] || '',
        duration: 4000
      });
    } catch (error) {
      console.error('Erreur ajout au panier:', error);
      
      // Show error notification
      addNotification({
        type: 'error',
        message: 'Erreur lors de l\'ajout au panier',
        productName: product.name,
        duration: 4000
      });
    }
  };

  const renderImage = () => {
    if (product?.photos[0]) {
      if (product?.photos[0].startsWith('http://localhost:5000/')) {
        return (
          <img
            src={product?.photos[0]?.replace('http://localhost:5000/', 'https://api.rafly.me/')}
            alt={product?.name}
            width={300}
            height={200}
            className={styles.productImage}
          />
        )
      } else {
        return (
          <img
            src={product?.photos[0]}
            alt={product?.name}
            width={300}
            height={200}
            className={styles.productImage}
          />
        )
      }
    }
  }

  return (
    <div className={styles.productCard}>
      <div className={styles.imageContainer}>
        {product?.photos?.length > 0 ? (
          renderImage()
        ) : (
          <div className={styles.imagePlaceholder}>
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <rect width="60" height="60" rx="12" fill="var(--primary)" fillOpacity="0.1"/>
              <path d="M20 25L30 35L40 25" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{product?.name}</h3>
        <p className={styles.category}>{product?.category}</p>
        
        <div className={styles.priceSection}>
          {product?.pricePromo && product?.pricePromo !== 0 ? (
            <Box className={styles.priceContainer}
              sx={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <Typography className={styles.price}>{product?.pricePromo} FCFA</Typography>
              <Typography sx={{
                textDecoration: 'line-through',
                color: 'red',
                whiteSpace: 'nowrap',
                fontSize: 13
                }}>{product?.price} FCFA</Typography>
            </Box>
          ) : (
            <Box className={styles.priceContainer}>
              <span className={styles.price}>{product?.price} FCFA</span>
            </Box>
          )}
          <div className={styles.features}>
            <div className={styles.feature}>
              <svg className={styles.checkIcon} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Licence incluse</span>
            </div>
          </div>
        </div>
        
        <div className={styles.buttonGroup}>
          <button className={styles.accessButton} onClick={handleClick}>
            {t('accessProduct')}
          </button>
          <button 
            className={styles.addToCartButtonBottom} 
            onClick={handleAddToCart}
            disabled={cart.isLoading}
          >
            {cart.isLoading ? (
              <div className={styles.spinner}>⏳</div>
            ) : (
              <AddShoppingCart />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
