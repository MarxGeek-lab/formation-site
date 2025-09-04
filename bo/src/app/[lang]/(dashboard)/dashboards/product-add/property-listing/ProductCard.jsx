"use client";

import Image from "next/image";
import styles from './ProductCard.module.scss';
import { useRouter } from 'next/navigation';
import { Box, Typography } from "@mui/material";

export default function ProductCard({ 
  title, 
  category, 
  price, 
  pricePromo, 
  image, 
}) {
  const router = useRouter();

console.log(image)
  return (
    <div className={styles.productCard}>
      <div className={styles.imageContainer}>
        {image ? (
          <Image
            src={URL.createObjectURL(image)}
            alt={title}
            width={300}
            height={200}
            className={styles.productImage}
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <rect width="60" height="60" rx="12" fill="var(--primary)" fillOpacity="0.1"/>
              <path d="M20 25L30 35L40 25" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
        <div className={styles.hoverOverlay}>
          <button className={styles.buyNowButton}>
            Acheter maintenant
          </button>
        </div>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.category}>{category}</p>
        
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          mb: 4,
          gap: '0.5rem'
        }}>
          {pricePromo && pricePromo !== 0 ? (
            <Box className={styles.priceContainer}
              sx={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <Typography className={styles.price}>{pricePromo} FCFA</Typography>
              <Typography sx={{
                textDecoration: 'line-through',
                color: 'red',
                whiteSpace: 'nowrap',
                fontSize: 13
                }}>{price} FCFA</Typography>
            </Box>
          ) : (
            <Box className={styles.priceContainer}>
              <span className={styles.price}>{price} FCFA</span>
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
        </Box>
        
        <button className={styles.accessButton}>
          Accéder au produit
        </button>
      </div>
    </div>
  );
}
