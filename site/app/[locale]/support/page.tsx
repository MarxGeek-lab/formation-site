'use client';

import { Box, Container } from '@mui/material';
import { useTheme } from '@/hooks/useTheme';
import { useTranslations } from 'next-intl';
import styles from './support.module.scss';
import Grid from '@mui/material/Grid2';
import Image from 'next/image';
import FAQSection from '@/components/FAQSection';

import support from '@/assets/images/suport-1.webp'
import support2 from '@/assets/images/suport-2.webp'
import support3 from '@/assets/images/suport-3.webp'
import users from '@/assets/images/Frame-12-1.png'

import Miguel from '@/assets/images/miguel-ose.png';
import Gloriel from '@/assets/images/gloriel-dossou.jpg';
import Cresus from '@/assets/images/cresus-olatunde.jpg';
import Cre from '@/assets/images/Design-sans-titre-16.webp'

export default function SupportPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const { theme } = useTheme();
  const t = useTranslations('Support');

  return (
    <Box className={styles.supportPage}>

      {/* Support Cards Section */}
      <Container maxWidth="lg">
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className="rafly-title">{t('hero.title')}</h1>
            <p className={styles.heroDescription}>
              {t('hero.description')}
            </p>
          </div>
        </div>
        <Grid container spacing={4} sx={{ px: { xs: 2, md: 6 } }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <div className={styles.supportCard}>
              <div className={styles.supportIcon}>
                <Image src={support} alt={t('supportCards.client.title')} width={84} height={83} />
              </div>
              <h3 className={styles.supportTitle}>{t('supportCards.client.title')}</h3>
              <p className={styles.supportDescription}>
                {t('supportCards.client.description')}
              </p>
              <button className={styles.supportButton}>
                <a href="https://wa.me/22941559913" target="_blank" rel="noopener noreferrer">
                  {t('supportCards.contactButton')}
                </a>
              </button>
            </div>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <div className={styles.supportCard}>
              <div className={styles.supportIcon}>
                <Image src={support2} alt={t('supportCards.technical.title')} width={80} height={82} />
              </div>
              <h3 className={styles.supportTitle}>{t('supportCards.technical.title')}</h3>
              <p className={styles.supportDescription}>
                {t('supportCards.technical.description')}
              </p>
              <button className={styles.supportButton}>
                <a href="https://wa.me/22941559913" target="_blank" rel="noopener noreferrer">
                  {t('supportCards.contactButton')}
                </a>
              </button>
            </div>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <div className={styles.supportCard}>
              <div className={styles.supportIcon}>
                <Image src={support3} alt={t('supportCards.designer.title')} width={80} height={82} />
              </div>
              <h3 className={styles.supportTitle}>{t('supportCards.designer.title')}</h3>
              <p className={styles.supportDescription}>
                {t('supportCards.designer.description')}
              </p>
              <button className={styles.supportButton}>
                <a href="https://wa.me/22941559913" target="_blank" rel="noopener noreferrer">
                  {t('supportCards.contactButton')}
                </a>
              </button>
            </div>
          </Grid>
        </Grid>
      </Container>

      {/* Team Section */}
      <Container maxWidth="lg">
        <div className={styles.teamSection}>
          <div className={styles.teamImages}>
            <div className={styles.teamMember}>
              <Image 
                src={Cresus} 
                alt="Team member" 
                width={120} 
                height={120}
                className={styles.teamImage}
              />
            </div>
            <div className={styles.teamMember}>
              <Image 
                src={Miguel} 
                alt="Team member" 
                width={120} 
                height={120}
                className={styles.teamImage}
              />
            </div>
            <div className={styles.teamMember}>
              <Image 
                src={Gloriel} 
                alt="Team member" 
                width={120} 
                height={120}
                className={styles.teamImage}
              />
            </div>
            <div className={styles.teamMember}>
              <Image 
                src={Cre} 
                alt="Team member" 
                width={120} 
                height={120}
                className={styles.teamImage}
              />
            </div>
          </div>
          <p className={styles.teamContact}>
            {t('team.contactText')} <a href="mailto:contact@rafly.me">contact@rafly.me</a>
          </p>
        </div>
      </Container>

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{px: {xs: 2, sm: 6}, mb: 8}}>
        <div className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <h3 className={styles.ctaTitle}>
              {t('cta.title')} <span>{t('cta.titleHighlight')}</span>
            </h3>
            <p className={styles.ctaDescription}>
              {t('cta.description')}
            </p>
            <div className={styles.ctaButtons}>
              <a href={`/${locale}#tarification`} className={styles.ctaButtonPrimary}>
                {t('cta.primaryButton')}
              </a>
              <a href={`/${locale}/catalogue`} className={styles.ctaButtonSecondary}>
                {t('cta.secondaryButton')}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </Box>
  );
}