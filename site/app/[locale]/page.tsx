"use client";

import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import PricingSection from "@/components/PricingSection";
import TeamSection from "@/components/TeamSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import MysteryProductSection from "@/components/MysteryProductSection";
import HeroSection from "@/components/HeroSection";
import FreeGuideBanner from "@/components/FreeGuideBanner";
import { Box, Container, Typography } from "@mui/material";
import { MenuBook } from "@mui/icons-material";
import Grid from "@mui/material/Grid2";
import { useTranslations } from 'next-intl';
import styles from './page.module.scss';
import ReactPlayer from "react-player";

import banniere from '@/assets/images/BANNIERE-1920px-600px.jpg';
import users from '@/assets/images/Frame-12-1.png'
import vector1 from '@/assets/images/Vector.png'
import vector2 from '@/assets/images/Vector-1.png'
import ellipse from '@/assets/images/ellipse.png';
import ellipse7 from '@/assets/images/ellipse7.png';

import { useRouter } from "next/navigation";
import { useAuthStore, useProductStore } from "@/contexts/GlobalContext";
import { useTheme } from "@/hooks/useTheme";
import { useEffect, useState } from "react";
import { GeoInfo } from "@/types/types";
import { countries } from "@/data/country";
import { country } from "@/data/countries";
import VideoPlayer from "@/components/VideoPlayer";
import VideoComponent from "@/components/VideoPlayer";
import { translate } from "@/utils/translate";
import { Translate } from "@/components/Translate";

const FREE_GUIDE_ID = '693ebeaecf4689a490d71cda';

export default function Home({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const { currency } = useAuthStore();
  const { theme } = useTheme();
  const { allProducts } = useProductStore();
  const router = useRouter();
  const t = useTranslations('Home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filtrer pour exclure le Guide de Démarrage gratuit
  let displayProducts = allProducts.filter(product => product._id !== FREE_GUIDE_ID);

  // Filtrer par catégorie si une catégorie est sélectionnée
  if (selectedCategory && selectedCategory !== 'all') {
    displayProducts = displayProducts.filter(product =>
      product.category?.toLowerCase() === selectedCategory.toLowerCase() ||
      product.category === selectedCategory
    );
  }

  // Trier les produits : HTML, CSS, JavaScript en tête
  displayProducts = displayProducts.sort((a, b) => {
    const priorityOrder = ['html', 'css', 'javascript', 'javascript avancé'];
    const categoryA = a.category?.toLowerCase() || '';
    const categoryB = b.category?.toLowerCase() || '';

    const indexA = priorityOrder.indexOf(categoryA);
    const indexB = priorityOrder.indexOf(categoryB);

    // Si les deux catégories sont dans la liste prioritaire
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    // Si seulement A est dans la liste prioritaire
    if (indexA !== -1) {
      return -1;
    }

    // Si seulement B est dans la liste prioritaire
    if (indexB !== -1) {
      return 1;
    }

    // Sinon, trier par ordre alphabétique du nom
    return (a.name || '').localeCompare(b.name || '');
  });

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // Écouter les changements de catégorie depuis la sidebar
  useEffect(() => {
    const handleCategoryEvent = (event: any) => {
      setSelectedCategory(event.detail.category);
    };

    window.addEventListener('categoryChange', handleCategoryEvent);

    return () => {
      window.removeEventListener('categoryChange', handleCategoryEvent);
    };
  }, []);

  return (
    <>
      {/* Hero Section */}
      <HeroSection locale={locale} />
      <Box sx={{
        px: {xs: 0, sm: 6},
        pb: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: {xs: '4rem', sm: '6rem'}
        }}>

        {/* Products Section */}
          <Container id="formations" maxWidth="lg"
          sx={{
            position: 'relative',
          }}
          >
             {/* Bannière Guide Gratuit */}
      <FreeGuideBanner />
            <div className="text-center mb-12">
              <Typography 
                sx={{my: 2, mx: 'auto', textAlign: 'center'}} 
                className="titlePageSection"
              >
               Nos formations
              </Typography>
            </div>
            
            <Grid container spacing={3}>
              {/* Product Card 1 */}
              {displayProducts.map((product) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product._id}>
                  <ProductCard
                    product={product}
                    locale={locale}
                  />
                </Grid>
              ))}
            </Grid>
            {/* <button className={styles.primaryButton}
              style={{
                margin: '2rem auto',
              }}
              onClick={() => router.push(`${locale}/catalogue`)}>
              <span>{t('exploreCatalog')}</span>
              <Box className={styles.iconWrapper} sx={{
                borderRadius: '50%',
              }}>
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Box>
            </button> */}
          </Container>

        {/* Pricing Section */}
        <PricingSection locale={locale} />
        
        {/* FAQ Section */}
        {/* <FAQSection /> */}
      </Box>
    </>
  );
}
