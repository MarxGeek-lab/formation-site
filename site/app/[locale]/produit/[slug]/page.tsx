'use client';

import { Box, Container, Typography, Chip, Button, Card, CardContent, FormControlLabel, Radio, RadioGroup, Checkbox, FormGroup, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import styles from './product.module.scss';
import ProductCard from '@/components/ProductCard';

import icon from '@/assets/images/icon.webp'
import { useProductStore } from '@/contexts/ProductStore';
import { useCart } from '@/contexts/CartContext';
import { useTracking } from '@/utils/trackingPixel';
import LocalizedPrice from '@/components/LocalizedPrice2';
import ProductImage from '@/components/ProductImage';
import { Translate } from '@/components/Translate';
import { TranslateHTML } from '@/components/TranslateHTML';

export default function ProductPage({ params }: { params: { locale: string; slug: string } }) {
  const { product, getProductById, allProducts } = useProductStore();
  const { addToCart } = useCart();
  const { locale, slug } = params;
  const router = useRouter();
  const t = useTranslations('Product');
  const { trackProductView, trackAddToCart } = useTracking();
  const [openDemo, setOpenDemo] = useState(false);

  const [selectedOptions, setSelectedOptions] = useState<{[key: string]: any}>({
    visual: 'without-visual',
    support: []
  });

  const [loading, setLoading] = useState(true);

  const imgSrc = product?.photos[0]
    ? product.photos[0].startsWith("http://localhost:5000/")
      ? product.photos[0].replace("http://localhost:5000/", "https://api.rafly.me/")
      : product.photos[0]
    : null;

  // if (!imgSrc) return null;

  useEffect(() => {
    getProductById(slug);
  }, [slug]);

  // Tracker la vue du produit quand le produit est chargé
  useEffect(() => {
    if (product?._id) {
      trackProductView(product._id);
    }
  }, [product?._id, trackProductView]);


    // useEffect(() => {
    //   getLocalizedPrice(product.price).then(price => {
    // // console.log("price ===", price);
    //     return price
    //   });
      
    // }, []);

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" align="center">{t('productNotFound')}</Typography>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button onClick={() => router.push(`/${locale}/catalogue`)}>
            {t('backToCatalogue')}
          </Button>
        </Box>
      </Container>
    );
  }

  const relatedProducts = allProducts.filter((item: any) => item?.category === product?.category);

  const options = [
    {
      id: 'visual',
      type: 'radio',
      title: 'Option de Visuel de Publicité',
      choices: [
        { id: 'with-visual', label: 'Avec Visuel de Publicité', price: 2500, description: 'Commander un visuel de publicité pour votre produit' },
        { id: 'without-visual', label: 'Sans Visuel de Publicité', price: 0, description: 'Acheter le produit uniquement sans visuel de publicité', selected: true }
      ]
    },
    {
      id: 'support',
      type: 'checkbox',
      title: 'Options supplémentaires',
      choices: [
        { id: 'accompagnement', label: 'Accompagnement personnalisé 1 mois', price: 15000, description: 'Obtenez un accompagnement personnalisé d\'une durée de 1 mois avec nos experts !' }
      ]
    }
  ]

  const handleOptionChange = (optionId: string, value: any) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionId]: value
    }));
  };

  const calculateTotal = () => {
    let total = product?.price || 0;
    
    // Ajouter le prix de l'option visuel
    const visualOption = options?.[0]?.choices?.find((choice: any) => choice.id === selectedOptions.visual);
    if (visualOption) {
      total += visualOption.price;
    }
    
    // Ajouter les prix des options supplémentaires
    selectedOptions.support.forEach((supportId: any) => {
      const supportOption = options?.[1]?.choices?.find((choice: any) => choice.id === supportId);
      if (supportOption) {
        total += supportOption.price;
      }
    });

    return  total || 0;
  };
 
  return (
    <Box sx={{ 
      backgroundColor: 'var(--background)', 
      py: { xs: 4, md: 8 },
      px: { xs: 0, sm: 6 },
      }}>
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Image et description */}
          <Grid size={{ xs: 12, md: 7 }}>
            {/* Image produit */}
            <Box className={styles.productImage}
            sx={{position: 'relative'}}>
              {/* <ProductImage product={product} /> */}
              {loading && (
                <div
                  style={{
                    width: "100%",
                    height: "400px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: 'var(--primary-light)'
                  }}
                >
                  {loading && <CircularProgress />}
                </div>
              )}
              <img
                src={imgSrc}
                alt={product?.name}
                width={640}
                height={360}
                className={styles.image}
                 onLoad={() => setLoading(false)}
                onError={() => setLoading(false)}
                style={{ display: loading ? "none" : "block" }}
              />

              {product?.demoVideo && (
                <Button
                  variant="contained"
                  sx={{
                    position: "absolute",
                    right: 8,
                    bottom: 8,
                    px: 1,
                    py: 0.5,
                    borderRadius: "8px",
                    fontWeight: "600",
                    textTransform: "none",
                    fontSize: "15px",
                    backgroundColor: "rgba(255, 255, 255, 1)", // noir transparent
                    color: "#333",
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.8)",
                    backdropFilter: "blur(4px)", // effet verre dépoli subtil
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0px 6px 14px rgba(0,0,0,0.4)",
                      transform: "translateY(-2px)"
                    },
                  }}
                  onClick={() => setOpenDemo(true)}
                >
                 Voir démo
                </Button>
              )}
              
            </Box>

            {/* Description détaillée */}
            <Box className={styles.productDescription}>
              <Typography variant="h4" className={styles.sectionTitle}>
                {t('description')}
              </Typography>
              <Typography sx={{ mb: 3 }}>
                <TranslateHTML html={product?.description} lang={locale} />
              </Typography>

              {product?.advantage?.length > 0 && (
                <>  
                  <Typography variant="h4" className={styles.sectionTitle}>
                    {t('advantages')}
                  </Typography>
                  <Box component="ul" className={styles.benefitsList}>
                    {product?.advantage?.map((benefit: string, index: number) => (
                      <Box component="li" key={index} sx={{ mb: 1 }}>
                        <Translate text={benefit} lang={locale} />
                      </Box>
                    ))}
                  </Box>
                </>
              )}
            </Box>
          </Grid>

          {/* Sidebar commande */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box className={styles.orderSidebar}>
              <Card className={styles.orderCard}>
                <CardContent>
                  {/* En-tête produit */}
                  <Box className={styles.productHeader}>
                    <Box className={styles.productIcon}>
                      <Image src={icon} alt="Icon" width={60} height={60} />
                    </Box>
                    <Box>
                      <Typography variant="h3" className={styles.price}>
                        <LocalizedPrice amount={calculateTotal()} />
                      </Typography>
                    </Box>
                  </Box>

                  {/* Options */}
                  <Box className={styles.optionsSection}>
                    
                    {options?.map((option: any) => (
                      <Box key={option.id} className={styles.optionGroup}>
                        <Typography variant="h6" className={styles.optionTitle}>
                          {option.id === 'visual' ? t('visualAdvertisingOption') : t('additionalOptions')}
                        </Typography>
                        
                        {option.type === 'radio' && (
                          <RadioGroup
                            value={selectedOptions[option.id]}
                            onChange={(e) => handleOptionChange(option.id, e.target.value)}
                          >
                            {option.choices?.map((choice: any) => (
                              <Box key={choice.id} className={styles.optionChoice}>
                                <FormControlLabel
                                  value={choice.id}
                                  control={<Radio />}
                                  label={
                                    <Box>
                                      <Box className={styles.choiceHeader}>
                                        <Typography className={styles.choiceTitle}>
                                          {choice.id === 'with-visual' ? t('withVisual') : 
                                           choice.id === 'without-visual' ? t('withoutVisual') :
                                           choice.label}
                                        </Typography>
                                        {choice.price > 0 && (
                                          <Typography variant="body2" className={styles.choicePrice}>
                                            +<LocalizedPrice amount={choice?.price} />
                                          </Typography>
                                        )}
                                      </Box>
                                      <Typography variant="body2" className={styles.choiceDescription}>
                                        {choice.id === 'with-visual' ? t('withVisualDescription') : 
                                         choice.id === 'without-visual' ? t('withoutVisualDescription') :
                                         choice.description}
                                      </Typography>
                                    </Box>
                                  }
                                />
                              </Box>
                            ))}
                          </RadioGroup>
                        )}

                        {option.type === 'checkbox' && (
                          <FormGroup>
                            {option.choices?.map((choice: any) => (
                              <Box key={choice.id} className={styles.optionChoice}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={selectedOptions[option.id].includes(choice.id)}
                                      onChange={(e) => {
                                        const currentValues = selectedOptions[option.id];
                                        const newValues = e.target.checked
                                          ? [...currentValues, choice.id]
                                          : currentValues.filter((id: string) => id !== choice.id);
                                        handleOptionChange(option.id, newValues);
                                      }}
                                    />
                                  }
                                  label={
                                    <Box>
                                      <Box className={styles.choiceHeader}>
                                        <Typography className={styles.choiceTitle}>
                                          {choice.id === 'accompagnement' ? t('personalizedSupport') : choice.label}
                                        </Typography>
                                        <Typography variant="body2" className={styles.choicePrice}>
                                          ( +<LocalizedPrice amount={choice?.price} /> )
                                        </Typography>
                                      </Box>
                                      <Typography variant="body2" className={styles.choiceDescription}>
                                        {choice.id === 'accompagnement' ? t('personalizedSupportDescription') : choice.description}
                                      </Typography>
                                    </Box>
                                  }
                                />
                              </Box>
                            ))}
                          </FormGroup>
                        )}
                      </Box>
                    ))}
                  </Box>

                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    my: '1rem',
                  }}>
                    <Typography variant="h6" className={styles.optionTitle}>
                      Total
                    </Typography>
                    <Typography variant="h6" className={styles.optionTitle}>
                      <LocalizedPrice amount={calculateTotal()} />
                    </Typography>
                  </Box>

                  {/* Bouton d'achat */}
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    className={styles.buyButton}
                    onClick={() => {
                      // Tracker l'ajout au panier
                      trackAddToCart(product?._id);
                      
                      // Ajouter le produit au panier avec les options sélectionnées
                      const cartItem = {
                        id: product?._id,
                        name: product?.name,
                        price: calculateTotal() || 0,
                        image: product?.photos?.[0] || '',
                        category: product?.category || '',
                        options: selectedOptions,
                        totalPrice: calculateTotal(),
                        type: 'achat',
                        subscription: null,
                      };
                      
                      addToCart(cartItem);
                      
                      // Rediriger vers la page paiement
                      router.push(`/${locale}/paiement`);
                    }}
                  >
                    {t('buyNow')}
                  </Button>
                </CardContent>
                
              </Card>
              {/* Alternative abonnement */}
              {product?.isSubscriptionBased && (
                <Box className={styles.subscriptionAlternative}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  my: 3
                }}>
                  <Box sx={{height: '1px', width: '100%', backgroundColor: 'var(--primary-border)'}} />
                  <Typography variant="body2" align="center">
                    {t('or')}
                  </Typography>
                  <Box sx={{height: '1px', width: '100%', backgroundColor: 'var(--primary-border)'}} />
                </Box>
                
                <Typography variant="h6" align="center" sx={{ mb: 1 }}>
                  {t('subscribeToSubscription')}
                </Typography>
                <Typography variant="body2" align="center" sx={{ mb: 3 }}>
                  {t('subscriptionDescription')}
                </Typography>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => router.push(`/${locale}/#tarification`)}
                >
                  {t('takeSubscription')}
                </Button>
              </Box>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Section Produits Similaires */}
        <Box sx={{ mt: 8 }}>
          {/* <Container maxWidth="lg"> */}
            <Box sx={{ mb: 6, textAlign: 'center' }}>
              <Typography variant="h3" sx={{ 
                fontSize: '2rem',
                fontWeight: 700,
                color: 'var(--foreground)',
                mb: 2
              }}>
                {t('similarProducts')}
              </Typography>
              <Typography variant="body1" sx={{ 
                color: 'var(--muted-foreground)',
                fontSize: '1.1rem'
              }}>
                {t('discoverSimilarProducts')}
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {relatedProducts.map((relatedProduct) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={relatedProduct.id}>
                  <ProductCard
                    product={relatedProduct}
                    locale={locale}
                  />
                </Grid>
              ))}
            </Grid>
          {/* </Container> */}
        </Box>
      </Container>
      <Dialog
        open={openDemo}
        onClose={() => setOpenDemo(false)}
        maxWidth="md" // limite la largeur
        fullWidth
        PaperProps={{
          sx: {
            background: "var(--background)",
            borderRadius: "12px",
            overflow: "hidden", // supprime le scroll interne
          },
        }}
      >
        <DialogTitle>{t("videoDemo")}</DialogTitle>
        <DialogContent
          sx={{
            p: 0, // pas de padding autour
            overflow: "hidden", // empêche le scroll
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxHeight: "70vh", // limite la hauteur à l’écran
              display: "flex",
              justifyContent: "center",
            }}
          >
            <video
              controls
              style={{
                width: "100%",
                height: "100%",
                maxHeight: "70vh", // garde la vidéo responsive
                objectFit: "contain", // pas de déformation
                borderRadius: "8px",
              }}
            >
              <source src={product?.demoVideo} type="video/mp4" />
              {t("browserNotSupported")}
            </video>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color="error" size="small" variant="contained" onClick={() => setOpenDemo(false)}>{t("close")}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
