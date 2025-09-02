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
import { useAdminStore, useAuthStore } from '@/contexts/GlobalContext'
import { showToast } from '@/components/ToastNotification/ToastNotification'
import { hideLoader, showLoader } from '@/components/Loader/loaderService'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import { Chip } from '@mui/material'
import { permissionsArray2 } from '@/data/constant'

const AddCategoryDrawer = props => {
  // Props
  const { open, handleClose, adminData, setData, fetchAdmin, setAdminData } = props

  const { createAdmin, updateAdmin } = useAdminStore();
  const { user } = useAuthStore();

  // States
  const [file, setFile] = useState(null)
  const [category, setCategory] = useState('')
  const [name, setName] = useState('')
  const [permissions, setPermissions] = useState([])
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  const permissionsArray = [
    { value: 'manage_properties', label: 'Gérer les propriétés' },
    { value: 'manage_users', label: 'Gérer les utilisateurs' },
    { value: 'view_statistics', label: 'Voir les statistiques' },
    { value: 'view_rentals', label: 'Voir les locations' },
    { value: 'view_reservations', label: 'Voir les réservations' },
    { value: 'manage_content', label: 'Gérer le contenu' },
    { value: 'manage_admin', label: 'Gérer les administrateurs' },
    { value: 'manage_supports', label: 'Gérer les supports' },
    { value: 'manage_settigns', label: 'Gérer les paramètres' },
    { value: 'all', label: 'Tous les accès' },
  ];

  // Handle Form Submit
  const handleFormSubmit = async data => {

    if (name && email) {
      const newData = {
        name, email, phoneNumber, permissions, admin: user?._id
      }

      showLoader();

      try {
        let res;
        if (adminData) {
          res = await updateAdmin(adminData?._id, newData);
        } else {
          res = await createAdmin(newData);
        }
        hideLoader();
        console.log(res);

        if (res === 201) {
          handleReset();
          fetchAdmin();
          showToast('Administrateur ajouté avec succès', 'success', 5000);
        } else if (res === 200) {
          fetchAdmin();
          setAdminData(null)
          handleReset();
          showToast('Administrateur mise à jour', 'success', 5000);
        }
        else if (res === 400) {
          showToast('Cet administrateur existe déjà.', 'error', 5000);
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
    setName('')
    setEmail('')
    setPhoneNumber('')
    setPermissions([])
  }

  useEffect(() => {
    if (adminData) {
      setName(adminData?.name);
      setEmail(adminData?.email);
      setPhoneNumber(adminData?.phoneNumber);
      setPermissions(adminData?.permissions);
    }
  },[adminData]);

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
        <Typography variant='h5'>{adminData ? 'Modifier':'Nouveau'}</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='tabler-x text-textSecondary text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='flex flex-col gap-5 p-6'>
        {/* <form onSubmit={handleSubmit(data => handleFormSubmit(data))} className='flex flex-col gap-5'> */}
          <CustomTextField
            fullWidth
            label='Nom complet'
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder='...'
          /> 

          <CustomTextField
            fullWidth
            label='Email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder='...'
          /> 

          <CustomTextField
            fullWidth
            label='Téléphone'
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            placeholder='...'
          /> 
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

          <Grid size={{ xs: 12, md: 6 }}>
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
          </Grid>
          <div className='flex items-center gap-4'>
            <Button variant='contained' onClick={handleFormSubmit}>
              {adminData ? 'Enrégistrer':'Ajouter'}
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
