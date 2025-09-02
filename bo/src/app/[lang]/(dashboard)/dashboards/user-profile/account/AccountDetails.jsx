'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { countries } from '@/components/country/country'
import { hideLoader, showLoader } from '@/components/Loader/loaderService'
import { showToast } from '@/components/ToastNotification/ToastNotification'
import UploadPDFFile from '@/components/UploadsPdfFile/DocumentFile '
import { useAuthStore } from '@/contexts/GlobalContext'
import { useDropzone } from 'react-dropzone'
import { API_URL_ROOT } from '@/settings'
import { Avatar, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import UploadPDFFile2 from '@/components/UploadsPdfFile/DocumentFile2'
import ProductImage2 from '@/components/selectProductImages/ProductImage2'
import ReactCountryFlag from 'react-country-flag'

import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

// Vars
const initialData = {
  name: '',
  phoneNumber: '',
  address: '',
  city: '',
  country: {name: '', code: ''},
  district: '',
  sexe: '',
  documents2: [],
  documents: [],
  role: '',
  nameEntreprise: '',
  ifu: '',
  rccm: ''
}


const AccountDetails = ({ data }) => {
  // States
  const { user, token, getUserById, updatePhoto, updateUser } = useAuthStore();
  const [ userProfile, setUserProfile] = useState(null);
  const [ picture, setPicture ] = useState("");
  const [ documents, setDocuments ] = useState([]);
  const [ documents2, setDocuments2 ] = useState([]);
  const [ account, setAccount ] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFilesBack, setSelectedFilesBack] = useState([]);
  const [selectedFiles2, setSelectedFiles2] = useState([]);

  const [isModified, setIsModified] = useState(false);
  const [formData, setFormData] = useState(initialData)

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 
      'image/png': [], 
      'image/jpeg': [], 
      'image/jpg': [] 
    },
    multiple: false, // Empêche plusieurs fichiers
    onDrop: acceptedFiles => {
      setPicture(acceptedFiles[0]); // Stocke uniquement le premier fichier
    }
  });  

  const handleUpdate = async () => {
      if (user && user._id && isModified) {
       
        const formDataUp = new FormData();
        if (formData.email) formDataUp.append("email", formData.email);
        if (formData.name) formDataUp.append("name", formData.name);
        if (formData.phoneNumber) formDataUp.append("phoneNumber", formData.phoneNumber);
        if (formData.sexe) formDataUp.append("sexe", formData.sexe);
        if (formData.city) formDataUp.append("city", formData.city);
        if (formData.country) formDataUp.append("country", formData?.country?.name);
        if (formData.district) formDataUp.append("district", formData.district);
        if (formData.address) formDataUp.append("address", formData.address);
        if (formData.nameEntreprise) formDataUp.append("entreprise", formData.nameEntreprise);
        if (formData.ifu) formDataUp.append("ifu", formData.ifu);
        if (formData.rccm) formDataUp.append("rccm", formData.rccm);
        if (account) formDataUp.append("account", account);

        /* if (formData.birthDate) formDataUp.append("birthDate", formData.birthDate);
        if (formData.nationality) formDataUp.append("nationality", formData.nationality);
        if (formData.bio) formDataUp.append("bio", formData.bio); */

        formDataUp.append("documents2", JSON.stringify(documents2));
        
      /*   for(const file of documents) {
          formDataUp.append("pdf", file);
        } */

        if (selectedFiles) {
          formDataUp.append("images", selectedFiles[0]);
        }

        if (documents) {
          formDataUp.append("pdf", documents[0]);
        }

          try {
              showLoader()
              const status = await updateUser(user._id, formDataUp);
              hideLoader();

              if (status === 200) {
                  fetchUserProfile();
                  showToast("Profil mis à jour avec succès. Veuillez attendre la validation de votre compte avant de commencez à publier vos biens.", "success", 5000);
                  setIsModified(false);
                  window.location.reload();
              } else {
                  showToast("Erreur inconnue. Veuillez réessayer", "error", 5000);
              }
          } catch (error) {
              console.log(error);
              showToast("Erreur inconnue. Veuillez réessayer", "error", 5000);
          }
          hideLoader();
      }
  }

  const updateUserPhoto = async () => {
      if (user && user._id && picture) {
          const form = new FormData();
          form.append("profile", picture);

          showLoader();
          try {
              const status = await updatePhoto(user._id, form);
              hideLoader();
  
              if (status === 200) {
                  showToast("Modification effectuée", "success", 5000);
                  window.location.reload()
              } else {
                  showToast("Erreur inconnue. Veuillez réessayer", "error", 5000);
              }
          } catch (error) {
              console.log(error);
              showToast("Erreur inconnue. Veuillez réessayer", "error", 500);
          }
          hideLoader();
      }
  }
 

  const fetchUserProfile = async () => {
      try {
          const { data: userData, status } = await getUserById(user._id);
          if (status === 200) {
              setUserProfile(userData);

              setFormData({
                name: userData?.name,
                city: userData?.city,
                district: userData?.district,
                sexe: userData?.sexe,
                address: userData?.address,
                phoneNumber: userData?.phoneNumber,
                role: userData?.role,
                documents2: userData?.documents,
                rccm: userData?.rccm,
                ifu: userData?.ifu,
                nameEntreprise: userData?.entreprise,
                country: countries.find(country => country?.name === userData?.country)
              })
          }
      } catch (error) {
          console.log(error);
      }
  }

  useEffect(() => {
    fetchUserProfile();
  }, [user]);
