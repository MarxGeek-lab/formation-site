// React Imports
import { useState, useRef, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Components Imports
import CustomTextField from '@core/components/mui/TextField'
import { useSubscriptionContext, useAuthStore, useAdminStore, usePropertyStore } from '@/contexts/GlobalContext'
import { showToast } from '@/components/ToastNotification/ToastNotification'
import { hideLoader, showLoader } from '@/components/Loader/loaderService'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import { Chip, InputAdornment, MenuItem } from '@mui/material'

const AddCategoryDrawer = props => {
  // Props
  const { open, handleClose, subscriptionData, setData, fetchSubscription, setSubscriptionData } = props

  const { addSubscription, updateSubscription } = useSubscriptionContext();
  const { user } = useAuthStore();
  const { allProducts, getAllProducts } = usePropertyStore();

  // States
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [priceEUR, setPriceEUR] = useState('')
  const [features, setFeatures] = useState([])
  const [newFeature, setNewFeature] = useState('')
  const [duration, setDuration] = useState('')
  const [product, setProduct] = useState('')
 
  const featuresArray = [
    'Accès à 3 produits gagnants',
    '2 affiches publicitaires offertes',
    'Contrat de licence PLR',
    'Accès anticipé aux nouveaux produits',
    'Produit surprise chaque mois',
    'Produits mystères tendance chaque semaine',
    'Pack de textes publicitaires optimisés',
    'Call mensuel avec un expert Facebook Ads',
    'Audit mensuel gratuit des campagnes publicitaires',
    'Suggestions de stratégies marketing',
    'Accès complet à l’intégralité du catalogue produit',
    '15 affiches publicitaires offertes',
    'Une boutique e-ecommerce offerte',
    '01 Produit mystère tendance chaque semaine',
    'Rapports comparatifs sur les marchés',
    'Conseils hebdomadaires',
    'Accès exclusif aux meilleures audiences et pays cibles pour chaque produit',
    'Contact privé avec les coachs',
    'Audit mensuel gratuit des campagnes publicitaires',
    'Suggestions de stratégies marketing',
    'Contrat de licence PLR',
    'Accès à 15 produits gagnants',
    '8 affiches publicitaires offertes',
    'Conseils hebdomadaires sur les tendances générales du marché',
    'Audit mensuel gratuit sur les stratégies publicitaires',
    '1 produit surprise chaque mois',
    'Contrat de licence PLR',
    'Produits mystères tendance chaque semaine',
    'Pack de textes publicitaires optimisés',
    'Call mensuel avec un expert Facebook Ads',
    'Une boutique e-ecommerce offerte',
    'Accès exclusif aux meilleures audiences et pays cibles pour chaque produit'
  ];

  // Feature management functions
  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()])
      setNewFeature('')
    }
  }

  const removeFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  // Handle Form Submit
  const handleFormSubmit = async () => {

    if (title && description && price && priceEUR) {
      const newData = {
        title,
        description,
        price: parseFloat(price),
        priceEUR: priceEUR ? parseFloat(priceEUR) : undefined,
        features,
        duration: duration,
        admin: user?._id,
        product,
      }

      showLoader();

      try {
        let res;
        if (subscriptionData) {
          res = await updateSubscription(newData, subscriptionData?._id);
        } else {
          res = await addSubscription(newData);
        }
        hideLoader();
        console.log(res);

        if (res === 201) {
          handleReset();
          fetchSubscription();
          showToast('Produit d\'abonnement ajouté avec succès', 'success', 5000);
        } else if (res === 200) {
          fetchSubscription();
          setSubscriptionData(null)
          handleReset();
          showToast('Produit d\'abonnement mis à jour', 'success', 5000);
        }
        else if (res === 400) {
          showToast('Ce produit d\'abonnement existe déjà.', 'error', 5000);
        } else {
          showToast('Une erreur est survenue. Veuillez réessayer.', 'error', 5000);
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  // Handle Form Reset
  const handleReset = () => {
    handleClose()
    setTitle('')
    setDescription('')
    setPrice('')
    setPriceEUR('')
    setFeatures([])
    setNewFeature('')
    setDuration('')
  }

  useEffect(() => {
    getAllProducts();
  }, [user]);

  useEffect(() => {
    if (subscriptionData) {
      setTitle(subscriptionData?.title || '');
      setDescription(subscriptionData?.description || '');
      setPrice(subscriptionData?.price?.toString() || '');
      setPriceEUR(subscriptionData?.priceEUR?.toString() || '');
      setFeatures(subscriptionData?.features || []);
      setDuration(subscriptionData?.duration?.toString() || '');
    }
  },[subscriptionData]);

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
        <Typography variant='h5'>{subscriptionData ? 'Modifier':'Nouveau'} Produit d'Abonnement</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='tabler-x text-textSecondary text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='flex flex-col gap-5 p-6'>
        {/* <form onSubmit={handleSubmit(data => handleFormSubmit(data))} className='flex flex-col gap-5'> */}
          <CustomTextField
            fullWidth
            label={
              <Typography variant="subtitle2" className="mb-2">
                Titre <span className="text-red-500">*</span>
              </Typography>
            }
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Nom du produit d'abonnement"
          /> 

          <CustomTextField
            fullWidth
            label={
              <Typography variant="subtitle2" className="mb-2">
                Description <span className="text-red-500">*</span>
              </Typography>
            }
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description du produit d'abonnement"
            multiline
            rows={3}
          /> 

          <CustomTextField
            fullWidth
            label={
              <Typography variant="subtitle2" className="mb-2">
                Prix <span className="text-red-500">*</span>
              </Typography>
            }
            value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder='0'
            type='number'
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography>FCFA</Typography>
                </InputAdornment>
              ),
            }}
          />

          <CustomTextField
            fullWidth
            label={
              <Typography variant="subtitle2" className="mb-2">
                Prix (EUR) <span className="text-red-500">*</span>
              </Typography>
            }
            value={priceEUR}
            onChange={e => setPriceEUR(e.target.value)}
            placeholder='0.00'
            type='number'
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography>€</Typography>
                </InputAdornment>
              ),
            }}
          />

          <CustomTextField
            fullWidth
            label={
              <Typography variant="subtitle2" className="mb-2">
                Durée en mois <span className="text-red-500">*</span>
              </Typography>
            }
            value={duration}
            onChange={e => setDuration(e.target.value)}
            placeholder='3'
            type='number'
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography>/mois</Typography>
                </InputAdornment>
              ),
            }}
          /> 

          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" className="mb-2">Avantages</Typography>
            <div className="flex gap-2 mb-3">
              <CustomAutocomplete
                fullWidth
                freeSolo
                value={newFeature}
                onChange={(event, value) => setNewFeature(value || '')}
                onInputChange={(event, value) => setNewFeature(value)}
                options={featuresArray.filter(feature => !features.includes(feature))}
                getOptionLabel={(option) => option}
                renderInput={(params) => 
                  <CustomTextField 
                    {...params} 
                    placeholder="Sélectionner ou ajouter une fonctionnalité"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addFeature()
                      }
                    }}
                  />
                }
              />
              <Button
                variant="contained"
                size="small"
                onClick={addFeature}
                disabled={!newFeature.trim()}
                sx={{ minWidth: '40px', px: 1 }}
              >
                <i className="tabler-plus" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {features.map((feature, index) => (
                <Chip
                  key={index}
                  label={feature}
                  onDelete={() => removeFeature(index)}
                  deleteIcon={<i className="tabler-x" />}
                  variant="outlined"
                  size="small"
                />
              ))}
            </div>
          </Grid>

           <Grid size={{ xs: 12, md: 6 }}>
              <CustomTextField
                select
                fullWidth
                value={product || ''}
                onChange={(e) =>  setProduct(e.target.value)}
                label={
                  <Typography variant="subtitle2" className="mb-2">
                    Produit lié directement <span className="text-red-500">*</span>
                  </Typography>
                }
                placeholder="Sélectionner un produit *"
              >
                <MenuItem value="">Aucun</MenuItem>
                {allProducts.map((product, index) => (
                  <MenuItem key={index} value={product._id}>
                    {product.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>

          {/* <Grid size={{ xs: 12 }}>
            <CustomAutocomplete
              fullWidth
              multiple
              value={relatedProducts}
              onChange={(event, value) => setRelatedProducts(value)}
              options={allProducts}
              getOptionLabel={(option) => option._id}
              renderInput={(params) => <CustomTextField {...params} label="Produits liés" />}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip 
                    label={option.name} 
                    size="small" 
                    {...getTagProps({ index })} 
                    key={option._id} 
                  />
                ))
              }
            />
          </Grid> */}

          {/* <Grid size={{ xs: 12 }}>
            <CustomAutocomplete
              fullWidth
              value={subscriptionTypes.find(type => type.value === subscriptionType) || null}
              onChange={(event, value) => setSubscriptionType(value?.value || 'subscription')}
              options={subscriptionTypes}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => <CustomTextField {...params} label="Type de produit" />}
            />
          </Grid> */}
          <div className='flex items-center gap-4'>
            <Button variant='contained' onClick={handleFormSubmit}>
              {subscriptionData ? 'Enregistrer':'Ajouter'}
            </Button>
            <Button variant='tonal' color='error' type='reset' onClick={handleReset}>
              Annuler
            </Button>
          </div>
        {/* </form> */}
      </div>
    </Drawer>
  )
}

export default AddCategoryDrawer
