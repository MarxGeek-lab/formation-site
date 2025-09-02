// MUI Imports
import Grid from '@mui/material/Grid2'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import FormControlLabel from '@mui/material/FormControlLabel'
import RadioGroup from '@mui/material/RadioGroup'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import DirectionalIcon from '@components/DirectionalIcon'
import { Typography } from '@mui/material'
import { showToast } from '@/components/ToastNotification/ToastNotification'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/contexts/GlobalContext'

const StepPriceDetails = ({ 
  activeStep, handleNext, handlePrev, steps,
  billing, setBilling,
  availability, setAvailability,
  stock, setStock, stocks, setStocks,
  acquisitionDeadline, setAcquisitionDeadline,
  deadlinePending, setDeadlinePending,
  category, subCategory
}) => {

  const [qtyError, setQtyError] = useState('');
  const { user, getUserById } = useAuthStore();
  const [userProfile, setUserProfile] = useState();

  const fetchUserProfile = async () => {
    if (user) {
        try {
            const { data, status } = await getUserById(user._id);
            if (status === 200) {
                setUserProfile(data);

                if (!acquisitionDeadline) {
                  setAcquisitionDeadline(data?.acquisitionDeadline);
                }
                
                if (!deadlinePending) {
                  setDeadlinePending(data?.deadlinePending);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
  }

  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  const billingModes = [
    { value: 'hour', text: 'Heure' },
    { value: 'day', text: 'Jour' },
    ...(category && ['Hébergements'].includes(category) ? [{ value: 'night', text: 'Nuité' }] : [])
    // { value: 'night', text: 'Nuité' }
  ];

  const days = [
    { value: 'monday', text: 'Lundi' },
    { value: 'tuesday', text: 'Mardi' },
    { value: 'wednesday', text: 'Mercredi' },
    { value: 'thursday', text: 'Jeudi' },
    { value: 'friday', text: 'Vendredi' },
    { value: 'saturday', text: 'Samedi' },
    { value: 'sunday', text: 'Dimanche' }
  ];

  const handleBillingChange = (mode, field, value) => {
    if (field === 'price') {
      value = Number(value);
    }
    setBilling(prev => ({
      ...prev,
      [mode]: {
        ...prev[mode],
        [field]: value
      }
    }));
  };

  const handleGlobalChange = (field, value) => {
    setBilling(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvailabilityChange = (day, field, value) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
        ...(field === 'isAvailable' && value ? { hours: [{ start: '', end: '' }] } : {})
      }
    }));
  };

  const handleHoursChange = (day, field, value) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        hours: [{ ...prev[day].hours[0], [field]: value }]
      }
    }));
  };

  const handleHoursBlur = (day, field, value) => {
    if (field === 'end') {
      const startHour = availability[day].hours[0].start;
      const endHour = value;
      
      if (endHour <= startHour) {
        showToast('La fin doit être après le début', 'error', 5000);
        
        // Ajouter 1 heure à l'heure de début
        const [startHours, startMinutes] = startHour.split(':').map(Number);
        const newEndHour = new Date(0, 0, 0, startHours, startMinutes);
        newEndHour.setHours(newEndHour.getHours() + 1);
        
        const newEndValue = newEndHour.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        
        setAvailability(prev => ({
          ...prev,
          [day]: {
            ...prev[day],
            hours: [{
              ...prev[day].hours[0],
              end: newEndValue
            }]
          }
        }));

        return;
      }
    }
  };


  return (
    <Grid container spacing={6}>
      {/* Stock Initial */}
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomTextField
          fullWidth
          type='number'
          placeholder='0'
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          onBlur={(e) => {
            const value = Number(e.target.value);
            if (stocks) {
              console.log(value, stocks.rented, 'stocks');
              if (value == Number(stocks.rented)) {
                setQtyError('Le stock initial doit être supérieur ou égal au stock loué');
                setStock(stocks.total);
              } else {
                setQtyError('');
                setStock(value);
              }
            }
          }}
          label={
            <Typography component="span">
              Stock initial <Typography component="span" color="error" variant=''>*</Typography>
            </Typography>
          }
        />
        {qtyError && (
          <Typography variant='inherit' component="span" sx={{ mt: 2, fontSize: '13px' }} color='error'>
            {qtyError}
          </Typography>
        )}
      </Grid>

      {/* Global Quantity Settings */}
      <Grid size={{ xs: 12 }}>
        <Typography variant="h6" sx={{ mt: 4, mb: 0 }}>
          Quantités réservables
        </Typography>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <CustomTextField
          fullWidth
          type='number'
          placeholder='1'
          value={billing.minQuantity}
          onChange={(e) => handleGlobalChange('minQuantity', Number(e.target.value))}
          label={
            <Typography component="span">
              Quantité minimale réservable <Typography component="span" color="error" variant=''>*</Typography>
            </Typography>
          }
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomTextField
          fullWidth
          type='number'
          placeholder='0'
          value={billing.maxQuantity}
          onChange={(e) => handleGlobalChange('maxQuantity', Number(e.target.value))}
          label={
            <Typography component="span">
              Quantité maximale réservable (0 = illimité) <Typography component="span" color="error" variant=''>*</Typography>
            </Typography>
          }
        />
      </Grid>

      {/* Billing Modes */}
      <Grid size={{ xs: 12 }}>
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          Différents prix
        </Typography>
      </Grid>
      <Grid container spacing={4}>
        {billingModes.map((mode) => (
          <Grid size={{ xs: 12, sm: 6}} key={mode.value}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={billing[mode.value]?.isActive || false}
                    onChange={(e) => handleBillingChange(mode.value, 'isActive', e.target.checked)}
                  />
                }
                label={mode.text}
              />
              {billing[mode.value]?.isActive && (
                <Box sx={{ mt: 2 }}>
                  <CustomTextField
                    fullWidth
                    type='text'
                    placeholder='25000'
                    value={billing[mode.value]?.price || 0}
                    onChange={(e) => handleBillingChange(mode.value, 'price', Number(e.target.value))}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position='end'>
                            F CFA
                          </InputAdornment>
                        )
                      }
                    }}
                    label={
                      <Typography component="span">
                        Prix par {mode.text.toLowerCase()} <Typography component="span" color="error" variant=''>*</Typography>
                      </Typography>
                    }
                  />
                </Box>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Availability Settings */}
      <Grid size={{ xs: 12 }}>
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          Jours de disponibilité
        </Typography>
      </Grid>

      <Grid container spacing={4}>
        {days.map((day) => (
          <Grid size={{ xs: 12, sm: 6 }} key={day.value}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={availability[day.value]?.isAvailable || false}
                    onChange={(e) => handleAvailabilityChange(day.value, 'isAvailable', e.target.checked)}
                  />
                }
                label={day.text}
              />
              {availability[day.value]?.isAvailable && (
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CustomTextField
                      fullWidth
                      type='time'
                      value={availability[day.value]?.hours[0]?.start || ''}
                      onChange={(e) => handleHoursChange(day.value, 'start', e.target.value)}
                      onBlur={(e) => handleHoursBlur(day.value, 'start', e.target.value)}
                      label="Heure de début"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CustomTextField
                      fullWidth
                      type='time'
                      value={availability[day.value]?.hours[0]?.end || ''}
                      onChange={(e) => handleHoursChange(day.value, 'end', e.target.value)}
                      onBlur={(e) => handleHoursBlur(day.value, 'end', e.target.value)}
                      label="Heure de fin"
                    />
                  </Grid>
                </Grid>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>

      <Grid size={{ xs: 12 }} className="mt-6">
        <Typography variant="h6" className="mb-4">Délai d'acquisition après confirmation de la réservation</Typography>
        <Typography variant="body2" className="mb-4" color="text.secondary">
          Spécifiez le délai maximum que le client a pour acquérir le bien après la confirmation de la réservation ( au moins un paiement effectué ). Passé ce délai, vous pouvez l'annulée.
        </Typography>
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              fullWidth
              type="number"
              label="Délai (en heures)"
              value={acquisitionDeadline || ''}
              onChange={(e) => setAcquisitionDeadline(e.target.value)}
              InputProps={{
                inputProps: { min: 1 },
                endAdornment: <InputAdornment position="end">heures</InputAdornment>
              }}
              helperText="Exemple: 24 heures (1 jour), 48 heures (2 jours), etc."
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid size={{ xs: 12 }} className="mt-6">
        <Typography variant="h6" className="mb-4">Délai d'annulation d'une réservation en attente</Typography>
        <Typography variant="body2" className="mb-4" color="text.secondary">
          Spécifiez le délai d'annulation si la réservation est toujours en attente ( aucun paiement effectué ).
        </Typography>
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              fullWidth
              type="number"
              label="Délai (en heures)"
              value={deadlinePending || ''}
              onChange={(e) => setDeadlinePending(e.target.value)}
              InputProps={{
                inputProps: { min: 1 },
                endAdornment: <InputAdornment position="end">heures</InputAdornment>
              }}
              helperText="Exemple: 24 heures (1 jour), 48 heures (2 jours), etc."
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <div className='flex items-center justify-between'>
          <Button
            variant='tonal'
            color='secondary'
            disabled={activeStep === 0}
            onClick={handlePrev}
            startIcon={<DirectionalIcon ltrIconClass='tabler-arrow-left' rtlIconClass='tabler-arrow-right' />}
          >
            Précédent
          </Button>
          <Button
            variant='contained'
            color={activeStep === steps.length - 1 ? 'success' : 'primary'}
            onClick={handleNext}
            endIcon={
              activeStep === steps.length - 1 ? (
                <i className='tabler-check' />
              ) : (
                <DirectionalIcon ltrIconClass='tabler-arrow-right' rtlIconClass='tabler-arrow-left' />
              )
            }
          >
            {activeStep === steps.length - 1 ? 'Enrégistrer' : 'Suivant'}
          </Button>
        </div>
      </Grid>
    </Grid>
  )
}

export default StepPriceDetails
