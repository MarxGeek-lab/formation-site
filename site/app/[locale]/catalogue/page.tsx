'use client';

import { Box, Container, Typography } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import styles from './catalogue.module.scss';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { useProductStore } from '@/contexts/ProductStore';
import { useCommonStore } from '@/contexts/CommonContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

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
  const { allProducts, getAllProduct } = useProductStore()
  const { allCategories } = useCommonStore();
  const { locale } = params;
  const t = useTranslations('Catalogue');
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  useEffect(() => {
    getAllProduct()
  }, [])

  const filteredProducts = selectedCategory === "all" ? allProducts 
  : allProducts.filter(product => product?.category === selectedCategory);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of products section
    const productsSection = document.querySelector(`.${styles.productsSection}`);
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className={styles.cataloguePage}>
      {/* Hero Section */}
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
      </Container>

      {/* Sticky Category Filters */}
      <div className={styles.categoriesSticky}>
        <Container maxWidth="lg">
          <div className={styles.categoriesHorizontal}>
            <h3 className={styles.categoriesTitle}>{t('categoriesTitle')}</h3>
            <div className={styles.categoryFiltersContainer}>
              <div className="swiper-button-prev-custom">
                <ArrowBackIos />
              </div>
              <button
                className={`${styles.categoryButton} ${
                  selectedCategory === 'all' ? styles.active : ''
                }`}
                onClick={() => setSelectedCategory('all')}
              >
                Tout
              </button>
              <Swiper
                modules={[Navigation]}
                spaceBetween={16}
                slidesPerView="auto"
                navigation={{
                  nextEl: '.swiper-button-next-custom',
                  prevEl: '.swiper-button-prev-custom',
                }}
                className={styles.categorySwiper}
              >
                {allCategories.map((category: any) => (
                  <SwiperSlide key={category?._id} className={styles.categorySlide}>
                    
                    <button
                      className={`${styles.categoryButton} ${
                        selectedCategory === category?.nameFr ? styles.active : ''
                      }`}
                      onClick={() => setSelectedCategory(category?.nameFr)}
                    >
                      {locale === 'fr' ? category?.nameFr : category?.nameEn}
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="swiper-button-next-custom">
                <ArrowForwardIos />
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container maxWidth="lg">
        <div className={styles.catalogueContent}>
          {/* Products Grid */}
          <div className={styles.productsSection}>
            <Grid container spacing={5}>
              {currentProducts.map((product) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={product._id}>
                  <ProductCard
                    product={product}
                    locale={locale}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button 
                  className={styles.paginationButton}
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <span>←</span>
                </button>
                
                {getPageNumbers().map((page, index) => (
                  page === '...' ? (
                    <span key={`ellipsis-${index}`} className={styles.paginationEllipsis}>
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      className={`${styles.paginationButton} ${
                        currentPage === page ? styles.active : ''
                      }`}
                      onClick={() => handlePageChange(page as number)}
                    >
                      {page}
                    </button>
                  )
                ))}
                
                <button 
                  className={styles.paginationButton}
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  <span>→</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
