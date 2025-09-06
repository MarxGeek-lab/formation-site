"use client";

import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import PricingSection from "@/components/PricingSection";
import TeamSection from "@/components/TeamSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import MysteryProductSection from "@/components/MysteryProductSection";
import { Box, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useTranslations } from 'next-intl';
import styles from './page.module.scss';

import banniere from '@/assets/images/BANNIERE-1920px-600px.jpg';
import users from '@/assets/images/Frame-12-1.png'
import vector1 from '@/assets/images/Vector.png'
import vector2 from '@/assets/images/Vector-1.png'
import ellipse from '@/assets/images/ellipse.png';

import { useRouter } from "next/navigation";
import { useProductStore } from "@/contexts/GlobalContext";
import { useTheme } from "@/hooks/useTheme";

export default function Home({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const { theme } = useTheme();
  const { allProducts } = useProductStore();
  const router = useRouter();
  const t = useTranslations('Home');  

  return (
    <>
       {/* Hero Section */}
       <Container maxWidth="xl" sx={{
          // mt: {xs: 2, sm: 3, md: 5}, 
          pt: {xs: 2, sm: 16},
          mb: 8,
          position: 'relative',
          // width: '100%',
          top: 0,
          // border: '1px solid red',
          
        }}>
          <div style={{
            position: 'absolute',
            top: -30,
            left: '15%',
            width: '70%',
            height: '500px',
            backgroundImage: `url(${ellipse.src})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.8
          }} />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '50%',
            height: '500px',
            backgroundImage: `url(${vector1.src})`,
            backgroundSize: 'contain',
            backgroundPosition: 'left center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.8
          }} />
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '500px',
            backgroundImage: `url(${vector2.src})`,
            backgroundSize: 'contain',
            backgroundPosition: 'right center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.8
          }} />
          <Grid container spacing={6} alignItems="center"
            sx={{position: 'relative', zIndex: 2}}>
            <Grid size={{ xs: 12 }} sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              px: {xs: 0, sm: 0, md: 6, lg: 8, xl: 20}
            }}>
              <Box className={'rafly-sub'}>
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.4611 0V3.17372H10.5391V0H9.461H9.4611ZM5.05927 0.95375L4.17607 1.57213L5.99612 4.17123L6.87884 3.55283L5.05927 0.95375ZM14.9407 0.95375L13.1212 3.55285L14.004 4.17125L15.8241 1.57213L14.9409 0.95375H14.9407ZM9.99987 4.04207C7.36275 4.04207 5.22499 5.64345 5.22499 7.61915L7.93785 15.835H12.0624L14.775 7.61915C14.775 5.64348 12.6374 4.04207 10.0001 4.04207H9.99987ZM1.42447 4.99455L1.05615 6.00812L4.03697 7.09335L4.40665 6.08027L1.4244 4.99455H1.42447ZM18.5755 4.99455L15.5932 6.08035L15.9617 7.09355L18.9439 6.00813L18.5755 4.99455ZM4.26265 9.62802L1.19765 10.4501L1.47575 11.4906L4.54075 10.6697L4.2627 9.62802H4.26265ZM15.7373 9.62802L15.4594 10.6697L18.5244 11.4905L18.8023 10.45L15.7373 9.62798V9.62802ZM7.87772 16.4339V17.862H12.1225V16.4341H7.87774L7.87772 16.4339ZM7.87772 18.5719V20H12.1225V18.5721H7.87774L7.87772 18.5719Z" fill="currentColor"/>
                </svg>
                <span>{t('heroSubtitle')}</span>
              </Box>
              
              <Typography className={'rafly-title'} sx={{
                textAlign: 'center',
                mt: 2
              }}>
                {t('heroTitle')}
              </Typography>
              
              <p className={`${styles.heroDescription} ${theme === 'light' ? styles.light : styles.dark}`}>
                {t('heroDescription')}
              </p>
              
              <Box className={styles.heroButtons} 
                sx={{
                  mt: 5,
                  display: 'flex',
                  flexDirection: {xs: 'column', sm: 'row'},
                  justifyContent: 'center',
                  gap: 2
                }}>
                <button className={styles.primaryButton}
                  onClick={() => router.push('/catalogue')}>
                  <span>{t('browseProducts')}</span>
                  <Box className={styles.iconWrapper}>
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Box>
                </button>
                <button className={`${styles.secondaryButton} ${theme === 'light' ? styles.light : styles.dark}`}
                  onClick={() => window.open('https://graphnex.me/', '__blank')}>
                  <span>{t('orderVisual')}</span>
                  <Box className={styles.iconWrapper}>
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Box>
                </button>
              </Box>
            </Grid>
            
            <Grid size={{ xs: 12 }}>
              <Box className={`${styles.heroCard}`} sx={{mb: 2}}>
                <Box className={styles.heroCardHeader}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: {xs: 'column', sm: 'row'}
                  }}>
                  <Image src={users} alt="" />
                  <p>{t('satisfiedResellers')}</p>
                </Box>
              </Box>
              
              <Box className={`${styles.videoPlaceholder}`}>
                <Box className={styles.content}>
                  <Box className={styles.iconWrapper}>
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </Box>
                  <Typography className={styles.dark}>{t('presentationVideo')}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
        
      <Box sx={{
        px: {xs: 0, sm: 6},
        pb: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: {xs: '4rem', sm: '6rem'}
        }}>

        {/* Banner publicitaire */}
          {/* <Container maxWidth="lg" sx={{
            mt: {xs: 2, sm: 3, md: 5}, 
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-20%',
              left: '-5%',
              width: '50%',
              height: '500px',
              backgroundImage: `url(${vector1.src})`,
              backgroundSize: 'contain',
              backgroundPosition: 'left top',
              backgroundRepeat: 'no-repeat',
              zIndex: 1,
              opacity: 0.8
            }} />
            <div style={{
              position: 'absolute',
              top: '-20%',
              right: '-10%',
              width: '50%',
              height: '500px',
              backgroundImage: `url(${vector2.src})`,
              backgroundSize: 'contain',
              backgroundPosition: 'left top',
              backgroundRepeat: 'no-repeat',
              zIndex: 1,
              opacity: 0.8
            }} />
            <a style={{zIndex: 2, position: 'relative'}} href="https://chariow.com/fr?campaign=MCCD8DFZ" target="_blank" rel="noopener noreferrer">
              <Image
                src={banniere}
                alt="Publicité Chariow"
                className="w-full h-auto rounded-lg"
              />
            </a>
          </Container> */}

        {/* Features Section */}
          <Container maxWidth="lg">
            <Box className={styles.header} sx={{
              px: {xs: 0, sm: 6, md: 8, lg: 10, xl: 18}, 
              mb: 8}}>
              <Typography className="rafly-title" sx={{mx: 'auto'}}>
                {t('featuresTitle')}</Typography>
              <Typography sx={{textAlign: 'center'}}>
                {t('featuresDescription')}
              </Typography>
            </Box>
            
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <div className={`${styles.featureCard} ${theme === 'light' ? styles.light : styles.dark}`}>
                  <div className={styles.iconWrapper}>
                    <svg fill="currentColor" viewBox="0 0 35 35">
                      <path d="M8.75004 29.1667C10.3542 29.1667 11.6667 27.8542 11.6667 26.25V16.0417C11.6667 14.4375 10.3542 13.125 8.75004 13.125C7.14587 13.125 5.83337 14.4375 5.83337 16.0417V26.25C5.83337 27.8542 7.14587 29.1667 8.75004 29.1667ZM23.3334 21.875V26.25C23.3334 27.8542 24.6459 29.1667 26.25 29.1667C27.8542 29.1667 29.1667 27.8542 29.1667 26.25V21.875C29.1667 20.2709 27.8542 18.9584 26.25 18.9584C24.6459 18.9584 23.3334 20.2709 23.3334 21.875ZM17.5 29.1667C19.1042 29.1667 20.4167 27.8542 20.4167 26.25V8.75004C20.4167 7.14587 19.1042 5.83337 17.5 5.83337C15.8959 5.83337 14.5834 7.14587 14.5834 8.75004V26.25C14.5834 27.8542 15.8959 29.1667 17.5 29.1667Z"/>
                    </svg>
                  </div>
                  <h3>{t('readyToUse')}</h3>
                  <p className={theme === 'light' ? styles.light : styles.dark}>
                    {t('readyToUseDescription')}
                  </p>
                </div>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <div className={`${styles.featureCard} ${theme === 'light' ? styles.light : styles.dark}`}>
                  <div className={styles.iconWrapper}>
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3>{t('resultsFocused')}</h3>
                  <p className={theme === 'light' ? styles.light : styles.dark}>
                    {t('resultsFocusedDescription')}
                  </p>
                </div>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <div className={`${styles.featureCard} ${theme === 'light' ? styles.light : styles.dark}`}>
                  <div className={styles.iconWrapper}>
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-1.106-1.106A6.002 6.002 0 004 10c0 .91.203 1.77.567 2.542l1.591-1.425zM6.918 6.55l1.414-1.414A6.002 6.002 0 0110 4c.911 0 1.77.2 2.543.564L11.12 6.007a4.001 4.001 0 00-2.16.043L6.918 6.55z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3>{t('fastSupport')}</h3>
                  <p className={theme === 'light' ? styles.light : styles.dark}>
                    {t('fastSupportDescription')}
                  </p>
                </div>
              </Grid>
            </Grid>
            
            <div className={styles.featuresFooter}>
              <button className={styles.ctaButton}
                onClick={() => router.push('/catalogue')}>
                {t('findRightProduct')}
              </button>
              <p className={theme === 'light' ? styles.light : styles.dark}>
                {t('timeMatters')} <span className={styles.underline}>{t('takeActionNow')}</span>
              </p>
            </div>
          </Container>

        {/* Products Section */}
          <Container maxWidth="lg">
            <div className="text-center mb-12">
              <span className="rafly-sub">{t('productsSubtitle')}</span>
              <Typography 
                sx={{my: 2, mx: 'auto', textAlign: 'center'}} 
                className="rafly-title"
              >
                {t('productsTitle')}
              </Typography>
              <p className="text-lg" style={{ color: theme === 'light' ? '#4b5563' : '#d1d5db' }}>
                {t('productsDescription')}
              </p>
            </div>
            
            <Grid container spacing={3}>
              {/* Product Card 1 */}
              {allProducts.slice(0, 3).map((product) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product._id}>
                  <ProductCard
                    product={product}
                    locale={locale}
                  />
                </Grid>
              ))}
            </Grid>
          </Container>

        {/* Mystery Product Section */}
        <MysteryProductSection />

        {/* Pricing Section */}
        <PricingSection />

        {/* Team Section */}
        <TeamSection />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* FAQ Section */}
        <FAQSection />
      </Box>
    </>
  );
}
