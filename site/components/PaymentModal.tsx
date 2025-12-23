'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Close,
  Phone,
  WhatsApp,
  Download,
  CheckCircle,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { useCart } from '@/contexts/CartContext';
import { useNotification } from '@/contexts/NotificationContext';
import styles from './PaymentModal.module.scss';
import { API_URL } from '@/settings/constant';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  locale: string;
}

export default function PaymentModal({ open, onClose, locale }: PaymentModalProps) {
  const { cart, clearCart } = useCart();
  const { addNotification } = useNotification();

  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});

  const PAYMENT_NUMBER = '+229 01 69 81 64 13';
  const WHATSAPP_NUMBER = '+2290169816413';

  const steps = ['Informations', 'Paiement', 'Confirmation'];

  const formatPrice = (price: number) => {
    return `${price?.toLocaleString('fr-FR')} FCFA`;
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    const re = /^[\d\s+()-]{8,}$/;
    return re.test(phone);
  };

  const handleValidateStep1 = () => {
    const newErrors: { email?: string; phone?: string } = {};

    if (!email) {
      newErrors.email = 'L\'email est requis';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email invalide';
    }

    if (!phone) {
      newErrors.phone = 'Le numéro de téléphone est requis';
    } else if (!validatePhone(phone)) {
      newErrors.phone = 'Numéro de téléphone invalide';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setActiveStep(1);
    }
  };

  const handleDownloadAndPayLater = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}orders/download-locked`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          phone,
          items: cart.items.map((item) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          totalPrice: cart.totalPrice,
          totalItems: cart.totalItems,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la création de la commande');
      }

      setOrderId(data.orderId);

      // Télécharger les PDFs verrouillés
      if (data.downloadLinks && data.downloadLinks.length > 0) {
        for (let i = 0; i < data.downloadLinks.length; i++) {
          console.log("data == ", data)
          const link = data.downloadLinks[i];

          try {
            // Fetch the file as blob
            const response = await fetch(link);
            if (!response.ok) {
              console.error(`Failed to download: ${link}`);
              continue;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            // Create download link
            const a = document.createElement('a');
            a.href = url;
            a.download = `formation-preview-${i + 1}.pdf`;
            document.body.appendChild(a);
            a.click();

            // Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            // Délai entre chaque téléchargement
            if (i < data.downloadLinks.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 1500));
            }
          } catch (downloadError) {
            console.error('Error downloading file:', downloadError);
          }
        }
      }

      addNotification({
        type: 'success',
        message: `${data.downloadLinks?.length || 0} preview(s) téléchargé(s) avec succès`,
      });

      setActiveStep(2);
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: error.message || 'Erreur lors du téléchargement',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          phone,
          items: cart.items.map((item) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          totalPrice: cart.totalPrice,
          totalItems: cart.totalItems,
          paymentMethod: 'mobile_money',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la création de la commande');
      }

      setOrderId(data.orderId);
      addNotification({
        type: 'success',
        message: 'Commande créée avec succès !',
      });

      setActiveStep(2);
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: error.message || 'Erreur lors de la création de la commande',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (activeStep === 2) {
      clearCart();
    }
    setActiveStep(0);
    setEmail('');
    setPhone('');
    setOrderId(null);
    setErrors({});
    onClose();
  };

  const handleWhatsAppContact = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Bonjour, je viens d'effectuer un paiement. Commande N°: ${orderId}`, '_blank');
  };

  const handlePhoneCall = () => {
    window.location.href = `tel:${PAYMENT_NUMBER}`;
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      className={styles.paymentModal}
    >
      <DialogTitle className={styles.dialogTitle}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <PaymentIcon sx={{ color: '#FA003F' }} />
            <Typography variant="h6" fontWeight={700}>
              Finaliser votre commande
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent className={styles.dialogContent}>
        <Stepper
          activeStep={activeStep}
          sx={{
            mb: 4,
            '& .MuiStepLabel-label': {
              color: '#fff',
            },
            '& .MuiStepLabel-label.Mui-active': {
              color: '#FA003F',
              fontWeight: 600,
            
            },
            '& .MuiStepLabel-label.Mui-completed': {
              color: '#fff',
            },
            '& .MuiStepIcon-root': {
              color: 'rgba(255,255,255,0.4)',
            },
            '& .MuiStepIcon-root.Mui-active': {
              color: '#FA003F',
            },
            '& .MuiStepIcon-root.Mui-completed': {
              color: '#fff',
            },
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>


        {/* Étape 1: Informations */}
        {activeStep === 0 && (
          <Box className={styles.step1}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Vos informations
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={3}>
              Ces informations seront utilisées pour créer votre compte et vous envoyer les formations
            </Typography>

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              placeholder="votre@email.com"
              sx={{
                mb: 2,
                '& .MuiInputBase-input': {
                  color: '#fff',
                },
                '& .MuiInputLabel-root': {
                  color: '#fff',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#fff',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#fff',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#fff',
                  },
                },
                '& .MuiFormHelperText-root': {
                  color: '#fff',
                },
              }}
            />


            <TextField
              fullWidth
              label="Numéro de téléphone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={!!errors.phone}
              helperText={errors.phone}
              placeholder="+229 XX XX XX XX"
              sx={{
                mb: 3,
                '& .MuiInputBase-input': {
                  color: '#fff',
                },
                '& .MuiInputLabel-root': {
                  color: '#fff',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#fff',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#fff',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#fff',
                  },
                },
                '& .MuiFormHelperText-root': {
                  color: '#fff',
                },
              }}
            />


            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom fontWeight={600}>
              Récapitulatif de la commande
            </Typography>

            <Box className={styles.orderSummary}>
              {cart.items.map((item) => (
                <Box key={item.id} className={styles.orderItem}>
                  <Typography variant="body2">{item.name}</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatPrice(item.price)}
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Box className={styles.orderTotal}>
                <Typography variant="h6" fontWeight={700}>
                  Total
                </Typography>
                <Typography variant="h6" fontWeight={700} color="#FA003F">
                  {formatPrice(cart.totalPrice)}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Étape 2: Paiement */}
        {activeStep === 1 && (
          <Box className={styles.step2}>
            <Alert severity="info" sx={{ mb: 3, background: '#7e4444ff' }}>
              <Typography variant="body2" fontWeight={600}>
                Deux options s'offrent à vous pour accéder aux formations
              </Typography>
            </Alert>

            {/* Option 1: Payer maintenant */}
            <Box className={styles.paymentOption}>
              <Box className={styles.optionHeader}>
                <PaymentIcon sx={{ color: '#FA003F', fontSize: 32 }} />
                <Typography variant="h6" fontWeight={700}>
                  Option 1: Payer maintenant
                </Typography>
              </Box>

              <Alert severity="warning" sx={{ my: 2, background: "none" }}>
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Instructions de paiement :
                </Typography>
                <Typography variant="body2">
                  1. Effectuez un dépôt Mobile Money au numéro :{' '}
                  <span
                    style={{
                      color: '#FA003F',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                    }}
                  >
                    {PAYMENT_NUMBER}
                  </span>
                </Typography>
                <Typography variant="body2" mt={1}>
                  2. Montant à payer :{' '}
                  <span style={{ color: '#FA003F', fontWeight: 700 }}>
                    {formatPrice(cart.totalPrice)}
                  </span>
                </Typography>
                <Typography variant="body2" mt={1}>
                  3. Après le paiement, contactez-nous pour recevoir vos formations
                </Typography>
              </Alert>

              <Box display="flex" gap={2} mt={2}>
                <Button
                  variant="outlined"
                  startIcon={<Phone />}
                  onClick={handlePhoneCall}
                  fullWidth
                  sx={{
                    borderColor: '#FA003F',
                    color: '#FA003F',
                    '&:hover': {
                      borderColor: '#C70032',
                      background: 'rgba(250, 0, 63, 0.05)',
                    },
                  }}
                >
                  Appeler
                </Button>
                <Button
                  variant="contained"
                  startIcon={<WhatsApp />}
                  onClick={handleWhatsAppContact}
                  fullWidth
                  sx={{
                    background: '#25D366',
                    '&:hover': {
                      background: '#1DA851',
                    },
                  }}
                >
                  WhatsApp
                </Button>
              </Box>

              <Button
                variant="contained"
                fullWidth
                onClick={handleConfirmPayment}
                disabled={loading}
                sx={{
                  mt: 2,
                  background: '#FA003F',
                  '&:hover': {
                    background: '#C70032',
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "J'ai effectué le paiement"
                )}
              </Button>
            </Box>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="textSecondary">
                OU
              </Typography>
            </Divider>

            {/* Option 2: Télécharger et payer après */}
            <Box className={styles.paymentOption}>
              <Box className={styles.optionHeader}>
                <Download sx={{ color: '#5E3AFC', fontSize: 32 }} />
                <Typography variant="h6" fontWeight={700}>
                  Option 2: Télécharger et payer après
                </Typography>
              </Box>

              <Alert severity="info" sx={{ my: 2, background: "none" }}>
                <Typography variant="body2">
                  Téléchargez les PDFs de prévisualisation (verrouillés). Après paiement,
                  contactez-nous pour recevoir les mots de passe et accéder aux formations complètes.
                </Typography>
              </Alert>

              <Button
                variant="outlined"
                startIcon={<Download />}
                fullWidth
                onClick={handleDownloadAndPayLater}
                disabled={loading}
                sx={{
                  borderColor: '#5E3AFC',
                  color: '#5E3AFC',
                  '&:hover': {
                    borderColor: '#4c2bfc',
                    background: 'rgba(94, 58, 252, 0.05)',
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  'Télécharger les previews'
                )}
              </Button>
            </Box>
          </Box>
        )}

        {/* Étape 3: Confirmation */}
        {activeStep === 2 && (
          <Box className={styles.step3} textAlign="center">
            <CheckCircle sx={{ fontSize: 80, color: '#10B981', mb: 2 }} />

            <Typography variant="h5" fontWeight={700} gutterBottom>
              Commande enregistrée !
            </Typography>

            <Typography variant="body1" color="textSecondary" mb={3}>
              Numéro de commande : <strong>ORD-{orderId?.slice(0, 8).toLocaleUpperCase()}</strong>
            </Typography>

            <Alert severity="success" sx={{ mb: 3, textAlign: 'left', background: 'none' }}>
              <Typography variant="body2" fontWeight={600} gutterBottom>
                Prochaines étapes :
              </Typography>
              <Typography variant="body2">
                1. Effectuez le paiement au numéro{' '}
                <span style={{ color: '#FA003F', fontWeight: 700 }}>
                  {PAYMENT_NUMBER}
                </span>
              </Typography>
              <Typography variant="body2" mt={1}>
                2. Contactez-nous via WhatsApp ou par téléphone
              </Typography>
              <Typography variant="body2" mt={1}>
                3. Recevez vos formations par email sous 24h
              </Typography>
            </Alert>

            <Box display="flex" gap={2} justifyContent="center">
              <Button
                variant="outlined"
                startIcon={<Phone />}
                onClick={handlePhoneCall}
                sx={{
                  borderColor: '#FA003F',
                  color: '#FA003F',
                  '&:hover': {
                    borderColor: '#C70032',
                    background: 'rgba(250, 0, 63, 0.05)',
                  },
                }}
              >
                Appeler maintenant
              </Button>
              <Button
                variant="contained"
                startIcon={<WhatsApp />}
                onClick={handleWhatsAppContact}
                sx={{
                  background: '#25D366',
                  '&:hover': {
                    background: '#1DA851',
                  },
                }}
              >
                Contacter sur WhatsApp
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>

      <Divider />

      <DialogActions className={styles.dialogActions}>
        {activeStep === 0 && (
          <>
            <Button onClick={handleClose} sx={{
              color: "white"
            }}>
              Annuler
            </Button>
            <Button
              variant="contained"
              onClick={handleValidateStep1}
              sx={{
                background: '#FA003F',
                '&:hover': {
                  background: '#C70032',
                },
              }}
            >
              Continuer
            </Button>
          </>
        )}

        {/* {activeStep === 1 && ( */}
          <Button
            onClick={() => setActiveStep(activeStep === 1 ? 0 : 1)}
            sx={{
              color: '#FA003F',
            }}
          >
            Retour
          </Button>
        {/* )} */}

        {activeStep === 2 && (
          <Button
            variant="contained"
            onClick={handleClose}
            sx={{
              background: '#FA003F',
              '&:hover': {
                background: '#C70032',
              },
            }}
          >
            Terminer
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
