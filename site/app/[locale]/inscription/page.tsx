'use client';

import { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Alert, Divider, IconButton, InputAdornment, Checkbox, FormControlLabel } from '@mui/material';
import { Visibility, VisibilityOff, Google, Facebook } from '@mui/icons-material';
import Link from 'next/link';
import { useTheme } from '@/hooks/useTheme';
import { useTranslations } from 'next-intl';
import styles from '../connexion/auth.module.scss';
import { hideLoader, showLoader } from '@/components/Loader/loaderService';
import { showToast } from '@/components/ToastNotification/ToastNotification';
import { useAuthStore } from '@/contexts/GlobalContext';
import router from 'next/router';

export default function InscriptionPage({ params, affiliate = false, setIsAffiliate }: 
  { params: { locale: string }, affiliate?: boolean, setIsAffiliate?: (value: boolean) => void }) {
  const { locale } = params;
  const { register } = useAuthStore();
  const { theme } = useTheme();
  const t = useTranslations('Auth');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = t('errors.firstNameRequired');
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t('errors.lastNameRequired');
    }

    if (!formData.email) {
      newErrors.email = t('errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('errors.emailInvalid');
    }

    if (!formData.password) {
      newErrors.password = t('errors.passwordRequired');
    } else if (formData.password.length < 8) {
      newErrors.password = t('errors.passwordMinLength');
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('errors.passwordRequired');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('errors.passwordsNotMatch');
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = t('errors.termsRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    showLoader()
    setErrors({});

    const data = { 
      name: formData.firstName + " " + formData.lastName, 
      email: formData.email, 
      password: formData.password,
      origin: window.location.origin,
      affiliate: affiliate
  };

    try {
      const status = await register(data);
      hideLoader()
      if (status) {
          console.log(status)

          if (status === 201) {
            if (!affiliate) {
              alert(t('toasts.accountCreatedSuccess'))
              // showToast(t('toasts.accountCreatedSuccess'), "success");
              window.location.href = `/${locale}/connexion`
            } else {
              setIsAffiliate && setIsAffiliate(true);
            }
          } else if (status === 409) {
              showToast(t('toasts.emailAlreadyExists'), "error")
          } else {
              showToast(t('toasts.accountCreationError'), "error");
          }
      }
    } catch (err) {
      showToast(t('toasts.generalError'), "error");
    } finally {
      hideLoader()
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Inscription avec ${provider}`);
  };

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
            <Typography variant="h3" className="titlePageSection titlePageSection2" 
            sx={{ mb: 0, mx: 'auto' }}>
              {t('register')}
            </Typography>
            <Typography variant="body1" sx={{ 
              color: 'var(--muted-foreground)',
              fontSize: '1rem',
            }}>
              {t('registerSubtitle')}
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
              S'inscrire avec Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Facebook />}
              onClick={() => handleSocialLogin('Facebook')}
              className={styles.socialButton}
            >
              S'inscrire avec Facebook
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
              ou
            </Typography>
          </Divider> */}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Box sx={{ flex: 1 }}>
                <label htmlFor="firstName" className={styles.label}>
                  {t('firstName')} {t('required')}
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                  placeholder={t('firstNamePlaceholder')}
                />
                {errors.firstName && (
                  <span className={styles.errorText}>{errors.firstName}</span>
                )}
              </Box>
              <Box sx={{ flex: 1 }}>
                <label htmlFor="lastName" className={styles.label}>
                  {t('lastName')} {t('required')}
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                  placeholder={t('lastNamePlaceholder')}
                />
                {errors.lastName && (
                  <span className={styles.errorText}>{errors.lastName}</span>
                )}
              </Box>
            </Box>

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
              <span className={styles.helperText}>{t('errors.passwordMinLength')}</span>
            </Box>

            <Box sx={{ mb: 3 }}>
              <label htmlFor="confirmPassword" className={styles.label}>
                {t('confirmPassword')} {t('required')}
              </label>
              <div className={styles.passwordContainer}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                  placeholder={t('confirmPasswordPlaceholder')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={styles.passwordToggle}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className={styles.errorText}>{errors.confirmPassword}</span>
              )}
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.acceptTerms}
                    onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                    sx={{ color: errors.acceptTerms ? 'error.main' : 'primary.main' }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: 'var(--foreground)' }}>
                    {t('acceptTerms')}{' '}
                    <Link href={`/${locale}/politique-confidentialite`} className={styles.authLink}>
                      {t('privacyPolicy')}
                    </Link>
                  </Typography>
                }
              />
              {errors.acceptTerms && (
                <Typography variant="caption" sx={{ color: 'error.main', display: 'block', mt: 1 }}>
                  {errors.acceptTerms}
                </Typography>
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
              {isLoading ? t('registerLoading') : t('registerButton')}
            </Button>
          </form>

          {/* Login Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
              {t('hasAccount')}{' '}
              <Link href={`/${locale}/connexion`} className={styles.authLink}>
                {t('loginToAccount')}
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
