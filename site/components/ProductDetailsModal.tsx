'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Grid2,
} from '@mui/material';
import {
  Close,
  Check,
  Star,
  PlayCircle,
  Download,
  Lightbulb,
  Timer,
  Language,
  AddShoppingCart,
  ShoppingBag,
  WhatsApp,
  VideoCall,
  Update,
} from '@mui/icons-material';
import styles from './ProductDetailsModal.module.scss';
import { useCart } from '@/contexts/CartContext';
import { useNotification } from '@/contexts/NotificationContext';
import { formatPrice } from '@/utils/formatPrice';
import { Translate } from './Translate';
import ProductImage from './ProductImage';
import { API_URL3 } from '@/settings/constant';

interface ProductDetailsModalProps {
  open: boolean;
  onClose: () => void;
  product: any;
  locale: string;
  price: string;
}

export default function ProductDetailsModal({
  open,
  onClose,
  product,
  locale,
  price,
}: ProductDetailsModalProps) {
  const { addToCart, cart } = useCart();
  const { addNotification } = useNotification();
  const [openDemo, setOpenDemo] = useState(false);

  const handleAddToCart = async () => {
    try {
      const finalPrice = product?.pricePromo && product?.pricePromo !== 0 ? product.pricePromo : product.price;

      await addToCart({
        id: product._id,
        name: product.name,
        price: finalPrice,
        image: product?.photos?.[0] || '',
        category: product.category,
        type: 'achat'
      });

      addNotification({
        type: 'success',
        message: 'Produit ajouté au panier',
        productName: product.name,
        productImage: product?.photos?.[0] || '',
        duration: 4000
      });

      onClose();
    } catch (error) {
      console.error('Erreur ajout au panier:', error);
      addNotification({
        type: 'error',
        message: 'Erreur lors de l\'ajout au panier',
        productName: product.name,
        duration: 4000
      });
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    // Redirection vers le panier ou checkout peut être ajoutée ici
  };

  // Avantages par défaut pour les formations
const defaultBenefits = [
  {
    icon: <Download />,
    title: 'Accès illimité',
    description: 'Consultez le contenu quand vous voulez',
  },
  {
    icon: <WhatsApp />,
    title: 'Support WhatsApp 24/7',
    description: 'Assistance personnalisée par WhatsApp',
  },
  {
    icon: <VideoCall />,
    title: 'Suivi Vidéo',
    description: 'Sessions de suivi par Google Meet',
  },
  {
    icon: <Update />,
    title: 'Mises à jour gratuites',
    description: 'Accès à vie aux nouvelles versions',
  },
];


  // Fonctionnalités/Options par défaut
  const defaultFeatures = [
    'Vidéos HD de haute qualité',
    'Code source complet inclus',
    'Exercices pratiques',
    'Ressources téléchargeables',
    'Accès mobile et desktop',
    'Support par email',
  ];

  const [loading, setLoading] = useState(true);
  
    const imgSrc = product?.photos[0]
      ? API_URL3+ product.photos[0]
      : null;
  
    if (!imgSrc) return null;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            background: 'var(--background)',
            borderRadius: '24px',
            overflow: 'hidden',
            maxHeight: '90vh',
          },
        }}
      >
        <IconButton
          onClick={onClose}
          className={styles.closeButton}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            zIndex: 10,
            background: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            '&:hover': {
              background: 'rgba(250, 0, 63, 0.9)',
            },
          }}
        >
          <Close />
        </IconButton>

        <DialogContent className={styles.modalContent} sx={{ p: 0 }}>
          <Box className={styles.modalGrid}>
            <Grid2 container spacing={2}>
              {/* Section gauche - Image et vidéo */}
              <Grid2 size={{xs: 12, sm: 6}}>
              <Box className={`${styles.leftSection}`} sx={{ position: 'sticky', top: 20 }}>
                <Box className={styles.imageWrapper}>
                  {product?.photos?.length > 0 ? (
                    <img
                      src={imgSrc}
                      alt={product?.name}
                      className={styles.productImage}
                      // onLoad={() => setLoading(false)}
                      // onError={() => setLoading(false)}
                      style={{ 
                        // display: loading ? "none" : "block",
                        width: "100%",
                        height: "100%"
                      }}
                    />
                  ) : (
                    <Box className={styles.imagePlaceholder}>
                      <ShoppingBag sx={{ fontSize: 80, opacity: 0.3 }} />
                    </Box>
                  )}
                </Box>

                <Box className={styles.descriptionSection}>
                  <Typography
                    variant="body1"
                    sx={{ color: 'var(--foreground)', lineHeight: 1.8 }}
                  >
                    Formation complète pour maîtriser les technologies web et mobile modernes. Apprenez les meilleures pratiques et créez des projets concrets.
                  </Typography>
                </Box>
              </Box>
              </Grid2>

              {/* Section droite - Détails */}
              <Grid2 size={{xs: 12, sm: 6}}>
              <Box className={styles.rightSection}>
                <Box className={styles.header}>
                  <Typography variant="h4" className={styles.productTitle}>
                    <Translate text={product?.name} lang={locale} />
                  </Typography>

                  <Box className={styles.ratingSection}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} sx={{ color: '#FFB800', fontSize: 20 }} />
                      ))}
                    </Box>
                    <Typography variant="body2" sx={{ color: '#9ca3af', ml: 1 }}>
                      4.9 (1,234 avis)
                    </Typography>
                  </Box>
                </Box>

                {/* Prix */}
                <Box className={styles.priceBox}>
                  {product?.pricePromo && product?.pricePromo !== 0 ? (
                    <>
                      <Typography className={styles.currentPrice}>
                        {product?.pricePromo} FCFA
                      </Typography>
                      <Typography className={styles.oldPrice}>
                        {formatPrice(product?.price, 'USD', locale)}
                      </Typography>
                      <Chip
                        label={`-${Math.round(((product.price - product.pricePromo) / product.price) * 100)}%`}
                        size="small"
                        sx={{
                          background: '#10b981',
                          color: 'white',
                          fontWeight: 700,
                          ml: 1,
                        }}
                      />
                    </>
                  ) : (
                    <Typography className={styles.currentPrice}>
                      {price || `F CFA ${product?.price}`}
                    </Typography>
                  )}
                </Box>

                <Box className={styles.actionButtons}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<ShoppingBag />}
                    onClick={handleBuyNow}
                    disabled={cart.isLoading}
                    className={styles.buyButton}
                    sx={{
                      background: 'linear-gradient(135deg, #FA003F 0%, #C70032 100%)',
                      color: 'white',
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 800,
                      borderRadius: '14px',
                      textTransform: 'none',
                      whiteSpace: "nowrap",
                      boxShadow: '0 8px 24px rgba(250, 0, 63, 0.35)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #C70032 0%, #FA003F 100%)',
                        boxShadow: '0 12px 32px rgba(250, 0, 63, 0.5)',
                      },
                    }}
                  >
                    {cart.isLoading ? 'Chargement...' : 'Acheter maintenant'}
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<AddShoppingCart />}
                    onClick={handleAddToCart}
                    disabled={cart.isLoading}
                    sx={{
                      borderColor: '#FA003F',
                      color: '#FA003F',
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 700,
                      borderRadius: '14px',
                      textTransform: 'none',
                      borderWidth: 2,
                      '&:hover': {
                        borderColor: '#C70032',
                        background: 'rgba(250, 0, 63, 0.05)',
                        borderWidth: 2,
                      },
                    }}
                  >
                    Ajouter au panier
                  </Button>
                </Box>

                {/* Description */}
              

                {/* Fonctionnalités/Options */}
                {/* <Box className={styles.featuresSection}>
                  <Typography variant="h6" className={styles.sectionTitle}>
                    Ce que vous obtenez
                  </Typography>
                  <Box className={styles.featuresList}>
                    {defaultFeatures.map((feature, index) => (
                      <Box key={index} className={styles.featureItem}>
                        <Check className={styles.checkIcon} />
                        <Typography>{feature}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box> */}

                {/* Avantages */}
                <Box className={styles.benefitsSection}>
                  <Typography variant="h6" className={styles.sectionTitle}>
                    Pourquoi choisir cette formation ?
                  </Typography>
                  <Box className={styles.benefitsGrid}>
                    {defaultBenefits.map((benefit, index) => (
                      <Box key={index} className={styles.benefitCard}>
                        <Box className={styles.benefitIcon}>{benefit.icon}</Box>
                        <Box>
                          <Typography className={styles.benefitTitle}>
                            {benefit.title}
                          </Typography>
                          <Typography className={styles.benefitDescription}>
                            {benefit.description}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
              </Grid2>
            </Grid2>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Modal Vidéo Démo */}
      <Dialog
        open={openDemo}
        onClose={() => setOpenDemo(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'var(--background)',
            borderRadius: '12px',
            overflow: 'hidden',
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Box
            sx={{
              width: '100%',
              maxHeight: '70vh',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <video
              controls
              style={{
                width: '100%',
                height: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
              }}
            >
              <source src={product?.demoVideo} type="video/mp4" />
              Votre navigateur ne supporte pas les vidéos.
            </video>
          </Box>
        </DialogContent>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenDemo(false)}
          >
            Fermer
          </Button>
        </Box>
      </Dialog>
    </>
  );
}
