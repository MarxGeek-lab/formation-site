'use client';

import { Box, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@/hooks/useTheme';
import { useTranslations } from 'next-intl';
import styles from './about.module.scss';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import heroImg from '@/assets/images/aboutHeroImg.webp'
import img1 from '@/assets/images/Rectangle-53-2.webp'
import img2 from '@/assets/images/Rectangle-54-1.webp'
import img3 from '@/assets/images/Rectangle-53-3.webp'
import img4 from '@/assets/images/Rectangle-55.webp'
import img5 from '@/assets/images/WhatsApp-Image-2025-08-10-at-05.47.12.webp'
import profil from '@/assets/images/WhatsApp-Image-2025-02-14-scaled-e1739523690677-768x768.jpg'
import logo from '@/assets/images/Elearn_Market-removebg-preview-150x150.webp'
import logo2 from '@/assets/images/Logo-02-removebg-preview-150x150.webp'
import logo3 from '@/assets/images/logo_DigiBoost-Store-removebg-preview-150x150.webp'
import logo4 from '@/assets/images/LOGO-New-devant-1-150x150.webp'
import logo5 from '@/assets/images/b9e9ef1d-907b-4127-b281-0c6ae4128b8b-150x150.webp'
import logo6 from '@/assets/images/e11a9ec6-85ae-473c-a352-b759288d3cf4-150x150.webp'

import Image from 'next/image';
import TeamSection from '@/components/TeamSection';

// Testimonial data structure - content will come from translations
const getTestimonials = (t: any) => [
  {
    image: "/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-10-at-05.47.12.jpeg",
    company: "Rafly",
    description: t('testimonials.testimonial1.description'),
    mission: t('testimonials.testimonial1.mission'),
    avatar: "/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-14-scaled-e1739523690677.jpg",
    clientName: t('testimonials.testimonial1.clientName'),
    result: t('testimonials.testimonial1.result'),
    period: t('testimonials.testimonial1.period')
  }
];

// Client logos data
const clientLogos = [
  logo,
  logo2,
  logo3,
  logo4,
  logo5,
  logo6
];

export default function AboutPage() {
  const { theme } = useTheme();
  const t = useTranslations('About');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = getTestimonials(t);
  
  const changeTestimonial = (direction: number) => {
    setCurrentTestimonial(prev => {
      const newIndex = prev + direction;
      if (newIndex >= testimonials.length) return 0;
      if (newIndex < 0) return testimonials.length - 1;
      return newIndex;
    });
  };

  const testimonial = testimonials[currentTestimonial];

  return (
    <div className={styles.aboutPage}>

        <Container maxWidth="lg">
            <Grid container spacing={4} sx={{
                alignItems: 'center',
                px: {xs: 0, sm: 6}
            }}>
                <Grid size={{ xs: 12, sm: 12, md: 6 }} justifyContent="center" alignItems={'center'}>
                    <Typography className={'titlePageSection'} sx={{
                        textAlign: {xs: 'center', sm: 'center', md: 'left'}
                    }}>
                        {t('hero.title')}
                    </Typography>
                    <Typography sx={{textAlign: {xs: 'center', sm: 'left'}}}>
                        {t('hero.description')}
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                    <div className={styles.heroImage}>
                        <Image 
                        src={heroImg} 
                        alt="Rafly Platform" 
                        width={485}
                        height={486}
                        />
                    </div>
                </Grid>
            </Grid>
        </Container>

        <Container maxWidth="lg">
          <h2 className={'titlePageSection'}>
            {t('whatIsRafly.title')}
          </h2>
          <p className={`${styles.heroDescription} ${theme === 'light' ? styles.light : styles.dark}`}>
            {t('whatIsRafly.description')}
          </p>

          {/* Problem Cards */}
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <div className={styles.problemCard}>
              <Image 
                src={img1} 
                alt="Scrolling Facebook"
                width={259}
                height={417}
              />
              <p className={theme === 'light' ? styles.light : styles.dark}>
                {t('problems.problem1')}
              </p>
            </div>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <div className={styles.problemCard}>
              <Image 
                src={img2} 
                alt="Finding products and designers"
                width={263}
                height={420}
              />
              <p className={theme === 'light' ? styles.light : styles.dark}>
                {t('problems.problem2')}
              </p>
            </div>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <div className={styles.problemCard}>
              <Image 
                src={img3} 
                alt="Waiting for visuals"
                width={259}
                height={417}
              />
              <p className={theme === 'light' ? styles.light : styles.dark}>
                {t('problems.problem3')}
              </p>
            </div>
            </Grid>
          </Grid>
        </Container>

        <Container maxWidth="lg">
            <div className={'rafly-sub'}>
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.4611 0V3.17372H10.5391V0H9.461H9.4611ZM5.05927 0.95375L4.17607 1.57213L5.99612 4.17123L6.87884 3.55283L5.05927 0.95375ZM14.9407 0.95375L13.1212 3.55285L14.004 4.17125L15.8241 1.57213L14.9409 0.95375H14.9407ZM9.99987 4.04207C7.36275 4.04207 5.22499 5.64345 5.22499 7.61915L7.93785 15.835H12.0624L14.775 7.61915C14.775 5.64348 12.6374 4.04207 10.0001 4.04207H9.99987ZM1.42447 4.99455L1.05615 6.00812L4.03697 7.09335L4.40665 6.08027L1.4244 4.99455H1.42447ZM18.5755 4.99455L15.5932 6.08035L15.9617 7.09355L18.9439 6.00813L18.5755 4.99455ZM4.26265 9.62802L1.19765 10.4501L1.47575 11.4906L4.54075 10.6697L4.2627 9.62802H4.26265ZM15.7373 9.62802L15.4594 10.6697L18.5244 11.4905L18.8023 10.45L15.7373 9.62798V9.62802ZM7.87772 16.4339V17.862H12.1225V16.4341H7.87774L7.87772 16.4339ZM7.87772 18.5719V20H12.1225V18.5721H7.87774L7.87772 18.5719Z" />
            </svg>
            <span>{t('problems.summary')}</span>
          </div>

          <Typography className='titlePageSection' 
            sx={{
              my: 3,
              px: {xs: 0, sm: 8}
            }}>
            {t('solution.intro')} 
            <span style={{ fontFamily: 'Alkatra, cursive' }}>
              {t('solution.idea')}
            </span>
          </Typography>
          <Grid container spacing={4} sx={{mt: 7, px: {xs: 0, sm: 6}}}>
            <Grid size={{ xs: 12, sm: 6 }}>
                <Image 
                    src={img4}
                    alt="Rafly Solution"
                    width={518}
                    height={366}
                />
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
                <div className={styles.solutionText}>
                <p className={styles.solutionDescription}>
                    {t('solution.description')}
                </p>
                <p className={styles.solutionDescription}>
                    <em>{t('solution.mission')}</em>
                </p>
                <p className={styles.solutionDescription}>
                    {t('solution.intro2')}
                </p>

                <ul className={styles.checkList}>
                    <li>
                    <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className={styles.solutionDescription}>
                        {t('solution.features.feature1')}
                    </span>
                    </li>
                    <li>
                    <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className={styles.solutionDescription}>
                        {t('solution.features.feature2')}
                    </span>
                    </li>
                    <li>
                    <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className={styles.solutionDescription}>
                        {t('solution.features.feature3')}
                    </span>
                    </li>
                    <li>
                    <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className={styles.solutionDescription}>
                        {t('solution.features.feature4')}
                    </span>
                    </li>
                </ul>
                </div>
            </Grid>
          </Grid>
        </Container>
   
        <Container maxWidth="lg"> 
          <Grid container spacing={{xs: 0, sm: 4}} sx={{px: {xs: 0, sm: 0, md: 6}}}>
            <Grid size={{ xs: 12, md: 6 }}>
              <div className={styles.testimonialImage}>
                <Image 
                  src={img5}
                  alt="Client testimonial"
                  width={500}
                  height={400}
                />
              </div>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <h2 className={'titlePageSection'} style={{ 
                color: 'white', 
                marginBottom: '3rem',
                textAlign: 'left'
                }}>
                {t('testimonials.title')}
              </h2>
              <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '2rem',
              }}>
                {/* <div className={styles.navigationSection}>
                    <button 
                    className={styles.navBtn}
                    onClick={() => changeTestimonial(-1)}
                    aria-label="Previous testimonial"
                    >
                    <svg viewBox="0 0 24 24" fill="none">
                        <path
                        d="M18 15L12 9L6 15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        />
                    </svg>
                    </button>

                    <button 
                    className={styles.navBtn}
                    onClick={() => changeTestimonial(1)}
                    aria-label="Next testimonial"
                    >
                    <svg viewBox="0 0 24 24" fill="none">
                        <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        />
                    </svg>
                    </button>
                </div> */}

                <div className={styles.testimonialText}>
                    <div className={styles.companyBadge}>
                    {testimonial.company}
                    </div>
                    <p>{testimonial.description}</p>
                    <Box className={styles.missionQuote} sx={{
                        my: 2
                    }}>
                        <p>"{testimonial.mission}"</p>
                    </Box>

                    <Box className={styles.clientInfo} sx={{}}>
                        <div className={styles.clientAvatar}>
                            <Image 
                            src={profil}
                            alt="Client avatar"
                            width={50}
                            height={50}
                            />
                        </div>
                        <span className={styles.clientName}>{testimonial.clientName}</span>
                    </Box>

                    <Box className={styles.results}>
                        <span className={styles.amount}>{testimonial.result}</span>
                        <span className={styles.period}>{testimonial.period}</span>
                    </Box>
                </div>
              </Box>
            </Grid>
          </Grid>
        </Container>

      <TeamSection />

      {/* CTA Section */}
        <Container maxWidth="lg">
          <div className={styles.ctaContent}>
            <h2 className={'titlePageSection'}>
              {t('cta.title')}
            </h2>
            <p className={styles.sectionDescription}>
              {t('cta.description')}
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.ctaPrimaryBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {t('cta.primaryButton')}
              </button>
              <button className={styles.ctaSecondaryBtn}>
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="16" viewBox="0 0 21 16" fill="none">
                  <path d="M4.84279 0.858486C4.93576 0.951359 5.00952 1.06165 5.05984 1.18305C5.11017 1.30444 5.13607 1.43457 5.13607 1.56599C5.13607 1.6974 5.11017 1.82753 5.05984 1.94893C5.00952 2.07032 4.93576 2.18061 4.84279 2.27349C3.34222 3.7743 2.49924 5.80969 2.49924 7.93199C2.49924 10.0543 3.34222 12.0897 4.84279 13.5905C4.9383 13.6827 5.01448 13.7931 5.06689 13.9151C5.1193 14.0371 5.14688 14.1683 5.14804 14.3011C5.14919 14.4339 5.12389 14.5655 5.07361 14.6884C5.02333 14.8113 4.94907 14.923 4.85518 15.0169C4.76129 15.1108 4.64964 15.185 4.52674 15.2353C4.40384 15.2856 4.27216 15.3109 4.13938 15.3097C4.0066 15.3086 3.87538 15.281 3.75338 15.2286C3.63138 15.1762 3.52103 15.1 3.42879 15.0045C-0.478215 11.0985 -0.478215 4.76449 3.42879 0.858486C3.61631 0.671015 3.87062 0.5657 4.13579 0.5657C4.40095 0.5657 4.65526 0.671015 4.84279 0.858486ZM17.5748 0.858486C21.4808 4.76549 21.4808 11.0985 17.5748 15.0045C17.3873 15.1921 17.1329 15.2976 16.8676 15.2977C16.6024 15.2978 16.3479 15.1925 16.1603 15.005C15.9726 14.8175 15.8672 14.5631 15.8671 14.2978C15.867 14.0326 15.9723 13.7781 16.1598 13.5905C17.6603 12.0897 18.5033 10.0543 18.5033 7.93199C18.5033 5.80969 17.6603 3.7743 16.1598 2.27349C15.9721 2.08585 15.8667 1.83135 15.8667 1.56599C15.8667 1.30062 15.9721 1.04613 16.1598 0.858486C16.3474 0.670846 16.6019 0.56543 16.8673 0.56543C17.1326 0.56543 17.3871 0.670846 17.5748 0.858486ZM7.80979 3.73249C7.99726 3.92001 8.10257 4.17432 8.10257 4.43949C8.10257 4.70465 7.99726 4.95896 7.80979 5.14649C7.44574 5.5105 7.15696 5.94265 6.95993 6.41827C6.76291 6.8939 6.6615 7.40367 6.6615 7.91849C6.6615 8.4333 6.76291 8.94308 6.95993 9.4187C7.15696 9.89432 7.44574 10.3265 7.80979 10.6905C7.90263 10.7834 7.97627 10.8937 8.02649 11.0151C8.07671 11.1364 8.10253 11.2665 8.10249 11.3978C8.10244 11.5292 8.07652 11.6592 8.02622 11.7806C7.97591 11.9019 7.9022 12.0121 7.80929 12.105C7.71637 12.1978 7.60609 12.2715 7.48472 12.3217C7.36335 12.3719 7.23328 12.3977 7.10193 12.3977C6.97058 12.3976 6.84053 12.3717 6.7192 12.3214C6.59787 12.2711 6.48763 12.1974 6.39479 12.1045C5.28461 10.9943 4.66093 9.48853 4.66093 7.91849C4.66093 6.34844 5.28461 4.8427 6.39479 3.73249C6.48766 3.63951 6.59795 3.56575 6.71935 3.51543C6.84074 3.4651 6.97087 3.4392 7.10229 3.4392C7.2337 3.4392 7.36383 3.4651 7.48523 3.51543C7.60662 3.56575 7.71691 3.63951 7.80979 3.73249ZM14.7678 3.73249C15.878 4.8427 16.5016 6.34844 16.5016 7.91849C16.5016 9.48853 15.878 10.9943 14.7678 12.1045C14.5792 12.2866 14.3266 12.3874 14.0644 12.3852C13.8022 12.3829 13.5514 12.2777 13.366 12.0923C13.1806 11.9069 13.0754 11.6561 13.0731 11.3939C13.0708 11.1317 13.1716 10.8791 13.3538 10.6905C13.7178 10.3265 14.0066 9.89432 14.2036 9.4187C14.4007 8.94308 14.5021 8.4333 14.5021 7.91849C14.5021 7.40367 14.4007 6.8939 14.2036 6.41827C14.0066 5.94265 13.7178 5.5105 13.3538 5.14649C13.1716 4.95788 13.0708 4.70528 13.0731 4.44309C13.0754 4.18089 13.1806 3.93008 13.366 3.74467C13.5514 3.55926 13.8022 3.45409 14.0644 3.45181C14.3266 3.44953 14.5792 3.55033 14.7678 3.73249ZM10.5818 6.50249C10.9796 6.50249 11.3611 6.66052 11.6424 6.94183C11.9237 7.22313 12.0818 7.60466 12.0818 8.00249C12.0818 8.40031 11.9237 8.78184 11.6424 9.06315C11.3611 9.34445 10.9796 9.50249 10.5818 9.50249C10.184 9.50249 9.80243 9.34445 9.52112 9.06315C9.23982 8.78184 9.08179 8.40031 9.08179 8.00249C9.08179 7.60466 9.23982 7.22313 9.52112 6.94183C9.80243 6.66052 10.184 6.50249 10.5818 6.50249Z" fill="#ECEFFF"/>
                </svg>
                {t('cta.secondaryButton')}
              </button>
            </div>
          </div>
        </Container>
    </div>
  );
}