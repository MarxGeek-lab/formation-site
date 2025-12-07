import { Box } from '@mui/material';
import { Facebook, Twitter, Instagram } from '@mui/icons-material';

export default function SocialFloat() {
  return (
    <Box
      sx={{
        position: 'fixed',     // pour qu'il reste flottant
        top: '50%',            // centré verticalement
        right: 0,              // aligné à droite
        transform: 'translateY(-50%)', // ajuste pour centrer exactement
        display: 'flex',
        flexDirection: 'column', // vertical
        gap: 2,                 // espace entre les icônes
        p: 1,                   // padding
        bgcolor: 'background.paper', // optionnel : fond léger
        borderRadius: '8px 0 0 8px', // arrondir le côté gauche
        boxShadow: 3,           // ombre pour flotter
        zIndex: 1000            // toujours au-dessus
      }}
    >
      <a href="#" style={{ color: '#3b5998' }}>
        <Facebook />
      </a>
      <a href="#" style={{ color: '#00acee' }}>
        <Twitter />
      </a>
      <a href="#" style={{ color: '#C13584' }}>
        <Instagram />
      </a>
    </Box>
  );
}
