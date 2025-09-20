// React Imports
import { useState, useRef, useEffect } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'

// Components Imports
import CustomTextField from '@core/components/mui/TextField'
import { useAdminStore } from '@/contexts/GlobalContext'
import { showToast } from '@/components/ToastNotification/ToastNotification'
import { hideLoader, showLoader } from '@/components/Loader/loaderService'
import { FormControlLabel, Switch } from '@mui/material'

const AddCategoryDrawer = props => {
  // Props
  const { open, handleClose, categoryData, setData, fetchCategories, setCategoryData } = props

  const { createCategory, updateCategory } = useAdminStore();
  // States
  const [file, setFile] = useState(null)
  const [categoryFr, setCategoryFr] = useState('')
  const [categoryEn, setCategoryEn] = useState('')
  const [isActive, setIsActive] = useState(false)

  // Refs
  const fileInputRef = useRef(null)

  // Handle Form Submit
  const handleFormSubmit = async data => {
    if (categoryFr) {
      const newData = {
        nameFr: categoryFr,
        nameEn: categoryEn,
        isActive: isActive
      };
      showLoader();

      try {
        let res;
        if (categoryData) {
          res = await updateCategory(categoryData?._id, newData);
        } else {
          res = await createCategory(newData);
        }
        hideLoader();
        console.log(res);

        if (res === 201) {
          handleReset();
          fetchCategories();
          showToast('Catégorie ajouté avec succès', 'success', 5000);
        } else if (res === 200) {
          fetchCategories();
          setCategoryData(null)
          handleReset();
          showToast('Catégorie mise à jour', 'success', 5000);
        }
        else if (res === 400) {
          showToast('Cet catégorie existe déjà.', 'error', 5000);
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
    setFile(null)
    setCategoryFr('')
    setCategoryEn('')
    setIsActive(false)
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

  // Handle subcategory changes
  const handleSubcategoryChange = (index, value) => {
    const newSubcategories = [...subcategories];
    newSubcategories[index] = value;
    setSubcategories(newSubcategories);
  };

  useEffect(() => {
    if (categoryData) {
      setCategoryFr(categoryData.nameFr);
      setCategoryEn(categoryData.nameEn);
      setIsActive(categoryData.isActive || false);
    }
  },[categoryData]);

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 }, margin: 'auto' } }}
    >
      <div className='flex items-center justify-between pli-6 plb-5'>
        <Typography variant='h5'>{categoryData ? 'Modifier la catégorie':'Nouvelle catégorie'}</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='tabler-x text-textSecondary text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='flex flex-col gap-5 p-6'>
          <CustomTextField
            fullWidth
            label='Nom en français'
            value={categoryFr}
            onChange={e => setCategoryFr(e.target.value)}
            placeholder='Nom en français'
            required
          />

          <CustomTextField
            fullWidth
            label='Nom en anglais'
            value={categoryEn}
            onChange={e => setCategoryEn(e.target.value)}
            placeholder='Nom en Anglais'
            required
          />

          <FormControlLabel
            control={
              <Switch
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                name="isActive"
              />
            }
            label="Catégorie active"
          />

          <div className='flex items-center gap-4'>
            <Button variant='contained' onClick={handleFormSubmit}>
              {categoryData ? 'Enrégistrer':'Ajouter'}
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
