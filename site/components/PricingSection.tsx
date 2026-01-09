'use client';

import { useState, useEffect } from 'react';
import { Box, Container, Typography, Alert, CircularProgress } from '@mui/material';
import { Check, WhatsApp } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import Grid from '@mui/material/Grid2';
import styles from './PricingSection.module.scss';
import { useRouter } from 'next/navigation';
import PaymentModal from './PaymentModal';
import { API_URL } from '@/settings/constant';

interface Subscription {
  _id: string;
  title: string;
  description: string;
  price: number;
  priceEUR?: number;
  period: string;
  popular: boolean;
  features: string[];
  products: string[];
  duration: number;
}

export default function PricingSection({ locale }: { locale: string }) {
  const t = useTranslations('Pricing');
  const router = useRouter();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch subscriptions from API
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch(`${API_URL}subscription/public`);
        const data = await response.json();
        if (data.success) {
          setSubscriptions(data.data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des abonnements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleSelectPlan = (plan: any) => {
    setSelectedPlan(plan);
    setPaymentModalOpen(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
    <Box
      id="tarification"
      className={styles.pricingSection}
    >
      <Container maxWidth="lg">
        <Box className={styles.pricingHeader}>
          <Typography variant="h2"
          // className="titlePageSection"
          sx={{textAlign: "center", fontWeight: "700", fontSize: "40px"}}>
            Nos abonnements
          </Typography>
        </Box>

        {/* Section mise en avant WhatsApp */}
        <Alert
          icon={<WhatsApp sx={{ fontSize: 28 }} />}
          severity="success"
          sx={{
            mb: 4,
            background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.15) 0%, rgba(29, 168, 81, 0.15) 100%)',
            border: '2px solid rgba(37, 211, 102, 0.4)',
            borderRadius: '12px',
            '& .MuiAlert-icon': {
              color: '#25D366',
            },
          }}
        >
          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: '#25D366' }}>
            🎯 Notre avantage principal : Suivi WhatsApp personnalisé
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
            Tous nos abonnements incluent un accompagnement direct par WhatsApp. Posez vos questions, partagez vos difficultés,
            et recevez des réponses rapides et personnalisées. Vous n'êtes jamais seul dans votre apprentissage !
          </Typography>
        </Alert>

        <Grid container spacing={3} justifyContent="center" id="abonnements">
          {subscriptions.map((subscription) => (
            <Grid size={{ xs: 12, md: 4 }} key={subscription._id}>
              <Box
                className={`${styles.pricingCard} ${subscription.popular ? styles.popular : ''}`}
              >
                {subscription.popular && (
                  <Box className={styles.popularBadge}>
                    Plus populaire
                  </Box>
                )}
                <Typography className={styles.planName}>
                  {subscription.title}
                </Typography>
                <Typography className={styles.planDescription}>
                  {subscription.description}
                </Typography>
                <Box className={styles.planPrice}>
                  <Typography className={styles.price}>
                    {subscription.price.toLocaleString('fr-FR')} XOF
                  </Typography>
                  <Typography className={styles.period}>
                    / {subscription.duration > 1 ? subscription.duration : '' } {subscription.period}
                  </Typography>
                </Box>
                <button className={styles.planButton} onClick={() => handleSelectPlan(subscription)}>
                  Choisir ce plan
                </button>
                <Box className={styles.featuresList}>
                  {subscription.features.map((feature, index) => (
                    <Box key={index} className={styles.feature}>
                      <Check className={styles.checkIcon} />
                      <Typography>{feature}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>

    {/* Modal de paiement pour abonnement */}
    <PaymentModal
      open={paymentModalOpen}
      onClose={() => setPaymentModalOpen(false)}
      locale={locale}
      subscription={selectedPlan}
    />
    </>
  );
}
