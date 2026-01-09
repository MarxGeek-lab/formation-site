'use client';

import { useEffect, useState } from 'react';
import { Box, Container, Typography, TextField, Button, Alert, Divider, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff, Google, Facebook } from '@mui/icons-material';
import Link from 'next/link';
import { useTheme } from '@/hooks/useTheme';
import { useTranslations } from 'next-intl';
import styles from './auth.module.scss';
import { hideLoader, showLoader } from '@/components/Loader/loaderService';
import { useAuthStore } from '@/contexts/GlobalContext';
import { showToast } from '@/components/ToastNotification/ToastNotification';
import { useRouter } from 'next/navigation';

export default function ConnexionPage({ 
  params, 
  affiliate = false,
  setIsAffiliate
}: 
  { 
    params: { locale: string }, 
    affiliate?: boolean,
    setIsAffiliate?: (value: boolean) => void
  }) {
  const { locale } = params;
  const router = useRouter();
  const { login, user, token} = useAuthStore();
  const { theme } = useTheme();
  const t = useTranslations('Auth');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // router.push(`/${locale}/dashboard`);
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email) {
      newErrors.email = t('errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('errors.emailInvalid');
    }

    if (!formData.password) {
      newErrors.password = t('errors.passwordRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    showLoader()

    const data = {
      email: formData.email,
      password: formData.password,
      affiliate: affiliate
    };

    try {
      const status = await login(data);
      hideLoader()
      if (status) {
          console.log(status)

          if (status === 200) {
            if (!affiliate) {
              window.location.href = `/${locale}/dashboard`;
            } else {
              setIsAffiliate && setIsAffiliate(true);
            }
          } else if (status === 429) {
              showToast(t('toasts.tooManyAttempts'), "error");
          } else {
              showToast(t('toasts.invalidCredentials'), "error");
          }
      }
    } catch (err) {
      showToast(t('toasts.generalError'), "error");
    } finally {
      hideLoader()
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Connexion avec ${provider}`);
  };

  return (
    <Box sx={{
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden',
      py: 4
    }}>
      <Container maxWidth="lg" sx={{
        px: { xs: 2, sm: 3, md: 4 }
      }}>
        <Box className={styles.authContainer}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography className="titlePageSection titlePageSection2" 
            sx={{ mb: 0, mx: 'auto' }}>
              {t('login')}
            </Typography>
            <Typography variant="body1" sx={{ 
              color: 'var(--muted-foreground)',
              fontSize: '1rem',
              textAlign: 'center'
            }}>
              {t('loginSubtitle')}
            </Typography>
          </Box>

          {/* Social Login */}
          {/* <Box className={styles.socialLogin}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Google />}
              onClick={() => handleSocialLogin('Google')}
              className={styles.socialButton}
              sx={{ mb: 2 }}
            >
              Continuer avec Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Facebook />}
              onClick={() => handleSocialLogin('Facebook')}
              className={styles.socialButton}
            >
              Continuer avec Facebook
            </Button>
          </Box> */}

          {/* <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
              ou
            </Typography>
          </Divider> */}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            <Box sx={{ mb: 3 }}>
              <label htmlFor="email" className={styles.label}>
                {t('email')} {t('required')}
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                placeholder={t('emailPlaceholder')}
              />
              {errors.email && (
                <span className={styles.errorText}>{errors.email}</span>
              )}
            </Box>

            <Box sx={{ mb: 3 }}>
              <label htmlFor="password" className={styles.label}>
                {t('password')} {t('required')}
              </label>
              <div className={styles.passwordContainer}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                  placeholder={t('passwordPlaceholder')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.passwordToggle}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </button>
              </div>
              {errors.password && (
                <span className={styles.errorText}>{errors.password}</span>
              )}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
              <Link href={`/${locale}/mot-de-passe-oublie`} className={styles.forgotLink}>
                {t('forgotPasswordLink')}
              </Link>
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
              {isLoading ? t('loginLoading') : t('loginButton')}
            </Button>
          </form>

          {/* Register Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
              {t('noAccount')}{' '}
              <Link href={`/${locale}/inscription`} className={styles.authLink}>
                {t('createAccount')}
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
