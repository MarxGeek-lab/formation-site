"use client";

import Image from "next/image";
import { useTheme } from "../hooks/useTheme";
import styles from './ProductCard.module.scss';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface ProductCardProps {
  title: string;
  category: string;
  price: string;
  features: string[];
  image?: any;
  slug?: string;
  displayText: string;
  locale: string;
}

export default function ProductCard({ 
  title, 
  category, 
  price, 
  features, 
  image, 
  slug, 
  displayText,
  locale 
}: ProductCardProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const t = useTranslations('Home');

  const handleClick = () => {
    if (slug) {
      router.push(`/${locale}/produit/${slug}`);
    }
  };

  return (
    <div className={styles.productCard}>
      <div className={styles.imageContainer}>
        {image ? (
          <Image
            src={image}
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
          <button className={styles.buyNowButton} onClick={handleClick}>
            {t('buyNow')}
          </button>
        </div>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.category}>{category}</p>
        
        <div className={styles.priceSection}>
          <div className={styles.priceContainer}>
            <span className={styles.price}>{price}</span>
          </div>
          <div className={styles.features}>
            <div className={styles.feature}>
              <svg className={styles.checkIcon} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>{displayText}</span>
            </div>
          </div>
        </div>
        
        <button className={styles.accessButton} onClick={handleClick}>
          {t('accessProduct')}
        </button>
      </div>
    </div>
  );
}
