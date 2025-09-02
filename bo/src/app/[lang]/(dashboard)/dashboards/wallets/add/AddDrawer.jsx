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
import { useAdminStore, useAuthStore, useWalletStore } from '@/contexts/GlobalContext'
import { showToast } from '@/components/ToastNotification/ToastNotification'
import { hideLoader, showLoader } from '@/components/Loader/loaderService'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import { Chip, MenuItem } from '@mui/material'
// import { permissionsArray2 } from '@/data/constant'

const AddDrawer = props => {
  // Props
  const { open, handleClose, requestData, setData, fetchWallet, setRequest, statsSold } = props

  const { createWallet, updateWallet } = useWalletStore();
  const { user, getUserById } = useAuthStore();

  // States
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [userProfile, setUserProfile] = useState();

  // Handle Form Submit
  const handleFormSubmit = async data => {

    if (statsSold?.withdrawableAmount < amount) {
      showToast('Vous ne disposez pas assez de fonds retirable.', 'error', 6000);
      return;
    }
    
    if (amount && phoneNumber) {
      const newData = {
        amount, 
        method: userProfile?.phoneNumberWithdrawal.find(item => item.phoneNumber === phoneNumber)?.network, 
        user: user?._id,
        numberWithdraw: phoneNumber
      }

      showLoader();

      try {
        let res;
        if (requestData) {
          res = await updateWallet(requestData?._id, newData);
        } else {
          res = await createWallet(newData);
        }

        hideLoader();

        if (res === 201) {
          handleReset();
          handleReset();
          fetchWallet();
          showToast('Demande de retrait effectué avec succès', 'success', 5000);
        } else if (res === 200) {
          fetchWallet();
          setRequest(null)
          handleReset();
          showToast('Demande de retrait mise à jour', 'success', 5000);
        }
        else if (res === 400) {
          if (requestData) {
            showToast('Cette demande a été déjà traité. Vous ne pouvez plus le modifié', 'error', 5000);
          } else {
            showToast('Vous ne disposez pas assez de fonds retirable.', 'error', 5000);
          }
        } else {
          showToast('Une erreur est survenue. Veuillez réessayer.', 'error', 5000);
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const fetchUserProfile = async () => {
    if (user) {
        try {
            const { data, status } = await getUserById(user._id);
            if (status === 200) {
                setUserProfile(data);
            }
        } catch (error) {
            console.log(error);
        }
    }
  }

  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  // Handle Form Reset
  const handleReset = () => {
    handleClose()
    setAmount('')
    setMethod('')
    setPhoneNumber('')
  }

  useEffect(() => {
    if (requestData) {
      setAmount(requestData?.amount);
      setMethod(requestData?.method);
      setPhoneNumber(requestData?.numberWithdraw);
    }
  },[requestData]);

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
        <Typography variant='h5'>{requestData ? 'Modifier la demande':'Nouvelle demande de retrait'}</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='tabler-x text-textSecondary text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='flex flex-col gap-5 p-6'>
        {/* <form onSubmit={handleSubmit(data => handleFormSubmit(data))} className='flex flex-col gap-5'> */}
          <CustomTextField
            fullWidth
            label='Montant demandé'
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder='...'
          /> 

          <CustomTextField
            select
            fullWidth
            label='Numéro de réception'
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
          >
            {userProfile && userProfile?.phoneNumberWithdrawal?.map((item, index) => (
              <MenuItem key={index} value={item.phoneNumber}>{item.network + ' - ' + item.phoneNumber}</MenuItem>
            ))}
          </CustomTextField>
            <Button variant='contained' onClick={() => {
              window.location.href = '/fr/dashboards/settings';
            }} color='secondary' size='small' startIcon={<i className='tabler-plus' />}>
              Ajouter un numéro
            </Button>
       {/*  <Grid size={{ xs: 12 }}>
          <CustomAutocomplete
            fullWidth
            multiple
            value={permissions}
            onChange={(event, value) => setPermissions(value)} // Évite les valeurs vides
            options={permissionsArray2}
            getOptionLabel={(option) => option || ""}
            renderInput={(params) => <CustomTextField {...params} label="Permissions" />}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={option} size="small" {...getTagProps({ index })} key={index} />
              ))
            }
          />
        </Grid> */}

         {/*  <Grid size={{ xs: 12, md: 6 }}>
            <CustomAutocomplete
              fullWidth
              multiple
              value={permissions}
              onChange={(event, value) => setPermissions(value)} // Évite les valeurs vides
              options={permissionsArray2}
              getOptionLabel={(option) => option}
              renderInput={(params) => <CustomTextField {...params} label="Type d'événement" />}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip label={option} size="small" {...getTagProps({ index })} key={index} />
                ))
              }
            />
          </Grid> */}
          <div className='flex items-center gap-4'>
            <Button variant='contained' onClick={handleFormSubmit}>
              {requestData ? 'Enrégistrer':'Soumettre'}
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

export default AddDrawer
