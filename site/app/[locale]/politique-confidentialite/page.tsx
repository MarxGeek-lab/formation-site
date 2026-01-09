'use client';

import { Box, Container, Typography } from '@mui/material';
import { useTheme } from '@/hooks/useTheme';
import { useTranslations } from 'next-intl';
import styles from './politique.module.scss';

export default function PolitiqueConfidentialitePage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const { theme } = useTheme();
  const t = useTranslations('PrivacyPolicy');

  return (
    <Box sx={{
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden',
      py: 4
    }}>
      <Container maxWidth="lg" sx={{
        px: { xs: 2, sm: 3, md: 4 }
      }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" sx={{
            fontSize: { xs: '1.8rem', md: '2.5rem' },
            fontWeight: 700,
            color: 'var(--foreground)',
            mb: 2,
            mx: 'auto'
          }} className={'titlePageSection'}>
            {t('title')}
          </Typography>
          <Typography variant="body1" sx={{
            color: 'var(--muted-foreground)',
            maxWidth: '600px',
            mx: 'auto'
          }}>
            {t('subtitle')}
          </Typography>
        </Box>

        <Box className={styles.policyContent}>
          {/* Section 1 */}
          <section className={styles.section}>
            <Typography variant="h4" className={styles.sectionTitle}>
              {t('sections.section1.title')}
            </Typography>
            <div className={styles.sectionContent}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {t('sections.section1.paragraph1')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {t('sections.section1.paragraph2')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {t('sections.section1.paragraph3')}
              </Typography>
              <Typography variant="body1">
                {t('sections.section1.paragraph4')}
              </Typography>
            </div>
          </section>

          {/* Section 2 */}
          <section className={styles.section}>
            <Typography variant="h4" className={styles.sectionTitle}>
              {t('sections.section2.title')}
            </Typography>
            <div className={styles.sectionContent}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {t('sections.section2.paragraph1')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {t('sections.section2.paragraph2')}
              </Typography>
              <Typography variant="body1">
                {t('sections.section2.paragraph3')}
              </Typography>
            </div>
          </section>

          {/* Section 3 */}
          <section className={styles.section}>
            <Typography variant="h4" className={styles.sectionTitle}>
              {t('sections.section3.title')}
            </Typography>
            <div className={styles.sectionContent}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {t('sections.section3.paragraph1')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {t('sections.section3.paragraph2')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {t('sections.section3.paragraph3')}
              </Typography>
              <Typography variant="body1">
                {t('sections.section3.paragraph4')}
              </Typography>
            </div>
          </section>

          {/* Section 4 */}
          <section className={styles.section}>
            <Typography variant="h4" className={styles.sectionTitle}>
              {t('sections.section4.title')}
            </Typography>
            <div className={styles.sectionContent}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {t('sections.section4.paragraph1')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {t('sections.section4.paragraph2')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {t('sections.section4.paragraph3')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {t('sections.section4.paragraph4')}
              </Typography>
              <Typography variant="body1">
                {t('sections.section4.paragraph5')}
              </Typography>
            </div>
          </section>

          {/* Section 5 */}
          <section className={styles.section}>
            <Typography variant="h4" className={styles.sectionTitle}>
              {t('sections.section5.title')}
            </Typography>
            <div className={styles.sectionContent}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {t('sections.section5.paragraph1')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {t('sections.section5.paragraph2')}
              </Typography>
              <Typography variant="body1">
                {t('sections.section5.paragraph3')}
              </Typography>
            </div>
          </section>

          {/* Section 6 */}
          <section className={styles.section}>
            <Typography variant="h4" className={styles.sectionTitle}>
              {t('sections.section6.title')}
            </Typography>
            <div className={styles.sectionContent}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {t('sections.section6.paragraph1')}
              </Typography>
              <Typography variant="body1">
                {t('sections.section6.paragraph2')}
              </Typography>
            </div>
          </section>

          {/* Section 7 */}
          <section className={styles.section}>
            <Typography variant="h4" className={styles.sectionTitle}>
              {t('sections.section7.title')}
            </Typography>
            <div className={styles.sectionContent}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {t('sections.section7.paragraph1')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {t('sections.section7.paragraph2')}
              </Typography>
              <Typography variant="body1">
                {t('sections.section7.paragraph3')}
              </Typography>
            </div>
          </section>

          {/* Section 8 */}
          <section className={styles.section}>
            <Typography variant="h4" className={styles.sectionTitle}>
              {t('sections.section8.title')}
            </Typography>
            <div className={styles.sectionContent}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {t('sections.section8.paragraph1')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {t('sections.section8.paragraph2')}
              </Typography>
              <Typography variant="body1">
                {t('sections.section8.paragraph3')}
              </Typography>
            </div>
          </section>

          {/* Contact Section */}
          <section className={styles.contactSectionss}>
            <Typography variant="h4" className={styles.sectionTitle}>
              {t('contact.title')}
            </Typography>
            <div className={styles.sectionContent}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {t('contact.description')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>{t('contact.email')}:</strong> mgangbala610@gmail.com
              </Typography>
              <Typography variant="body2" sx={{ 
                color: 'var(--muted-foreground)',
                fontStyle: 'italic',
                mt: 3
              }}>
                {t('contact.lastUpdated')}: {new Date().toLocaleDateString('fr-FR')}
              </Typography>
            </div>
          </section>
        </Box>
      </Container>
    </Box>
  );
}
