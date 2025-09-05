'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Snackbar,
  Alert,
  Tooltip,
  IconButton,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  Place as PlaceIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { countries } from '../../data/country';
import styles from './addresses.module.scss';
import { useAuthStore } from '@/contexts/GlobalContext';
import { hideLoader, showLoader } from '@/components/Loader/loaderService';
import { COLORS } from '@/settings/theme';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import ApartmentIcon from '@mui/icons-material/Apartment';

interface Address {
  id: string;
  _id: string;
  type: 'home' | 'work' | 'other';
  fullName: string;
  email: string;
  apartment?: string;
  city: string;
  district: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

const AddressesPage: React.FC = () => {
  const router = useRouter();
  const { user, getUserById, updateUser } = useAuthStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [formData, setFormData] = useState<Partial<Address>>({
    type: 'home',
    fullName: '',
    email: '',
    apartment: '',
    city: '',
    district: '',
    postalCode: '',
    country: '',
    phone: '',
    isDefault: false,
  });

  const fetchData = async () => {
    if (user) {
      try {
        const { data, status } = await getUserById(user._id);
        if (status === 200) {
          setLoading(false);
          setAddresses(data.addressShipping);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleOpenDialog = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setFormData(address);
    } else {
      setEditingAddress(null);
      setFormData({
        type: 'home',
        fullName: '',
        email: '',
        apartment: '',
        city: '',
        district: '',
        postalCode: '',
        country: '',
        phone: '',
        isDefault: false,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingAddress(null);
    setFormData({});
  };

  const handleInputChange = (field: keyof Address, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveAddress = async () => {
    if (!formData.fullName || !formData.email || !formData.district || !formData.city || !formData.country) {
      setSnackbarMessage('Veuillez remplir tous les champs obligatoires');
      setSnackbarOpen(true);
      return;
    }

    showLoader()
    setDialogOpen(false)

    try {
      const data = { 
        addressShipping: formData, 
        ...(editingAddress ? { id: editingAddress?._id } : {} ),
        action: editingAddress ? 'updateAddress' : 'addAddress'
      }
      let status = await updateUser(user._id, data, false);
      hideLoader();

      if (status === 200) {
        if (editingAddress) {
          setSnackbarMessage('Adresse modifiée avec succès');
        } else {
          setSnackbarMessage('Adresse ajoutée avec succès');
        }
        setSnackbarOpen(true);
        fetchData();
      } else {
        setDialogOpen(true)
        setSnackbarMessage('Une erreur est survenue');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.log(error);
      hideLoader();
    }

    setSnackbarOpen(true);
    // handleCloseDialog();
  };

  const handleDeleteAddress = async (addressId: string) => {
    showLoader()
    setDialogOpen(false)
    try {
      const data = { 
        id: addressId,
        action: 'deleteAddress'
      }
      let status = await updateUser(user._id, data);
      hideLoader();
      if (status === 200) {
        setSnackbarMessage('Adresse supprimée avec succès');
        setSnackbarOpen(true);
        fetchData();
      } else {
        setDialogOpen(true)
        setSnackbarMessage('Une erreur est survenue');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.log(error);
      hideLoader();
    }
  };

  const handleSetDefault = async (addressId: string) => {
    showLoader()
    setDialogOpen(false)
    try {
      const data = { 
        id: addressId,
        action: 'setDefaultAddress'
      }
      let status = await updateUser(user._id, data);
      hideLoader();
      if (status === 200) {
        setSnackbarMessage('Adresse par défaut mise à jour');
        setSnackbarOpen(true);
        fetchData();
      } else {
        setDialogOpen(true)
        setSnackbarMessage('Une erreur est survenue');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.log(error);
      hideLoader();
    }
  };

  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case 'home': return <HomeIcon />;
      case 'work': return <WorkIcon />;
      default: return <PlaceIcon />;
    }
  };

  const getAddressTypeLabel = (type: string) => {
    switch (type) {
      case 'home': return 'Domicile';
      case 'work': return 'Bureau';
      default: return 'Autre';
    }
  };

  if (loading) {
    return (
      <Container 
        maxWidth="lg" 
        sx={{ 
          padding: { xs: '80px 8px 20px 8px', sm: '160px 16px', md: '160px 24px' },
          minHeight: '100vh',
          textAlign: 'center'
        }}
      >
        <Typography variant="h6">Chargement de vos adresses...</Typography>
      </Container>
    );
  }

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        padding: { xs: '80px 8px 20px 8px', sm: '160px 16px', md: '160px 24px' },
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <Box sx={{ 
        mb: { xs: 3, sm: 4 },
        display: 'flex',
        alignItems: 'flex-end',
      }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          sx={{ 
            mb: { xs: 1.5, sm: 2 },
            borderRadius: { xs: 2, sm: 1 },
            px: { xs: 2, sm: 3 },
            py: { xs: 1, sm: 1.5 },
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}
        />
        
        <Box sx={{ 
          display: 'flex', 
          mb: { xs: 1, sm: 2 },
          flexDirection: 'column',
        }}>
          {/* <LocationIcon sx={{ 
            fontSize: { xs: 28, sm: 32 }, 
            color: 'primary.main',
          }} /> */}
          <Typography 
            variant="h5" 
            component="h1" 
            sx={{ 
              fontWeight: 600,
              fontSize: { xs: '1.75rem', sm: '2rem' }
            }}
          >
            Mes Adresses
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            Gérez vos adresses de livraison et de facturation
          </Typography>
        </Box>
      </Box>

      {/* Add Address Button */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            backgroundColor: COLORS.siteColor.primary,
            borderRadius: { xs: 2, sm: 1 },
            px: { xs: 2, sm: 2 },
            py: { xs: 1.5, sm: 1 },
            fontSize: { xs: '0.875rem', sm: '1rem' },
            fontWeight: 600,
            textTransform: 'none',
            minHeight: { xs: 48, sm: 'auto' }
          }}
        >
          Ajouter une adresse
        </Button>
      </Box>

      {/* Addresses List */}
      <Grid2 container spacing={{ xs: 2, sm: 3 }}>
      {addresses.map((address) => (
        <Grid2 key={address?._id} size={{ xs: 12, md: 6, lg: 4 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
              border: '1px solid rgba(0,0,0,0.05)',
              background: '#fff',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              },
              position: 'relative',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {address?.isDefault && (
              <Chip
                icon={<StarIcon />}
                label="Par défaut"
                color="primary"
                size="small"
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  fontWeight: 600,
                  zIndex: 1,
                }}
              />
            )}

            <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {getAddressTypeIcon(address?.type || 'home')}
                <Typography variant="h6" sx={{ ml: 1, fontWeight: 700 }}>
                  {address?.type === 'home' ? 'Domicile' : 'Travail'}
                </Typography>
              </Box> */}

              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HomeIcon fontSize="small" color="action" />
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {address?.fullName}
                  </Typography>
                </Box>

                {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOnIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {address?.district}
                    {address?.address && `, ${address?.address}`}
                  </Typography>
                </Box> */}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ApartmentIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {address?.postalCode} {address?.city} {address?.district}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOnIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {address?.country}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {address?.email}
                  </Typography>
                </Box>

                {address?.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Tél: {address?.phone}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Tooltip title="Modifier">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(address)}
                    color="primary"
                    sx={{ borderRadius: 2 }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>

                {!address?.isDefault && (
                  <Tooltip title="Par défaut">
                    <IconButton
                      size="small"
                      onClick={() => handleSetDefault(address?._id)}
                      color="primary"
                      sx={{ borderRadius: 2 }}
                    >
                      <StarIcon />
                    </IconButton>
                  </Tooltip>
                )}

                <Tooltip title="Supprimer">
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteAddress(address?._id)}
                    color="error"
                    disabled={address?.isDefault}
                    sx={{ borderRadius: 2 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
      ))}

      </Grid2>

      {/* Add/Edit Address Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: { xs: 3, sm: 2 },
            m: { xs: 1, sm: 2 },
            zIndex: 0
          }
        }}
      >
        <DialogTitle sx={{ 
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          fontWeight: 600
        }}>
          {editingAddress ? 'Modifier l\'adresse' : 'Ajouter une adresse'}
        </DialogTitle>
        
        <DialogContent>
          <Grid2 container spacing={{ xs: 2, sm: 3 }} sx={{ mt: 1 }}>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                label="Nom et Prénom"
                value={formData.fullName || ''}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                fullWidth
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: { xs: 2, sm: 1 } } }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Type d'adresse</InputLabel>
                <Select
                  value={formData.type || 'home'}
                  label="Type d'adresse"
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  sx={{ borderRadius: { xs: 2, sm: 1 } }}
                >
                  <MenuItem value="home">Domicile</MenuItem>
                  <MenuItem value="work">Bureau</MenuItem>
                  <MenuItem value="other">Autre</MenuItem>
                </Select>
              </FormControl>
            </Grid2>
            
            {/* <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Nom de l'adresse"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                fullWidth
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: { xs: 2, sm: 1 } } }}
              />
            </Grid2> */}
            
            
            
            {/* <Grid2 size={{ xs: 12 }}>
              <TextField
                label="Adresse"
                value={formData.street || ''}
                onChange={(e) => handleInputChange('street', e.target.value)}
                fullWidth
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: { xs: 2, sm: 1 } } }}
              />
            </Grid2> */}
            
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Appartement / Suite / Maison"
                value={formData.apartment || ''}
                onChange={(e) => handleInputChange('apartment', e.target.value)}
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: { xs: 2, sm: 1 } } }}
              />
            </Grid2>
            
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Code postal (optionnel)"
                value={formData.postalCode || ''}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: { xs: 2, sm: 1 } } }}
              />
            </Grid2>
            
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Quartier"
                value={formData.district || ''}
                onChange={(e) => handleInputChange('district', e.target.value)}
                fullWidth
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: { xs: 2, sm: 1 } } }}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Ville"
                value={formData.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
                fullWidth
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: { xs: 2, sm: 1 } } }}
              />
            </Grid2>
            
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Autocomplete
                options={countries}
                getOptionLabel={(option) => option.name || ''}
                value={countries.find(country => country.name === formData.country) || null}
                onChange={(event, newValue) => {
                  handleInputChange('country', newValue ? newValue.name : '');
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Pays"
                    variant="outlined"
                    placeholder="Rechercher un pays..."
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: { xs: 2, sm: 1 }
                      }
                    }}
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
                filterOptions={(options, { inputValue }) => {
                  return options.filter(option =>
                    option.name.toLowerCase().includes(inputValue.toLowerCase())
                  );
                }}
                noOptionsText="Aucun pays trouvé"
              />
            </Grid2>
            
            <Grid2 size={{ xs: 12 }}>
              <TextField
                label="Email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: { xs: 2, sm: 1 } } }}
              />
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              <TextField
                label="Téléphone"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: { xs: 2, sm: 1 } } }}
              />
            </Grid2>
          </Grid2>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ 
              borderRadius: { xs: 2, sm: 1 },
              textTransform: 'none'
            }}
          >
            Annuler
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveAddress}
            sx={{ 
              borderRadius: { xs: 2, sm: 1 },
              textTransform: 'none'
            }}
          >
            {editingAddress ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success"
          sx={{ borderRadius: { xs: 2, sm: 1 } }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddressesPage;
