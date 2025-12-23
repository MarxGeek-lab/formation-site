'use client';

import { Box, Container, Typography } from '@mui/material';
import { Check } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import Grid from '@mui/material/Grid2';
import styles from './PricingSection.module.scss';
import { useRouter } from 'next/navigation';

const plans = [
  {
    name: 'Basic',
    xofPrice: '10 000 XOF',
    period: 'paiement unique',
    description:
      'Pour apprendre les bases du développement web à ton rythme.',
    features: [
      'Accès complet aux formations HTML, CSS et JavaScript',
      'Parcours pédagogique structuré et progressif',
      'Exercices pratiques après chaque module',
      'Suivi de progression automatisé',
      'Support par email',
      'Accès à vie aux contenus',
    ],
    popular: false,
  },
  {
    name: 'Populaire',
    price: '79 €',
    xofPrice: '25 000 XOF',
    period: '/mois',
    description:
      'Idéal pour progresser rapidement avec un suivi actif et interactif',
    features: [
      'Accès complet aux formations HTML, CSS et JavaScript',
      'Accès au module de formation React.js',
      'Projets pratiques encadrés (HTML / CSS / JavaScript / React)',
      'Suivi actif et interactif avec retours personnalisés',
      'Corrections détaillées des exercices et projets',
      'Sessions d’échanges (chat ou visio selon planning)',
      'Support WhatsApp prioritaire',
    ],
    popular: true,
  },
  {
    name: 'Avancé',
    price: '199 €',
    xofPrice: '70 000 XOF',
    period: '/mois',
    description:
      'Un accompagnement intensif pour atteindre un niveau professionnel',
    features: [
      'Toutes les fonctionnalités du plan Populaire',
      'Suivi personnalisé individuel (one-to-one)',
      'Coaching technique régulier',
      'Projets réels simulant des cas professionnels',
      'Revue de code approfondie et bonnes pratiques',
      'Plan de progression personnalisé selon le niveau',
      'Préparation à l’insertion professionnelle (portfolio, conseils, orientation)',
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
          <Typography variant="h2" 
          // className="titlePageSection"
          sx={{textAlign: "center", fontWeight: "700", fontSize: "40px"}}>
            Nos abonnements
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
                    {plan.xofPrice}
                  </Typography>
                  <Typography className={styles.period}>
                    {plan.period}
                  </Typography>
                </Box>
                {/* <Typography className={styles.xofPrice}>
                  {plan.xofPrice}
                </Typography> */}
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
