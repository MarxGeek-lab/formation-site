'use client';

import { Box, Container, Typography, Button, Card, CardContent, IconButton, Divider } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '@/contexts/CartContext';
import styles from './panier.module.scss';
import LocalizedPrice from '@/components/LocalizedPrice2';
import { Translate } from '@/components/Translate';

export default function CartPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const router = useRouter();
  const t = useTranslations('Cart');
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  const handleCheckout = () => {
    router.push(`/${locale}/paiement`);
  };

  if (cart?.items?.length === 0) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        pt: { xs: 12, md: 16 },
        pb: 8,
        background: 'var(--background)'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            textAlign: 'center',
            py: 8
          }}>
            <ShoppingCartIcon sx={{ 
              fontSize: 80, 
              color: 'var(--muted-foreground)',
              mb: 3 
            }} />
            <Typography variant="h4" sx={{ 
              mb: 2,
              color: 'var(--foreground)'
            }}>
              <Translate text="Votre panier est vide" lang={locale} /> 
            </Typography>
            <Typography variant="body1" sx={{ 
              mb: 4,
              color: 'var(--muted-foreground)'
            }}>
              <Translate text="Découvrez nos produits et ajoutez-les à votre panier" lang={locale} /> 
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push(`/${locale}/catalogue`)}
              sx={{
                background: 'var(--primary)',
                color: 'white',
                '&:hover': {
                  background: 'var(--primary-dark)'
                }
              }}
            >
              <Translate text="Voir le catalogue" lang={locale} /> 
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      pt: { xs: 12, md: 16 },
      pb: 8,
      background: 'var(--background)'
    }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ 
            fontSize: '2.5rem',
            fontWeight: 700,
            color: 'var(--foreground)',
            mb: 2
          }}>
            <Translate text="Mon Panier" lang={locale} /> 
          </Typography>
          <Typography variant="body1" sx={{ 
            color: 'var(--muted-foreground)'
          }}>
            {cart?.items?.length} {cart?.items?.length === 1 ? 'produit' : 'produits'} 
            <Translate text="dans votre panier" lang={locale} /> 
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Liste des produits */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box className={styles.cartItems}>
              {cart?.items?.map((item: any) => (
                <Card key={item.id} className={styles.cartItem}>
                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={3} alignItems="center">
                      {/* Image du produit */}
                      <Grid size={{ xs: 12, sm: 3 }}>
                        <Box className={styles.productImage}>
                          <img
                            src={item.image || '/placeholder-product.jpg'}
                            alt={item.name}
                            style={{
                              width: '100%',
                              height: '120px',
                              objectFit: 'cover',
                              borderRadius: '8px'
                            }}
                          />
                        </Box>
                      </Grid>

                      {/* Détails du produit */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="h6" className={styles.productName}>
                          <Translate text={item.name} lang={locale} /> 
                        </Typography>
                        <Typography variant="body2" className={styles.productCategory}>
                          <Translate text={item.category} lang={locale} /> 
                        </Typography>
                        
                        {/* Options sélectionnées */}
                        {item.options && (
                          <Box sx={{ mt: 1 }}>
                            {item.options.visual && item.options.visual !== 'without-visual' && (
                              <Typography variant="body2" className={styles.productOption}>
                                <Translate text="• Avec visuel de publicité" lang={locale} /> 
                                ( + <LocalizedPrice amount={2500} /> )
                              </Typography>
                            )}
                            {item.options.support && item.options.support.length > 0 && (
                              <Typography variant="body2" className={styles.productOption}>
                                <Translate text="• Accompagnement personnalisé" lang={locale} /> 
                                ( + <LocalizedPrice amount={150000} /> )
                              </Typography>
                            )}
                          </Box>
                        )}

                        <Typography variant="h6" className={styles.productPrice}>
                           <LocalizedPrice amount={item.totalPrice || item.price} />
                        </Typography>
                      </Grid>

                      {/* Contrôles de quantité et suppression */}
                      <Grid size={{ xs: 12, sm: 3 }}>
                        <Box className={styles.cartControls}>
                          <Box className={styles.quantityControls}>
                            <IconButton
                              size="small"
                              onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                              disabled={(item.quantity || 1) <= 1}
                              className={styles.quantityButton}
                            >
                              <RemoveIcon />
                            </IconButton>
                            <Typography className={styles.quantity}>
                              {item.quantity || 1}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                              className={styles.quantityButton}
                            >
                              <AddIcon />
                            </IconButton>
                          </Box>
                          
                          <IconButton
                            onClick={() => removeFromCart(item.id)}
                            className={styles.deleteButton}
                            sx={{ mt: 2 }}
                          >
                            <DeleteIcon color='error'/>
                          </IconButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* Actions du panier */}
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={clearCart}
                sx={{
                  borderColor: 'var(--border)',
                  color: 'var(--muted-foreground)',
                  '&:hover': {
                    borderColor: 'var(--primary)',
                    color: 'var(--primary)'
                  }
                }}
              >
                <Translate text="Vider le panier" lang={locale} /> 
              </Button>
              <Button
                variant="outlined"
                onClick={() => router.push(`/${locale}/catalogue`)}
                sx={{
                  borderColor: 'var(--primary)',
                  color: 'var(--primary)',
                  '&:hover': {
                    background: 'var(--primary)',
                    color: 'white'
                  }
                }}
              >
                <Translate text="Continuer mes achats" lang={locale} /> 
              </Button>
            </Box>
          </Grid>

          {/* Résumé de commande */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card className={styles.orderSummary}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ 
                  mb: 3,
                  fontWeight: 600,
                  color: 'var(--foreground)'
                }}>
                  <Translate text="Résumé de la commande" lang={locale} /> 
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">
                      <Translate text="Sous-total" lang={locale} /> 
                      ({cart?.items?.length} {cart?.items?.length === 1 ? 'article' : 'articles'})
                    </Typography>
                    <Typography variant="body2">
                      <LocalizedPrice amount={cart?.totalPrice} />
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">
                      <Translate text="Frais de livraison" lang={locale} /> 
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--success)' }}>
                      <Translate text="Gratuit" lang={locale} /> 
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    <Translate text="Total" lang={locale} /> 
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600,
                    color: 'var(--primary)'
                  }}>
                     <LocalizedPrice amount={cart?.totalPrice} />
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleCheckout}
                  className={styles.checkoutButton}
                  sx={{
                    background: 'var(--primary)',
                    color: 'white',
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    '&:hover': {
                      background: 'var(--primary-dark)'
                    }
                  }}
                >
                  <Translate text="Procéder au paiement" lang={locale} /> 
                </Button>

                <Typography variant="body2" sx={{ 
                  mt: 2,
                  textAlign: 'center',
                  color: 'var(--muted-foreground)',
                  fontSize: '0.875rem'
                }}>
                  <Translate text="Paiement sécurisé • Livraison numérique instantanée" lang={locale} /> 
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
