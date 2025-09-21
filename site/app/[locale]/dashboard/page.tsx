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
  Chip,
  Avatar,
  Divider,
  LinearProgress,
  Alert,
  AlertTitle,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import {
  Dashboard as DashboardIcon,
  ShoppingBag as ShoppingBagIcon,
  LocalShipping as LocalShippingIcon,
  Payment as PaymentIcon,
  TrendingUp as TrendingUpIcon,
  Favorite as FavoriteIcon,
  AccountCircle as AccountCircleIcon,
  Notifications as NotificationsIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Cancel as CancelIcon,
  Star as StarIcon,
  Edit as EditIcon,
  Security as SecurityIcon,
  CreditCard as CreditCardIcon,
  LocationOn as LocationOnIcon,
  Download as DownloadIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuthStore, useCommonStore, useOrderStore } from '@/contexts/GlobalContext';
import { formatAmount } from '@/utils/formatAmount';
import { Translate } from '@/components/Translate';
import LocalizedPrice from '@/components/LocalizedPrice2';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalSpent: number;
  favoriteItems: number;
  rewardPoints: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  itemsCount: number;
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  color: string;
}

export default function DashboardPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const router = useRouter();
  const { cart } = useCart();
  const { orders, getUserOrders } = useOrderStore()
  const { user, logout, getUserById } = useAuthStore()
  const { getStatsOwner } = useCommonStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [logoutDialog, setLogoutDialog] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  const fetchData = async () => {
    if (user) {
      try {
        const { status } = await getUserOrders(user._id);
        const { data, status: statusStats } = await getStatsOwner(user._id);
        setStats(data);
        if (status === 200 || statusStats === 200) {
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchDataUser = async () => {
    if (user) {
      try {
        const { data, status } = await getUserById(user._id);
        if (status === 200) {
          setProfile(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleLogout = () => {
    setLogoutDialog(true);
  };

  useEffect(() => {
    fetchData();
    fetchDataUser()
  }, [user]);

  const getStatusColor = (status: RecentOrder['status']) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'success';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: RecentOrder['status']) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'confirmed':
        return 'Confirmée';
      case 'shipped':
        return 'Expédiée';
      case 'delivered':
        return 'Livrée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  const quickActions: QuickAction[] = [
    {
      title: 'Affiliations',
      description: 'Voir le tableau de bord des affiliations',
      icon: <ShoppingBagIcon />,
      action: () => {
        if (user) {
          if (profile?.isAffiliate) {
            router.push(`/${locale}/affiliate`);
          } else {
            router.push(`/${locale}/affiliation`);
          }
        }
      },
      color: '#1976d2',
    },
    {
      title: 'Mes Commandes',
      description: 'Voir toutes mes commandes / produit zippé / contrat',
      icon: <ShoppingBagIcon />,
      action: () => router.push(`/${locale}/orders`),
      color: '#1976d2',
    },
    {
      title: 'Mes Abonnements',
      description: 'Abonnements actifs',
      icon: <FavoriteIcon />,
      action: () => router.push(`/${locale}/abonnements`),
      color: '#e91e63',
    },
    {
      title: 'Mon Profil',
      description: 'Gérer mes informations',
      icon: <AccountCircleIcon />,
      action: () => router.push(`/${locale}/profile`),
      color: '#9c27b0',
    },
  ];

  if (loading) {
    return (
      <ProtectedRoute>
        <Container maxWidth="lg" sx={{ padding: '160px 0', textAlign: 'center' }}>
          <Typography variant="h6">
            <Translate text="Chargement de votre tableau de bord..." lang={locale} />
          </Typography>
          <LinearProgress sx={{ mt: 2, maxWidth: 300, mx: 'auto' }} />
        </Container>
      </ProtectedRoute>
    );
  }

  console.log("stats == ", stats)
  const statsData = [
    {
      value: stats?.ordersCount || 0,
      label: 'Commandes totales',
      icon: <ShoppingBagIcon />,
      color: 'primary',
      gradient: ['#1976d2', '#42a5f5'],
      rgba: 'rgba(25, 118, 210,',
    },
    {
      value: stats?.orderPending || 0,
      label: 'Commandes en attente',
      icon: <LocalShippingIcon />,
      color: 'warning',
      gradient: ['#ff9800', '#ffb74d'],
      rgba: 'rgba(255, 152, 0,',
    },
    {
      value: stats?.orderConfirmed || 0,
      label: 'Total Achat',
      icon: <TrendingUpIcon />,
      color: 'success',
      gradient: ['#2e7d32', '#66bb6a'],
      rgba: 'rgba(46, 125, 50,',
    },
    {
      value: stats?.expense ? formatAmount(stats?.expense || 0)+" FCFA" : 0,
      label: 'Mes dépenses',
      icon: <StarIcon sx={{ color: '#FFD700' }} />,
      color: 'inherit',
      gradient: ['#ffc107', '#ffeb3b'],
      rgba: 'rgba(255, 193, 7,',
    },
  ];

  return (
    <ProtectedRoute>
    <Container 
      maxWidth="lg" 
      sx={{ 
        padding: { xs: '20px 8px', sm: '20px 16px', md: '20px 24px' },
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 1,
        }}>
          <DashboardIcon sx={{ 
            fontSize: { xs: 28, sm: 32 }, 
            mr: 1.5, 
            color: 'primary.main' 
          }} />
          <Typography 
            variant="h5" 
            // component="h1" 
            sx={{ 
              fontWeight: 700,
              // fontSize: { xs: '1.75rem', sm: '2.125rem' }
            }}
          >
            <Translate text="Tableau de bord" lang={locale} />
          </Typography>
        </Box>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ 
            fontSize: { xs: '0.9rem', sm: '1rem' },
            pl: { xs: 0.5, sm: 0 }
          }}
        >
          <Translate text="Bienvenue ! Voici un aperçu de votre activité." lang={locale} />
        </Typography>
      </Box>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: 'space-between',
          p: 2,
          mb: 2,
          backgroundColor: 'var(--primary-subtle)',
          borderRadius: 2,
          boxShadow: 1
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            sx={{ 
              width: 50, 
              height: 50,
              bgcolor: 'primary.main',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}
          >
            {user?.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              <Translate text={user?.fullName || 'Utilisateur'} lang={locale} />
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
        </Box>
        
        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          <Translate text="Déconnexion" lang={locale} />
        </Button>
      </Box>

      {/* Alerte panier */}
      {cart.items.length > 0 && (
        <Alert 
          severity="warning"
          // icon={<InfoOutlinedIcon sx={{ fontSize: 24, mt: 0.5 }} />}
          sx={{ 
            mb: { xs: 2, sm: 3 },
            borderRadius: 2,
            background: 'rgba(255, 76, 60, 0.08)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 76, 60, 0.15)',
            color: 'warning.dark',
            boxShadow: 'none',
            p: { xs: 1.5, sm: '12px 16px' },
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
          action={
            <Button 
              variant="contained"
              color="warning" 
              onClick={() => router.push(`/${locale}/paiement`)}
              sx={{ whiteSpace: 'nowrap', fontWeight: 600, ml: 2 }}
            >
              <Translate text="Finaliser" lang={locale} />
            </Button>
          }
        >
          <Typography sx={{ fontWeight: 500 }}>
            <Translate text="Vous avez" lang={locale} /> <strong>{cart.totalItems} <Translate text="article(s)" lang={locale} /></strong> <Translate text="dans votre panier pour un total de" lang={locale} /> 
            <strong><LocalizedPrice amount={cart.totalPrice} /></strong>
          </Typography>
        </Alert>
      )}

      {/* Statistiques principales */}
      <Grid2 container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, sm: 4 } }}>
        {statsData.map((item, index) => (
          <Grid2 key={index} size={{ xs: 6, sm: 6, md: 3 }}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 2,
                // background: `linear-gradient(135deg, ${item.gradient[0]}, ${item.gradient[1]})`,
                background: 'var(--e-global-color-c3c16f7)',
                // backdropFilter: "blur(12px)",
                border: "1px solid rgba(0,0,0,0.05)",
                // boxShadow: "0 1px 20px rgba(0,0,0,0.06)",
                boxShadow: 'none',
                transition: "all 0.25s ease-in-out",
                "&:hover": {
                  transform: "translateY(-6px) scale(1.01)",
                  boxShadow: "0 1px 15px rgba(0,0,0,0.1)",
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: {xs: "flex-start", sm: "center"},
                  flexDirection: {xs: 'column', sm: 'row'},
                  justifyContent: "flex-start",
                  gap: 2,
                  p: { xs: 1, sm: 2.5 },
                  height: '100%'
                }}
              >
                {/* Icône stylisée */}
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    minWidth: 40,
                    borderRadius: 2,
                    background: 'var(--background)',
                    // background: `linear-gradient(135deg, ${item.gradient[0]}, ${item.gradient[1]})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 3px 2px rgba(0,0,0,0.1)",
                    color: "#fff",
                  }}
                >
                  {React.cloneElement(item.icon, {
                    sx: { fontSize: 20, color: item.gradient },
                  })}
                </Box>

                {/* Texte */}
                <Box sx={{ textAlign: "left" }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      lineHeight: 1.2,
                      fontSize: { xs: "1.2rem", sm: "1.5rem" },
                      background: `linear-gradient(135deg, ${item.gradient[0]}, ${item.gradient[1]})`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      mb: 1,
                    }}
                  >
                    {item.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: "text.secondary",
                      letterSpacing: 0.5,
                    }}
                  >
                    <Translate text={item.label} lang={locale} />
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>

      <Grid2 container spacing={{ xs: 2, sm: 3 }}>
        {/* Actions rapides */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              borderRadius: 2,
              height: "100%",
              background: "var(--primary-subtle)",
              backdropFilter: "blur(12px)",
              border: "1px solid var(--primary-light)",
              // boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              boxShadow: 'none',
              transition: "all 0.25s ease-in-out",
              "&:hover": {
                // boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
              },
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, sm: 1.5 } }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                {quickActions.map((action, index) => (
                  <Box
                    key={index}
                    onClick={action.action}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      borderRadius: 2.5,
                      cursor: "pointer",
                      px: 1,
                      py: 0.5,
                      borderBottom: '1px solid rgba(0,0,0,0.06)',
                      transition: "all 0.25s ease-in-out",
                      "&:hover": {
                        backgroundColor: "action.hover",
                        transform: "translateY(-2px) scale(1.01)",
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        color: "var(--primary)",
                        backgroundColor: "var(--primary-light)",
                        width: 35,
                        height: 35,
                        fontSize: 16,
                        mr: { xs: 1.5, sm: 2 },
                        boxShadow: "0 3px 6px rgba(0,0,0,0.12)",
                      }}
                    >
                      {action.icon}
                    </Avatar>

                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: "0.9rem", sm: "0.95rem" },
                        }}
                      >
                        <Translate text={action.title} lang={locale} />
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: { xs: "0.75rem", sm: "0.8rem" } }}
                      >
                        <Translate text={action.description} lang={locale} />
                      </Typography>
                    </Box>

                    <ArrowForwardIcon
                      sx={{
                        color: "white",
                        fontSize: { xs: 20, sm: 22 },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid2>


        {/* Commandes récentes */}
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: "none",
              background: "var(--e-global-color-light)",
              border: "1px solid var(--primary-light)",
              overflow: "hidden",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                // boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
              },
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              {/* Header */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "1.15rem", sm: "1.25rem" },
                  }}
                >
                  <Translate text="Commandes récentes" lang={locale} />
                </Typography>
                <Button
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => router.push(`/${locale}/orders`)}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    fontWeight: 500,
                  }}
                >
                  <Translate text="Voir tout" lang={locale} />
                </Button>
              </Box>

              {/* Vide */}
              {orders.length === 0 ? (
                <Box
                  sx={{
                    textAlign: "center",
                    py: { xs: 4, sm: 6 },
                    opacity: 0.85,
                  }}
                >
                  <ShoppingBagIcon
                    sx={{ fontSize: 46, color: "text.secondary", mb: 1.5 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    <Translate text="Aucune commande récente" lang={locale} />
                  </Typography>
                </Box>
              ) : (
                <Box>
                  {orders.slice(0, 3).map((order, index) => (
                    <Box key={order?._id}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          py: 1.8,
                          px: 1,
                          transition: "all 0.25s ease",
                          borderRadius: 2,
                          "&:hover": {
                            backgroundColor: "rgba(0,0,0,0.03)",
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        {/* Gauche */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.6 }}>
                          <Avatar
                            sx={{
                              bgcolor: "transparent",
                              background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                              color: "#fff",
                              fontSize: 20,
                              width: 38,
                              height: 38,
                              boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
                            }}
                          >
                            <ShoppingBagIcon fontSize="inherit" />
                          </Avatar>
                          <Box>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              sx={{ letterSpacing: 0.3 }}
                            >
                              ORD-{order?._id?.slice(0, 6).toUpperCase()}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="primary"
                              sx={{ display: "block", mt: 0.4 }}
                            >
                              {order?.createdAt &&
                                new Date(order?.createdAt).toLocaleDateString("fr-FR")}{" "}
                              • {order?.items?.length} 
                              <Translate text="article(s)" lang={locale} />
                            </Typography>
                          </Box>
                        </Box>

                        {/* Droite */}
                        <Box sx={{ textAlign: "right" }}>
                          <Typography
                            variant="body2"
                            fontWeight={700}
                            sx={{
                              fontSize: "0.9rem",
                              color: "text.primary",
                            }}
                          >
                            <LocalizedPrice amount={order?.totalAmount || 0} />
                          </Typography>
                          <Chip
                            label={getStatusText(order?.status)}
                            color={getStatusColor(order?.status)}
                            size="small"
                            sx={{
                              mt: 0.6,
                              fontSize: "0.72rem",
                              fontWeight: 500,
                              height: 22,
                              borderRadius: "8px",
                            }}
                          />
                        </Box>
                      </Box>

                      {/* Divider soft */}
                      {index < orders.slice(0, 3).length - 1 && (
                        <Divider sx={{ opacity: 0.3 }} />
                      )}
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid2> 
      </Grid2>
    </Container>
    <Dialog open={logoutDialog} onClose={() => {setLogoutDialog(false)}}
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: 'var(--background)',
          p: 1
        },
      }}>
      <DialogTitle> <Translate text="Déconnexion" lang={locale} /></DialogTitle>
      <DialogContent> 
        <Typography variant="body2">
          <Translate text="Voulez-vous vraiment vous déconnecter ?" lang={locale} />
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={logout}>
          <Translate text="Oui" lang={locale} />
        </Button>
        <Button variant="outlined" color="primary" onClick={() => {setLogoutDialog(false)}}>
          <Translate text="Non" lang={locale} />
        </Button>
      </DialogActions>
    </Dialog>
    </ProtectedRoute>
  );
};
