'use client';

import { Box, Container, Typography } from '@mui/material';
import { Check } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import Grid from '@mui/material/Grid2';
import styles from './PricingSection.module.scss';
import { useRouter } from 'next/navigation';

const plans = [
  {
    name: 'Starter',
    price: '29€',
    xofPrice: '~19 000 XOF',
    period: '/mois',
    description: 'Idéal pour débuter',
    features: [
      'Accès à 10 formations',
      'Support par email',
      'Certificat de completion',
      'Accès à vie aux formations',
    ],
    popular: false,
  },
  {
    name: 'Pro',
    price: '79€',
    xofPrice: '~52 000 XOF',
    period: '/mois',
    description: 'Pour les professionnels',
    features: [
      'Accès illimité aux formations',
      'Support prioritaire 24/7',
      'Certificats professionnels',
      'Projets pratiques inclus',
      'Mentorat personnalisé',
      'Accès aux masterclasses',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '199€',
    xofPrice: '~130 000 XOF',
    period: '/mois',
    description: 'Pour les équipes',
    features: [
      'Tout du plan Pro',
      'Formations sur mesure',
      'Tableau de bord équipe',
      'Rapports détaillés',
      'Intégration SSO',
      'Gestionnaire de compte dédié',
    ],
    popular: false,
  },
];

export default function PricingSection({ locale }: { locale: string }) {
  const t = useTranslations('Pricing');
  const router = useRouter();

  return (
    <Box
      id="tarification"
      className={styles.pricingSection}
    >
      <Container maxWidth="lg">
        <Box className={styles.pricingHeader}>
          <Typography className="rafly-sub">
            {t('subtitle')}
          </Typography>
          <Typography variant="h2" className="titlePageSection">
            {t('title')}
          </Typography>
          <Typography className={styles.pricingDescription}>
            {t('description')}
          </Typography>
        </Box>

        <Grid container spacing={3} justifyContent="center">
          {plans.map((plan) => (
            <Grid size={{ xs: 12, md: 4 }} key={plan.name}>
              <Box
                className={`${styles.pricingCard} ${plan.popular ? styles.popular : ''}`}
              >
                {plan.popular && (
                  <Box className={styles.popularBadge}>
                    Plus populaire
                  </Box>
                )}
                <Typography className={styles.planName}>
                  {plan.name}
                </Typography>
                <Typography className={styles.planDescription}>
                  {plan.description}
                </Typography>
                <Box className={styles.planPrice}>
                  <Typography className={styles.price}>
                    {plan.price}
                  </Typography>
                  <Typography className={styles.period}>
                    {plan.period}
                  </Typography>
                </Box>
                <Typography className={styles.xofPrice}>
                  {plan.xofPrice}
                </Typography>
                <button className={styles.planButton}>
                  Choisir ce plan
                </button>
                <Box className={styles.featuresList}>
                  {plan.features.map((feature, index) => (
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
  );
}
