'use client';

import { Box, Container, Typography, Card, CardContent, List, ListItem, ListItemIcon, ListItemText, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Check } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import styles from './PricingSection/PricingSection.module.scss';

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

export default function PricingSection() {
    const t = useTranslations('Pricing');

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

    const price3 = {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: 'var(--primary)'
    }

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
              <button className={styles.primaryButton}>
                <span>{t('subscribe')}</span>
                <Box className={styles.iconWrapper}>
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Box>
              </button>

              {/* Features */}
              <List sx={{ flexGrow: 1, color: 'var(--primary-text)' }}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('basic.features.access3Products')} />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('basic.features.advertisingPosters')} />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('basic.features.plrLicense')} />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('basic.features.earlyAccess')} />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('basic.features.monthlySuprise')} />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('basic.features.weeklyMystery')} />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('basic.features.adTexts')} />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('basic.features.monthlyCall')} />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('basic.features.monthlyAudit')} />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('basic.features.marketingStrategies')} />
                </ListItem>
              </List>
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
                }}>
                <span>{t('subscribe')}</span>
                <Box className={styles.iconWrapper} sx={{background: 'var(--primary)'}}>
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fill="white" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Box>
              </button>

              {/* Features - All features from Basic plan */}
              <List sx={{ flexGrow: 1 }}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckIcon color='white' />
                  </ListItemIcon>
                  <ListItemText primary={t('basic.features.access3Products')} />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckIcon color='white' />
                  </ListItemIcon>
                  <ListItemText primary={t('basic.features.advertisingPosters')} />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckIcon color='white' />
                  </ListItemIcon>
                  <ListItemText primary={t('essential.features.plrLicense')} />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckIcon color='white'/>
                  </ListItemIcon>
                  <ListItemText primary={t('basic.features.earlyAccess')} />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckIcon color='white' />
                  </ListItemIcon>
                  <ListItemText primary={t('basic.features.monthlySuprise')} />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckIcon color='white' />
                  </ListItemIcon>
                  <ListItemText primary={t('basic.features.weeklyMystery')} />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckIcon color='white' />
                  </ListItemIcon>
                  <ListItemText primary={t('basic.features.adTexts')} />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckIcon color='white' />
                  </ListItemIcon>
                  <ListItemText primary={t('basic.features.monthlyCall')} />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckIcon color='white' />
                  </ListItemIcon>
                  <ListItemText primary={t('basic.features.monthlyAudit')} />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckIcon color='white' />
                  </ListItemIcon>
                  <ListItemText primary={t('basic.features.marketingStrategies')} />
                </ListItem>
              </List>
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
              <button className={styles.primaryButton}>
                <span>{t('subscribe')}</span>
                <Box className={styles.iconWrapper}>
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Box>
              </button>

              {/* Features */}
              <List sx={{ flexGrow: 1, color: 'var(--primary-text)' }}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('essential.features.access15Products')} />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('essential.features.advertising8Posters')} />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('essential.features.weeklyTrends')} />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('essential.features.monthlyStrategyAudit')} />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('essential.features.plrLicense')} />
                </ListItem>
              </List>
            </Box>
          </Grid>

          
        </Grid>
      </Container>
    </Box>
  );
}
