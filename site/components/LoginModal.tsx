'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
  CircularProgress
} from '@mui/material';
import { Close, Email, Lock, CheckCircle } from '@mui/icons-material';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/contexts/GlobalContext';
import { showToast } from '@/components/ToastNotification/ToastNotification';
import styles from './LoginModal.module.scss';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  locale: string;
}

type Step = 'email' | 'password' | 'success';

export default function LoginModal({ open, onClose, locale }: LoginModalProps) {
  const { theme } = useTheme();
  const { login } = useAuthStore();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Charger l'email depuis localStorage au montage
  useEffect(() => {
    if (open && typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('userEmail');
      if (savedEmail) {
        setEmail(savedEmail);
      }
    }
  }, [open]);

  // Réinitialiser le modal à la fermeture
  const handleClose = () => {
    setStep('email');
    setPassword('');
    setErrors({});
    onClose();
  };

  // Valider l'email
  const validateEmail = (email: string) => {
    if (!email) {
      return 'L\'email est requis';
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return 'Email invalide';
    }
    return '';
  };

  // Étape 1: Envoyer l'email pour recevoir le mot de passe
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/send-login-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        // Sauvegarder l'email dans localStorage
        localStorage.setItem('userEmail', email);

        showToast(
          data.isNewUser
            ? '🎉 Compte créé ! Vérifiez votre email pour le mot de passe'
            : '📧 Mot de passe envoyé par email',
          'success'
        );

        setStep('password');
      } else {
        setErrors({ email: data.message || 'Une erreur est survenue' });
        showToast(data.message || 'Erreur lors de l\'envoi', 'error');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setErrors({ email: 'Erreur de connexion au serveur' });
      showToast('Erreur de connexion au serveur', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Étape 2: Connexion avec le mot de passe
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      setErrors({ password: 'Le mot de passe est requis' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const status = await login({ email, password });

      if (status === 200) {
        // Sauvegarder la session avec expiration de 12h
        const sessionExpiry = Date.now() + (12 * 60 * 60 * 1000); // 12 heures
        localStorage.setItem('sessionExpiry', sessionExpiry.toString());

        showToast('✅ Connexion réussie !', 'success');
        setStep('success');

        // Rediriger après 1.5s
        setTimeout(() => {
          handleClose();
          window.location.href = `/${locale}/dashboard`;
        }, 1500);
      } else if (status === 429) {
        setErrors({ password: 'Trop de tentatives. Réessayez plus tard.' });
        showToast('Trop de tentatives', 'error');
      } else {
        setErrors({ password: 'Mot de passe incorrect' });
        showToast('Mot de passe incorrect', 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ password: 'Erreur de connexion' });
      showToast('Erreur de connexion', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Retour à l'étape email
  const handleBackToEmail = () => {
    setStep('email');
    setPassword('');
    setErrors({});
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: styles.dialogPaper,
        sx: {
          backgroundColor: 'var(--background)',
          backgroundImage: 'none',
        }
      }}
    >
      <DialogContent className={styles.dialogContent}>
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          className={styles.closeButton}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: 'var(--muted-foreground)',
            '&:hover': {
              backgroundColor: 'var(--muted)',
            }
          }}
        >
          <Close />
        </IconButton>

        {/* Header */}
        <Box className={styles.header}>
          <Typography className={styles.title}>
            {step === 'email' && '👋 Connexion'}
            {step === 'password' && '🔐 Entrez votre mot de passe'}
            {step === 'success' && '✅ Connexion réussie !'}
          </Typography>
          <Typography className={styles.subtitle}>
            {step === 'email' && 'Entrez votre email pour continuer'}
            {step === 'password' && 'Consultez votre boîte email'}
            {step === 'success' && 'Redirection en cours...'}
          </Typography>
        </Box>

        {/* Step 1: Email Form */}
        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className={styles.form}>
            <Box className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                <Email sx={{ fontSize: 18, mr: 0.5 }} />
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({});
                }}
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                placeholder="votre@email.com"
                disabled={isLoading}
                autoFocus
              />
              {errors.email && (
                <span className={styles.errorText}>{errors.email}</span>
              )}
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              className={styles.submitButton}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                  Envoi en cours...
                </>
              ) : (
                'Continuer'
              )}
            </Button>

            <Box className={styles.infoBox}>
              <Typography variant="body2" className={styles.infoText}>
                💡 Vous recevrez un mot de passe par email à chaque connexion
              </Typography>
            </Box>
          </form>
        )}

        {/* Step 2: Password Form */}
        {step === 'password' && (
          <form onSubmit={handlePasswordSubmit} className={styles.form}>
            <Box className={styles.emailDisplay}>
              <Email sx={{ fontSize: 18, color: 'var(--primary)' }} />
              <Typography variant="body2" className={styles.emailDisplayText}>
                {email}
              </Typography>
              <Button
                size="small"
                onClick={handleBackToEmail}
                className={styles.changeEmailButton}
              >
                Modifier
              </Button>
            </Box>

            <Box className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                <Lock sx={{ fontSize: 18, mr: 0.5 }} />
                Mot de passe (envoyé par email)
              </label>
              <input
                id="password"
                type="text"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({});
                }}
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                placeholder="Collez le mot de passe reçu"
                disabled={isLoading}
                autoFocus
              />
              {errors.password && (
                <span className={styles.errorText}>{errors.password}</span>
              )}
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              className={styles.submitButton}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>

            <Box className={styles.infoBox}>
              <Typography variant="body2" className={styles.infoText}>
                📧 Vérifiez votre boîte de réception (et les spams)
              </Typography>
            </Box>
          </form>
        )}

        {/* Step 3: Success */}
        {step === 'success' && (
          <Box className={styles.successBox}>
            <CheckCircle sx={{ fontSize: 64, color: 'var(--primary)', mb: 2 }} />
            <Typography variant="h6" className={styles.successText}>
              Bienvenue !
            </Typography>
            <CircularProgress size={24} sx={{ mt: 2, color: 'var(--primary)' }} />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
