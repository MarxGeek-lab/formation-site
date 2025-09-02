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
import { useAnnoncesStore, useAuthStore } from '@/contexts/GlobalContext'
import { showToast } from '@/components/ToastNotification/ToastNotification'
import { hideLoader, showLoader } from '@/components/Loader/loaderService'
import { Chip, InputAdornment } from '@mui/material'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'


const AddAnnonce = props => {
  // Props
  const { open, handleClose, annonceData, setData, fetchAnnonces, setAnnonceData } = props

  const { addAnnonce, updateAnnonce } = useAnnoncesStore();
  const { user } = useAuthStore();

  // States
  const [file, setFile] = useState(null)
  const [typeUser, setTypeUser] = useState(['user'])

  const typeUsers = ['owner','agent','user'];

  // Refs
  const fileInputRef = useRef(null)

  // Handle Form Submit
  const handleFormSubmit = async () => {
    if (annonceData) {
      if (!file && !typeUser) {
        showToast('Remplissez tous les champs');
        return;
      }
    }
    
    const newData = new FormData();
    if (typeUser.length > 0) newData.append('typeUser', JSON.stringify(typeUser));

    if (file) {
      newData.append('images', file);
    }

    showLoader();

    try {
      let res;
      if (annonceData) {
        res = await updateAnnonce(annonceData?._id, newData);
      } else {
        res = await addAnnonce(newData);
      }
      hideLoader();
      console.log(res);

      if (res === 201) {
        handleReset();
        fetchAnnonces();
        showToast('Annonce ajouté avec succès', 'success', 5000);
      } else if (res === 200) {
        fetchAnnonces();
        setAnnonceData(null)
        handleReset();
        showToast('Annonce mise à jour', 'success', 5000);
      } else {
        showToast('Une erreur est survenue. Veuillez réessayer.', 'error', 5000);
      }
    } catch (error) {
      console.log(error)
    }
    
  }

  // Handle File Upload
  const handleFileUpload = (event) => {
    const { files } = event.target;
  
    if (files && files.length > 0) {
      const file = files[0];
  
      const allowedTypes = ['image/jpeg', 'image/png', 'image/web', 'image/jpg']; 
      if (allowedTypes.includes(file.type)) {
        console.log('Fichier sélectionné :', file);
        setFile(file);
      } else {
        showToast('Type de fichier non autorisé.', 'warning', 5000);
      }
    } else {
      console.error('Aucun fichier sélectionné.');
    }
  };

  // Handle Form Reset
  const handleReset = () => {
    handleClose()
    setTypeUser([])
    setFile(null)
  }

  useEffect(() => {
    if (annonceData) {
      setTypeUser(annonceData?.typeUser);
    }
  },[annonceData]);

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 600 } } }}
    >
      <div className='flex items-center justify-between pli-6 plb-5'>
        <Typography variant='h5'>{annonceData ? 'Modifier':'Nouveau'}</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='tabler-x text-textSecondary text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='flex flex-col gap-5 p-6'>
        {/* <form onSubmit={handleSubmit(data => handleFormSubmit(data))} className='flex flex-col gap-5'> */}
        {/*   <CustomTextField
            fullWidth
            label='Titre'
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder='...'
          />  */}

          <div className='flex items-end gap-4'>
            <CustomTextField
              label='Flyers'
              placeholder='No file chosen'
              value={file?.name}
              className='flex-auto'
              slotProps={{
                input: {
                  readOnly: true,
                  endAdornment: file ? (
                    <InputAdornment position='end'>
                      <IconButton size='small' edge='end' onClick={() => setFile(null)}>
                        <i className='tabler-x' />
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }
              }}
            />
            <Button component='label' variant='tonal' htmlFor='contained-button-file' className='min-is-fit'>
              Choisissez
              <input hidden id='contained-button-file' type='file' onChange={handleFileUpload} ref={fileInputRef} />
            </Button>
          </div>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomAutocomplete
              fullWidth
              multiple
              value={typeUser}
              onChange={(event, value) => setTypeUser(value)} // Évite les valeurs vides
              options={typeUsers}
              getOptionLabel={(option) => option}
              renderInput={(params) => <CustomTextField {...params} label="Type d'utilisateurs" />}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip label={option} size="small" {...getTagProps({ index })} key={index} />
                ))
              }
            />
          </Grid>
          <div className='flex items-center gap-4'>
            <Button variant='contained' onClick={handleFormSubmit}>
              {annonceData ? 'Enrégistrer':'Ajouter'}
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

export default AddAnnonce
