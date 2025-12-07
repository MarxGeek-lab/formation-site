'use client';

import { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Alert } from '@mui/material';
import { Email, ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
import { useTheme } from '@/hooks/useTheme';
import { useTranslations } from 'next-intl';
import styles from '../connexion/auth.module.scss';
import { hideLoader, showLoader } from '@/components/Loader/loaderService';
import { useAuthStore } from '@/contexts/AuthContext';
import { showToast } from '@/components/ToastNotification/ToastNotification';

export default function MotDePasseOubliePage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const { theme } = useTheme();
  const { verifyEmail }= useAuthStore()
  const t = useTranslations('Auth');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!email) {
      newErrors.email = t('errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('errors.emailInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        sessionStorage.setItem("email__", email);
        console.log(email)
        if (email) {
            showLoader()
            try {
                const status = await verifyEmail(email);
                console.log(status)
                hideLoader()
                if (status) {

                    if (status === 200) {
                        setIsSuccess(true)
                    } else if (status === 404) {
                        showToast(t('toasts.generalError'), "error");
                    }
                }
            } catch (error) {
                 hideLoader()
            }
        } else {
            alert("Veuillez entrer vos identifiants de connexion");
        }
    }

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  if (isSuccess) {
    return (
      <Box sx={{ 
        backgroundColor: 'var(--background)', 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 4, md: 8 }
      }}>
        <Container maxWidth="sm">
          <Box className={styles.authContainer}>
            <Box sx={{ textAlign: 'center', mb: 4,  }}>
              <Box sx={{ 
                width: 80, 
                height: 80, 
                borderRadius: '50%', 
                backgroundColor: 'var(--primary-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                
              }}>
                <Email sx={{ fontSize: 40, color: 'var(--primary)' }} />
              </Box>
              
              <Typography variant="h3" className="titlePageSection" sx={{ mb: 2, mx: 'auto' }}>
                {t('emailSent')}
              </Typography>
              
              <Typography variant="body1" sx={{ 
                color: 'var(--muted-foreground)',
                mb: 3
              }}>
                {t('resetLinkSentTo')}
              </Typography>
              
              <Typography variant="body1" sx={{ 
                color: 'var(--primary)',
                fontWeight: 600,
                mb: 4
              }}>
                {email}
              </Typography>
              
              <Alert severity="info" sx={{ mb: 4, textAlign: 'left', background: 'var(--primary-light)' }}>
                <Typography variant="body2">
                  <strong>{t('checkInbox')}</strong><br />
                  {t('resetLinkExpires')}
                </Typography>
              </Alert>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2,  }}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                className={styles.submitButton}
              >
                {t('resendEmail')}
              </Button>
              
              <Link href={`/${locale}/connexion`} style={{ textDecoration: 'none' }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  className={styles.socialButton}
                >
                  {t('backToLogin')}
                </Button>
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      backgroundColor: 'var(--background)', 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      py: { xs: 4, md: 8 }
    }}>
      <Container maxWidth="sm">
        <Box className={styles.authContainer}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography className="titlePageSection" sx={{ mb: 2, mx: 'auto' }}>
              {t('forgotPassword')}
            </Typography>
            <Typography variant="body1" sx={{ 
              color: 'var(--muted-foreground)',
              fontSize: '1rem'
            }}>
              {t('forgotPasswordDescription')}
            </Typography>
          </Box>

          {/* Reset Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            <Box sx={{ mb: 4 }}>
              <label htmlFor="email" className={styles.label}>
                {t('email')} {t('required')}
              </label>
              <div className={styles.inputWithIcon}>
                <Email className={styles.inputIcon} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className={`${styles.input} ${styles.inputWithIconPadding} ${errors.email ? styles.inputError : ''}`}
                  placeholder={t('emailPlaceholder')}
                />
              </div>
              {errors.email && (
                <span className={styles.errorText}>{errors.email}</span>
              )}
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              className={styles.submitButton}
              sx={{ mb: 3 }}
            >
              {isLoading ? t('sendingReset') : t('sendResetButton')}
            </Button>
          </form>

          {/* Back to Login */}
          <Box sx={{ textAlign: 'center' }}>
            <Link href={`/${locale}/connexion`} className={styles.authLink}>
              <ArrowBack sx={{ fontSize: 16, mr: 1 }} />
              {t('backToLogin')}
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
