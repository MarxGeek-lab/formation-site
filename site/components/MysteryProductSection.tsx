"use client";

import React, { useEffect } from 'react';
import { Box, Container, Typography, Button, Rating, Card, CardContent } from '@mui/material';
import { useTheme } from '../hooks/useTheme';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Grid from '@mui/material/Grid2';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CreditCardIcon from '@mui/icons-material/CreditCard';

import Vector2 from '@/assets/images/Vector-2.png';
import MystereImage from '@/assets/images/Mystere-s2-Juillet-copie-2.jpg';
import { useProductStore } from '@/contexts/ProductStore';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';

export default function MysteryProductSection({ locale }: { locale: string }) {
  const { theme } = useTheme();
  const { addToCart} = useCart();
  const router = useRouter();
  const { productMystere, getProductsMystere } = useProductStore();
  const t = useTranslations('MysteryProduct');

  const handleAddToCart = async (e: React.MouseEvent, type='achat') => {
    e.stopPropagation();
    
    try {
      const product = productMystere;
      const price = product.price;
      
      // Ajouter au panier (synchronisation automatique avec backend)
      await addToCart({
        id: product._id,
        name: product.name,
        price: price,
        image: product?.photos?.[0] || '',
        category: product.category,
        type: type
      });

      router.push(`/${locale}/paiement`);

    } catch (error) {
      console.error('Erreur ajout au panier:', error);
    }
  };


  useEffect(() => {
    getProductsMystere();
  }, []);
console.log(productMystere);

  return (
    <Box 
      component="section" 
      id="produit-mystere" 
      sx={{ 
        position: 'relative',
        
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: 6}}>
          <Typography 
            variant="overline" 
            className='rafly-sub'
          >
            {t('subtitle')}
          </Typography>
          
          <Typography 
            variant="h2" 
            sx={{ 
              mx: 'auto',
              my: 2,
            }}
            className='rafly-title'
          >
            {t('title')}
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: theme === 'light' ? '#4b5563' : '#d1d5db',
              fontSize: '1.1rem',
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            {t('description')}
          </Typography>
        </Box>

        {/* Mystery Product Card */}
        <Box sx={{ maxWidth: '1000px', mx: 'auto',
          backgroundImage: `url(${Vector2.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'right',
         }}>
          <Card
            sx={{
              position: 'relative',
              borderRadius: 4,
              overflow: 'hidden',
              backgroundColor: 'transparent',
              backgroundImage: 'linear-gradient(180deg, #382396 0%, var(--e-global-color-primary) 100%)',
            }}
          >
            {/* Background Vector */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '300px',
                height: '180px',
                opacity: 0.3,
                zIndex: 1,
              }}
            >
              <Image
                src={Vector2}
                alt="Background decoration"
                fill
                style={{ objectFit: 'contain' }}
              />
            </Box>

            <CardContent sx={{ p: 2, position: 'relative', zIndex: 2 }}>
              {/* <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}> */}
                <Grid container spacing={4} sx={{alignItems: 'center'}}>
                    {/* Right Image */}
                    <Grid size={{xs: 12, sm: 12, md: 6}}>
                        <Box 
                        sx={{ 
                            height: { xs: '150px', sm: '200px', md: '250px' },
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        >
                        <img
                            src={productMystere?.photos?.[0]}
                            alt="Produit Mystère"
                            style={{ 
                            objectFit: 'cover',
                            borderRadius: '12px'
                            }}
                        />
                        </Box>
                    </Grid>

                    {/* Left Content */}
                    <Grid size={{xs: 12, sm: 12, md: 6}}>
                        <Box sx={{ flex: 1, color: 'white' }}>
                        {/* Rating */}
                        <Box sx={{ mb: 0 }}>
                            <Rating 
                            value={5} 
                            readOnly 
                            sx={{ 
                                '& .MuiRating-iconFilled': { 
                                color: '#fbbf24' ,
                                fontSize: 20
                                } 
                            }} 
                            />
                        </Box>

                        {/* Product Title */}
                        <Typography 
                            variant="h4" 
                            sx={{ 
                            fontWeight: 700,
                            mb: 1,
                            fontSize: '1.5rem'
                            }}
                        >
                            {productMystere?.name} 
                            {/* {t('productTitle')} */}
                        </Typography>

                        {/* Product Description */}
                        <Typography 
                            variant="body1" 
                            sx={{ 
                            mb: 4,
                            opacity: 0.9,
                            lineHeight: 1.6
                            }}
                        >
                            {t('productDescription')}
                        </Typography>

                        {/* Action Buttons */}
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: 2 
                        }}>
                            <Button
                            variant="contained"
                            size="large"
                            startIcon={<ArrowForwardIcon />}
                            sx={{
                                backgroundColor: 'white',
                                color: 'var(--primary)',
                                fontWeight: 600,
                                px: 2,
                                py: 1.5,
                                fontSize: '0.8rem',
                                borderRadius: 2,
                                whiteSpace: 'nowrap',
                                '&:hover': {
                                backgroundColor: '#f8fafc',
                                transform: 'translateY(-2px)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                            onClick={(e) => handleAddToCart(e, 'achat')}
                            >
                            {t('buyNow')}
                            </Button>

                            <Button
                            variant="outlined"
                            size="large"
                            startIcon={<CreditCardIcon />}
                            sx={{
                                borderColor: 'white',
                                color: 'white',
                                fontWeight: 600,
                                px: 2,
                                py: 1.5,
                                fontSize: '0.8rem',
                                borderRadius: 2,
                                whiteSpace: 'nowrap',
                                '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                borderColor: 'white',
                                transform: 'translateY(-2px)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                            onClick={(e) => handleAddToCart(e, 'abonnement')}
                            >
                            {t('subscribe')}
                            </Button>
                        </Box>
                        </Box>
                    </Grid>
                </Grid>
              {/* </Box> */}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}