/* 
  useEffect(() => {
      // fetchUserProfile();
      if (data) {
        setFormData({
          name: data?.name,
          country: data?.country,
          city: data?.city,
          district: data?.district,
          sexe: data?.sexe,
          address: data?.address,
          phoneNumber: data?.phoneNumber,
          role: data?.role,
          documents2: data?.documents,
          rccm: data?.rccm,
          ifu: data?.ifu,
          nameEntreprise: data?.entreprise
        });

        if (data?.country) {
          setFormData({
            ...formData,
            country: countries.find(country => country.name === data?.country)
          })
        }

        setAccount(data?.account)

        setDocuments2(data?.documents);
      }
  }, [data]); */

  useEffect(() => {
    if (picture) {
      updateUserPhoto();
    }
  }, [picture]);

  return (
    <Card>
      <CardContent className='mbe-4'>
        <div className='flex max-sm:flex-col items-center gap-6'>
          {data?.picture ? (
              <img
                height={80} 
                width={80} 
                src={API_URL_ROOT + data?.picture} 
                // onError={handleImageError}
                className='rounded' 
                alt='Profile Background'
              />
          ):(
            <Avatar
              alt={"Marx"}
              src={''}
              className='cursor-pointer bs-[80px] is-[80px]'
            />
          )}
          <div className='flex flex-grow flex-col gap-4'>
            <div className='flex flex-col sm:flex-row gap-4'>
            <Button 
              {...getRootProps()} 
              component='label' 
              variant='contained' 
              htmlFor='account-settings-upload-image'
              size='small'
            >
              <input {...getInputProps()} />
              Télécharger une photo
            </Button>
             {/*  <Button variant='tonal' color='secondary' onClick={handleFileInputReset}>
                Reset
              </Button> */}
            </div>
            <Typography>JPG ou PNG autorisés. Taille maximale de 800K</Typography>
          </div>
        </div>
      </CardContent>
      <CardContent>
        <form onSubmit={e => e.preventDefault()}>
          <Grid size={{ xs: 12 }} className='flex justify-end mb-5'>
            {!isModified ? (
              <Button variant='contained' color='warning'
                onClick={() => setIsModified(true)}>
                Modifier
              </Button>
            ): (
              <Button variant='contained' color='success' type='submit'
                onClick={handleUpdate}>
                Enrégistrer
              </Button>
            ) }
          </Grid>
          <Grid container spacing={6}>
            <Box
              sx={{
                border: '1px solid #ccc',
                borderRadius: 2,
                p: 5,
                backgroundColor: '#f9f9f9',
                width: '100%'
              }}
            >
              <Grid container spacing={6}>
                <Grid size={{ xs: 12}}>
                  <FormControl component="fieldset">
                    <FormLabel>Type de compte</FormLabel>
                    <RadioGroup defaultValue='personnel' value={account} onChange={(e) => setAccount(e.target.value)}
                      className='flex flex-row gap-6'>
                      <FormControlLabel value='particulier' control={<Radio />} label='Particulier' />
                      <FormControlLabel value='entreprise' control={<Radio />} label='Entreprise' />
                    </RadioGroup>
                  </FormControl> 
                </Grid>
                {account === 'entreprise' ? (
                  <>
                    <Typography variant='h5'>Information entreprise</Typography>
                    <Grid size={{ xs: 12 }}>
                      <CustomTextField
                        fullWidth
                        label='Nom Entreprise'
                        value={formData?.nameEntreprise}
                        placeholder='John'
                        onChange={e => handleFormChange('nameEntreprise', e.target.value)}
                        disabled={!isModified}
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <CustomTextField
                        fullWidth
                        label='IFU'
                        value={formData?.ifu}
                        placeholder='Votre IFU'
                        onChange={e => handleFormChange('ifu', e.target.value)}
                        disabled={!isModified}
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <CustomTextField
                        fullWidth
                        label='RCCM'
                        value={formData?.rccm}
                        placeholder='Votre RCCM'
                        onChange={e => handleFormChange('rccm', e.target.value)}
                        disabled={!isModified}
                      />
                    </Grid>
                  </>
                ) : null}
              </Grid>
            </Box>

            <Typography variant='h5'>Information personnel</Typography>
            <Grid size={{ xs: 12 }}>
              <CustomTextField
                fullWidth
                label='Nom complet'
                value={formData?.name}
                placeholder='John'
                onChange={e => handleFormChange('name', e.target.value)}
                disabled={!isModified}
              />
            </Grid>
          {/*   <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Email'
                value={data?.email}
                placeholder='john.doe@gmail.com'
                onChange={e => handleFormChange('email', e.target.value)}
                
              />
            </Grid> */}
             <Grid size={{ xs: 12, sm: 6 }} sx={{
              paddingTop: '15px !important',
              '& .PhoneInput': { height: '40px' }, 
              '& .PhoneInputInput': { 
                height: '40px', 
                width: '100%', 
                borderRadius: '6px', 
                border: '1px solid rgba(61, 61, 61, 0.2)', 
                padding: '0 14px' ,
                outline: 'none',
              } }}>
                <PhoneInput
                  international
                  defaultCountry="BJ"
                  value={formData?.phoneNumber}
                  onChange={value => handleFormChange('phoneNumber', value)}
                  disabled={!isModified}
                  placeholder="Entrez votre numéro"
                  containerClass='phone-input-container'
                  buttonClass='phone-input-button'
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                select
                fullWidth
                label='Sexe'
                value={formData?.sexe}
                onChange={e => handleFormChange('sexe', e.target.value)}
                disabled={!isModified}
              >
                <MenuItem key={"male"} value={"male"}>Masculin</MenuItem>
                <MenuItem key={"female"} value={"female"}>Féminin</MenuItem>
              </CustomTextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
                select
                fullWidth
                label='Pays'
                value={formData?.country}
                onChange={e => handleFormChange('country', e.target.value)}
                disabled={!isModified}
              >
                {countries.map((list) => (
                  <MenuItem key={list.name} value={list.name}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', pr: 4 }}>
                      <ReactCountryFlag
                        countryCode={list.code}
                        svg
                        style={{
                          width: '20px',
                          height: '20px',
                          flexShrink: 0
                        }}
                      />
                      <Typography sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13 }}>
                        {list.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
                        {list.dial_code}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Ville'
                value={formData?.city}
                placeholder='New York'
                onChange={e => handleFormChange('city', e.target.value)}
                disabled={!isModified}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Quartier'
                value={formData?.district}
                placeholder='New York'
                onChange={e => handleFormChange('district', e.target.value)}
                disabled={!isModified}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Adresse de résidence'
                value={formData?.address}
                placeholder='Address'
                onChange={e => handleFormChange('address', e.target.value)}
                disabled={!isModified}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <ProductImage2 setSelectedFiles={setSelectedFilesBack} selectedFiles={selectedFilesBack}
                setSelectedFiles2={setSelectedFiles2} selectedFiles2={selectedFiles2}
                subtitle={"Télécharger une image clair et de bonne qualité ( png, jpg, jpeg )"}
                title={"Photo"} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <UploadPDFFile2 selectedFiles={documents} setSelectedFiles={setDocuments}
                selectedFiles2={documents2} setSelectedFiles2={setDocuments2}
                title={"Télécharger votre CIP ou carte d'identité valide"} text={"Veuillez télécharger un fichier pdf"} />
            </Grid>
         {/*    {["agent","owner"].includes(formData?.role) && (
              
                <Grid size={{ xs: 12 }}>
                  <UploadPDFFile selectedFiles={documents} setSelectedFiles={setDocuments}
                    selectedFiles2={documents2} setSelectedFiles2={setDocuments2}
                    title={"Télécharger votre CIP"} text={"Veuillez télécharger les documents demandé"} />
                </Grid>
            )} */}
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default AccountDetails
