'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from '@/hooks/useTheme';
import styles from './about.module.scss';
import Image from 'next/image';
import { Container, Grid2, Box } from '@mui/material';
import {
  CheckCircle,
  Rocket,
  ArrowForward,
  Star,
  TrendingUp,
  People
} from '@mui/icons-material';
import Link from 'next/link';

export default function AboutPage() {
  const t = useTranslations('About');
  const { theme } = useTheme();

  const values = [
    {
      icon: <Rocket />,
      title: t('values.excellence.title'),
      description: t('values.excellence.description'),
    },
    {
      icon: <People />,
      title: t('values.accessibility.title'),
      description: t('values.accessibility.description'),
    },
    {
      icon: <TrendingUp />,
      title: t('values.innovation.title'),
      description: t('values.innovation.description'),
    },
  ];

  const stats = [
    { number: '12+', label: t('stats.formations') },
    { number: '500+', label: t('stats.students') },
    { number: '98%', label: t('stats.satisfaction') },
    { number: '24/7', label: t('stats.support') },
  ];

  return (
    <div className={styles.aboutPage}>
      {/* Hero Section */}
      <section className={`${styles.heroSection} ${theme === 'dark' ? styles.dark : styles.light}`}>
        <Container maxWidth="lg">
          <Grid2 container spacing={4} alignItems="center">
            <Grid2 size={{ xs: 12, md: 6 }}>
              <h1 className="heroTitle" style={{textAlign: "left"}}>{t('hero.title')}</h1>
              <p className={`${styles.heroDescription} ${theme === 'dark' ? styles.dark : styles.light}`}>
                {t('hero.description')}
              </p>
              <Box className={styles.iconList}>
                <Star />
                <span>{t('hero.badge')}</span>
              </Box>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <div className={styles.heroImage}>
                <Image
                  src="/images/about-hero.svg"
                  alt="About MarxGeek Academy"
                  width={500}
                  height={400}
                  className={styles.heroImg}
                />
              </div>
            </Grid2>
          </Grid2>
        </Container>
      </section>

      {/* Mission Section */}
      <section>
        <Container maxWidth="lg">
          <h2 className={"heroTitle"} style={{textAlign: "center"}}>{t('mission.title')}</h2>
          <p className={`${styles.sectionDescription} ${theme === 'dark' ? styles.dark : styles.light}`}>
            {t('mission.description')}
          </p>

          <div className={styles.problemCards}>
            <div className={styles.problemCard}>
              <Image
                src="/images/mission-1.svg"
                alt="Formation de qualit�"
                width={250}
                height={350}
              />
              <p className={theme === 'dark' ? styles.dark : styles.light}>
                {t('mission.card1')}
              </p>
            </div>
            <div className={styles.problemCard}>
              <Image
                src="/images/mission-2.svg"
                alt="Apprentissage pratique"
                width={250}
                height={350}
              />
              <p className={theme === 'dark' ? styles.dark : styles.light}>
                {t('mission.card2')}
              </p>
            </div>
            <div className={styles.problemCard}>
              <Image
                src="/images/mission-3.svg"
                alt="Accompagnement personnalis�"
                width={250}
                height={350}
              />
              <p className={theme === 'dark' ? styles.dark : styles.light}>
                {t('mission.card3')}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Values Section */}
      <section>
        <Container maxWidth="lg">
          <h2 className={"heroTitle"} style={{textAlign: "center"}}>{t('values.title')}</h2>
          <p className={`${styles.sectionDescription} ${theme === 'dark' ? styles.dark : styles.light}`}>
            {t('values.description')}
          </p>

          <Grid2 container spacing={4} sx={{ marginTop: 4 }}>
            {values.map((value, index) => (
              <Grid2 size={{ xs: 12, md: 4 }} key={index}>
                <div className={styles.problemCard}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(250, 0, 63, 0.1) 0%, rgba(199, 0, 50, 0.05) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FA003F',
                      marginBottom: 2,
                    }}
                  >
                    {value.icon}
                  </Box>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--foreground)' }}>
                    {value.title}
                  </h3>
                  <p className={theme === 'dark' ? styles.dark : styles.light}>
                    {value.description}
                  </p>
                </div>
              </Grid2>
            ))}
          </Grid2>
        </Container>
      </section>
    </div>
  );
}
