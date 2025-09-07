'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Snackbar,
  CircularProgress,
  Paper,
  Stack,
  IconButton,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CreditCard as CreditCardIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Verified as VerifiedIcon,
  ShoppingBag as ShoppingBagIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { countries } from '@/data/country';
import styles from './profile.module.scss';
import { useAuthStore } from '@/contexts/GlobalContext';
import { COLORS } from '@/settings/theme';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  phoneCode?: string;
  address?: string;
  city?: string;
  country?: string;
  gender?: string;
  avatar: string;
  createdAt: string;
  isVerified: boolean;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  preferences: UserPreferences;
  stats: UserStats;
}

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'mobile';
  name: string;
  last4?: string;
  network?: string;
  expiryDate?: string;
  isDefault: boolean;
}

interface UserPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  language: string;
  currency: string;
}

interface UserStats {
  totalOrders: number;
  totalSpent: number;
  memberSince: string;
  loyaltyPoints: number;
}

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { user, getUserById, updateUser } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | any | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const fetchData = async () => {
    if (user) {
      try {
        const { data, status } = await getUserById(user._id);
        console.log(data)
        if (status === 200) {
          setLoading(false);
          setProfile(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = async (category: keyof UserPreferences, field: string, value: any) => {
    if (!profile) return;
    
    const updatedPreferences = {
      ...profile.preferences,
      [category]: {
        ...profile.preferences[category],
        [field]: value,
      },
    };
  
    const dataToSend = JSON.parse(JSON.stringify({ preferences: updatedPreferences }));
  

    try {
      const status = await updateUser(user._id, dataToSend);
      if (status === 200) {
        setSnackbarMessage('Préférences mises à jour avec succès');
        setSnackbarOpen(true);

        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAddressTypeLabel = (type: string) => {
    switch (type) {
      case 'home': return 'Domicile';
      case 'work': return 'Bureau';
      default: return 'Autre';
    }
  };

  const getPaymentIcon = (type: string) => {
    if (type === 'card') return <CreditCardIcon />;
    return <PhoneIcon />;
  };

  const handleUpdateUser = async () => {
    if (!editMode) {
      setEditedProfile(profile);
      setEditMode(true);
    } else {
      if (user && editedProfile) {
        try {
          console.log(editedProfile);
          const status = await updateUser(user._id, editedProfile);
          if (status === 200) {
            console.log(status)
            setSnackbarMessage('Profil mis à jour avec succès');
            setSnackbarOpen(true);
            setEditMode(!editMode);

            fetchData();
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const styleInput = {
    '& .MuiInputBase-root': {
      borderRadius: 2,
      backgroundColor: 'var(--primary-light)',
      color: 'white',
      '& fieldset': {
        borderRadius: 2,
        borderColor: 'var(--primary-light)',
        color: 'white',
      },
      '&:hover fieldset': {
        borderColor: 'var(--primary)',
        color: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'var(--primary)',
        color: 'white',
      },
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <Container 
          maxWidth="lg" 
          sx={{ 
            padding: { xs: '80px 8px 20px 8px', sm: '160px 16px', md: '160px 24px' },
            minHeight: '100vh',
            textAlign: 'center'
          }}
        >
          <CircularProgress />
          <Typography variant="h6">Chargement de votre profil...</Typography>
        </Container>
      </ProtectedRoute>
    );
  }

  if (!profile) {
    return (
      <ProtectedRoute>
        <Container 
          maxWidth="lg" 
          sx={{ 
            padding: { xs: '80px 8px 20px 8px', sm: '160px 16px', md: '160px 24px' },
            minHeight: '100vh',
            textAlign: 'center'
          }}
        >
          <CircularProgress />
          <Typography variant="h6" color="error">Erreur lors du chargement du profil</Typography>
        </Container>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Container 
        maxWidth="lg" 
        sx={{ 
          padding: { xs: '80px 8px 20px 8px', sm: '20px 16px', md: '20px 24px' },
          minHeight: '100vh',
        }}
      >
      {/* Header */}
      <Box sx={{
        pb: { xs: 2, sm: 3 },
        mb: { xs: 3, sm: 4 },
        // borderBottom: '1px solid',
        // borderColor: 'divider',
        display: 'flex',
        alignItems: 'flex-end',
      }}>
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          sx={{
            mb: { xs: 2, sm: 3 },
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'action.hover'
            }
          }}
        />

        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 2, sm: 2.5 }
        }}>
          {/* <Avatar sx={{
            bgcolor: 'primary.main',
            width: { xs: 48, sm: 56 },
            height: { xs: 48, sm: 56 },
          }}>
            <PersonIcon sx={{ fontSize: { xs: 28, sm: 32 } }} />
          </Avatar> */}
          {/* <IconButton onClick={() => router.back()} sx={{ mr: 1 }}>
            <ArrowBackIcon color='primary' />
          </IconButton> */}
          <Box>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '1.75rem', sm: '2.125rem' }
              }}
            >
              Mon Profil
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              Gérez vos informations et préférences
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid2 container spacing={{ xs: 2, sm: 3 }}>
        {/* Informations personnelles */}
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Paper variant="outlined" sx={{ 
            backgroundColor: 'var(--primary-subtle)',
            border: '1px solid var(--primary-light)',
            borderRadius: 3, p: { xs: 2, sm: 3 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Informations personnelles
              </Typography>
              <Button
                startIcon={editMode ? <SaveIcon /> : <EditIcon />}
                onClick={handleUpdateUser}
                variant={editMode ? 'contained' : 'outlined'}
                sx={{ 
                  textTransform: 'none', fontWeight: 600, borderRadius: 2,
                  bgcolor: editMode ? 'primary.main' : 'transparent',
                  color: editMode ? 'white' : 'primary.main'
                }}
              >
                {editMode ? 'Sauvegarder' : 'Modifier'}
              </Button>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 3 }} alignItems="center" sx={{ mb: 3 }}>
              <Avatar
                src={profile.avatar}
                alt={`${profile.name}`}
                sx={{ width: 100, height: 100, border: '3px solid', borderColor: 'divider' }}
              />
              <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {profile?.name}
                  </Typography>
                  {profile.isVerified && (
                    <VerifiedIcon color="success" />
                  )}
                </Stack>
                <Typography variant="body1" color="text.secondary">
                  Membre depuis {new Date(profile?.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
                </Typography>
              </Box>
            </Stack>

            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12 }}>
                <TextField
                  label="Nom et Prénom"
                  value={editMode ? editedProfile?.name || '' : profile?.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!editMode}
                  fullWidth
                  sx={styleInput}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Email"
                  value={profile?.email}
                  disabled
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  sx={styleInput}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Stack direction="row" spacing={1}>
                  <Autocomplete
                    options={countries}
                    getOptionLabel={(option) => `${option.dial_code}`}
                    value={countries.find(country => country.dial_code === (editMode ? editedProfile.phoneCode || '' : profile.phoneCode || '')) || null}
                    onChange={(event, newValue) => {
                      handleInputChange('phoneCode', newValue ? newValue.dial_code : '');
                    }}
                    disabled={!editMode}
                    sx={{ width: 140 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Code"
                        variant="outlined"
                        placeholder="+33"
                        sx={styleInput}
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <img
                          src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                          alt={`Drapeau ${option.name}`}
                          style={{ width: 20, height: 'auto' }}
                        />
                        <Typography>{option.dial_code}</Typography>
                        <Typography variant="body2" color="text.secondary">({option.code})</Typography>
                      </Box>
                    )}
                    noOptionsText="Aucun code"
                  />
                  <TextField
                    label="Téléphone"
                    value={editMode ? editedProfile?.phoneNumber || '' : profile?.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    disabled={!editMode}
                    fullWidth
                    variant="outlined"
                    placeholder="6 12 34 56 78"
                    sx={styleInput}
                  />
                </Stack>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Adresse"
                  value={editMode ? editedProfile?.address || '' : profile?.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!editMode}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  sx={styleInput}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Ville"
                  value={editMode ? editedProfile?.city || '' : profile?.city || ''}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  disabled={!editMode}
                  fullWidth
                  variant="outlined"
                  sx={styleInput}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Autocomplete
                  options={countries}
                  getOptionLabel={(option) => option.name || ''}
                  value={countries.find(country => country.name === (editMode ? editedProfile?.country || '' : profile?.country || '')) || null}
                  onChange={(event, newValue) => {
                    handleInputChange('country', newValue ? newValue.name : '');
                  }}
                  disabled={!editMode}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Pays"
                      variant="outlined"
                      placeholder="Rechercher un pays..."
                      sx={styleInput}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <img
                        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                        alt={`Drapeau ${option.name}`}
                        style={{ width: 20, height: 'auto' }}
                      />
                      <Typography>{option.name}</Typography>
                    </Box>
                  )}
                  noOptionsText="Aucun pays trouvé"
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth disabled={!editMode} sx={styleInput}>
                  <InputLabel>Sexe</InputLabel>
                  <Select
                    value={editMode ? editedProfile?.gender || '' : profile?.gender || ''}
                    label="Sexe"
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                  >
                    <MenuItem value="">Préférer ne pas dire</MenuItem>
                    <MenuItem value="male">Homme</MenuItem>
                    <MenuItem value="female">Femme</MenuItem>
                    <MenuItem value="other">Autre</MenuItem>
                  </Select>
                </FormControl>
              </Grid2>
            </Grid2>

            {editMode && (
              <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 3 }}>
                <Button
                  onClick={() => {
                    setEditMode(false);
                    setEditedProfile({});
                  }}
                  variant="outlined"
                  color="error"
                  sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                >
                  Annuler
                </Button>
              </Stack>
            )}
          </Paper>
        </Grid2>

        {/* Colonne de droite (Actions) */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Stack spacing={{ xs: 2, sm: 3 }}>
            <Paper variant="outlined" sx={{ 
               backgroundColor: 'var(--primary-subtle)',
               border: '1px solid var(--primary-light)',
              borderRadius: 3, p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Changer le mot de passe
              </Typography>
              {/* <Stack spacing={2}>
                <TextField label="Ancien mot de passe" type="password" fullWidth sx={styleInput} />
                <TextField label="Nouveau mot de passe" type="password" fullWidth sx={styleInput} />
                <TextField label="Confirmer le nouveau" type="password" fullWidth sx={styleInput} />
              </Stack> */}
              <Button variant="contained" sx={{ 
                mt: 2, textTransform: 'none', fontWeight: 600, borderRadius: 2,
                backgroundColor: 'var(--primary)',
                }}>
                Mettre à jour le mot de passe
              </Button>
            </Paper>

            <Paper variant="outlined" sx={{ 
              backgroundColor: 'var(--primary-subtle)',
              border: '1px solid var(--primary-light)',
              borderRadius: 3, p: { xs: 2, sm: 3 }, borderColor: 'error.main' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'error.main' }}>
                Zone de danger
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                La suppression de votre compte est une action irréversible.
              </Typography>
              <Button variant="contained" color="error" sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>
                Supprimer mon compte
              </Button>
            </Paper>
          </Stack>
        </Grid2>

        {/* Sidebar - Préférences */}
        {/* <Grid2 size={{ xs: 12, md: 4 }}>
          <Card sx={{ 
            borderRadius: { xs: 3, sm: 2 },
            boxShadow: { xs: '0 4px 20px rgba(0,0,0,0.08)', sm: 1 },
            border: { xs: '1px solid rgba(255, 255, 255, 0.8)', sm: 'none' },
            background: { xs: 'rgba(255, 255, 255, 0.95)', sm: 'white' },
            backdropFilter: { xs: 'blur(10px)', sm: 'none' }
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  mb: { xs: 2, sm: 3 },
                  fontSize: { xs: '1.125rem', sm: '1.25rem' },
                  textAlign: { xs: 'center', sm: 'left' }
                }}
              >
                Préférences
              </Typography>
              
              <List sx={{ p: 0 }}>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemIcon>
                    <NotificationsIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Notifications email"
                    sx={{ flex: 1 }}
                  />
                  <Switch
                    checked={profile?.preferences?.notifications?.email}
                    onChange={(e) => handlePreferenceChange('notifications', 'email', e.target.checked)}
                    color="primary"
                  />
                </ListItem>
                <Divider />
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemIcon>
                    <PhoneIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Notifications SMS"
                    sx={{ flex: 1 }}
                  />
                  <Switch
                    checked={profile?.preferences?.notifications?.sms}
                    onChange={(e) => handlePreferenceChange('notifications', 'sms', e.target.checked)}
                    color="primary"
                  />
                </ListItem>
                <Divider />
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemIcon>
                    <SecurityIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Notifications push"
                    sx={{ flex: 1 }}
                  />
                  <Switch
                    checked={profile?.preferences?.notifications?.push}
                    onChange={(e) => handlePreferenceChange('notifications', 'push', e.target.checked)}
                    color="primary"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid2> */}
      </Grid2>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
      </Container>
    </ProtectedRoute>
  );
};

export default ProfilePage;
