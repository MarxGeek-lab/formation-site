// React Imports
import { useState, useRef, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { MenuItem, FormControl, InputLabel, Select } from '@mui/material'

// Components Imports
import CustomTextField from '@core/components/mui/TextField'
import { usePromoCodeStore, useAuthStore } from '@/contexts/GlobalContext'
import { showToast } from '@/components/ToastNotification/ToastNotification'
import { hideLoader, showLoader } from '@/components/Loader/loaderService'

const AddCategoryDrawer = props => {
  // Props
  const { open, handleClose, promoCodeData, setData, fetchPromoCodes, setPromoCodeData } = props

  const { createPromoCode, updatePromoCode } = usePromoCodeStore();
  const { user } = useAuthStore();

  // States
  const [code, setCode] = useState('')
  const [discountType, setDiscountType] = useState('percentage')
  const [discountValue, setDiscountValue] = useState('')
  const [minPurchase, setMinPurchase] = useState('')
  const [maxUsage, setMaxUsage] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [isActive, setIsActive] = useState(true)


  // Handle Form Submit
  const handleFormSubmit = async () => {
    if (!code || !discountValue || !expiresAt) {
      showToast('Veuillez remplir tous les champs obligatoires', 'error', 5000);
      return;
    }

    const newData = {
      code: code.toUpperCase(),
      discountType,
      discountValue: parseFloat(discountValue),
      minPurchase: parseFloat(minPurchase) || 0,
      maxUsage: parseInt(maxUsage) || 1,
      expiresAt: new Date(expiresAt),
      isActive
    }

    showLoader();

    try {
      let res;
      if (promoCodeData) {
        res = await updatePromoCode(promoCodeData?._id, newData);
      } else {
        res = await createPromoCode(newData);
      }
      hideLoader();

      if (res === 201) {
        handleReset();
        fetchPromoCodes();
        showToast('Code promo ajouté avec succès', 'success', 5000);
      } else if (res === 200) {
        fetchPromoCodes();
        setPromoCodeData(null)
        handleReset();
        showToast('Code promo mis à jour', 'success', 5000);
      }
      else if (res === 400) {
        showToast('Ce code promo existe déjà.', 'error', 5000);
      } else {
        showToast('Une erreur est survenue. Veuillez réessayer.', 'error', 5000);
      }
    } catch (error) {
      console.log(error)
      hideLoader();
    }
  }

  // Handle Form Reset
  const handleReset = () => {
    handleClose()
    setCode('')
    setDiscountType('percentage')
    setDiscountValue('')
    setMinPurchase('')
    setMaxUsage('')
    setExpiresAt('')
    setIsActive(true)
  }

  useEffect(() => {
    if (promoCodeData) {
      setCode(promoCodeData?.code || '');
      setDiscountType(promoCodeData?.discountType || 'percentage');
      setDiscountValue(promoCodeData?.discountValue?.toString() || '');
      setMinPurchase(promoCodeData?.minPurchase?.toString() || '');
      setMaxUsage(promoCodeData?.maxUsage?.toString() || '');
      setExpiresAt(promoCodeData?.expiresAt ? new Date(promoCodeData.expiresAt).toISOString().split('T')[0] : '');
      setIsActive(promoCodeData?.isActive ?? true);
    }
  },[promoCodeData]);

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between pli-6 plb-5'>
        <Typography variant='h5'>{promoCodeData ? 'Modifier le Code Promo':'Nouveau Code Promo'}</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='tabler-x text-textSecondary text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='flex flex-col gap-5 p-6'>
          <CustomTextField
            fullWidth
            label='Code Promo *'
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            placeholder='Ex: SUMMER2024'
            inputProps={{ style: { textTransform: 'uppercase' } }}
          /> 

          <FormControl fullWidth>
            <InputLabel>Type de Réduction *</InputLabel>
            <Select
              value={discountType}
              onChange={e => setDiscountType(e.target.value)}
              label='Type de Réduction *'
            >
              <MenuItem value='percentage'>Pourcentage</MenuItem>
              <MenuItem value='fixed'>Montant fixe</MenuItem>
            </Select>
          </FormControl>

          <CustomTextField
            fullWidth
            label={`Valeur de la Réduction * ${discountType === 'percentage' ? '(%)' : '(€)'}`}
            value={discountValue}
            onChange={e => setDiscountValue(e.target.value)}
            type='number'
            inputProps={{ min: 0, max: discountType === 'percentage' ? 100 : undefined }}
          /> 

          <CustomTextField
            fullWidth
            label='Achat Minimum (€)'
            value={minPurchase}
            onChange={e => setMinPurchase(e.target.value)}
            type='number'
            inputProps={{ min: 0 }}
            placeholder='0'
          /> 

          <CustomTextField
            fullWidth
            label="Nombre d\'utilisations maximum"
            value={maxUsage}
            onChange={e => setMaxUsage(e.target.value)}
            type='number'
            inputProps={{ min: 1 }}
            placeholder='1'
          /> 

          <CustomTextField
            fullWidth
            label="Date d\'expiration *"
            value={expiresAt}
            onChange={e => setExpiresAt(e.target.value)}
            type='date'
            InputLabelProps={{ shrink: true }}
          /> 

          <FormControl fullWidth>
            <InputLabel>Statut</InputLabel>
            <Select
              value={isActive}
              onChange={e => setIsActive(e.target.value)}
              label='Statut'
            >
              <MenuItem value={true}>Actif</MenuItem>
              <MenuItem value={false}>Inactif</MenuItem>
            </Select>
          </FormControl>

          <div className='flex items-center gap-4'>
            <Button variant='contained' onClick={handleFormSubmit}>
              {promoCodeData ? 'Enregistrer':'Ajouter'}
            </Button>
            <Button variant='tonal' color='error' type='reset' onClick={handleReset}>
              Annuler
            </Button>
          </div>
      </div>
    </Drawer>
  )
}

export default AddCategoryDrawer
