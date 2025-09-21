'use client';

import { Box, Container, Typography, Card, CardContent, List, ListItem, ListItemIcon, ListItemText, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Check } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import styles from './PricingSection/PricingSection.module.scss';
import { useSubscriptionContext } from '@/contexts/SubscriptionContext';
import { useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { hideLoader, showLoader } from './Loader/loaderService';

const CheckIcon: React.FC<{ color?: string }> = ({ color }) => (
  <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.02727 15.5156L4.64545 13.2299L2.02727 12.6585L2.28182 10.0156L0.5 8.01562L2.28182 6.01562L2.02727 3.37277L4.64545 2.80134L6.02727 0.515625L8.5 1.55134L10.9727 0.515625L12.3545 2.80134L14.9727 3.37277L14.7182 6.01562L16.5 8.01562L14.7182 10.0156L14.9727 12.6585L12.3545 13.2299L10.9727 15.5156L8.5 14.4799L6.02727 15.5156ZM7.73636 10.5513L11.8455 6.51562L10.8273 5.47991L7.73636 8.51562L6.17273 7.01563L5.15455 8.01562L7.73636 10.5513Z" fill={color || '#5E3AFC'}/>
  </svg>
);

const StarIcon = () => (
  <svg width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24.5" cy="24.5156" r="24" fill="url(#paint0_linear_98_1608)"/>
    <path d="M24.8503 14.23H25.2926L25.8653 16.3051C26.2965 17.8662 27.2277 19.2427 28.5164 20.2237C29.805 21.2046 31.3797 21.7358 32.9992 21.7359H34.7857V22.0939L33.2537 23.1514C31.957 24.0461 30.9796 25.3313 30.4638 26.8199C29.948 28.3084 29.9206 29.9228 30.3856 31.428L31.0749 33.6586H30.6225L29.7861 32.9675C28.4595 31.8712 26.7924 31.2715 25.0715 31.2715C23.3505 31.2715 21.6834 31.8712 20.3568 32.9675L19.5204 33.6586H19.0671L19.7573 31.4289C20.2225 29.9236 20.1953 28.309 19.6794 26.8203C19.1636 25.3315 18.1861 24.0462 16.8893 23.1514L15.3572 22.0939V21.7368H17.1428C18.7625 21.7369 20.3376 21.2056 21.6264 20.2245C22.9152 19.2434 23.8466 17.8665 24.2777 16.3051L24.8503 14.23Z" stroke="white" strokeWidth="1.5"/>
    <defs>
      <linearGradient id="paint0_linear_98_1608" x1="24.5" y1="0.515625" x2="24.5" y2="48.5156" gradientUnits="userSpaceOnUse">
        <stop stopColor="white" stopOpacity="0.08"/>
        <stop offset="1" stopColor="white" stopOpacity="0"/>
      </linearGradient>
    </defs>
  </svg>
);

const RocketIcon = () => (
  <svg width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24.5" cy="24.0156" r="24" fill="url(#paint0_linear_98_1666)"/>
    <path d="M23.1601 22.6758C22.8034 23.0307 22.602 23.5126 22.6001 24.0158C22.6001 24.5197 22.8003 25.003 23.1566 25.3593C23.5129 25.7156 23.9962 25.9158 24.5001 25.9158C25.0033 25.9139 25.4852 25.7125 25.8401 25.3558" stroke="#ECEFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24.5001 18.3154C23.3727 18.3154 22.2707 18.6497 21.3333 19.2761C20.3959 19.9024 19.6654 20.7926 19.2339 21.8341C18.8025 22.8757 18.6896 24.0218 18.9096 25.1274C19.1295 26.2331 19.6724 27.2488 20.4695 28.0459C21.2667 28.8431 22.2823 29.386 23.388 29.6059C24.4937 29.8258 25.6398 29.713 26.6813 29.2815C27.7229 28.8501 28.6131 28.1195 29.2394 27.1822C29.8658 26.2448 30.2001 25.1428 30.2001 24.0154" stroke="#ECEFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24.5 14.5156C22.6211 14.5156 20.7844 15.0728 19.2221 16.1167C17.6598 17.1605 16.4422 18.6442 15.7231 20.3801C15.0041 22.116 14.816 24.0262 15.1825 25.869C15.5491 27.7118 16.4539 29.4045 17.7825 30.7331C19.1111 32.0617 20.8038 32.9665 22.6466 33.3331C24.4895 33.6996 26.3996 33.5115 28.1355 32.7925C29.8714 32.0734 31.3551 30.8558 32.399 29.2935C33.4428 27.7313 34 25.8945 34 24.0156M28.025 20.4916L25.45 23.0656" stroke="#ECEFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M33.44 17.8595L30.2 18.3155L30.656 15.0755C30.6593 15.0378 30.6514 15.0001 30.6331 14.967C30.6149 14.9339 30.5872 14.907 30.5536 14.8897C30.52 14.8724 30.482 14.8655 30.4445 14.87C30.407 14.8744 30.3716 14.8899 30.343 14.9145L28.195 17.0515C27.9743 17.2737 27.8121 17.547 27.7226 17.8471C27.6331 18.1472 27.6191 18.4647 27.682 18.7715L28.024 20.4915L29.744 20.8325C30.0507 20.8953 30.3683 20.8814 30.6684 20.7919C30.9684 20.7024 31.2418 20.5401 31.464 20.3195L33.6 18.1725C33.6247 18.1437 33.6402 18.1083 33.6447 18.0708C33.6491 18.0333 33.6424 17.9953 33.6251 17.9621C33.6078 17.9289 33.5809 17.9019 33.5477 17.8847C33.5146 17.8674 33.4766 17.8607 33.439 17.8655L33.44 17.8595Z" stroke="#ECEFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="paint0_linear_98_1666" x1="24.5" y1="0.0156" x2="24.5" y2="48.0156" gradientUnits="userSpaceOnUse">
        <stop stopColor="white" stopOpacity="0.08"/>
        <stop offset="1" stopColor="white" stopOpacity="0"/>
      </linearGradient>
    </defs>
  </svg>
);

export default function PricingSection({locale}: {locale: string }) {
    const t = useTranslations('Pricing');
    const { addToCart, clearCart } = useCart();
    const router = useRouter();
    const { subscriptionPlans, fetchSubscription } = useSubscriptionContext();

    const stylesFond = {
        p: 4,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'var(--primary-light)',
        backgroundColor: 'background.paper',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(94, 58, 252, 0.05) 0%, rgba(94, 58, 252, 0.02) 100%)'
    }

    const title = {
      fontWeight: 700,
      fontSize: '1.3rem',
      marginBottom: '0.5rem'
    }

    const subtitle = {
      fontSize: '0.9rem',
      opacity: 0.7
    }

    const price1 = {
      fontSize: '2rem',
      fontWeight: 700,
      color: 'var(--primary)'
    }

    const price2 = {
      fontSize: '1.2rem',
      fontWeight: 700,
      color: 'var(--primary)'
    }

    const handleAddToCart = async (plan: any) => {
      clearCart();

      try { 
        const product = plan[0]?.product;
        const price = plan.price;

        // Ajouter au panier (synchronisation automatique avec backend)
        await addToCart({
          id: product?._id,
          name: product?.name,
          price: price,
          image: product?.photos?.[0] || '',
          category: product?.category || '',
          type: 'abonnement',
          subscription: JSON.stringify(plan)
        });

        console.log({
          id: product?._id,
          name: product?.name,
          price: price,
          image: product?.photos?.[0] || '',
          category: product?.category || '',
          type: 'abonnement',
          subscription: plan
        })

        showLoader();

        setTimeout(() => {
          hideLoader();
          router.push(`/${locale}/paiement`);
        }, 1000);
  
      } catch (error) {
        console.error('Erreur ajout au panier:', error);
      }
    };

  useEffect(() => {
    fetchSubscription();
  }, []);

  console.log("subscriptionPlans == ", subscriptionPlans)

  return (
    <Box 
      id="tarification" 
      sx={{ 
        backgroundColor: 'var(--background)',
        borderTop: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="overline" 
            sx={{ 
              color: 'primary.main',
              fontWeight: 600,
              letterSpacing: 1,
              mb: 2,
              display: 'block'
            }}
            className='rafly-sub'
          >
            {t('subtitle')}
          </Typography>
          <Typography 
            variant="h2" 
            sx={{ 
              ...title,
              my: 2,
              mx: 'auto',
              color: 'text.primary'
            }}
            className='rafly-title'
          >
            {t('title')}
          </Typography>
          <Typography sx={subtitle}>
            {t('description')}
          </Typography>
        </Box>

        {/* Pricing Cards */}
        <Grid container spacing={4} justifyContent="center" 
          sx={{mt: {xs: 6, sm: 8, md: 18, lg: 16}}}
          >
          {/* Basic Plan */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box 
              sx={stylesFond}
            >
              {/* Icon */}
              <Box sx={{ mb: 3 }}>
                <StarIcon />
              </Box>

              {/* Title */}
              <Typography variant="h5" sx={title}>
                {t('basic.title')}
              </Typography>
              <Typography variant="body1" sx={{  mb: 3, opacity: 0.7 }}>
                {t('basic.description')}
              </Typography>

              {/* Price */}
              <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                <Typography variant="h4" sx={price1}>
                  23
                </Typography>
                <Typography variant="h4" sx={price1}>
                  €
                </Typography>
                <Typography variant="body1" sx={{  ml: 1, opacity: 0.7 }}>
                  / mois
                </Typography>
              </Box>

              {/* XOF Price */}
              <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 4 }}>
                <Typography variant="h5" sx={price2}>
                  ~15 000 XOF
                </Typography>
                <Typography variant="body2" sx={{  ml: 1 }}>
                  / mois
                </Typography>
              </Box>

              {/* CTA Button */}
              <button className={styles.primaryButton}
                onClick={() => handleAddToCart(subscriptionPlans[0])}>
                <span>{t('subscribe')}</span>
                <Box className={styles.iconWrapper}>
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Box>
              </button>

              {/* Features */}
              <ul className={styles.featureList}>
                <li className={styles.featureItem}>
                  <CheckIcon />
                  <span>{t('basic.features.access3Products')}</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckIcon />
                  <span>{t('basic.features.advertisingPosters')}</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckIcon />
                  <span>{t('basic.features.plrLicense')}</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckIcon />
                  <span className={styles.featureItemDisabled}>{t('basic.features.earlyAccess')}</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckIcon />
                  <span className={styles.featureItemDisabled}>{t('basic.features.monthlySuprise')}</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckIcon />
                  <span className={styles.featureItemDisabled}>{t('basic.features.weeklyMystery')}</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckIcon />
                  <span className={styles.featureItemDisabled}>{t('basic.features.adTexts')}</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckIcon />
                  <span className={styles.featureItemDisabled}>{t('basic.features.monthlyCall')}</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckIcon />
                  <span className={styles.featureItemDisabled}>{t('basic.features.monthlyAudit')}</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckIcon />
                  <span className={styles.featureItemDisabled}>{t('basic.features.marketingStrategies')}</span>
                </li>
              </ul>

            </Box>
          </Grid>

          {/* Elite Plan */}
          <Grid size={{ xs: 12, md: 4 }}
            sx={{marginTop: {xs: 0, sm: 0, md: '-5rem', lg: '-5rem', xl: '-5rem'}}}>
            <Box 
              sx={{
                ...stylesFond,
                background: 'var(--primary)',
                color: 'white'
              }}
            >
              {/* Popular Badge */}
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: -12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'white',
                  color: 'var(--primary)',
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}
              >
                {t('popular')}
              </Box>

              {/* Icon */}
              <Box sx={{ mb: 3 }}>
                <RocketIcon />
              </Box>

              {/* Title */}
              <Typography variant="h5" sx={title}>
                {t('elite.title')}
              </Typography>
              <Typography variant="body1" sx={subtitle}>
                {t('elite.description')}
              </Typography>

              {/* Price */}
              <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1, mt: 3 }}>
                <Typography variant="h2" sx={price1}>
                  230
                </Typography>
                <Typography variant="h4" sx={{ ...price1, ml: 1 }}>
                  €
                </Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  / 3 mois
                </Typography>
              </Box>

              {/* XOF Price */}
              <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 4 }}>
                <Typography variant="h5" sx={price2}>
                  ~150 000 XOF
                </Typography>
                <Typography variant="body2" sx={{ ml: 1 }}>
                  / 3 mois
                </Typography>
              </Box>

              {/* CTA Button */}
              <button className={styles.primaryButton}
                style={{
                  background: 'white',
                  color: 'var(--primary)',
                  border: '1px solid var(--primary)'
                }} onClick={() => handleAddToCart(subscriptionPlans[2])}>
                <span>{t('subscribe')}</span>
                <Box className={styles.iconWrapper} sx={{background: 'var(--primary)'}}>
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fill="white" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Box>
              </button>

              {/* Features - Elite plan features */}
              <ul className={styles.featureList}>
                <li className={styles.featureItem}>
                  <CheckIcon color='white' />
                  <span>{t('elite.features.fullCatalogAccess')}</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckIcon color='white' />
                  <span>{t('elite.features.advertising15Posters')}</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckIcon color='white' />
                  <span>{t('elite.features.ecommerceStore')}</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckIcon color='white' />
                  <span>{t('elite.features.monthlyExpertCall')}</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckIcon color='white' />
                  <span>{t('elite.features.weeklyMysteryProduct')}</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckIcon color='white' />
                  <span>{t('elite.features.marketReports')}</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckIcon color='white' />
                  <span>{t('elite.features.weeklyAdvice')}</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckIcon color='white' />
                  <span>{t('elite.features.exclusiveAudiences')}</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckIcon color='white' />
                  <span>{t('elite.features.privateCoachContact')}</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckIcon color='white' />
                  <span>{t('elite.features.monthlyAudit')}</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckIcon color='white'/>
                  <span>{t('elite.features.marketingStrategies')}</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckIcon color='white'/>
                  <span>{t('elite.features.plrContract')}</span>
                </li>
              </ul>
            </Box>
          </Grid>

          {/* Essential Plan */}
          <Grid size={{ xs: 12, md: 4 }}
            sx={{marginTop: {xs: 0, sm: 0, md: '-2.5rem', lg: '-2.5rem', xl: '-2.5rem'}}}>
            <Box 
              sx={stylesFond}
            >
              {/* Icon */}
              <Box sx={{ mb: 3 }}>
                <svg width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24.5" cy="24.0156" r="24" fill="url(#paint0_linear_98_1738)"/>
                  <path d="M30.075 19.0156C30.075 18.8167 30.154 18.6259 30.2947 18.4853C30.4353 18.3446 30.6261 18.2656 30.825 18.2656C31.888 18.2656 32.746 18.6536 33.335 19.2856C33.912 19.9076 34.189 20.7216 34.189 21.5156C34.189 22.3096 33.912 23.1236 33.334 23.7456C32.746 24.3776 31.888 24.7656 30.824 24.7656H15.5C15.3011 24.7656 15.1103 24.6866 14.9697 24.546C14.829 24.4053 14.75 24.2145 14.75 24.0156C14.75 23.8167 14.829 23.6259 14.9697 23.4853C15.1103 23.3446 15.3011 23.2656 15.5 23.2656H30.825C31.504 23.2656 31.953 23.0286 32.235 22.7236C32.529 22.4076 32.689 21.9716 32.689 21.5156C32.689 21.0596 32.529 20.6236 32.236 20.3076C31.953 20.0026 31.504 19.7656 30.825 19.7656C30.6261 19.7656 30.4353 19.6866 30.2947 19.546C30.154 19.4053 30.075 19.2145 30.075 19.0156ZM14.75 28.0156C14.75 27.8167 14.829 27.6259 14.9697 27.4853C15.1103 27.3446 15.3011 27.2656 15.5 27.2656H30.911C31.968 27.2656 32.821 27.6556 33.404 28.2886C33.977 28.9106 34.25 29.7236 34.25 30.5156C34.25 31.3076 33.977 32.1206 33.404 32.7426C32.821 33.3756 31.968 33.7656 30.911 33.7656C30.7121 33.7656 30.5213 33.6866 30.3807 33.546C30.24 33.4053 30.161 33.2145 30.161 33.0156C30.161 32.8167 30.24 32.6259 30.3807 32.4853C30.5213 32.3446 30.7121 32.2656 30.911 32.2656C31.579 32.2656 32.021 32.0306 32.301 31.7256C32.591 31.4106 32.75 30.9736 32.75 30.5156C32.75 30.0576 32.591 29.6206 32.3 29.3056C32.021 29.0006 31.58 28.7656 30.911 28.7656H15.5C15.3011 28.7656 15.1103 28.6866 14.9697 28.546C14.829 28.4053 14.75 28.2145 14.75 28.0156Z" fill="#ECEFFF"/>
                  <defs>
                    <linearGradient id="paint0_linear_98_1738" x1="24.5" y1="0.0156" x2="24.5" y2="48.0156" gradientUnits="userSpaceOnUse">
                      <stop stopColor="white" stopOpacity="0.08"/>
                      <stop offset="1" stopColor="white" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                </svg>
              </Box>

              {/* Title */}
              <Typography variant="h5" sx={title}>
                {t('essential.title')}
              </Typography>
              <Typography variant="body1" sx={subtitle}>
                {t('essential.description')}
              </Typography>

              {/* Price */}
              <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1, mt: 3 }}>
                <Typography variant="h2" sx={price1}>
                  100
                </Typography>
                <Typography variant="h4" sx={{ ...price1, ml: 1 }}>
                  €
                </Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  / 3 mois
                </Typography>
              </Box>

              {/* XOF Price */}
              <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 4 }}>
                <Typography variant="h5" sx={price2}>
                  ~65 000 XOF
                </Typography>
                <Typography variant="body2" sx={{  ml: 1 }}>
                  / 3 mois
                </Typography>
              </Box>

              {/* CTA Button */}
              <button className={styles.primaryButton}
                onClick={() => handleAddToCart(subscriptionPlans[1])}>
                <span>{t('subscribe')}</span>
                <Box className={styles.iconWrapper}>
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Box>
              </button>

              {/* Features */}
              <ul className={styles.featureList}>
                <li className={styles.featureItem}>
                  <CheckIcon />
                  <span>{t('essential.features.access15Products')}</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckIcon />
                  <span>{t('essential.features.advertising8Posters')}</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckIcon />
                  <span>{t('essential.features.weeklyTrends')}</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckIcon />
                  <span>{t('essential.features.monthlyStrategyAudit')}</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckIcon />
                  <span>{t('essential.features.monthlySurprise')}</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckIcon />
                  <span>{t('essential.features.plrLicense')}</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckIcon />
                  <span className={styles.featureItemDisabled}>{t('basic.features.weeklyMystery')}</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckIcon />
                  <span className={styles.featureItemDisabled}>{t('basic.features.adTexts')}</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckIcon />
                  <span className={styles.featureItemDisabled}>{t('basic.features.monthlyCall')}</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckIcon/>
                  <span className={styles.featureItemDisabled}>{t('elite.features.ecommerceStore')}</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckIcon />
                  <span className={styles.featureItemDisabled}>{t('elite.features.exclusiveAudiences')}</span>
                </li>
              </ul>
            </Box>
          </Grid>

          
        </Grid>
        <Box className={styles.footerPricing}>
          <Box className={styles.itemsInfos}>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="26" viewBox="0 0 25 26" fill="none"><path d="M23.3237 10.0573C23.1166 4.45737 18.5204 0.0225586 12.9166 0.015625H12.0833C8.11328 0.0263672 4.49253 2.28682 2.7396 5.84897H2.5C1.11987 5.85034 0.00136719 6.96885 0 8.34898V16.6823C0.00151367 17.9018 0.88125 18.9428 2.08335 19.1478V21.2656C2.08333 21.343 2.10487 21.4189 2.14555 21.4847C2.18623 21.5505 2.24444 21.6037 2.31365 21.6383C2.38287 21.6729 2.46035 21.6876 2.53743 21.6806C2.6145 21.6737 2.6881 21.6454 2.75 21.5989L5.97207 19.1823H15C16.3801 19.1809 17.4986 18.0624 17.5 16.6823V8.34898C17.4986 6.96885 16.3801 5.85034 15 5.84897H5.63877C6.37062 4.82104 7.33703 3.98242 8.45783 3.40271C9.57863 2.823 10.8215 2.51889 12.0833 2.51562H12.9167C17.1225 2.52256 20.5893 5.81577 20.8121 10.0156H19.5833C18.893 10.0156 18.3333 10.5753 18.3333 11.2656V17.9323C18.3333 18.6226 18.893 19.1823 19.5833 19.1823H20.8333V19.5989C20.832 20.7489 19.9 21.6809 18.75 21.6823H11.1733C11.0875 21.4394 10.9287 21.229 10.7186 21.0798C10.5086 20.9306 10.2576 20.85 10 20.8489H6.66665C5.97632 20.8489 5.41665 21.4086 5.41665 22.0989V23.7656C5.41665 24.456 5.97632 25.0156 6.66665 25.0156H10C10.2576 25.0146 10.5086 24.9339 10.7186 24.7847C10.9287 24.6356 11.0875 24.4252 11.1733 24.1823H18.75C21.2801 24.1793 23.3304 22.129 23.3333 19.5989V19.1406C24.3027 18.9412 24.9988 18.0885 25 17.0989V12.0989C24.9981 11.1063 24.2971 10.2524 23.3237 10.0573ZM16.6667 8.34898V16.6823C16.6667 17.6028 15.9205 18.349 15 18.349H5.83335C5.74319 18.349 5.65547 18.3782 5.58335 18.4323L2.9167 20.4323V18.7656C2.9167 18.6551 2.8728 18.5491 2.79467 18.471C2.71653 18.3929 2.61055 18.349 2.50005 18.349C1.57959 18.349 0.833398 17.6028 0.833398 16.6823V8.34898C0.833398 7.42852 1.57959 6.68232 2.50005 6.68232H15C15.9205 6.68228 16.6667 7.42847 16.6667 8.34898ZM12.9166 1.68228H12.0833C9.04839 1.68975 6.23306 3.26577 4.63999 5.84893H3.67251C5.35493 2.77354 8.57783 0.857568 12.0833 0.848926H12.9167C18.0446 0.855176 22.2611 4.89277 22.4896 10.0156H21.6454C21.4216 5.35557 17.5821 1.69004 12.9166 1.68228ZM19.1667 17.9323V11.2656C19.1667 11.1551 19.2105 11.0491 19.2887 10.971C19.3668 10.8929 19.4728 10.849 19.5833 10.849H20.8333V18.349H19.5833C19.4728 18.349 19.3668 18.3051 19.2887 18.2269C19.2105 18.1488 19.1667 18.0428 19.1667 17.9323ZM10.4166 23.7656C10.4166 23.8761 10.3728 23.9821 10.2946 24.0602C10.2165 24.1384 10.1105 24.1823 10 24.1823H6.66665C6.55615 24.1823 6.45017 24.1384 6.37203 24.0602C6.2939 23.9821 6.25 23.8761 6.25 23.7656V22.099C6.25 21.9885 6.2939 21.8825 6.37203 21.8044C6.45017 21.7262 6.55615 21.6823 6.66665 21.6823H10C10.1105 21.6823 10.2165 21.7262 10.2946 21.8044C10.3728 21.8825 10.4166 21.9885 10.4166 22.099V23.7656ZM18.75 23.349H11.25V22.5156H18.75C20.36 22.5136 21.6646 21.2089 21.6667 19.599V19.1823H22.5V19.599C22.4977 21.6691 20.8201 23.3467 18.75 23.349ZM24.1667 17.099C24.1667 17.7893 23.607 18.349 22.9167 18.349H21.6667V10.849H22.9167C23.607 10.849 24.1667 11.4086 24.1667 12.099V17.099Z" fill="#5E3AFC"></path><path d="M2.08325 10.0158C2.08325 10.1263 2.12715 10.2323 2.20529 10.3104C2.28342 10.3885 2.3894 10.4324 2.4999 10.4324H10.4166C10.5271 10.4324 10.633 10.3885 10.7112 10.3104C10.7893 10.2323 10.8332 10.1263 10.8332 10.0158C10.8332 9.90527 10.7893 9.79929 10.7112 9.72115C10.633 9.64302 10.5271 9.59912 10.4166 9.59912H2.4999C2.3894 9.59912 2.28342 9.64302 2.20529 9.72115C2.12715 9.79929 2.08325 9.90527 2.08325 10.0158ZM12.0833 10.4324H14.9999C15.1104 10.4324 15.2164 10.3885 15.2945 10.3104C15.3727 10.2323 15.4166 10.1263 15.4166 10.0158C15.4166 9.90527 15.3727 9.79929 15.2945 9.72115C15.2164 9.64302 15.1104 9.59912 14.9999 9.59912H12.0833C11.9727 9.59912 11.8668 9.64302 11.7886 9.72115C11.7105 9.79929 11.6666 9.90527 11.6666 10.0158C11.6666 10.0705 11.6774 10.1247 11.6983 10.1752C11.7192 10.2258 11.7499 10.2717 11.7886 10.3104C11.8273 10.3491 11.8732 10.3798 11.9238 10.4007C11.9744 10.4217 12.0285 10.4324 12.0833 10.4324ZM14.9999 12.0991H2.4999C2.3894 12.0991 2.28342 12.143 2.20529 12.2212C2.12715 12.2993 2.08325 12.4053 2.08325 12.5158C2.08325 12.6263 2.12715 12.7323 2.20529 12.8104C2.28342 12.8885 2.3894 12.9324 2.4999 12.9324H14.9999C15.1104 12.9324 15.2164 12.8885 15.2945 12.8104C15.3727 12.7323 15.4166 12.6263 15.4166 12.5158C15.4166 12.4053 15.3727 12.2993 15.2945 12.2212C15.2164 12.143 15.1104 12.0991 14.9999 12.0991ZM7.91655 14.5991H2.4999C2.3894 14.5991 2.28342 14.643 2.20529 14.7212C2.12715 14.7993 2.08325 14.9053 2.08325 15.0158C2.08325 15.1263 2.12715 15.2322 2.20529 15.3104C2.28342 15.3885 2.3894 15.4324 2.4999 15.4324H7.91655C8.14668 15.4324 8.3332 15.2459 8.3332 15.0158C8.3332 14.7856 8.14668 14.5991 7.91655 14.5991Z" fill="#5E3AFC"></path></svg>
            <Typography>Paiement sécurisé</Typography>
          </Box>
          <Box className={styles.itemsInfos}>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="21" viewBox="0 0 25 21" fill="none"><path d="M8.79922 9.24868C8.06726 9.98063 7.56878 10.9132 7.36683 11.9284C7.16488 12.9437 7.26852 13.996 7.66465 14.9524C8.06077 15.9087 8.73159 16.7261 9.59228 17.3012C10.453 17.8763 11.4649 18.1833 12.5 18.1833C13.5351 18.1833 14.547 17.8763 15.4077 17.3012C16.2684 16.7261 16.9392 15.9087 17.3354 14.9524C17.7315 13.996 17.8351 12.9437 17.6332 11.9284C17.4312 10.9132 16.9327 9.98063 16.2008 9.24868C15.7171 8.75857 15.1409 8.36942 14.5056 8.10381C13.8703 7.8382 13.1886 7.70143 12.5 7.70143C11.8114 7.70143 11.1297 7.8382 10.4944 8.10381C9.8591 8.36942 9.28289 8.75857 8.79922 9.24868ZM15.7174 16.1669C14.9731 16.9113 13.9936 17.3745 12.946 17.4777C11.8983 17.5809 10.8474 17.3176 9.97206 16.7327C9.09678 16.1479 8.45136 15.2776 8.14578 14.2703C7.8402 13.2629 7.89336 12.1807 8.29622 11.2082C8.69907 10.2356 9.42669 9.43281 10.3551 8.93657C11.2835 8.44033 12.3552 8.28136 13.3877 8.48673C14.4202 8.69211 15.3495 9.24913 16.0173 10.0629C16.6851 10.8766 17.0501 11.8968 17.0501 12.9495C17.0518 13.5472 16.9348 14.1394 16.7061 14.6917C16.4773 15.244 16.1413 15.7454 15.7174 16.1669V16.1669ZM14.4359 11.4971L12.9834 12.9495L14.4359 14.4021C14.5 14.4662 14.5361 14.5531 14.5361 14.6438C14.5361 14.7345 14.5 14.8214 14.4359 14.8855C14.3718 14.9496 14.2849 14.9856 14.1942 14.9856C14.1036 14.9856 14.0166 14.9496 13.9525 14.8855L12.5 13.4329L11.0474 14.8855C10.9833 14.9496 10.8964 14.9856 10.8057 14.9856C10.7151 14.9856 10.6281 14.9496 10.564 14.8855C10.4999 14.8214 10.4639 14.7345 10.4639 14.6438C10.4639 14.5531 10.4999 14.4662 10.564 14.4021L12.0166 12.9495L10.5641 11.4971C10.5 11.433 10.4639 11.3461 10.4639 11.2554C10.4639 11.1648 10.5 11.0778 10.5641 11.0137C10.6282 10.9496 10.7151 10.9136 10.8058 10.9136C10.8964 10.9136 10.9834 10.9496 11.0475 11.0137L12.5 12.4661L13.9526 11.0137C14.0167 10.9496 14.1036 10.9136 14.1943 10.9136C14.2849 10.9136 14.3719 10.9496 14.436 11.0137C14.5001 11.0778 14.5361 11.1648 14.5361 11.2554C14.5361 11.3461 14.5 11.433 14.4359 11.4971ZM22.3218 0.698242H2.67822C1.96815 0.699043 1.28739 0.981477 0.785301 1.48358C0.283209 1.98568 0.000788344 2.66644 0 3.37651L0 17.6548C0.000788344 18.3649 0.283209 19.0457 0.785301 19.5478C1.28739 20.0499 1.96815 20.3323 2.67822 20.3331H22.3218C23.0318 20.3323 23.7126 20.0499 24.2147 19.5478C24.7168 19.0457 24.9992 18.3649 25 17.6548V3.37651C24.9992 2.66644 24.7168 1.98568 24.2147 1.48358C23.7126 0.981477 23.0318 0.699043 22.3218 0.698242ZM22.3218 19.6495H2.67822C2.1494 19.6489 1.64243 19.4385 1.2685 19.0646C0.894576 18.6906 0.684227 18.1837 0.683594 17.6548V6.24956H24.3164V17.6548C24.3158 18.1837 24.1054 18.6906 23.7315 19.0646C23.3576 19.4385 22.8506 19.6489 22.3218 19.6495ZM24.3164 5.56597H0.683594V3.37651C0.684227 2.84769 0.894576 2.34072 1.2685 1.96678C1.64243 1.59284 2.1494 1.38248 2.67822 1.38184H22.3218C22.8506 1.38248 23.3576 1.59284 23.7315 1.96678C24.1054 2.34072 24.3158 2.84769 24.3164 3.37651V5.56597ZM3.75513 2.42173C3.54702 2.42173 3.34359 2.48344 3.17055 2.59906C2.99752 2.71468 2.86266 2.87901 2.78302 3.07128C2.70338 3.26355 2.68255 3.47511 2.72315 3.67922C2.76375 3.88332 2.86397 4.07081 3.01113 4.21796C3.15829 4.36511 3.34577 4.46532 3.54988 4.50591C3.75399 4.5465 3.96556 4.52566 4.15782 4.44602C4.35008 4.36637 4.51441 4.2315 4.63002 4.05846C4.74563 3.88542 4.80733 3.68198 4.80732 3.47388C4.80701 3.19492 4.69606 2.92747 4.4988 2.73022C4.30154 2.53297 4.03409 2.42203 3.75513 2.42173ZM3.75513 3.84263C3.68222 3.84263 3.61096 3.82101 3.55034 3.78051C3.48973 3.74 3.44248 3.68244 3.41458 3.61508C3.38668 3.54773 3.37938 3.47361 3.39361 3.40211C3.40783 3.33061 3.44293 3.26493 3.49448 3.21338C3.54603 3.16183 3.61171 3.12672 3.68322 3.1125C3.75472 3.09828 3.82883 3.10558 3.89619 3.13348C3.96354 3.16138 4.02111 3.20862 4.06161 3.26924C4.10211 3.32985 4.12373 3.40112 4.12373 3.47402C4.12359 3.57173 4.0847 3.66538 4.0156 3.73446C3.9465 3.80353 3.85283 3.84238 3.75513 3.84248V3.84263ZM6.44556 2.42173C6.23745 2.42173 6.03402 2.48344 5.86098 2.59906C5.68795 2.71468 5.55309 2.87901 5.47345 3.07128C5.39381 3.26355 5.37298 3.47511 5.41358 3.67922C5.45418 3.88332 5.5544 4.07081 5.70156 4.21796C5.84872 4.36511 6.0362 4.46532 6.24031 4.50591C6.44442 4.5465 6.65599 4.52566 6.84825 4.44602C7.04051 4.36637 7.20484 4.2315 7.32045 4.05846C7.43606 3.88542 7.49776 3.68198 7.49775 3.47388C7.49743 3.19488 7.38644 2.9274 7.18913 2.73015C6.99182 2.53289 6.72431 2.42197 6.44531 2.42173H6.44556ZM6.44556 3.84263C6.37265 3.84263 6.30139 3.82101 6.24077 3.78051C6.18015 3.74 6.13291 3.68244 6.10501 3.61508C6.07711 3.54773 6.06981 3.47361 6.08404 3.40211C6.09826 3.33061 6.13336 3.26493 6.18491 3.21338C6.23646 3.16183 6.30214 3.12672 6.37365 3.1125C6.44515 3.09828 6.51926 3.10558 6.58662 3.13348C6.65397 3.16138 6.71154 3.20862 6.75204 3.26924C6.79254 3.32985 6.81416 3.40112 6.81416 3.47402C6.81402 3.57177 6.7751 3.66546 6.70595 3.73454C6.63679 3.80362 6.54306 3.84244 6.44531 3.84248L6.44556 3.84263ZM9.13599 2.42173C8.92788 2.42172 8.72444 2.48342 8.5514 2.59904C8.37836 2.71465 8.24349 2.87898 8.16384 3.07124C8.0842 3.26351 8.06336 3.47508 8.10396 3.67919C8.14455 3.8833 8.24477 4.07079 8.39192 4.21794C8.53908 4.3651 8.72656 4.46531 8.93068 4.50591C9.13479 4.54651 9.34635 4.52566 9.53862 4.44602C9.73088 4.36638 9.89522 4.23151 10.0108 4.05847C10.1264 3.88542 10.1881 3.68199 10.1881 3.47388C10.1878 3.19488 10.0768 2.92741 9.87954 2.73015C9.68224 2.5329 9.41474 2.42197 9.13574 2.42173H9.13599ZM9.13599 3.84263C9.06308 3.84264 8.99181 3.82103 8.93119 3.78053C8.87056 3.74003 8.82331 3.68247 8.79541 3.61512C8.7675 3.54776 8.76019 3.47365 8.77441 3.40214C8.78863 3.33064 8.82373 3.26495 8.87528 3.2134C8.92683 3.16184 8.99251 3.12673 9.06401 3.11251C9.13551 3.09828 9.20963 3.10558 9.27698 3.13347C9.34434 3.16137 9.40191 3.20862 9.44242 3.26923C9.48292 3.32985 9.50454 3.40112 9.50454 3.47402C9.5044 3.57176 9.46549 3.66545 9.39634 3.73453C9.3272 3.8036 9.23348 3.84243 9.13574 3.84248L9.13599 3.84263ZM22.0771 3.47402C22.0771 3.51891 22.0683 3.56335 22.0511 3.60482C22.0339 3.64629 22.0087 3.68397 21.977 3.71571C21.9453 3.74745 21.9076 3.77263 21.8661 3.7898C21.8246 3.80698 21.7802 3.81582 21.7353 3.81582H14.4794C14.3888 3.81582 14.3019 3.77981 14.2378 3.71571C14.1737 3.65161 14.1376 3.56467 14.1376 3.47402C14.1376 3.38337 14.1737 3.29644 14.2378 3.23234C14.3019 3.16824 14.3888 3.13223 14.4794 3.13223H21.7353C21.8259 3.13232 21.9127 3.16835 21.9767 3.23241C22.0407 3.29646 22.0767 3.38331 22.0768 3.47388L22.0771 3.47402Z" fill="#5E3AFC"></path></svg>
            <Typography>Résiliable à tout moment</Typography>
          </Box>
          <Box className={styles.itemsInfos}>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="26" viewBox="0 0 25 26" fill="none"><path d="M23.3237 10.0573C23.1166 4.45737 18.5204 0.0225586 12.9166 0.015625H12.0833C8.11328 0.0263672 4.49253 2.28682 2.7396 5.84897H2.5C1.11987 5.85034 0.00136719 6.96885 0 8.34898V16.6823C0.00151367 17.9018 0.88125 18.9428 2.08335 19.1478V21.2656C2.08333 21.343 2.10487 21.4189 2.14555 21.4847C2.18623 21.5505 2.24444 21.6037 2.31365 21.6383C2.38287 21.6729 2.46035 21.6876 2.53743 21.6806C2.6145 21.6737 2.6881 21.6454 2.75 21.5989L5.97207 19.1823H15C16.3801 19.1809 17.4986 18.0624 17.5 16.6823V8.34898C17.4986 6.96885 16.3801 5.85034 15 5.84897H5.63877C6.37062 4.82104 7.33703 3.98242 8.45783 3.40271C9.57863 2.823 10.8215 2.51889 12.0833 2.51562H12.9167C17.1225 2.52256 20.5893 5.81577 20.8121 10.0156H19.5833C18.893 10.0156 18.3333 10.5753 18.3333 11.2656V17.9323C18.3333 18.6226 18.893 19.1823 19.5833 19.1823H20.8333V19.5989C20.832 20.7489 19.9 21.6809 18.75 21.6823H11.1733C11.0875 21.4394 10.9287 21.229 10.7186 21.0798C10.5086 20.9306 10.2576 20.85 10 20.8489H6.66665C5.97632 20.8489 5.41665 21.4086 5.41665 22.0989V23.7656C5.41665 24.456 5.97632 25.0156 6.66665 25.0156H10C10.2576 25.0146 10.5086 24.9339 10.7186 24.7847C10.9287 24.6356 11.0875 24.4252 11.1733 24.1823H18.75C21.2801 24.1793 23.3304 22.129 23.3333 19.5989V19.1406C24.3027 18.9412 24.9988 18.0885 25 17.0989V12.0989C24.9981 11.1063 24.2971 10.2524 23.3237 10.0573ZM16.6667 8.34898V16.6823C16.6667 17.6028 15.9205 18.349 15 18.349H5.83335C5.74319 18.349 5.65547 18.3782 5.58335 18.4323L2.9167 20.4323V18.7656C2.9167 18.6551 2.8728 18.5491 2.79467 18.471C2.71653 18.3929 2.61055 18.349 2.50005 18.349C1.57959 18.349 0.833398 17.6028 0.833398 16.6823V8.34898C0.833398 7.42852 1.57959 6.68232 2.50005 6.68232H15C15.9205 6.68228 16.6667 7.42847 16.6667 8.34898ZM12.9166 1.68228H12.0833C9.04839 1.68975 6.23306 3.26577 4.63999 5.84893H3.67251C5.35493 2.77354 8.57783 0.857568 12.0833 0.848926H12.9167C18.0446 0.855176 22.2611 4.89277 22.4896 10.0156H21.6454C21.4216 5.35557 17.5821 1.69004 12.9166 1.68228ZM19.1667 17.9323V11.2656C19.1667 11.1551 19.2105 11.0491 19.2887 10.971C19.3668 10.8929 19.4728 10.849 19.5833 10.849H20.8333V18.349H19.5833C19.4728 18.349 19.3668 18.3051 19.2887 18.2269C19.2105 18.1488 19.1667 18.0428 19.1667 17.9323ZM10.4166 23.7656C10.4166 23.8761 10.3728 23.9821 10.2946 24.0602C10.2165 24.1384 10.1105 24.1823 10 24.1823H6.66665C6.55615 24.1823 6.45017 24.1384 6.37203 24.0602C6.2939 23.9821 6.25 23.8761 6.25 23.7656V22.099C6.25 21.9885 6.2939 21.8825 6.37203 21.8044C6.45017 21.7262 6.55615 21.6823 6.66665 21.6823H10C10.1105 21.6823 10.2165 21.7262 10.2946 21.8044C10.3728 21.8825 10.4166 21.9885 10.4166 22.099V23.7656ZM18.75 23.349H11.25V22.5156H18.75C20.36 22.5136 21.6646 21.2089 21.6667 19.599V19.1823H22.5V19.599C22.4977 21.6691 20.8201 23.3467 18.75 23.349ZM24.1667 17.099C24.1667 17.7893 23.607 18.349 22.9167 18.349H21.6667V10.849H22.9167C23.607 10.849 24.1667 11.4086 24.1667 12.099V17.099Z" fill="#5E3AFC"></path><path d="M2.08325 10.0158C2.08325 10.1263 2.12715 10.2323 2.20529 10.3104C2.28342 10.3885 2.3894 10.4324 2.4999 10.4324H10.4166C10.5271 10.4324 10.633 10.3885 10.7112 10.3104C10.7893 10.2323 10.8332 10.1263 10.8332 10.0158C10.8332 9.90527 10.7893 9.79929 10.7112 9.72115C10.633 9.64302 10.5271 9.59912 10.4166 9.59912H2.4999C2.3894 9.59912 2.28342 9.64302 2.20529 9.72115C2.12715 9.79929 2.08325 9.90527 2.08325 10.0158ZM12.0833 10.4324H14.9999C15.1104 10.4324 15.2164 10.3885 15.2945 10.3104C15.3727 10.2323 15.4166 10.1263 15.4166 10.0158C15.4166 9.90527 15.3727 9.79929 15.2945 9.72115C15.2164 9.64302 15.1104 9.59912 14.9999 9.59912H12.0833C11.9727 9.59912 11.8668 9.64302 11.7886 9.72115C11.7105 9.79929 11.6666 9.90527 11.6666 10.0158C11.6666 10.0705 11.6774 10.1247 11.6983 10.1752C11.7192 10.2258 11.7499 10.2717 11.7886 10.3104C11.8273 10.3491 11.8732 10.3798 11.9238 10.4007C11.9744 10.4217 12.0285 10.4324 12.0833 10.4324ZM14.9999 12.0991H2.4999C2.3894 12.0991 2.28342 12.143 2.20529 12.2212C2.12715 12.2993 2.08325 12.4053 2.08325 12.5158C2.08325 12.6263 2.12715 12.7323 2.20529 12.8104C2.28342 12.8885 2.3894 12.9324 2.4999 12.9324H14.9999C15.1104 12.9324 15.2164 12.8885 15.2945 12.8104C15.3727 12.7323 15.4166 12.6263 15.4166 12.5158C15.4166 12.4053 15.3727 12.2993 15.2945 12.2212C15.2164 12.143 15.1104 12.0991 14.9999 12.0991ZM7.91655 14.5991H2.4999C2.3894 14.5991 2.28342 14.643 2.20529 14.7212C2.12715 14.7993 2.08325 14.9053 2.08325 15.0158C2.08325 15.1263 2.12715 15.2322 2.20529 15.3104C2.28342 15.3885 2.3894 15.4324 2.4999 15.4324H7.91655C8.14668 15.4324 8.3332 15.2459 8.3332 15.0158C8.3332 14.7856 8.14668 14.5991 7.91655 14.5991Z" fill="#5E3AFC"></path></svg>
            <Typography>Assistance en 24h max</Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
