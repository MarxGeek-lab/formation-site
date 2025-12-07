'use client';

import { Box, Container } from '@mui/material';
import { useTranslations } from 'next-intl';
import styles from './affiliation.module.scss';
import Grid from '@mui/material/Grid2';

import connexion from '@/assets/images/connexion-1.webp'
import programme from '@/assets/images/programme-de-parrainage.webp'
import marketing from '@/assets/images/le-marketing-daffiliation.webp'
import vector1 from '@/assets/images/Vector.png'

import Image from 'next/image';
import FAQSection from '@/components/FAQSection';
import { useRouter } from 'next/navigation';

export default function AffiliationPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const router = useRouter();
  const t = useTranslations('Affiliation');

  const gotToAffiliate = () => {
    router.push(`/${locale}/inscription-affiliate`)
  }

  return (
    <Box className={styles.affiliationPage}
    sx={{pb: 12}}>
      {/* Hero Section */}
      {/* <section className={styles.heroSection}> */}
        <Container maxWidth="lg" sx={{
            position: 'relative',
           
            }}>
          <div className={styles.heroContent} style={{
            position: 'relative',
            zIndex: 2
          }}>
            <div style={{
              position: 'absolute',
              top: '-80px',
              left: '-59%',
              width: '400px',
              height: '600px',
              backgroundImage: `url(${vector1.src})`,
              backgroundSize: 'contain',
              backgroundPosition: 'left top',
              backgroundRepeat: 'no-repeat',
              zIndex: 1,
              opacity: 0.8
            }} />
            <h1 className={styles.heroTitle}>
              {t('hero.title')} <span>{t('hero.titleHighlight')}</span>
            </h1>
            <p className={styles.heroDescription}>
              {t('hero.description')}
            </p>
            <button className={styles.ctaButton}
              onClick={gotToAffiliate}>
              {t('hero.ctaButton')}
            </button>
          </div>
          <div className={styles.heroDecorations}>
            <div className={styles.decorIcon1}>
              <svg width="16" height="25" viewBox="0 0 16 25" fill="none">
                <path d="M7.03781 24.4452L7.03781 0L8.59333 0L8.59333 24.4452H7.03781ZM11.1637 8.06883C11.0879 7.29855 10.7622 6.70016 10.1868 6.27364C9.61138 5.84712 8.83046 5.63386 7.84403 5.63386C7.17376 5.63386 6.60782 5.72935 6.14623 5.92033C5.68463 6.10494 5.33052 6.36276 5.08392 6.69379C4.84363 7.02482 4.72349 7.40041 4.72349 7.82056C4.71084 8.17069 4.78356 8.47625 4.94164 8.73726C5.10605 8.99826 5.33052 9.22425 5.61507 9.41523C5.89962 9.59984 6.22843 9.76217 6.6015 9.90223C6.97458 10.0359 7.37294 10.1505 7.7966 10.246L9.54183 10.6661C10.3891 10.8571 11.1669 11.1118 11.8751 11.4301C12.5833 11.7483 13.1967 12.1399 13.7152 12.6046C14.2337 13.0693 14.6352 13.6168 14.9198 14.247C15.2106 14.8772 15.3592 15.5997 15.3656 16.4146C15.3592 17.6114 15.0557 18.649 14.455 19.5275C13.8606 20.3997 13.0007 21.0776 11.8751 21.5614C10.7559 22.0389 9.40588 22.2776 7.82506 22.2776C6.25688 22.2776 4.89106 22.0357 3.72757 21.5519C2.57041 21.0681 1.66618 20.3519 1.01489 19.4034C0.369912 18.4485 0.0316164 17.2676 0 15.8607H3.97418C4.01844 16.5164 4.20498 17.0639 4.53379 17.5032C4.86892 17.936 5.31472 18.2639 5.87116 18.4867C6.43394 18.7031 7.06942 18.8114 7.77763 18.8114C8.47319 18.8114 9.07706 18.7095 9.58925 18.5058C10.1078 18.3021 10.5093 18.0188 10.7938 17.6559C11.0784 17.2931 11.2207 16.8761 11.2207 16.405C11.2207 15.9658 11.091 15.5966 10.8318 15.2974C10.5788 14.9982 10.2058 14.7435 9.71255 14.5334C9.22566 14.3234 8.62811 14.1324 7.91991 13.9605L5.80477 13.4258C4.16704 13.0247 2.87393 12.3977 1.92544 11.5446C0.976947 10.6916 0.505862 9.54255 0.512186 8.09748C0.505862 6.91341 0.818865 5.87895 1.45119 4.99408C2.08984 4.10922 2.96562 3.41851 4.07851 2.92197C5.19141 2.42542 6.45607 2.17715 7.87248 2.17715C9.31419 2.17715 10.5725 2.42542 11.6475 2.92197C12.7288 3.41851 13.5698 4.10922 14.1705 4.99408C14.7712 5.87895 15.081 6.90387 15.1 8.06883L11.1637 8.06883Z" fill="#5F3AFC"/>
              </svg>
            </div>
            <div className={styles.decorIcon2}>
              <svg width="15" height="20" viewBox="0 0 15 20" fill="none">
                <path d="M3.90989 19.3388L10.7468 0.795517L11.9268 1.23057L5.08986 19.7739L3.90989 19.3388ZM11.6199 8.07023C11.7778 7.4647 11.6981 6.91969 11.3809 6.43521C11.0637 5.95073 10.531 5.57055 9.78271 5.29466C9.27427 5.1072 8.81827 5.02135 8.4147 5.03712C8.01291 5.04806 7.67219 5.14459 7.39254 5.32673C7.11768 5.51063 6.9215 5.76194 6.80399 6.08065C6.69647 6.34271 6.66617 6.59484 6.71309 6.83704C6.7648 7.08101 6.87188 7.31522 7.03431 7.53968C7.19853 7.7593 7.40255 7.9744 7.64638 8.18498C7.89199 8.39074 8.16213 8.58908 8.4568 8.78L9.66316 9.58683C10.2525 9.96868 10.7713 10.3794 11.2195 10.8189C11.6677 11.2584 12.0234 11.7269 12.2868 12.2245C12.5501 12.722 12.7016 13.2496 12.7412 13.8073C12.7856 14.3667 12.6962 14.9563 12.4731 15.5762C12.1336 16.4823 11.6131 17.1845 10.9117 17.6829C10.2169 18.1783 9.37497 18.452 8.38586 18.5042C7.40332 18.5534 6.31247 18.3569 5.11332 17.9148C3.92375 17.4762 2.95534 16.9107 2.20808 16.2182C1.46561 15.5276 0.979991 14.7314 0.751227 13.8298C0.52904 12.925 0.602694 11.9346 0.972192 10.8586L3.98687 11.9701C3.83706 12.4799 3.82544 12.9473 3.95202 13.3725C4.08517 13.7946 4.33164 14.168 4.69142 14.4926C5.05779 14.8142 5.50958 15.074 6.0468 15.2721C6.57443 15.4666 7.061 15.5583 7.5065 15.547C7.9568 15.5375 8.34061 15.4349 8.65795 15.2392C8.97528 15.0436 9.19983 14.7671 9.33158 14.4097C9.45443 14.0765 9.45937 13.7602 9.34639 13.4607C9.2382 13.163 9.02642 12.8655 8.71104 12.5682C8.40045 12.2727 8.00058 11.9607 7.51144 11.6322L6.05652 10.635C4.92636 9.87272 4.12083 9.0354 3.63992 8.12304C3.159 7.21068 3.12303 6.20729 3.53199 5.11287C3.85836 4.21291 4.38511 3.51575 5.11226 3.02137C5.8442 2.52876 6.70172 2.24976 7.6848 2.18435C8.66788 2.11895 9.69664 2.28433 10.7711 2.68048C11.8647 3.0837 12.7498 3.62397 13.4264 4.30128C14.1077 4.98036 14.5525 5.73952 14.7607 6.57876C14.9689 7.418 14.9173 8.28212 14.6058 9.17113L11.6199 8.07023Z" fill="#01B966"/>
              </svg>
            </div>
            <div className={styles.decorIcon3}>
              <svg width="15" height="20" viewBox="0 0 15 20" fill="none">
              <path d="M7.03781 24.4452L7.03781 0L8.59333 0L8.59333 24.4452H7.03781ZM11.1637 8.06883C11.0879 7.29855 10.7622 6.70016 10.1868 6.27364C9.61138 5.84712 8.83046 5.63386 7.84403 5.63386C7.17376 5.63386 6.60782 5.72935 6.14623 5.92033C5.68463 6.10494 5.33052 6.36276 5.08392 6.69379C4.84363 7.02482 4.72349 7.40041 4.72349 7.82056C4.71084 8.17069 4.78356 8.47625 4.94164 8.73726C5.10605 8.99826 5.33052 9.22425 5.61507 9.41523C5.89962 9.59984 6.22843 9.76217 6.6015 9.90223C6.97458 10.0359 7.37294 10.1505 7.7966 10.246L9.54183 10.6661C10.3891 10.8571 11.1669 11.1118 11.8751 11.4301C12.5833 11.7483 13.1967 12.1399 13.7152 12.6046C14.2337 13.0693 14.6352 13.6168 14.9198 14.247C15.2106 14.8772 15.3592 15.5997 15.3656 16.4146C15.3592 17.6114 15.0557 18.649 14.455 19.5275C13.8606 20.3997 13.0007 21.0776 11.8751 21.5614C10.7559 22.0389 9.40588 22.2776 7.82506 22.2776C6.25688 22.2776 4.89106 22.0357 3.72757 21.5519C2.57041 21.0681 1.66618 20.3519 1.01489 19.4034C0.369912 18.4485 0.0316164 17.2676 0 15.8607H3.97418C4.01844 16.5164 4.20498 17.0639 4.53379 17.5032C4.86892 17.936 5.31472 18.2639 5.87116 18.4867C6.43394 18.7031 7.06942 18.8114 7.77763 18.8114C8.47319 18.8114 9.07706 18.7095 9.58925 18.5058C10.1078 18.3021 10.5093 18.0188 10.7938 17.6559C11.0784 17.2931 11.2207 16.8761 11.2207 16.405C11.2207 15.9658 11.091 15.5966 10.8318 15.2974C10.5788 14.9982 10.2058 14.7435 9.71255 14.5334C9.22566 14.3234 8.62811 14.1324 7.91991 13.9605L5.80477 13.4258C4.16704 13.0247 2.87393 12.3977 1.92544 11.5446C0.976947 10.6916 0.505862 9.54255 0.512186 8.09748C0.505862 6.91341 0.818865 5.87895 1.45119 4.99408C2.08984 4.10922 2.96562 3.41851 4.07851 2.92197C5.19141 2.42542 6.45607 2.17715 7.87248 2.17715C9.31419 2.17715 10.5725 2.42542 11.6475 2.92197C12.7288 3.41851 13.5698 4.10922 14.1705 4.99408C14.7712 5.87895 15.081 6.90387 15.1 8.06883L11.1637 8.06883Z" fill="#5F3AFC"/>
              </svg>
            </div>
          </div>
        </Container>
      {/* </section> */}

      {/* How it works Section */}
      <Container maxWidth="lg">
        <h2 className="titlePageSection">{t('howItWorks.title')}</h2>
        
        <Grid container spacing={4} sx={{px: {xs: 0, sm: 0, md: 20}}}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <div className={styles.stepCard}>
                <div className={styles.stepIcon}>
                <Image src={connexion} alt={t('howItWorks.steps.step1.title')} />
                </div>
                <h3 className={styles.stepTitle}>{t('howItWorks.steps.step1.title')}</h3>
                <p className={styles.stepDescription}>
                {t('howItWorks.steps.step1.description')}
                </p>
            </div>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <div className={styles.stepCard}>
                <div className={styles.stepIcon}>
                <Image src={programme} alt={t('howItWorks.steps.step2.title')} />
                </div>
                <h3 className={styles.stepTitle}>{t('howItWorks.steps.step2.title')}</h3>
                <p className={styles.stepDescription}>
                {t('howItWorks.steps.step2.description')}
                </p>
            </div>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <div className={styles.stepCard}>
                <div className={styles.stepIcon}>
                <Image src={marketing} alt={t('howItWorks.steps.step3.title')} />
                </div>
                <h3 className={styles.stepTitle}>{t('howItWorks.steps.step3.title')}</h3>
                <p className={styles.stepDescription}>
                {t('howItWorks.steps.step3.description')}
                </p>
            </div>
          </Grid>
        </Grid>
        
        <div className={styles.ctaCenter}>
          <button className={styles.ctaButton}
            onClick={gotToAffiliate}>
            {t('hero.ctaButton')}
          </button>
        </div>
      </Container>

      {/* What we provide Section */}
      <Container maxWidth="lg" className="">
        <h2 className="titlePageSection">
          {t('whatWeProvide.title')} <span>RAFLY</span> {t('whatWeProvide.titleSuffix')}
        </h2>
        
        <Grid container spacing={4} sx={{px: {xs: 0, sm: 0, md: 20}, mt: 6}}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                <svg width="16" height="25" viewBox="0 0 16 25" fill="none">
                    <path d="M7.03781 24.4452L7.03781 0L8.59333 0L8.59333 24.4452H7.03781ZM11.1637 8.06883C11.0879 7.29855 10.7622 6.70016 10.1868 6.27364C9.61138 5.84712 8.83046 5.63386 7.84403 5.63386C7.17376 5.63386 6.60782 5.72935 6.14623 5.92033C5.68463 6.10494 5.33052 6.36276 5.08392 6.69379C4.84363 7.02482 4.72349 7.40041 4.72349 7.82056C4.71084 8.17069 4.78356 8.47625 4.94164 8.73726C5.10605 8.99826 5.33052 9.22425 5.61507 9.41523C5.89962 9.59984 6.22843 9.76217 6.6015 9.90223C6.97458 10.0359 7.37294 10.1505 7.7966 10.246L9.54183 10.6661C10.3891 10.8571 11.1669 11.1118 11.8751 11.4301C12.5833 11.7483 13.1967 12.1399 13.7152 12.6046C14.2337 13.0693 14.6352 13.6168 14.9198 14.247C15.2106 14.8772 15.3592 15.5997 15.3656 16.4146C15.3592 17.6114 15.0557 18.649 14.455 19.5275C13.8606 20.3997 13.0007 21.0776 11.8751 21.5614C10.7559 22.0389 9.40588 22.2776 7.82506 22.2776C6.25688 22.2776 4.89106 22.0357 3.72757 21.5519C2.57041 21.0681 1.66618 20.3519 1.01489 19.4034C0.369912 18.4485 0.0316164 17.2676 0 15.8607H3.97418C4.01844 16.5164 4.20498 17.0639 4.53379 17.5032C4.86892 17.936 5.31472 18.2639 5.87116 18.4867C6.43394 18.7031 7.06942 18.8114 7.77763 18.8114C8.47319 18.8114 9.07706 18.7095 9.58925 18.5058C10.1078 18.3021 10.5093 18.0188 10.7938 17.6559C11.0784 17.2931 11.2207 16.8761 11.2207 16.405C11.2207 15.9658 11.091 15.5966 10.8318 15.2974C10.5788 14.9982 10.2058 14.7435 9.71255 14.5334C9.22566 14.3234 8.62811 14.1324 7.91991 13.9605L5.80477 13.4258C4.16704 13.0247 2.87393 12.3977 1.92544 11.5446C0.976947 10.6916 0.505862 9.54255 0.512186 8.09748C0.505862 6.91341 0.818865 5.87895 1.45119 4.99408C2.08984 4.10922 2.96562 3.41851 4.07851 2.92197C5.19141 2.42542 6.45607 2.17715 7.87248 2.17715C9.31419 2.17715 10.5725 2.42542 11.6475 2.92197C12.7288 3.41851 13.5698 4.10922 14.1705 4.99408C14.7712 5.87895 15.081 6.90387 15.1 8.06883L11.1637 8.06883Z" fill="#5F3AFC"/>
                </svg>
                </div>
                <h3 className={styles.featureTitle}>{t('whatWeProvide.features.feature1.title')}</h3>
                <p className={styles.featureDescription}>
                {t('whatWeProvide.features.feature1.description')}
                </p>
            </div>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6 }}>
            <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M13 21C13 21 20 22 23 25H24C24.5523 25 25 24.5523 25 24V17.937C25.8626 17.715 26.5 16.9319 26.5 16C26.5 15.0681 25.8626 14.285 25 14.063V8C25 7.44772 24.5523 7 24 7H23C20 10 13 11 13 11H9C7.89543 11 7 11.8954 7 13V19C7 20.1046 7.89543 21 9 21H10L11 26H13V21ZM15 12.6612C15.6833 12.5146 16.5275 12.3119 17.4393 12.0437C19.1175 11.5501 21.25 10.7726 23 9.57458V22.4254C21.25 21.2274 19.1175 20.4499 17.4393 19.9563C16.5275 19.6881 15.6833 19.4854 15 19.3388V12.6612ZM9 13H13V19H9V13Z" fill="#5F3AFC"/>
                </svg>
                </div>
                <h3 className={styles.featureTitle}>{t('whatWeProvide.features.feature2.title')}</h3>
                <p className={styles.featureDescription}>
                {t('whatWeProvide.features.feature2.description')}
                </p>
            </div>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6 }}>
            <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M17.2 26.8002V29.2002H14.8V26.8002H5.2C4.88174 26.8002 4.57652 26.6738 4.35147 26.4487C4.12643 26.2237 4 25.9185 4 25.6002V8.8002H28V25.6002C28 25.9185 27.8736 26.2237 27.6485 26.4487C27.4235 26.6738 27.1183 26.8002 26.8 26.8002H17.2ZM6.4 24.4002H25.6V11.2002H6.4V24.4002ZM17.2 13.6002H23.2V16.0002H17.2V13.6002ZM17.2 18.4002H23.2V20.8002H17.2V18.4002ZM12.4 13.6002V17.2002H16C16 17.9122 15.7889 18.6082 15.3933 19.2002C14.9977 19.7923 14.4355 20.2537 13.7777 20.5262C13.1198 20.7986 12.396 20.8699 11.6977 20.731C10.9993 20.5921 10.3579 20.2492 9.85442 19.7458C9.35095 19.2423 9.00808 18.6009 8.86917 17.9025C8.73027 17.2042 8.80156 16.4803 9.07403 15.8225C9.34651 15.1647 9.80793 14.6025 10.3999 14.2069C10.992 13.8113 11.688 13.6002 12.4 13.6002V13.6002ZM4 5.2002H28V7.6002H4V5.2002Z" fill="#5F3AFC"/>
                </svg>
                </div>
                <h3 className={styles.featureTitle}>{t('whatWeProvide.features.feature3.title')}</h3>
                <p className={styles.featureDescription}>
                {t('whatWeProvide.features.feature3.description')}
                </p>
            </div>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>          
            <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                <svg width="32" height="33" viewBox="0 0 32 33" fill="none">
                    <path d="M13.6 5.7002H18.4C20.9461 5.7002 23.3879 6.71162 25.1882 8.51197C26.9886 10.3123 28 12.7541 28 15.3002C28 17.8463 26.9886 20.2881 25.1882 22.0884C23.3879 23.8888 20.9461 24.9002 18.4 24.9002V29.1002C12.4 26.7002 4 23.1002 4 15.3002C4 12.7541 5.01143 10.3123 6.81178 8.51197C8.61212 6.71162 11.0539 5.7002 13.6 5.7002ZM16 22.5002H18.4C19.3455 22.5002 20.2818 22.314 21.1553 21.9521C22.0289 21.5903 22.8226 21.0599 23.4912 20.3914C24.1598 19.7228 24.6901 18.9291 25.0519 18.0555C25.4138 17.182 25.6 16.2457 25.6 15.3002C25.6 14.3547 25.4138 13.4184 25.0519 12.5449C24.6901 11.6713 24.1598 10.8776 23.4912 10.209C22.8226 9.54044 22.0289 9.0101 21.1553 8.64826C20.2818 8.28643 19.3455 8.1002 18.4 8.1002H16V22.5002Z" fill="#5F3AFC"/>
                </svg>
                </div>
                <h3 className={styles.featureTitle}>{t('whatWeProvide.features.feature4.title')}</h3>
                <p className={styles.featureDescription}>
                {t('whatWeProvide.features.feature4.description')}
                </p>
            </div>
          </Grid>
        </Grid>
      </Container>

      {/* Videos Section */}
      <Container maxWidth="lg">
        <h2 className="titlePageSection">{t('videos.title')}</h2>
        
        <Grid container spacing={4} sx={{ mt: 6, px: {xs: 2, sm: 6}}}>
          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
              <iframe
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                src="https://www.youtube.com/embed/xxi--lv3yZs"
                title="Video 1"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
              <iframe
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                src="https://www.youtube.com/embed/n1Y45CZMf6k"
                title="Video 2"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
              <iframe
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                src="https://www.youtube.com/embed/ZXStk9yjeFw"
                title="Video 3"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
              <iframe
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                src="https://www.youtube.com/embed/fIdNG5zv00c?si=5fHUTdSqh1kYFGqq"
                title="Video 3"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
              <iframe
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                src="https://www.youtube.com/embed/zezisDhK9zg?si=I1bb7iiJDWRcYW0k"
                title="Video 3"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </Grid>
        </Grid>
        
        <div className={styles.ctaCenter}>
          <button className={styles.ctaButton}
            onClick={gotToAffiliate}>
            {t('hero.ctaButton')}
          </button>
        </div>
      </Container>

      {/* FAQ Section */}
      <FAQSection />
    </Box>
  );
}