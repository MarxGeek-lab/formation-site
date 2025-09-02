'use client';

import { Box, Container, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Grid from '@mui/material/Grid2';

import Miguel from '@/assets/images/miguel-ose.png';
import Gloriel from '@/assets/images/gloriel-dossou.jpg';
import Cresus from '@/assets/images/cresus-olatunde.jpg';

import motif from '@/assets/images/gradient-line-768x215.png'

const teamMembers = [
  {
    id: 1,
    name: "Miguel Osé",
    roleKey: "graphicDesigner",
    image: Miguel
  },
  {
    id: 2,
    name: "Gloriel DOSSOU",
    roleKey: "graphicDesigner", 
    image: Gloriel
  },
  {
    id: 3,
    name: "Cresus OLATUNDE",
    roleKey: "graphicDesigner",
    image: Cresus
  }
];

export default function TeamSection() {
  const t = useTranslations('Team');

  return (
    <Box 
      id="equipe" 
      sx={{ 
        backgroundColor: 'var(--background)',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: `url(${motif.src})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
      }}
    >
      {/* Gradient Line Decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '640px',
          height: '179px',
          opacity: 0.3,
          zIndex: 0
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
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
            className='rafly-title'
            sx={{mx: 'auto', my: 3}}
          >
            {t('title')}
          </Typography>
          
          <Typography 
          >
            {t('description')}
          </Typography>
        </Box>

        {/* Team Grid */}
        <Grid container spacing={4} justifyContent="center"
          sx={{px: {xs: 0, sm: 6}}}>
          {teamMembers.map((member) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={member.id}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: 3,
                  borderRadius: 3,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(95, 58, 252, 0.1)'
                  }
                }}
              >
                {/* Profile Image */}
                <Box
                  sx={{
                    position: 'relative',
                    width: 200,
                    height: 200,
                    mx: 'auto',
                    mb: 3,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '8px solid',
                    borderColor: 'var(--primary)',
                    '&:hover': {
                      borderColor: 'var(--accent)'
                    }
                  }}
                >
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="200px"
                  />
                </Box>

                {/* Member Info */}
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700,
                    mb: 1,
                    color: 'var(--text)'
                  }}
                >
                  {member.name}
                </Typography>
                
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'var(--primary)',
                    fontWeight: 500
                  }}
                >
                  {t(`roles.${member.roleKey}`)}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
