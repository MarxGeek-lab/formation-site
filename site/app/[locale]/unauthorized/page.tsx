"use client";
import { Box, Typography, Button, Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/contexts/GlobalContext';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const handleGoBack = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/');
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        textAlign="center"
      >
        <Typography variant="h1" component="h1" gutterBottom>
          403
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Accès non autorisé
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGoBack}
          size="large"
        >
          Retour
        </Button>
      </Box>
    </Container>
  );
}
