// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Components Imports
import { useAdminAffiliationStore } from '@/contexts/GlobalContext'
import { showToast } from '@/components/ToastNotification/ToastNotification'
import { hideLoader, showLoader } from '@/components/Loader/loaderService'
import CustomTextField from '@core/components/mui/TextField'

const AddAffiliateDrawer = props => {
  const { open, handleClose, affiliateData, setData, fetchAffiliates, setAffiliateData } = props
  const { createAffiliate, updateAffiliate } = useAdminAffiliationStore()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [refCode, setRefCode] = useState('')
  const [affiliateLink, setAffiliateLink] = useState('')

  // Pré-remplissage si édition
  useEffect(() => {
    if (affiliateData) {
      setName(affiliateData?.name)
      setEmail(affiliateData?.email)
      setPhoneNumber(affiliateData?.phoneNumber)
      setRefCode(affiliateData?.refCode)
      setAffiliateLink(affiliateData?.affiliateLink)
    }
  }, [affiliateData])
  
  const generateRefCode = (length = 6) => {
    console.log('generateRefCode appelé'); // <-- vérifier l'appel
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let out = "";
    for (let i = 0; i < 6; i++) {
      const index = Math.floor(Math.random() * chars.length);
      out += chars[index];
    }
    setRefCode(out);
    setAffiliateLink(`${window.location.origin}/fr?ref=${out}`);
  };
  
  
    
  const handleFormSubmit = async () => {
    if (!name || !email) {
      showToast('Veuillez remplir tous les champs obligatoires', 'error', 5000)
      return
    }

    const newData = { 
      name, 
      email, 
      phoneNumber, 
      refCode 
    }

    showLoader()
    try {
      let res
      if (affiliateData) {
        res = await updateAffiliate(affiliateData?._id, newData)
      } else {
        res = await createAffiliate(newData)
      }
      hideLoader()
console.log(res)
      if (res.status === 201 || res.status === 200) {
        fetchAffiliates()
        setAffiliateData(null)
        handleReset()
        showToast(affiliateData ? 'Affilié mis à jour avec succès' : 'Affilié ajouté avec succès', 'success', 5000)
      } else if (res.status === 409) {
        showToast('Ce affilié existe déjà.', 'error', 5000)
      } else {
        showToast('Une erreur est survenue. Veuillez réessayer.', 'error', 5000)
      }
    } catch (error) {
      console.log(error)
      hideLoader()
    }
  }

  const handleReset = () => {
    handleClose()
    setName('')
    setEmail('')
    setPhoneNumber('')
    setAffiliateLink('')
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between pl-6 pb-5 pt-6'>
        <Typography variant='h5'>{affiliateData ? 'Modifier affilié' : 'Nouvel affilié'}</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='tabler-x text-textSecondary text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='flex flex-col gap-5 p-6'>
        <CustomTextField
          fullWidth
          label='Nom complet'
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder='Nom complet'
        /> 

        <CustomTextField
          fullWidth
          label='Email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder='Email'
          disabled={affiliateData}
        /> 

        <CustomTextField
          fullWidth
          label='Téléphone'
          value={phoneNumber}
          onChange={e => setPhoneNumber(e.target.value)}
          placeholder='Téléphone'
        /> 

        <CustomTextField
          fullWidth
          label='Code affilié'
          value={refCode}
          onChange={e => setRefCode(e.target.value)}
          placeholder='Code affilié'
        /> 
        <Button variant='contained' onClick={generateRefCode}>Générer</Button>

        {/* {!affiliateData && ( */}
          <CustomTextField
            fullWidth
            label='Lien affilié'
            value={affiliateLink}
            onChange={e => setAffiliateLink(e.target.value)}
            placeholder='Lien affilié (optionnel)'
          /> 
        {/* // )} */}

        <div className='flex items-center gap-4 mt-4'>
          <Button variant='contained' onClick={handleFormSubmit}>
            {affiliateData ? 'Enregistrer' : 'Ajouter'}
          </Button>
          <Button variant='tonal' color='error' onClick={handleReset}>
            Annuler
          </Button>
        </div>
      </div>
    </Drawer>
  )
}

export default AddAffiliateDrawer
