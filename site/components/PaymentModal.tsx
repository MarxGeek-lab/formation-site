'use client';

import React, { useState, useEffect } from 'react';

// Déclaration TypeScript pour FedaPay
declare global {
  interface Window {
    FedaPay: any;
  }
}
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
import fedapay from '@/assets/images/fedapay_logo.jpg';
import Image from 'next/image';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  locale: string;
  subscription?: any; // Pour les abonnements
}

export default function PaymentModal({ open, onClose, locale, subscription }: PaymentModalProps) {
  const { cart, clearCart } = useCart();
  const { addNotification } = useNotification();

  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any>(null);
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

  const handlePayWithFedaPay = () => {
    if (typeof window === 'undefined' || !window.FedaPay) {
      addNotification({
        type: 'error',
        message: 'FedaPay n\'est pas chargé. Veuillez rafraîchir la page.',
      });
      return;
    }

    setLoading(true);

    try {
      const isSubscription = !!subscription;

      // Helper pour obtenir le prix de l'abonnement (compatible avec ancien et nouveau format)
      const getSubscriptionPrice = () => {
        if (subscription.price && typeof subscription.price === 'number') {
          return subscription.price; // Nouveau format depuis API
        }
        if (subscription.xofPrice) {
          return parseInt(subscription.xofPrice.replace(/\s/g, '')); // Ancien format
        }
        return 0;
      };

      const amount = isSubscription
        ? getSubscriptionPrice()
        : cart.totalPrice;
      const description = isSubscription
        ? `Abonnement ${subscription.title || subscription.name} - MarxGeek Academy`
        : `Achat de ${cart.totalItems} formation(s) - MarxGeek Academy`;

      const checkout = window.FedaPay.init({
        public_key: 'pk_live_wcljr02MctKoLB1XRzS16wis',
        environment: 'live',
        locale: locale === 'fr' ? 'fr' : 'en',
        transaction: {
          // amount: 100,
          amount: amount,
          description: description,
        },
        customer: {
          email: email,
          phone_number: phone,
        },
        onComplete: async (reason: any, transaction: any) => {
          setLoading(false);
          console.log(transaction)
          console.log(reason)
          if (reason?.reason === "CHECKOUT COMPLETE") {
            // Paiement réussi
            try {
              const txn = reason?.transaction || {};
              const isSubscription = !!subscription;

              // Helper pour obtenir le prix de l'abonnement
              const getSubscriptionPrice = () => {
                if (subscription.price && typeof subscription.price === 'number') {
                  return subscription.price;
                }
                if (subscription.xofPrice) {
                  return parseInt(subscription.xofPrice.replace(/\s/g, ''));
                }
                return 0;
              };

              // Créer la commande dans la base de données
              const response = await fetch(`${API_URL}orders`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email,
                  phoneNumber: phone,
                  items: isSubscription
                    ? [{
                        id: subscription._id || 'subscription',
                        name: subscription.title || subscription.name,
                        price: getSubscriptionPrice(),
                        quantity: 1,
                        type: 'abonnement',
                        subscription: JSON.stringify({
                          title: subscription.title || subscription.name,
                          duration: subscription.duration || 30,
                          products: subscription.products || []
                        })
                      }]
                    : cart.items.map((item) => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        type: item.type || 'achat'
                      })),
                  totalAmount: isSubscription
                    ? getSubscriptionPrice()
                    : cart.totalPrice,
                  typeOrder: isSubscription ? 'abonnement' : 'achat',
                  paymentMethod: 'fedapay',
                  paymentStatus: 'paid',
                  fedapayTransaction: {
                    transactionId: txn.id,
                    reference: txn.reference,
                    status: txn.status,
                    mode: txn.mode,
                    operation: txn.operation,
                    amount: txn.amount,
                    amountDebited: txn.amount_debited,
                    amountTransferred: txn.amount_transferred,
                    fees: txn.fees,
                    commission: txn.commission,
                    fixedCommission: txn.fixed_commission,
                    approvedAt: txn.approved_at,
                    canceledAt: txn.canceled_at,
                    declinedAt: txn.declined_at,
                    refundedAt: txn.refunded_at,
                    transferredAt: txn.transferred_at,
                    toBeTransferredAt: txn.to_be_transferred_at,
                    transactionKey: txn.transaction_key,
                    lastErrorCode: txn.last_error_code,
                    receiptUrl: txn.receipt_url,
                    paymentUrl: txn.payment_url,
                    description: txn.description,
                    customerId: txn.customer_id,
                    paymentMethodId: txn.payment_method_id,
                    metadata: txn.metadata,
                    customMetadata: txn.custom_metadata
                  }
                }),
              });

              const data = await response.json();

              if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de la création de la commande');
              }

              console.log(data)

              setOrderId(data._id);
              setOrderData(data);
              addNotification({
                type: 'success',
                message: 'Paiement réussi ! Commande créée avec succès',
              });

              setActiveStep(2);
            } catch (error: any) {
              addNotification({
                type: 'error',
                message: error.message || 'Erreur lors de la création de la commande',
              });
            }
          } else if (reason === window.FedaPay.DIALOG_DISMISSED) {
            // L'utilisateur a fermé le dialogue
            setLoading(false);
            addNotification({
              type: 'info',
              message: 'Paiement annulé',
            });
          }
        },
      });

      // Ouvrir explicitement le popup FedaPay
      if (checkout && typeof checkout.open === 'function') {
        checkout.open();
      }
    } catch (error: any) {
      setLoading(false);
      console.error('Erreur FedaPay:', error);
      addNotification({
        type: 'error',
        message: error.message || 'Erreur lors de l\'initialisation du paiement',
      });
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
          paymentMethod: 'manual',
          paymentStatus: 'pending',
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
                  outline: 'none',
                  background: 'none'
                },
                '& .MuiInputLabel-root': {
                  color: '#fff',
                   outline: 'none',
                  background: 'none'
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#fff',
                   outline: 'none',
                  background: 'none'
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.5)',
                     outline: 'none',
                  background: 'none'
                  },
                  '&:hover fieldset': {
                    borderColor: '#fff',
                     outline: 'none',
                  background: 'none'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#fff',
                     outline: 'none',
                  background: 'none'
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
              {subscription ? 'Détails de l\'abonnement' : 'Récapitulatif de la commande'}
            </Typography>

            <Box className={styles.orderSummary}>
              {subscription ? (
                <>
                  <Box className={styles.orderItem}>
                    <Typography variant="body2" fontWeight={600}>{subscription.title || subscription.name}</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {subscription.price ? `${subscription.price.toLocaleString('fr-FR')} XOF` : subscription.xofPrice}
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 2, p: 2, background: 'rgba(37, 211, 102, 0.1)', borderRadius: '8px', border: '1px solid rgba(37, 211, 102, 0.3)' }}>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      <strong>Inclus dans cet abonnement:</strong>
                    </Typography>
                    {subscription.features.slice(0, 3).map((feature: string, index: number) => (
                      <Typography key={index} variant="body2" sx={{ fontSize: '0.85rem', mb: 0.5, color: 'rgba(255,255,255,0.8)' }}>
                        • {feature}
                      </Typography>
                    ))}
                  </Box>
                </>
              ) : (
                cart.items.map((item) => (
                  <Box key={item.id} className={styles.orderItem}>
                    <Typography variant="body2">{item.name}</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formatPrice(item.price)}
                    </Typography>
                  </Box>
                ))
              )}

              <Divider sx={{ my: 2 }} />

              <Box className={styles.orderTotal}>
                <Typography variant="h6" fontWeight={700}>
                  Total
                </Typography>
                <Typography variant="h6" fontWeight={700} color="#FA003F">
                  {subscription
                    ? (subscription.price ? `${subscription.price.toLocaleString('fr-FR')} XOF` : subscription.xofPrice)
                    : formatPrice(cart.totalPrice)}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Étape 2: Paiement */}
        {activeStep === 1 && (
          <Box className={styles.step2}>
            {/* Option 1: Payer maintenant */}
            <Box className={styles.paymentOption}>
              <Box className={styles.optionHeader}>
                <PaymentIcon sx={{ color: '#FA003F', fontSize: 32 }} />
                <Typography variant="h6" fontWeight={700}>
                  Payer maintenant
                </Typography>
              </Box>

              {/* <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2, p: 2, background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Image src={fedapay} alt="FedaPay" width={120} height={40} style={{ objectFit: 'contain' }} />
              </Box> */}

              <Alert severity="success" sx={{ my: 2, background: "rgba(16, 185, 129, 0.1)", border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Paiement sécurisé via FedaPay
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.875rem', mb: 1.5 }}>
                  Payez en toute sécurité avec Mobile Money ou Carte bancaire
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: "row", gap: 0.5, mt: 1.5, pt: 1.5, borderTop: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <Image src={fedapay} alt="FedaPay" width={100}  style={{ objectFit: 'contain' }} />
                  <Box sx={{ display: 'flex', flexDirection: "row", flexWrap: 'wrap', gap: 0.5, pt: 1.5, borderTop: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    {['MTN Bénin', 'MTN Côte d\'Ivoire', 'Moov Bénin', 'Moov Togo', 'Wave Côte d\'Ivoire', 'T-Money', 'Orange Mali', 'Free Sénégal', 'Airtel Niger', 'Celtiis Cash', 'Bestcash Money'].map((method) => (
                      <Box key={method} sx={{ 
                        px: 1, 
                        height: "30px", 
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: 'rgba(16, 185, 129, 0.15)', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.9)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                        {method}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Alert>

              <Button
                variant="contained"
                fullWidth
                startIcon={<PaymentIcon />}
                onClick={handlePayWithFedaPay}
                disabled={loading}
                sx={{
                  mt: 2,
                  background: 'linear-gradient(135deg, #FA003F 0%, #C70032 100%)',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  py: 1.5,
                  height: "52px",
                  '&:hover': {
                    background: 'linear-gradient(135deg, #C70032 0%, #8B0022 100%)',
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  subscription
                    ? `Payer ${subscription.price ? subscription.price.toLocaleString('fr-FR') + ' XOF' : subscription.xofPrice}`
                    : `Payer ${formatPrice(cart.totalPrice)}`
                )}
              </Button>

              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Ou Si vous avez un problème lié au paiement, contactez-moi par WhatsApp
                </Typography>
              </Divider>

              <Box display="flex" gap={2} mt={2}>
                <Button
                  variant="contained"
                  startIcon={<WhatsApp />}
                  onClick={handleWhatsAppContact}
                  fullWidth
                  sx={{
                    height: "52px",
                    background: '#25D366',
                    '&:hover': {
                      background: '#1DA851',
                    },
                  }}
                >
                  Contact
                </Button>
              </Box>
            </Box>

            {/* <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="textSecondary">
                OU
              </Typography>
            </Divider> */}

            {/* Option 2: Télécharger et payer après */}
            {/* <Box className={styles.paymentOption}>
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
            </Box> */}
          </Box>
        )}

        {/* Étape 3: Confirmation */}
        {activeStep === 2 && (
          <Box className={styles.step3} textAlign="center">
            <CheckCircle sx={{ fontSize: 80, color: '#10B981', mb: 2 }} />

            <Typography variant="h5" fontWeight={700} gutterBottom>
              {orderData?.paymentStatus === 'paid' ? 'Paiement confirmé !' : 'Commande enregistrée !'}
            </Typography>

            <Typography variant="body1" color="textSecondary" mb={3}>
              Numéro de commande : <strong>ORD-{orderId?.slice(0, 8).toLocaleUpperCase()}</strong>
            </Typography>

            {orderData?.paymentStatus === 'paid' && orderData?.typeOrder === 'abonnement' ? (
              <>
                <Alert severity="success" sx={{ mb: 3, textAlign: 'left', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <Typography variant="body2" fontWeight={600} gutterBottom>
                    🎉 Votre abonnement est confirmé !
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Votre paiement a été reçu avec succès. Un email de confirmation vous a été envoyé.
                  </Typography>
                  <Typography variant="body2" fontWeight={600} gutterBottom>
                    Prochaines étapes :
                  </Typography>
                  <Typography variant="body2">
                    1. Contactez-nous sur WhatsApp pour recevoir le pack complet
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    2. Vous recevrez toutes les instructions pour commencer votre formation
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    3. Notre équipe vous accompagnera tout au long de votre apprentissage
                  </Typography>
                </Alert>

                <Box display="flex" flexDirection="column" gap={2}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<WhatsApp />}
                    onClick={handleWhatsAppContact}
                    sx={{
                      background: '#25D366',
                      fontSize: '1rem',
                      fontWeight: 600,
                      py: 1.5,
                      '&:hover': {
                        background: '#1DA851',
                      },
                    }}
                  >
                    Contacter sur WhatsApp
                  </Button>
                </Box>
              </>
            ) : orderData?.paymentStatus === 'paid' && orderData?.productZip ? (
              <>
                <Alert severity="success" sx={{ mb: 3, textAlign: 'left', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <Typography variant="body2" fontWeight={600} gutterBottom>
                    🎉 Votre paiement a été confirmé !
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Vos fichiers sont prêts à être téléchargés. Un email contenant les liens vous a également été envoyé.
                  </Typography>
                  <Typography variant="body2" fontWeight={600} gutterBottom>
                    Prochaines étapes :
                  </Typography>
                  <Typography variant="body2">
                    1. Téléchargez vos formations ci-dessous
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    2. Contactez-nous sur WhatsApp pour toute assistance
                  </Typography>
                </Alert>

                <Box display="flex" flexDirection="column" gap={2}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Download />}
                    href={orderData.productZip}
                    download
                    target="_blank"
                    sx={{
                      background: '#10B981',
                      fontSize: '1rem',
                      fontWeight: 600,
                      py: 1.5,
                      '&:hover': {
                        background: '#059669',
                      },
                    }}
                  >
                    Télécharger mes formations
                  </Button>

                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<WhatsApp />}
                    onClick={handleWhatsAppContact}
                    sx={{
                      background: '#25D366',
                      fontSize: '1rem',
                      fontWeight: 600,
                      py: 1.5,
                      '&:hover': {
                        background: '#1DA851',
                      },
                    }}
                  >
                    Contacter sur WhatsApp
                  </Button>
                </Box>
              </>
            ) : (
              <>
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

            <Box display="flex" gap={2} justifyContent="center" mt={2}>
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
            </>
            )}
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
