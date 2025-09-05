'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Paper,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import {
  ArrowBack as ArrowBackIcon,
  Favorite as FavoriteIcon,
  ShoppingBag as ShoppingBagIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import FeaturedProductCard from '@/components/FeaturedProductCard/FeaturedProductCard';
import { FeaturedProduct } from '@/types/product';
import { featuredProducts } from '@/data/products';
import { useAuthStore, useProductStore } from '@/contexts/GlobalContext';

interface FavoriteItem extends FeaturedProduct {
  inStock: boolean;
}

const FavoritesPage: React.FC = () => {
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuthStore();
  const { getUserFavorites } = useProductStore();

  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [ whishList, setWhishList ] = useState<any[]>([]);

  const fetchFavorites = async () => {
      if (user) {
          try {
              const { data, status } = await getUserFavorites(user._id);
              console.log(data)
              if (status === 200) {
                setLoading(false)
                  setWhishList(data);
              }
          } catch (error) {
              console.log(error);
          }
      }
  }

  useEffect(() => {
      fetchFavorites();
  }, [user]);

  const handleRemoveFromFavorites = (itemId: string) => {
    setWhishList(prev => prev.filter(item => item.id !== itemId));
    setSnackbarMessage('Produit retiré des favoris');
    setSnackbarOpen(true);
  };

  const handleAddToCart = (item: FavoriteItem) => {
    if (!item.inStock) {
      setSnackbarMessage('Ce produit n\'est pas disponible');
      setSnackbarOpen(true);
      return;
    }

    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
    });

    setSnackbarMessage('Produit ajouté au panier');
    setSnackbarOpen(true);
  };

  const handleViewProduct = (itemId: string) => {
    // Navigation vers la page produit (à implémenter)
    router.push(`/product/${itemId}`);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    if (hasHalfStar) {
      stars.push('⭐');
    }

    return stars.join('');
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Container 
          maxWidth="lg" 
          sx={{ 
            padding: { xs: '80px 8px 20px 8px', sm: '160px 16px', md: '160px 24px' },
            minHeight: '100vh',
            textAlign: 'center'
          }}
        >
          <CircularProgress />
          <Typography variant="h6">Chargement de vos favoris...</Typography>
        </Container>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
    <Container 
      maxWidth="lg" 
      sx={{ 
        padding: { xs: '80px 8px 20px 8px', sm: '160px 16px', md: '160px 24px' },
        minHeight: '100vh',
      }}
    >
      {/* Header */}
       {/* Header */}
       <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <IconButton onClick={() => router.back()} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '1.75rem', sm: '2.125rem' },
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}
          >
            <FavoriteIcon sx={{ fontSize: { xs: 28, sm: 32 }, color: 'error.main' }} />
            Mes favoris
          </Typography>
        </Box>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{
            pl: { xs: 0, sm: 5.5 },
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }}
        >
          {whishList.length} produit(s) trouvé(s). Retrouvez ici tous vos produits préférés.
        </Typography>
      </Box>


      {whishList.length === 0 ? (
        <Paper sx={{ 
          p: { xs: 3, sm: 4 }, 
          textAlign: 'center',
          borderRadius: { xs: 3, sm: 2 },
          boxShadow: { xs: '0 4px 20px rgba(0,0,0,0.08)', sm: 1 },
          border: { xs: '1px solid rgba(255, 255, 255, 0.8)', sm: 'none' },
          background: { xs: 'rgba(255, 255, 255, 0.95)', sm: 'white' },
          backdropFilter: { xs: 'blur(10px)', sm: 'none' }
        }}>
          <FavoriteIcon sx={{ 
            fontSize: { xs: 48, sm: 64 }, 
            color: 'text.secondary', 
            mb: { xs: 1.5, sm: 2 } 
          }} />
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
          >
            Aucun favori trouvé
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            Commencez à ajouter des produits à vos favoris pour les retrouver ici.
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push('/products')}
            startIcon={<ShoppingBagIcon />}
            sx={{
              borderRadius: { xs: 2, sm: 1 },
              px: { xs: 3, sm: 4 },
              py: { xs: 1.5, sm: 2 },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              fontWeight: 600,
              textTransform: 'none'
            }}
          >
            Découvrir nos produits
          </Button>
        </Paper>
      ) : (
        <>
          {/* Statistiques rapides */}
          {/* <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Grid2 container spacing={{ xs: 2, sm: 3 }}>
              <Grid2 size={{ xs: 6, sm: 4 }}>
                <Card sx={{ 
                  borderRadius: { xs: 3, sm: 2 },
                  boxShadow: { xs: '0 4px 20px rgba(0,0,0,0.08)', sm: 1 },
                  border: { xs: '1px solid rgba(255, 255, 255, 0.8)', sm: 'none' },
                  background: { xs: 'rgba(255, 255, 255, 0.95)', sm: 'white' },
                  backdropFilter: { xs: 'blur(10px)', sm: 'none' }
                }}>
                  <CardContent sx={{ 
                    textAlign: 'center',
                    p: { xs: 2, sm: 3 },
                    '&:last-child': { pb: { xs: 2, sm: 3 } }
                  }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                        color: 'error.main'
                      }}
                    >
                      {favorites.length}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                    >
                      Favoris
                    </Typography>
                  </CardContent>
                </Card>
              </Grid2>
              
              <Grid2 size={{ xs: 6, sm: 4 }}>
                <Card sx={{ 
                  borderRadius: { xs: 3, sm: 2 },
                  boxShadow: { xs: '0 4px 20px rgba(0,0,0,0.08)', sm: 1 },
                  border: { xs: '1px solid rgba(255, 255, 255, 0.8)', sm: 'none' },
                  background: { xs: 'rgba(255, 255, 255, 0.95)', sm: 'white' },
                  backdropFilter: { xs: 'blur(10px)', sm: 'none' }
                }}>
                  <CardContent sx={{ 
                    textAlign: 'center',
                    p: { xs: 2, sm: 3 },
                    '&:last-child': { pb: { xs: 2, sm: 3 } }
                  }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                        color: 'success.main'
                      }}
                    >
                      {favorites.filter(item => item.inStock).length}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                    >
                      Disponibles
                    </Typography>
                  </CardContent>
                </Card>
              </Grid2>
              
              <Grid2 size={{ xs: 12, sm: 4 }}>
                <Card sx={{ 
                  borderRadius: { xs: 3, sm: 2 },
                  boxShadow: { xs: '0 4px 20px rgba(0,0,0,0.08)', sm: 1 },
                  border: { xs: '1px solid rgba(255, 255, 255, 0.8)', sm: 'none' },
                  background: { xs: 'rgba(255, 255, 255, 0.95)', sm: 'white' },
                  backdropFilter: { xs: 'blur(10px)', sm: 'none' }
                }}>
                  <CardContent sx={{ 
                    textAlign: 'center',
                    p: { xs: 2, sm: 3 },
                    '&:last-child': { pb: { xs: 2, sm: 3 } }
                  }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                        color: 'primary.main'
                      }}
                    >
                      {favorites.reduce((total, item) => total + item.price, 0).toFixed(0)} €
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                    >
                      Valeur totale
                    </Typography>
                  </CardContent>
                </Card>
              </Grid2>
            </Grid2>
          </Box> */}

          {/* Liste des favoris */}
          <Grid2 container spacing={{ xs: 2, sm: 3 }}>
            {whishList.map((item) => (
              <Grid2 key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Box sx={{ position: 'relative' }}>
                  <FeaturedProductCard product={item} />
                  
                  {/* Bouton favori en overlay */}
                  <IconButton
                    onClick={() => handleRemoveFromFavorites(item.id)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      zIndex: 3,
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 1)',
                        transform: 'scale(1.1)'
                      },
                      '&:active': {
                        transform: 'scale(0.95)'
                      }
                    }}
                  >
                    <FavoriteIcon color="error" />
                  </IconButton>
                  
                  {/* Badge stock si indisponible */}
                  {!item.inStock && (
                    <Chip
                      label="Rupture de stock"
                      color="default"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 60,
                        bgcolor: 'rgba(0, 0, 0, 0.8)',
                        color: 'white',
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        zIndex: 3,
                        fontWeight: 600
                      }}
                    />
                  )}
                  

                  
                  {/* Overlay d'opacité si indisponible */}
                  {!item.inStock && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: 'rgba(255, 255, 255, 0.3)',
                        zIndex: 1,
                        borderRadius: 3
                      }}
                    />
                  )}
                </Box>
              </Grid2>
            ))}
          </Grid2>
        </>
      )}

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
    </ProtectedRoute>
  );
};

export default FavoritesPage;
