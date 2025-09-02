// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Alert from '@mui/material/Alert'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { useRef, useState } from 'react'
import { Button, IconButton, InputAdornment, TextareaAutosize, TextField, Typography } from '@mui/material'

const Profile = ({
  supportEmail, setSupportEmail,
  contactPhoneCall, setContactPhoneCall,
  contactPhoneWhatsapp, setContactPhoneWhatsapp,
  description, setDescription, logoFile, setLogoFile,
  websiteTitle, setWebsiteTitle
}) => {
  const fileInputRef = useRef(null)
  // States
  const [file, setFile] = useState(null)
 
 // Handle File Upload
  const handleFileUpload = (event) => {
    const { files } = event.target;
  
    if (files && files.length > 0) {
      const file = files[0];
  
      const allowedTypes = ['image/jpeg', 'image/png', 'image/web', 'image/jpg']; 
      if (allowedTypes.includes(file.type)) {
        console.log('Fichier sélectionné :', file);
        setFile(file);
        setLogoFile(file);
      } else {
        showToast('Type de fichier non autorisé.', 'warning', 5000);
      }
    } else {
      console.error('Aucun fichier sélectionné.');
    }
  };

  return (
    <Card>
      <Typography variant="h5" fontWeight={600} className="mx-6 my-4">
        Informations support
      </Typography>
      <CardContent>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField 
              fullWidth label='Nom du site' 
              placeholder='...' 
              value={websiteTitle}
              onChange={(e) => setWebsiteTitle(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant='body2'>
              Description du site
            </Typography>
            <TextField
              fullWidth multiline
              placeholder='...'
              value={description}
              onChange={(e) => setDescription(e.target.value)} 
              rows={4}
              />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <div className='flex items-end gap-4'>
              <CustomTextField
                label='Logo du site'
                placeholder='Aucun fichier sélectionné'
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
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField 
              fullWidth label='Support email' 
              placeholder='...' 
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField 
              fullWidth label='Support contact' 
              placeholder='...'
              value={contactPhoneWhatsapp}
              onChange={(e) => setContactPhoneWhatsapp(e.target.value)} 
              />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField 
              fullWidth label='Numéro appel' 
              placeholder='2290169816413' 
              value={contactPhoneCall}
              onChange={(e) => setContactPhoneCall(e.target.value)}
            />
          </Grid>
         {/*  <Grid size={{ xs: 12 }}>
            <Alert severity='warning' icon={<i className='tabler-bell' />} className='font-medium text-lg'>
              Confirm that you have access to johndoe@gmail.com in sender email settings.
            </Alert>
          </Grid> */}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default Profile
