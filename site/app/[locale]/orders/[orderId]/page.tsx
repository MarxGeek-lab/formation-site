'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  Container,
  Box,
  Typography,
  Avatar,
  Divider,
  Stack,
  Grid,
  Paper,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Alert
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Grid2 from '@mui/material/Grid2';
import { ArrowBack as ArrowBackIcon, Close as CloseIcon, Download as DownloadIcon, Info } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuthStore, useOrderStore } from '@/contexts/GlobalContext';
import { formatAmount } from '@/utils/formatAmount';

const OrderDetailPage = ({ params }: { params: { locale: string; orderId: string } }) => {
  const { locale, orderId } = params;
  const router = useRouter();
  const { getOrderById } = useOrderStore();
  const { user } = useAuthStore();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  const fetchOrder = async () => {
    try {
      const { data, status } = await getOrderById(orderId);
      console.log('order == ', data)
      if (status === 200) {
        setOrder(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
        <Container sx={{ textAlign: 'center', pt: 20 }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Chargement de la commande...
          </Typography>
        </Container>
    );
  }

  if (!order) {
    return (
        <Container sx={{ textAlign: 'center', pt: 20 }}>
          <Typography variant="h6">Commande introuvable</Typography>
          <Button onClick={() => router.back()} startIcon={<ArrowBackIcon />} sx={{ mt: 2 }}>
            Retour
          </Button>
        </Container>
    );
  }

  return (
    <ProtectedRoute>
      <Container maxWidth="md" sx={{ pt: 4, pb: 4 }}>
        {/* Header */}
        {/* Message de succès */}
        <Alert 
          severity="success" 
          icon={<CheckCircleIcon fontSize="inherit" />} 
          sx={{ 
            mb: 3, 
            borderRadius: 2, 
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }}
        >
          Paiement effectué avec succès 🎉 Votre commande a été traitée avec succès.
          Veuillez télécharger votre contrat et votre produit.
        </Alert>

        {/* <Alert 
          severity="info" 
          variant="outlined"
          icon={<Info fontSize="inherit" />} 
          sx={{ 
            mb: 3, 
            borderRadius: 2, 
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            color: 'white',
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }}
        >
          Vous pouvez consulter votre commande dans votre espace client et télécharger
          votre contrat et votre produit à tout moment.
        </Alert> */}

       
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          {/* <IconButton onClick={() => router.back()}>
            <ArrowBackIcon sx={{color: 'white'}} />
          </IconButton> */}
          <Typography variant="h5" sx={{ 
            fontWeight: 700, 
            wordBreak: 'break-all' 
          }}>
            Commande ORD-{order?._id.toString().toUpperCase()}
          </Typography>
        </Box>

        {/* Statut */}
        <Box sx={{ mb: 3 }}>
          <Chip
            label={
                order?.status === 'pending' ? 'En attente'
                :order?.status === 'failed' ? 'Echoué': 'Confirmé'}
            color={
              order?.status === 'pending'
                ? 'warning'
                : order?.status === 'confirmed'
                ? 'success'
                : order?.status === 'shipped'
                ? 'primary'
                : order?.status === 'delivered'
                ? 'success'
                : 'error'
            }
            sx={{ fontWeight: 600 }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {formatDate(order?.completedAt)}
          </Typography>
        </Box>

        {/* Articles commandés */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Articles ({order?.items.length})
          </Typography>
          <Stack divider={<Divider />}>
            {order?.items.map((item: any) => (
              <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', py: 1.5 }}>
                <Avatar
                  src={item.product.photos[0]}
                  alt={item.name}
                  variant="rounded"
                  sx={{ width: 56, height: 56, mr: 2 }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {item.product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.quantity} × {formatAmount(item?.price || 0)} FCFA
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {formatAmount(item?.price * item?.quantity)} FCFA
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Récapitulatif */}
        <Paper sx={{ 
            p: 3, 
            mb: 4, 
            background: 'var(--primary-light)' }}>
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Total produits</Typography>
              <Typography>
                {formatAmount(order?.items?.reduce((total: number, item: any) => total + item?.price * item?.quantity, 0))} FCFA
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
              <Typography>Total payer</Typography>
              <Typography>{formatAmount(order?.totalAmount || 0)} FCFA</Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Actions */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          {order.paymentStatus === 'paid' && order.productZip && (
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => window.open(order.productZip, '_blank')}
            >
              Télécharger produits
            </Button>
          )}
          {order.paymentStatus === 'paid' && order.contrat && (
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => window.open(order.contrat, '_blank')}
            >
              Télécharger contrat
            </Button>
          )}
        </Box>

        {!user && (
        <Alert 
          severity="warning" 
          variant="outlined"
          icon={<Info fontSize="inherit" />} 
          sx={{ 
            mt: 3, 
            borderRadius: 2, 
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            color: 'white',
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }}
        >
          Votre compte utilisateur a été créé avec succès, veuillez réinitialiser votre mot de passe avec le email fourni lors de la commande.
        </Alert>
        )}
      </Container>
    </ProtectedRoute>
  );
};

export default OrderDetailPage;
