'use client';

import { useState, useEffect } from 'react';
import { Box, Container, Typography, TextField, Button, Alert, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff, CheckCircle, ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';
import { useTranslations } from 'next-intl';
import styles from '../connexion/auth.module.scss';

export default function ReinitialiserMotDePassePage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const { theme } = useTheme();
  const t = useTranslations('Auth');
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isValidToken, setIsValidToken] = useState(true);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    setToken(tokenParam);
    
    // Simulation de validation du token
    if (!tokenParam) {
      setIsValidToken(false);
    }
  }, [searchParams]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    // Simulation d'une requête de réinitialisation
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 2000);
  };

  // Token invalide ou expiré
  if (!isValidToken) {
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
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h3" className="rafly-title" sx={{ mb: 2 }}>
                {t('invalidLink')}
              </Typography>
              <Typography variant="body1" sx={{ 
                color: 'var(--muted-foreground)',
                mb: 4
              }}>
                {t('invalidLinkDescription')}
              </Typography>
              
              <Alert severity="error" sx={{ mb: 4, textAlign: 'left' }}>
                <Typography variant="body2">
                  <strong>{t('linkExpiredTitle')}</strong><br />
                  {t('requestNewLink')}
                </Typography>
              </Alert>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Link href={`/${locale}/mot-de-passe-oublie`} style={{ textDecoration: 'none' }}>
                <Button
                  fullWidth
                  variant="contained"
                  className={styles.submitButton}
                >
                  {t('requestNewLinkButton')}
                </Button>
              </Link>
              
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

  // Succès
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
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box sx={{ 
                width: 80, 
                height: 80, 
                borderRadius: '50%', 
                backgroundColor: 'var(--success-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3
              }}>
                <CheckCircle sx={{ fontSize: 40, color: 'var(--success)' }} />
              </Box>
              
              <Typography variant="h3" className="rafly-title" sx={{ mb: 2 }}>
                {t('passwordChanged')}
              </Typography>
              
              <Typography variant="body1" sx={{ 
                color: 'var(--muted-foreground)',
                mb: 4
              }}>
                {t('passwordChangedDescription')}
              </Typography>
              
              <Alert severity="success" sx={{ mb: 4, textAlign: 'left' }}>
                <Typography variant="body2">
                  <strong>{t('changeSuccessful')}</strong><br />
                  {t('accountSecured')}
                </Typography>
              </Alert>
            </Box>

            <Link href={`/${locale}/connexion`} style={{ textDecoration: 'none' }}>
              <Button
                fullWidth
                variant="contained"
                className={styles.submitButton}
              >
                {t('loginButton')}
              </Button>
            </Link>
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
            <Typography variant="h3" className="rafly-title" sx={{ mb: 2 }}>
              {t('newPassword')}
            </Typography>
            <Typography variant="body1" sx={{ 
              color: 'var(--muted-foreground)',
              fontSize: '1rem'
            }}>
              {t('newPasswordDescription')}
            </Typography>
          </Box>

          {/* Reset Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
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
                  placeholder={t('newPasswordPlaceholder')}
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
              <span className={styles.helperText}>{t('passwordMinLengthHelper')}</span>
            </Box>

            <Box sx={{ mb: 4 }}>
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

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              className={styles.submitButton}
              sx={{ mb: 3 }}
            >
              {isLoading ? t('resettingPassword') : t('resetPasswordButton')}
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
