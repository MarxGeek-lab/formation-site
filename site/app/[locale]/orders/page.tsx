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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Paper,
  Grid,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  IconButton,
  Stack,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import {
  ArrowBack as ArrowBackIcon,
  ShoppingBag as ShoppingBagIcon,
  LocalShipping as LocalShippingIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  LocalShipping as ShippingIcon,
  Cancel as CancelIcon,
  Close as CloseIcon,
  WhatsApp as WhatsAppIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import styles from './ordersList.module.scss';
import { useAuthStore, useOrderStore } from '@/contexts/GlobalContext';
import { API_URL2 } from '@/settings/constant';
import { formatAmount } from '@/utils/formatAmount';
import { COLORS } from '@/settings/theme';

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  category: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
}

const OrdersPage = ({ params }: { params: { locale: string } }) => {
  const { locale } = params;
  const router = useRouter();
  const { orders, getUserOrders } = useOrderStore()
  const { user } = useAuthStore()
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (user) {
      try {
        const { data, status } = await getUserOrders(user._id);
        if (status === 200) {
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const getStatusColor = (status: Order['status']) => {
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


  const getStatusColorPayment = (status: any) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'paid':
        return 'success';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: Order['status']) => {
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

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <ScheduleIcon />;
      case 'confirmed':
        return <CheckCircleIcon />;
      case 'shipped':
        return <ShippingIcon />;
      case 'delivered':
        return <CheckCircleIcon />;
      case 'cancelled':
        return <CancelIcon />;
      default:
        return <ScheduleIcon />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewPaymentDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowPaymentDetails(true);
  };

  const handleClosePaymentDetails = () => {
    setShowPaymentDetails(false);
    setSelectedOrder(null);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleCloseOrderDetails = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Container maxWidth="lg" sx={{ padding: '160px 0', textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="h6">Chargement de vos commandes...</Typography>
        </Container>
      </ProtectedRoute>
    );
  }

  const subTotal = selectedOrder ? selectedOrder?.items?.reduce((total: any, item: any) => total + item?.price * item?.quantity, 0) : 0;
console.log(selectedOrder)
  return (
    <ProtectedRoute>
    <Container 
      maxWidth="lg" 
      sx={{ 
        padding: { xs: '20px 8px 20px 8px', sm: '20px 16px', md: '20px 24px' },
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <IconButton onClick={() => router.push(`/${locale}/dashboard`)} sx={{ mr: 1 }}>
            <ArrowBackIcon color='primary' />
          </IconButton>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '1.75rem', sm: '2.125rem' },
            }}
          >
            Mes commandes
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
          {orders?.length} commande(s) trouvée(s). Consultez l'historique et suivez leur statut.
        </Typography>
      </Box>

      {orders.length === 0 ? (
        <Paper sx={{ 
          p: { xs: 3, sm: 4 }, 
          textAlign: 'center',
          borderRadius: { xs: 3, sm: 2 },
          boxShadow: { xs: '0 4px 20px rgba(0,0,0,0.08)', sm: 1 },
          border: { xs: '1px solid rgba(255, 255, 255, 0.8)', sm: 'none' },
          background: 'var(--primary-light)',
          backdropFilter: { xs: 'blur(10px)', sm: 'none' }
        }}>
          <ShoppingBagIcon sx={{ 
            fontSize: { xs: 48, sm: 64 }, 
            color: 'text.secondary', 
            mb: { xs: 1.5, sm: 2 } 
          }} />
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
          >
            Aucune commande trouvée
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            Vous n'avez pas encore passé de commande.
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push('/')}
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
            Commencer mes achats
          </Button>
        </Paper>
      ) : (

        <Grid2 container spacing={{ xs: 2, sm: 3 }}>
          {orders.map((order) => (
            <Grid2 key={order?._id} size={{ xs: 12 }}>
              <Accordion
                sx={{
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'var(--primary-light)',
                  boxShadow: 'none',
                  background: 'var(--primary-subtle)',
                  '&:before': { display: 'none' },
                }}
              >
                {/* Header Accordéon */}
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ px: { xs: 2.5, sm: 3 }, py: 1.5 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.1rem' } }}
                      >
                        {order?.typeOrder === 'abonnement' ? 'Abonnement' : 'Commande'} ORD-{order?._id?.toUpperCase()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(order?.createdAt)}
                      </Typography>
                    </Box>
                    <Chip
                      icon={getStatusIcon(order?.status)}
                      label={getStatusText(order?.status)}
                      color={getStatusColor(order?.status)}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </AccordionSummary>
        
                {/* Contenu Accordéon */}
                <AccordionDetails sx={{ px: { xs: 2.5, sm: 3 }, py: 1.5 }}>
                  {/* Liste des items */}
                  {order?.items?.map((item: any, idx: number) => (
                    <Box
                      key={item._id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        py: 1.5,
                        borderTop: idx === 0 ? 'none' : '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Avatar
                        src={item?.product?.photos[0]}
                        alt={item?.product?.name}
                        variant="rounded"
                        sx={{
                          width: 50,
                          height: 50,
                          mr: 2,
                          borderRadius: 2,
                          boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                        }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {order?.typeOrder === 'abonnement' ? item?.subscription?.title : item?.product?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item?.quantity} × {formatAmount(item?.price)} FCFA
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {formatAmount(item.quantity * item.price)} FCFA
                      </Typography>
                    </Box>
                  ))}
        
                  {/* Total et actions */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      pt: 2,
                      mt: 1,
                      borderTop: '1px dashed rgba(0,0,0,0.08)',
                    }}
                  >
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Total
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {formatAmount(order?.totalAmount || 0)} FCFA
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>

                       {(order?.paymentStatus === 'paid' && order?.productZip) && (
                        <Button
                          variant="contained"
                          onClick={() => window.open(order?.productZip, '_blank')}
                          startIcon={<DownloadIcon />}
                          sx={{ 
                            textTransform: 'none', fontWeight: 600,
                            color: 'white',
                            borderColor: '#25D366',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Télécharger les produits (PDF)
                        </Button>
                      )}
                      {order?.paymentStatus === 'paid' && order?.contrat && (
                        <Button
                          variant="contained"
                          onClick={() => window.open(order?.contrat, '_blank')}
                          startIcon={<DownloadIcon />}
                          sx={{ 
                            textTransform: 'none', fontWeight: 600,
                            color: 'white',
                            borderColor: '#25D366',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Télécharger le contrat (PDF)
                        </Button>
                      )}

                      {/* <Button
                        variant="outlined"
                        onClick={() => handleViewOrder(order)}
                        sx={{ 
                          textTransform: 'none', fontWeight: 600,
                          color: 'var(--primary)',
                          borderColor: 'var(--primary)',
                        }}
                      >
                        Détails
                      </Button> */}
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Grid2>
          ))}
        </Grid2>


      )}

      {/* Modal des détails de commande */}
      <Dialog
        open={showOrderDetails}
        onClose={handleCloseOrderDetails}
        maxWidth="md"
        fullWidth
        PaperProps={{ 
          sx: { 
            borderRadius: 4,
            background: 'var(--background)'
          },
        }}
      >
        {selectedOrder && (
          <>
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
                Détails de la commande #{selectedOrder?._id?.slice(-6).toUpperCase()}
              </Typography>
              <IconButton
                aria-label="close"
                onClick={handleCloseOrderDetails}
                sx={{ color: (theme) => theme.palette.grey[500] }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
              <Grid2 container spacing={{ xs: 2, sm: 3 }}>
               

                {/* Articles commandés */}
                <Grid2 size={{ xs: 12 }}>
                  <Typography variant="subtitle1" sx={{ my: 1, fontWeight: 600 }}>
                    Articles ({selectedOrder?.items?.length})
                  </Typography>
                  <Stack divider={<Divider />}>
                    {selectedOrder?.items?.map((item: any) => (
                      <Box key={item?._id} sx={{ display: 'flex', alignItems: 'center', py: 1.5 }}>
                        <Avatar
                          src={item?.product?.photos?.[0]}
                          alt={item?.product?.name}
                          variant="rounded"
                          sx={{ width: 56, height: 56, mr: 2, borderRadius: 1.5 }}
                        />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>{item?.product?.name}</Typography>
                          <Typography variant="body2" color="text.secondary">{item?.quantity} × {formatAmount(item?.price)} FCFA</Typography>
                        </Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{formatAmount(item.quantity * item.price)} FCFA</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Grid2>

                {/* Récapitulatif des prix */}
                <Grid2 size={{ xs: 12 }}>
                  <Stack spacing={1} sx={{ mt: 2, p: 2, backgroundColor: 'var(--primary-subtle)', borderRadius: 2 }}>
                    <Divider sx={{ my: '8px !important' }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Total</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{formatAmount(selectedOrder?.totalAmount)} FCFA</Typography>
                    </Box>
                  </Stack>
                </Grid2>
              </Grid2>
            </DialogContent>
            <DialogActions sx={{ p: { xs: 2, sm: '16px 24px' } }}>
              <Button 
                onClick={handleCloseOrderDetails} 
                color="error"
                variant='contained'
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Fermer
              </Button>
              {/* <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() => alert('Fonctionnalité de téléchargement à venir')}
                sx={{ textTransform: 'none', fontWeight: 600, bgcolor: COLORS.primary }}
              >
                Télécharger la facture
              </Button> */}
            </DialogActions>
          </>
        )}
      </Dialog>

      <Dialog 
        open={showPaymentDetails} 
        onClose={handleClosePaymentDetails}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        {selectedOrder && (
          <>
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
                Détails des paiements
              </Typography>
              <IconButton
                aria-label="close"
                onClick={handleClosePaymentDetails}
                sx={{ color: (theme) => theme.palette.grey[500] }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: { xs: 2, sm: 3 }, bgcolor: 'background.default' }}>
              <Stack spacing={2}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {selectedOrder?.payments?.length} paiement(s) trouvé(s)
                </Typography>
                {selectedOrder?.payments?.map((payment: any) => (
                  <Paper key={payment?._id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Grid2 container spacing={2}>
                      <Grid2 size={{ xs: 12, sm: 6 }}>
                        <Typography variant="caption" color="text.secondary">ID Transaction</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500, wordBreak: 'break-all' }}>{payment?.transaction?._id}</Typography>
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6 }}>
                        <Typography variant="caption" color="text.secondary">Montant</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>{formatAmount(payment?.amount)} FCFA</Typography>
                      </Grid2>
                      <Grid2 size={{ xs: 12 }}><Divider sx={{ my: 1 }} /></Grid2>
                      <Grid2 size={{ xs: 6 }}>
                        <Typography variant="caption" color="text.secondary">Type</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{payment?.transaction?.type === 'payment' ? 'Paiement' : 'Remboursement'}</Typography>
                      </Grid2>
                      <Grid2 size={{ xs: 6 }}>
                        <Typography variant="caption" color="text.secondary">Méthode</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{payment?.transaction?.paymentMethod}</Typography>
                      </Grid2>
                      <Grid2 size={{ xs: 6 }}>
                        <Typography variant="caption" color="text.secondary">Fournisseur</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{payment?.transaction?.mobileProvider}</Typography>
                      </Grid2>
                      <Grid2 size={{ xs: 6 }}>
                        <Typography variant="caption" color="text.secondary">Date</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{formatDate(payment?.transaction?.createdAt)}</Typography>
                      </Grid2>
                      <Grid2 size={{ xs: 12 }}>
                        <Typography variant="caption" color="text.secondary">Statut</Typography>
                        <Box>
                          <Chip 
                            label={payment?.transaction?.status}
                            color={getStatusColorPayment(payment?.transaction?.status)}
                            size="small"
                            sx={{ mt: 0.5, fontWeight: 600 }}
                          />
                        </Box>
                      </Grid2>
                    </Grid2>
                  </Paper>
                ))}
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: { xs: 2, sm: '16px 24px' } }}>
              <Button 
                variant="outlined" 
                onClick={handleClosePaymentDetails} 
                color="inherit"
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Fermer
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
    </ProtectedRoute>
  );
};

export default OrdersPage;
