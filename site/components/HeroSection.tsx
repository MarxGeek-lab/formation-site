"use client";

import { Box, Container, Typography, Chip } from '@mui/material';
import { ArrowForward, PlayCircle, WhatsApp, CheckCircle } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import styles from './HeroSection.module.scss';

export default function HeroSection({ locale }: { locale: string }) {
  const router = useRouter();

  return (
    <Box className={styles.heroSection}>
      <Container maxWidth="lg">
        <Box className={styles.heroContent}>
          <Box className={styles.heroText}>

            {/* Badge WhatsApp en haut */}
            <Chip
              icon={<WhatsApp sx={{ fontSize: 20 }} />}
              label="Suivi personnalisé par WhatsApp inclus"
              sx={{
                mb: 2,
                background: 'linear-gradient(135deg, #25D366 0%, #1DA851 100%)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.9rem',
                py: 2.5,
                px: 1,
                '& .MuiChip-icon': {
                  color: 'white',
                },
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': {
                    transform: 'scale(1)',
                  },
                  '50%': {
                    transform: 'scale(1.05)',
                  },
                },
              }}
            />

            <Typography variant="h1" className={styles.heroTitle}>
              Maîtrisez le Développement Web & Mobile
            </Typography>
            <Typography className={styles.heroDescription}>
Investissez dans votre avenir avec des formations web et mobile de haute qualité.
Apprenez à créer des solutions modernes guidé par des experts.
            </Typography>

            {/* Points clés avec WhatsApp */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3, mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle sx={{ color: '#10B981', fontSize: 20 }} />
                <Typography sx={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)' }}>
                  Accompagnement personnalisé par WhatsApp 24/7
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle sx={{ color: '#10B981', fontSize: 20 }} />
                <Typography sx={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)' }}>
                  Réponses rapides à vos questions
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle sx={{ color: '#10B981', fontSize: 20 }} />
                <Typography sx={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)' }}>
                  Support technique inclus dans chaque formation
                </Typography>
              </Box>
            </Box>
            <Box className={styles.heroButtons}>
              <button
                className={styles.heroPrimaryButton}
                onClick={() => router.push(`/${locale}#formations`)}
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
                <Typography className={styles.statNumber}>20+</Typography>
                <Typography className={styles.statLabel}>Formations</Typography>
              </Box>
              <Box className={styles.stat}>
                <Typography className={styles.statNumber}>50+</Typography>
                <Typography className={styles.statLabel}>Exercices</Typography>
              </Box>
              {/* <Box className={styles.stat}>
                <Typography className={styles.statNumber}>4.9/5</Typography>
                <Typography className={styles.statLabel}>Satisfaction</Typography>
              </Box> */}
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
