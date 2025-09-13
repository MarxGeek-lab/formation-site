'use client';

import { Box, Container, Typography, Button, Card, CardContent, Divider, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useCart } from '@/contexts/CartContext';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

import styles from './paiement.module.scss';

import icon_monero from '@/assets/images/icon_monero.svg'
import Image from 'next/image';
import { hideLoader, showLoader } from '@/components/Loader/loaderService';
import { useAuthStore, useOrderStore, usePaymentStore, useProductStore, usePromoCodeStore } from '@/contexts/GlobalContext';
import { useRouter } from 'next/navigation';
import { tree } from 'next/dist/build/templates/app-page';
import { useTracking } from '@/utils/trackingPixel';
import LocalizedPrice from '@/components/LocalizedPrice2';

export default function PaiementPage({ params }: { params: { locale: string } }) {
  const { user } = useAuthStore();
  const { allProducts } = useProductStore();
  const { applyPromoCode, markPromoAsUsed } = usePromoCodeStore();
  const { createOrder } = useOrderStore();
  const { SubmitPayment, getStatusPayment } = usePaymentStore();
  const { locale } = params;
  const router = useRouter();
  const t = useTranslations('Payment');
  const { cart, clearCart } = useCart();
  const { trackPurchase } = useTracking();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'Cameroun',
    city: '',
    address: '',
    district: '',
    postalCode: '',
    paymentMethod: 'mobile_money',
    acceptTerms: false,
    promoCode: '',
    
  });
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoMessage, setPromoMessage] = useState('');
  const [message, setMessage] = useState('');
  const [titleMessage, setTitleMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  console.log(allProducts)
  // Charger les données du panier depuis le contexte
  useEffect(() => {
    if (cart.items && cart.items.length > 0) {
      // Utiliser les données du panier du contexte
      const formattedItems = cart.items.map((item: any) => {
        return {
          id: item.id,
          title: item.name,
          price: item?.totalPrice || item.price,
          quantity: item.quantity || 1,
          image: item.image,
          category: item.category,
          options: item.options,
          type: item.type,
          subscription: item.subscription
        }
      });
      setCartItems(formattedItems);
    } else {
      // Fallback: charger depuis localStorage si le panier est vide
      const checkoutData = localStorage.getItem('checkoutData');
      if (checkoutData) {
        const data = JSON.parse(checkoutData);
        setCartItems([{
          id: data.product,
          title: data.title,
          price: data?.totalPrice || data.price,
          quantity: 1,
          options: data?.options,
          type: data?.type,
          subscription: data?.subscriptionId
        }]);
      } else {
        // Données par défaut si pas de checkout data
        setCartItems([]);
      }
    }
  }, [cart.items]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = t('errors.firstNameRequired');
    if (!formData.lastName.trim()) newErrors.lastName = t('errors.lastNameRequired');
    if (!formData.email.trim()) newErrors.email = t('errors.emailRequired');
    if (!formData.phone.trim()) newErrors.phone = t('errors.phoneRequired');
    if (!formData.city.trim()) newErrors.city = t('errors.cityRequired');
    if (!formData.address.trim()) newErrors.address = t('errors.addressRequired');
    if (!formData.acceptTerms) newErrors.acceptTerms = t('errors.acceptTermsRequired');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const orderData = {
        items: cart.items,
        fullName: formData.firstName + ' ' + formData.lastName,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
        phone: formData.phone,
        district: formData.district,
        email: formData.email,
        paymentMethod: formData.paymentMethod,
        totalAmount: calculateTotal(),
        customer: user?._id,
        sessionId: cart?.sessionId,
      }
  
      showLoader()
  
      try {
        const { data, status } = await createOrder(orderData)

        if (status === 201) {
          hideLoader()
          await payment(data._id, 'orderId')
        } else {
          hideLoader()
          setShowErrorModal(true)
          setTitleMessage('Erreur')
          setMessage('Une erreur est survenue lors du traitement de votre commande. Veuillez réessayer.');
        }
      } catch (error) {
        console.log(error)
      } finally {
        hideLoader();
      }
    }
  };

  const subTotal = () => {
    const subtotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    return subtotal;
  }; 

  const calculateTotal = () => {
    const subtotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    return subtotal - promoDiscount;
  };  

  const payment = async (orderId: string, method: string) => {
    showLoader()
    try {
      const { data: paymentData, status: paymentStatus } = await SubmitPayment({
        orderId: orderId,
        userId: user?._id,
        amount: calculateTotal(),
        method: method,
      });
      console.log(paymentData, paymentStatus)

      if (paymentData.success) {
        window.location.href = paymentData.url;
      } else {
        setShowErrorModal(true)
        setTitleMessage('Paiement echoué')
        setMessage('Votre commande a été créée avec succès, mais le paiement a echoué. Veuillez réessayer ou vous rendre sur votre espace personnel pour finaliser le paiement.');
      }
      hideLoader()
    } catch (error) {
      console.log(error)
      hideLoader()
    }
  }

  const retryPayment = async () => {
    const url = window.location.href;
    const urlParams = new URLSearchParams(url);
    const orderId = urlParams.get('orderId');
    const paymentId = urlParams.get('paymentId');

    if (paymentId) {
      await payment(paymentId, 'paymentId');
    }
  }

  const getStatusPaiement = async () => {
    const url = window.location.href;
    const urlParams = new URLSearchParams(url);
    const paymentId = urlParams.get('paymentId');
    const paymentStatus = urlParams.get('paymentStatus');
    
    if (paymentId) {
      try {
        const { data, status } = await getStatusPayment({paymentId, paymentStatus})
        console.log(data, status)

        if (data.status === 'success') {
          // Tracker l'achat réussi
          if (data.orderId) {
            trackPurchase(data.orderId, calculateTotal());
          }
          
          setShowSuccessModal(true)
          setTitleMessage('Paiement effectué')
          setMessage('Votre commande a été traitée avec succès et le paiement a été effectué avec succès');
          
          if (formData.promoCode) {
            await markPromoAsUseds()
          }
        } else {
          setShowErrorModal(true)
          setTitleMessage('Paiement echoué')
          setMessage('Votre commande a été créée avec succès, mais le paiement a echoué. Veuillez vous rendre sur votre espace personnel pour finaliser le paiement.');
        }
      } catch (error) {
        console.log(error)
      }
    } 
  }

  const markPromoAsUseds = async () => {
    try {
      const { data, status } = await markPromoAsUsed({
        code: formData.promoCode,
      })
    } catch (error) {
      console.log(error)
    }
  }

  const applyPromoCodes = async () => {
    if (!formData.promoCode.trim()) {
      setPromoMessage('Veuillez entrer un code promo');
      return;
    }

    try {
      const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      const { data, status } = await applyPromoCode({
        code: formData.promoCode,
        purchaseAmount: subtotal,
      })
      const data2: any = data;
      if (status === 200 && data2) {
        // Appliquer la réduction
        setPromoDiscount(data2?.discount || 0);
        setPromoApplied(true);
        setPromoMessage(`Code promo appliqué ! Réduction de ${data2?.discount.toLocaleString('fr-FR')} FCFA`);
        
        // Optionnel: masquer le champ de saisie après application
        setShowPromoInput(false);
      } else {
        setPromoMessage('Code promo invalide ou expiré');
        setPromoApplied(false);
        setPromoDiscount(0);
      }
    } catch (error) {
      console.log(error)
      setPromoMessage('Erreur lors de l\'application du code promo');
      setPromoApplied(false);
      setPromoDiscount(0);
    }
  }

  useEffect(() => {
    console.log("vérification de status")
    getStatusPaiement()
  }, [])

  console.log(cartItems)

  return (
    <Box sx={{ 
      backgroundColor: 'var(--background)', 
      minHeight: '100vh',
      py: { xs: 0, md: 6 },
      px: { xs: 0, md: 6 },
      pb: { xs: 6, md: 6 },
    }}>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ 
          textAlign: 'left',
          mb: 6,
          fontSize: { xs: '1.8rem', md: '2.5rem' },
          fontWeight: 700,
          color: 'var(--foreground)'
        }} className={'rafly-title'}>
          {t('finalizeOrder')}
        </Typography>

        {/* Section Code Promo */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 4,
          background: 'var(--background)',
          border: '1px solid var(--primary-light)',
          borderRadius: '8px',
          padding: '0.7rem',
        }}>
          <Typography variant="body1" sx={{ 
            color: 'var(--foreground)', 
          
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1
            }}>
            Consulter votre panier
          </Typography>
          <Button variant="contained" onClick={() => router.push(`/${locale}/panier`)}>Panier</Button>
        </Box>
        <Card className={styles.promoSection} sx={{ mb: 4 }}>
          <CardContent sx={{ p: 0 }}>
            {/* Message d'information */}
            <div className={styles.promoMessage} onClick={() => setShowPromoInput(!showPromoInput)}>
              <div className={styles.promoIcon}>🎫</div>
              <Typography variant="body1" sx={{ 
                color: 'var(--foreground)', 
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 1
                }}>
                {t('promoCodeQuestion')} 
                <Typography variant="body1" sx={{ color: 'var(--foreground)', cursor: 'pointer', textDecoration: 'underline' }}>
                  {t('clickToEnterCode')}
                </Typography>
              </Typography>
            </div>
            
            {/* Zone de saisie du code promo */}
            <Box className={styles.promoInputSection}
            sx={{
              display: showPromoInput ? 'block' : 'none',
            }}>
              <div className={styles.promoInputContainer}>
                <input 
                  type="text" 
                  placeholder={t('enterPromoCode')}
                  className={styles.promoInput}
                  value={formData.promoCode}
                  onChange={(e) => setFormData({ ...formData, promoCode: e.target.value })}
                />
                <Button 
                  variant="contained"
                  className={styles.applyPromoButton}
                  onClick={applyPromoCodes}
                >
                  {t('applyPromoCode')}
                </Button>
              </div>
            </Box>

            {/* Message du code promo */}
            {promoMessage && (
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: promoApplied ? 'var(--success)' : 'var(--destructive)',
                    textAlign: 'center',
                    padding: '0.5rem',
                    backgroundColor: promoApplied ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    borderRadius: '4px',
                    border: `1px solid ${promoApplied ? 'var(--success)' : 'var(--destructive)'}`,
                  }}
                >
                  {promoMessage}
                </Typography>
                {promoApplied && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                    <Button 
                      variant="text" 
                      size="small"
                      onClick={() => {
                        setPromoDiscount(0);
                        setPromoApplied(false);
                        setPromoMessage('');
                        setFormData({ ...formData, promoCode: '' });
                        setShowPromoInput(true);
                      }}
                      sx={{ color: 'var(--muted-foreground)' }}
                    >
                      Supprimer le code promo
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {/* Formulaire de facturation */}
          <Grid size={{ xs: 12, sm: 12, md: 8 }}>
            <Card className={styles.billingCard}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h5" sx={{ 
                  mb: 3,
                  fontWeight: 600,
                  color: 'var(--foreground)'
                }}>
                  {t('billingDetails')}
                </Typography>

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <div className={styles.formField}>
                        <label htmlFor="firstName">{t('firstName')} {t('required')}</label>
                        <input
                          id="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('firstName', e.target.value)}
                          className={errors.firstName ? styles.error : ''}
                        />
                        {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
                      </div>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <div className={styles.formField}>
                        <label htmlFor="lastName">{t('lastName')} {t('required')}</label>
                        <input
                          id="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('lastName', e.target.value)}
                          className={errors.lastName ? styles.error : ''}
                        />
                        {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
                      </div>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <div className={styles.formField}>
                        <label htmlFor="email">{t('email')} {t('required')}</label>
                        <input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                          className={errors.email ? styles.error : ''}
                        />
                        {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                      </div>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <div className={styles.formField}>
                        <label htmlFor="phone">{t('phone')}</label>
                        <input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('phone', e.target.value)}
                          className={errors.phone ? styles.error : ''}
                        />
                        {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                      </div>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <div className={styles.formField}>
                        <label htmlFor="country">{t('country')} {t('required')}</label>
                        <input
                          id="country"
                          type="text"
                          value={formData.country}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('country', e.target.value)}
                        />
                      </div>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <div className={styles.formField}>
                        <label htmlFor="city">{t('city')} </label>
                        <input
                          id="city"
                          type="text"
                          value={formData.city}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('city', e.target.value)}
                          className={errors.city ? styles.error : ''}
                        />
                        {errors.city && <span className={styles.errorText}>{errors.city}</span>}
                      </div>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <div className={styles.formField}>
                        <label htmlFor="address">{t('address')} </label>
                        <input
                          id="address"
                          type="text"
                          value={formData.address}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('address', e.target.value)}
                          className={errors.address ? styles.error : ''}
                        />
                        {errors.address && <span className={styles.errorText}>{errors.address}</span>}
                      </div>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <div className={styles.formField}>
                        <label htmlFor="address">{t('additionalInfo')} <span>{t('optional')}</span> </label>
                        <textarea
                          id="address"
                          value={formData.address}
                          rows={5}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('address', e.target.value)}
                          className={errors.address ? styles.error : ''}
                        />
                        {errors.address && <span className={styles.errorText}>{errors.address}</span>}
                      </div>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 4 }} />

                 

                  <div className={styles.checkboxField}>
                    <label className={styles.checkbolgabel}>
                      <input
                        type="checkbox"
                        checked={formData.acceptTerms}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('acceptTerms', e.target.checked)}
                        className={styles.checkbox}
                      />
                      <span className={styles.checkboxText}>
                        J'ai lu et j'accepte les{' '}
                        <a href="/conditions" className={styles.link}>
                          conditions générales
                        </a>
                      </span>
                    </label>
                  </div>
                  
                  {errors.acceptTerms && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {errors.acceptTerms}
                    </Alert>
                  )}
                </form>
              </CardContent>
            </Card>
          </Grid>

          {/* Résumé de commande */}
          <Grid size={{ xs: 12, sm: 12, md: 4 }}>
            <Card className={styles.orderSummary}>
              <CardContent sx={{ p: 0 }}>
                <Typography variant="h5" sx={{ 
                  mb: 3,
                  fontWeight: 600,
                  color: 'var(--foreground)'
                }}>
                  {t('yourOrder')}
                </Typography>

                <Box className={styles.cartItems}>
                  {cartItems.map((item) => (
                    <Box key={item.id} className={styles.cartItem}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box className={styles.itemImage}>
                          {item.image ? (
                            <img 
                              src={item.image?.replace('http://localhost:5000/', 'https://api.rafly.me/')} 
                              alt={item.title}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '8px'
                              }}
                            />
                          ) : (
                            <Box className={styles.imagePlaceholder}>
                              📦
                            </Box>
                          )}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" sx={{ 
                            fontWeight: 600,
                            mb: 0,
                            fontSize: '0.85rem'
                          }}>
                            {item.title}
                          </Typography>
                          
                          {/* Afficher la catégorie si disponible */}
                          {item.category && (
                            <Typography variant="caption" sx={{ 
                              display: 'block',
                              color: 'white',
                              fontSize: '0.75rem',
                              mb: 0
                            }}>
                              {item.category}
                            </Typography>
                          )}

                          {item.subscription && (
                            <Box>
                            <Typography sx={{ 
                              display: 'block',
                              color: 'var(--primary)',
                              fontSize: '0.95rem',
                              mb: 0
                            }}>
                              {item.subscription.title}
                            </Typography>
                            </Box>
                          )}
                          
                          {/* Afficher les options sélectionnées */}
                          {item.options && (
                            <Box sx={{ mb: 1 }}>
                              {Object.entries(item.options).map(([key, value]) => {
                                if (key === 'visual' && value !== 'without-visual') {
                                  return (
                                    <Typography key={key} variant="caption" sx={{ 
                                      display: 'block',
                                      color: 'white',
                                      fontSize: '0.75rem'
                                    }}>
                                      • {t('visualIncluded')}
                                    </Typography>
                                  );
                                }
                                if (key === 'support' && Array.isArray(value) && value.length > 0) {
                                  return value.map((support: string) => (
                                    <Typography key={support} variant="caption" sx={{ 
                                      display: 'block',
                                      color: 'white',
                                      fontSize: '0.75rem'
                                    }}>
                                      • {support === 'accompagnement' ? t('personalizedSupport1Month') : support}
                                    </Typography>
                                  ));
                                }
                                return null;
                              })}
                            </Box>
                          )}
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {/* <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
                              {t('quantity')}: {item.quantity}
                            </Typography> */}
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              <LocalizedPrice amount={item.price} />
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box className={styles.orderTotal}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">{t('subtotal')}:</Typography>
                    <Typography variant="body1">
                      <LocalizedPrice amount={subTotal()} />
                      </Typography>
                  </Box>
                  
                  {promoApplied && promoDiscount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body1" sx={{ color: 'var(--success)' }}>
                        Réduction ({formData.promoCode}):
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'var(--success)' }}>
                        -<LocalizedPrice amount={promoDiscount} />
                      </Typography>
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{t('total')}:</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--primary)' }}>
                      <LocalizedPrice amount={calculateTotal()} />
                    </Typography>
                  </Box>
                </Box>

                {/* Section Paiement */}
                <div className={styles.paymentSection}>
                  <div className={styles.paymentHeader}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>{t('paymentMethods')}</Typography>
                    <Image src={icon_monero} alt="Icone Monero" width={150} height={150} />
                  </div>
                  
                  <div className={styles.paymentMessage}>
                    <Typography variant="body1" sx={{ color: 'black' }}>{t('paymentMessage')}</Typography>
                  </div>
                  
                  <div className={styles.privacyNote}>
                    <p>{t('privacyNote')} <a href={`/${locale}/politique-confidentialite`}>{t('privacyPolicy')}</a>.</p>
                  </div>
                  
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleSubmit}
                    className={styles.commanderButton}
                  >
                    {t('orderButton')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

       <Dialog
          open={showSuccessModal}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx:{
              backgroundColor: 'var(--background)',
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              animation: 'fadeInScale 0.3s ease-out',
              '@keyframes fadeInScale': {
                '0%': { opacity: 0, transform: 'scale(0.9)' },
                '100%': { opacity: 1, transform: 'scale(1)' },
              },
            }
          }}
          >
          {/* Titre */}
          <DialogTitle sx={{ textAlign: 'center', pt: 5 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'success.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 56, color: 'success.main' }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
              {titleMessage}
            </Typography>
          </DialogTitle>

          {/* Contenu */}
          <DialogContent sx={{ textAlign: 'center', pb: 4, px: 4 }}>
            <Typography variant="body1" sx={{ mb: 2, fontSize: 16, color: '#374151' }}>
              {message}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              Vous recevrez un email de confirmation avec les détails de votre commande.
              Vous pouvez télécharger les produits et le contrat directement dans le mail ou dans votre espace client.
            </Typography>
          </DialogContent>

          {/* Actions */}
          <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 4 }}>
            <Button
              onClick={ () => {
                clearCart(); 
                setShowSuccessModal(false); 
                router.push('/')}}
              variant="outlined"
              size="large"
              startIcon={<ArrowBackIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
                fontWeight: 600,
              }}
            >
              Retour à l'accueil
            </Button>
            <Button
              onClick={ () => {
                clearCart(); 
                setShowSuccessModal(false); 
                router.push(`/${locale}/orders`)
              }}
              variant="contained"
              size="large"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
                fontWeight: 700,
                bgcolor: 'success.main',
                '&:hover': { bgcolor: 'success.dark' },
              }}
            >
              Voir ma commande
            </Button>
          </DialogActions>
        </Dialog>


        {/* Modal d'erreur */}
        <Dialog
          open={showErrorModal}
          onClose={() => {}}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx:{
              backgroundColor: 'var(--background)',
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              animation: 'fadeInScale 0.3s ease-out',
              '@keyframes fadeInScale': {
                '0%': { opacity: 0, transform: 'scale(0.9)' },
                '100%': { opacity: 1, transform: 'scale(1)' },
              },
            }
          }}
        >
          {/* Titre */}
          <DialogTitle sx={{ textAlign: 'center', pt: 5 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <ErrorIcon sx={{ fontSize: 48, color: 'error.main' }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'error.main' }}>
              {titleMessage}
            </Typography>
          </DialogTitle>

          {/* Contenu */}
          <DialogContent sx={{ textAlign: 'center', pb: 4, px: 4 }}>
            <Typography variant="body1" sx={{ mb: 2, fontSize: 16, color: '#374151' }}>
              {message}
            </Typography>

            <Alert
              severity="info"
              sx={{
                mt: 2,
                borderRadius: 2,
                color: '#0c4a6e',
                border: '1px solid var(--primary-border)',
                backgroundColor: 'var(--primary-subtle)',
              }}
            >
              <Typography variant="body2">
                Si le problème persiste, veuillez contacter notre service client.
              </Typography>
            </Alert>
          </DialogContent>

          {/* Actions */}
          <DialogActions sx={{ justifyContent: 'center', pb: 4 }}>
            <Button
              onClick={() => {
                setShowErrorModal(false)
                retryPayment()
              }}
              variant="contained"
              size="large"
              sx={{
                borderRadius: 2,
                px: 4,
                textTransform: 'none',
                fontWeight: 600,
                bgcolor: 'error.main',
                '&:hover': { bgcolor: 'error.dark' },
              }}
            >
              Réessayer
            </Button>
            <Button
              onClick={() => {
                setShowErrorModal(false)
                // router.push(`/${locale}/dashboard`)
              }}
              variant='outlined'
              size="large"
              color='error'
            >
              Retour
            </Button>
          </DialogActions>
        </Dialog>
    </Box>
  );
}
