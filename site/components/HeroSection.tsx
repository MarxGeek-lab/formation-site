"use client";

import { Box, Container, Typography } from '@mui/material';
import { ArrowForward, PlayCircle } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import styles from './HeroSection.module.scss';

export default function HeroSection({ locale }: { locale: string }) {
  const router = useRouter();

  return (
    <Box className={styles.heroSection}>
      <Container maxWidth="lg">
        <Box className={styles.heroContent}>
          <Box className={styles.heroText}>
          
            <Typography variant="h1" className={styles.heroTitle}>
              Maîtrisez le Développement Web & Mobile
            </Typography>
            <Typography className={styles.heroDescription}>
Investissez dans votre avenir avec des formations web et mobile de haute qualité.
Apprenez à créer des solutions modernes guidé par des experts.
            </Typography>
            <Box className={styles.heroButtons}>
              <button
                className={styles.heroPrimaryButton}
                onClick={() => router.push(`/${locale}#tarification`)}
              >
                <span>Commencer</span>
                <ArrowForward />
              </button>
              <button
                className={styles.heroSecondaryButton}
                onClick={() => router.push(`/${locale}/a-propos`)}
              >
                <PlayCircle />
                <span>En savoir plus</span>
              </button>
            </Box>
            <Box className={styles.heroStats}>
              <Box className={styles.stat}>
                <Typography className={styles.statNumber}>500+</Typography>
                <Typography className={styles.statLabel}>Formations</Typography>
              </Box>
              <Box className={styles.stat}>
                <Typography className={styles.statNumber}>10K+</Typography>
                <Typography className={styles.statLabel}>Exercices</Typography>
              </Box>
              <Box className={styles.stat}>
                <Typography className={styles.statNumber}>4.9/5</Typography>
                <Typography className={styles.statLabel}>Satisfaction</Typography>
              </Box>
            </Box>
          </Box>
          <Box className={styles.heroImage}>
            <img
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800"
              alt="Développement Web"
              className={styles.image}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
