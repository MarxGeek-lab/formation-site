'use client';

import { Box, Container, Typography } from '@mui/material';
import { useTheme } from '@/hooks/useTheme';
import { useTranslations } from 'next-intl';
import styles from './catalogue.module.scss';
import Grid from '@mui/material/Grid2';
import { useState } from 'react';
import ProductCard from '@/components/ProductCard';

// Mock data pour les produits
const mockProducts = [
  {
    id: 1,
    title: "FORMATION COMPLÈTE VO3",
    slug: "formation-complete-vo3",
    category: "E-Books & Guides",
    price: "14.000 CFA",
    image: "/veo3-768x432.jpg",
    gradientFrom: "#6017e7",
    gradientTo: "#c320f9",
    displayText: "Licence incluse",
    features: ["Licence incluse", "Licence incluse", "Licence incluse"]
  },
  {
    id: 2,
    title: "FORMATION COMPLETE PREMIERE PRO",
    slug: "formation-complete-premiere-pro",
    category: "Formations",
    price: "14.000 CFA",
    image: "/Premiere-pro-768x432.jpg",
    gradientFrom: "#6017e7",
    gradientTo: "#c320f9",
    displayText: "Licence incluse",
    features: ["Licence incluse", "Licence incluse", "Licence incluse"]
  },
  {
    id: 3,
    title: "INTEGRER L'IA DANS SA VIE QUOTIDIENNE",
    slug: "integrer-l-ia-dans-sa-vie-quotidienne",
    category: "IA",
    price: "9.000 CFA",
    image: "/ia-vie-quotidienne-768x432.jpg",
    gradientFrom: "#6017e7",
    gradientTo: "#c320f9",
    displayText: "Licence incluse",
    features: ["Licence incluse", "Licence incluse", "Licence incluse"]
  },
  {
    id: 4,
    title: "PACK TEMPLATES PREMIUM",
    slug: "pack-templates-premium",
    category: "Template",
    price: "12.000 CFA",
    image: "/template-pack.jpg",
    gradientFrom: "#6017e7",
    gradientTo: "#c320f9",
    displayText: "50+ Templates",
    features: ["Licence incluse", "Licence incluse", "Licence incluse"]
  },
  {
    id: 5,
    title: "GUIDE BUSINESS DIGITAL",
    slug: "guide-business-digital",
    category: "Business",
    price: "8.000 CFA",
    image: "/business-guide.jpg",
    gradientFrom: "#6017e7",
    gradientTo: "#c320f9",
    displayText: "Guide complet",
    features: ["Licence incluse", "Licence incluse", "Licence incluse"]
  },
  {
    id: 6,
    title: "OUTILS DESIGN PREMIUM",
    slug: "outils-design-premium",
    category: "Design graphique",
    price: "15.000 CFA",
    image: "/design-tools.jpg",
    gradientFrom: "#6017e7",
    gradientTo: "#c320f9",
    displayText: "Suite complète",
    features: ["Licence incluse", "Licence incluse", "Licence incluse"]
  }
];

const categoryKeys = [
  "all",
  "ebooks",
  "subscriptions",
  "business",
  "graphicDesign",
  "entertainment",
  "training",
  "ai",
  "videoEditing",
  "mysteries",
  "premiumTools",
  "spirituality",
  "templates"
];

export default function CataloguePage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const { theme } = useTheme();
  const t = useTranslations('Catalogue');
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);

  const handleCategoryFilter = (categoryKey: string) => {
    setSelectedCategory(categoryKey);
    if (categoryKey === "all") {
      setFilteredProducts(mockProducts);
    } else {
      const categoryName = t(`categories.${categoryKey}`);
      setFilteredProducts(mockProducts.filter(product => product.category === categoryName));
    }
  };

  return (
    <div className={styles.cataloguePage}>
      {/* Main Content */}
      <Container maxWidth="lg">
          <Box className={styles.heroContent} sx={{mb: 6}}>
            <Typography className={'rafly-sub'}>{t('subtitle')}</Typography>
            <Typography variant="h1" 
              className="rafly-title"
              sx={{
                mx: 'auto',
                my: 3
              }}
            >
              {t('title')}
            </Typography>
          </Box>
        <div className={styles.catalogueContent}>
          {/* Sidebar with Categories */}
          <div className={styles.sidebar}>
            <div className={styles.categoriesSection}>
              <h3 className={styles.categoriesTitle}>{t('categoriesTitle')}</h3>
              <div className={styles.categoryFilters}>
                {categoryKeys.map((categoryKey) => (
                  <button
                    key={categoryKey}
                    className={`${styles.categoryButton} ${
                      selectedCategory === categoryKey ? styles.active : ''
                    }`}
                    onClick={() => handleCategoryFilter(categoryKey)}
                  >
                    {t(`categories.${categoryKey}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className={styles.productsSection}>
            <Grid container spacing={5}>
              {filteredProducts.map((product) => (
                <Grid size={{ xs: 12, sm: 6, lg: 6 }} key={product.id}>
                  <ProductCard
                    slug={product.slug}
                    title={product.title}
                    category={product.category}
                    price={product.price}
                    displayText={product.displayText}
                    features={product.features}
                    locale={locale}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            <div className={styles.pagination}>
              <button className={styles.paginationButton}>
                <span>←</span>
              </button>
              <button className={`${styles.paginationButton} ${styles.active}`}>
                1
              </button>
              <button className={styles.paginationButton}>
                2
              </button>
              <button className={styles.paginationButton}>
                3
              </button>
              <button className={styles.paginationButton}>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
