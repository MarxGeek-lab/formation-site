'use client';

import { Box, Container, Typography, Card, CardContent, Avatar } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

// Import Swiper styles
import 'swiper/css';
// import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import Testimonial1 from '@/assets/images/testimonial-1.png';
import Testimonial2 from '@/assets/images/testimonial-2.jpg';
import Testimonial3 from '@/assets/images/testimonial-3.jpg';
import Testimonial4 from '@/assets/images/testimonial-4.jpg';

const testimonials = [
  {
    id: 1,
    name: "Josué D.",
    username: "@josue.d",
    textKey: "testimonial1",
    avatar: Testimonial1
  },
  {
    id: 2,
    name: "Positif D.",
    username: "@positif",
    textKey: "testimonial2",
    avatar: Testimonial2
  },
  {
    id: 3,
    name: "Julien B.",
    username: "@julienjulien",
    textKey: "testimonial3",
    avatar: Testimonial3
  },
  {
    id: 4,
    name: "Aminata",
    username: "@aminaaa",
    textKey: "testimonial4",
    avatar: Testimonial4
  },
  {
    id: 5,
    name: "Josué D.",
    username: "@josue.d",
    textKey: "testimonial1",
    avatar: Testimonial1
  },
  {
    id: 6,
    name: "Positif D.",
    username: "@positif",
    textKey: "testimonial2",
    avatar: Testimonial2
  },
  {
    id: 7,
    name: "Julien B.",
    username: "@julienjulien",
    textKey: "testimonial3",
    avatar: Testimonial3
  },
  {
    id: 8,
    name: "Aminata",
    username: "@aminaaa",
    textKey: "testimonial4",
    avatar: Testimonial4
  }
];

export default function TestimonialsSection() {
  const t = useTranslations('Testimonials');

  return (
    <Box 
      id="avis" 
      sx={{ 
        position: 'relative'
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="overline" 
            sx={{ 
              color: 'var(--primary)',
              fontWeight: 600,
              letterSpacing: 2,
              mb: 2,
              display: 'block'
            }}
            className='rafly-sub'
          >
            {t('subtitle')}
          </Typography>
          
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 700,
              my: 3,
              mx: 'auto',
              fontSize: { xs: '2rem', md: '3rem' },
              color: 'var(--text)'
            }}
            className='rafly-title'
          >
            {t('title')}
          </Typography>
          
          <Typography>
            {t('description')}
          </Typography>
        </Box>

        {/* Testimonials Carousel */}
        <Box sx={{ position: 'relative' }}>
          <Swiper
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
            }}
            
            speed={5000}
            freeMode={true}
            pagination={{
              clickable: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              1200: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
            }}
            loop={true}
            style={{
              paddingBottom: '50px',
              padding: '20px',
            }}
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <Card
                  sx={{
                    height: '280px',
                    minHeight: '200px',
                    
                    display: 'flex',
                    flexDirection: 'column',
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'var(--primary)',
                    boxShadow: '0 4px 20px rgba(95, 58, 252, 0.1)',
                    transition: 'all 0.3s ease',
                    background: 'var(--primary-subtle)', 
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(95, 58, 252, 0.15)'
                    },
                    flex: 1
                  }}
                >
                  <CardContent sx={{ 
                    p: 0, 
                    flex: 1,
                    '&:last-child': { pb: 0 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                    }}>
                    {/* Testimonial Text */}
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mb: 3,
                        lineHeight: 1.6,
                        color: 'var(--foreground)',
                        fontSize: 14
                      }}
                    >
                      "{t(`texts.${testimonial.textKey}`)}"
                    </Typography>

                    {/* User Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 50,
                          height: 50,
                          border: '2px solid var(--primary)'
                        }}
                      >
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          width={50}
                          height={50}
                          style={{ objectFit: 'cover' }}
                        />
                      </Avatar>
                      
                      <Box>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600,
                            mb: 0.5
                          }}
                        >
                          {testimonial.name}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'var(--primary)',
                            opacity: 0.8
                          }}
                        >
                          {testimonial.username}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Pagination Styles */}
          <style jsx global>{`
            .swiper-pagination {
              bottom: 10px !important;
            }
            .swiper-pagination-bullet {
              width: 12px !important;
              height: 12px !important;
              background: var(--primary) !important;
              opacity: 0.3 !important;
              transition: all 0.3s ease !important;
            }
            .swiper-pagination-bullet-active {
              opacity: 1 !important;
              transform: scale(1.2) !important;
            }
          `}</style>
        </Box>
      </Container>
    </Box>
  );
}
