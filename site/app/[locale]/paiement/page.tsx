'use client';

import { Box, Container, Typography, Button, Card, CardContent, Divider, Alert } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import styles from './paiement.module.scss';

import icon_monero from '@/assets/images/icon_monero.svg'
import Image from 'next/image';

export default function PaiementPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = useTranslations('Payment');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'Cameroun',
    city: '',
    address: '',
    paymentMethod: 'mobile_money',
    acceptTerms: false,
    promoCode: '',
    
  });
  const [showPromoInput, setShowPromoInput] = useState(false);

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Charger les données du checkout depuis localStorage
  useEffect(() => {
    const checkoutData = localStorage.getItem('checkoutData');
    if (checkoutData) {
      const data = JSON.parse(checkoutData);
      setCartItems([{
        id: data.product,
        title: data.title,
        price: data.price,
        quantity: 1,
        options: data.options
      }]);
    } else {
      // Données par défaut si pas de checkout data
      setCartItems([
        {
          id: 1,
          title: 'FORMATION COMPLÈTE PREMIERE PRO',
          price: 45000,
          quantity: 1
        }
      ]);
    }
  }, []);

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

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      // Ici vous pouvez intégrer votre logique de paiement
    }
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString('fr-FR')} CFA`;
  };

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
                />
                <Button 
                  variant="contained"
                  className={styles.applyPromoButton}
                >
                  {t('applyPromoCode')}
                </Button>
              </div>
            </Box>
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
                        <label htmlFor="phone">{t('phone')} {t('required')}</label>
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
                        <label htmlFor="country">{t('country')}</label>
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
                        <label htmlFor="city">{t('city')} {t('required')}</label>
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
                        <label htmlFor="address">{t('address')} {t('required')}</label>
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

                 

                  {/* <div className={styles.checkboxField}>
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
                  </div> */}
                  
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
                          <Box className={styles.imagePlaceholder}>
                            📦
                          </Box>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" sx={{ 
                            fontWeight: 600,
                            mb: 1,
                            fontSize: '0.9rem'
                          }}>
                            {item.title}
                          </Typography>
                          
                          {/* Afficher les options sélectionnées */}
                          {item.options && (
                            <Box sx={{ mb: 1 }}>
                              {Object.entries(item.options).map(([key, value]) => {
                                if (key === 'visual' && value !== 'without-visual') {
                                  return (
                                    <Typography key={key} variant="caption" sx={{ 
                                      display: 'block',
                                      color: 'var(--muted-foreground)',
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
                                      color: 'var(--muted-foreground)',
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
                            <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
                              {t('quantity')}: {item.quantity}
                            </Typography>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {formatPrice(item.price)}
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
                    <Typography variant="body1">{formatPrice(calculateTotal())}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{t('total')}:</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--primary)' }}>
                      {formatPrice(calculateTotal())}
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
    </Box>
  );
}
