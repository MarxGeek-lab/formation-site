'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// Third-party Imports
import { Box } from '@mui/material'
import CustomAvatar from '@/@core/components/mui/Avatar'
import AppReactDropzone from '@/libs/styles/AppReactDropzone'
import { useDropzone } from 'react-dropzone'

const Dropzone = styled(AppReactDropzone)(({ theme }) => ({
  '& .dropzone': {
    minHeight: 'unset',
    padding: theme.spacing(12),
    [theme.breakpoints.down('sm')]: {
      paddingInline: theme.spacing(5)
    },
    '&+.MuiList-root .MuiListItem-root .file-name': {
      fontWeight: theme.typography.body1.fontWeight
    }
  }
}))

const UploadPDFFile2 = ({ 
  setSelectedFiles, selectedFiles, selectedFiles2,
  title, textBtn, subtitle, type = 'pdf'
 }) => {
  // States
  const [files, setFiles] = useState(null)

  // Hooks
  const { getRootProps, getInputProps } = useDropzone({
    accept: type === 'pdf' 
      ? { 'application/pdf': [] }
      : { 
          'video/mp4': [],
          'video/avi': [],
          'video/mov': [],
          'video/wmv': [],
          'video/flv': [],
          'video/webm': [],
          'video/mkv': []
        }, 
    onDrop: acceptedFiles => {
      const file = acceptedFiles[0]; // Prendre seulement le premier fichier
      setFiles(file);
      setSelectedFiles(file);
    }
  })

  const renderFilePreview = file => {
    if (file.type.startsWith('image')) {
      return <img width={50} height={50} alt={file.name} src={URL.createObjectURL(file)} />
    } else if (file.type.startsWith('video')) {
      return <i className='tabler-video' />
    } else {
      return <i className='tabler-file-description' />
    }
  }

  const handleRemoveFile = file => {
    setFiles(null)
    setSelectedFiles(null)
  }

  const fileList = files ? (
    <ListItem key={files.name} className='pis-4 plb-3'>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(files)}</div>
        <div>
          <Typography className='file-name font-medium' color='text.primary'>
            {files.name}
          </Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(files.size / 100) / 10 > 1000
              ? `${(Math.round(files.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(files.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(files)}>
        <i className='tabler-x text-xl' />
      </IconButton>
    </ListItem>
  ) : null

  const handleRemoveAllFiles = () => {
    setFiles(null)
    setSelectedFiles(null)
  }

  return (
    <Dropzone>
      <Card>
      <CardHeader
        title={
          <Typography variant="h5" fontWeight={500}>
            {title} <Typography component="span" color="error" variant=''>*</Typography>
          </Typography>
        }
        subheader={subtitle}
        sx={{ '& .MuiCardHeader-action': { alignSelf: 'center' }, color: '#1976d2' }}
      />
      <CardContent>
        <Typography variant='body2'>{subtitle}</Typography> 
          {files ? (
            files.type.startsWith('video') && (
              <div className='mt-4'>
                <Typography variant='h6' className='mb-2'>Aperçu vidéo :</Typography>
                <video 
                  width="100%" 
                  height="300" 
                  controls 
                  style={{ borderRadius: '8px', border: '1px solid #ccc' }}
                >
                  <source src={URL.createObjectURL(files)} type={files.type} />
                  Votre navigateur ne supporte pas la lecture vidéo.
                </video>
              </div>
            )
          ): (
            <>
            <div {...getRootProps({ className: 'dropzone' })} 
              style={{
                border: '1px solid #ccc',
                borderStyle: 'dashed',
                borderRadius: '8px',
              }}>
              <input {...getInputProps()} />
              <div className='flex items-center flex-col gap-2 text-center'>
                <CustomAvatar variant='rounded' skin='light' color='secondary'>
                  <i className='tabler-upload' />
                </CustomAvatar>
                <Typography variant='h5'>Glissez-déposez votre fichier ici.</Typography>
                <Typography color='text.disabled'>or</Typography>
                <Button variant='tonal' size='small'>
                  Parcourir les fichiers
                </Button>
              </div>
            </div>
            </>
          )}
          {files ? (
          <>
            <List>{fileList}</List>
            <div className='buttons mt-4'>
              <Button color='error' variant='tonal' onClick={handleRemoveAllFiles}>
                Supprimer
              </Button>
            </div>
          </>
        ) : null}
        {selectedFiles2 && (
            <div className='mt-4'>
              <Typography variant='h6' className='mb-2'>Fichier existant :</Typography>
              {selectedFiles2.includes('.mp4') || selectedFiles2.includes('.avi') || selectedFiles2.includes('.mov') || selectedFiles2.includes('.wmv') || selectedFiles2.includes('.flv') || selectedFiles2.includes('.webm') || selectedFiles2.includes('.mkv') ? (
                <div>
                  <video 
                    width="100%" 
                    height="300" 
                    controls 
                    style={{ borderRadius: '8px', border: '1px solid #ccc' }}
                  >
                    <source src={selectedFiles2} type="video/mp4" />
                    Votre navigateur ne supporte pas la lecture vidéo.
                  </video>
                  <Box className='mt-2'>
                    <Button variant='outlined' size='small' onClick={() => {
                      window.open(selectedFiles2, '_blank')
                    }}>
                      Ouvrir dans un nouvel onglet
                    </Button>
                  </Box>
                </div>
              ) : (
                <Box>
                  <Button variant='outlined' size='small' onClick={() => {
                    window.open(selectedFiles2, '_blank')
                  }}>
                    Cliquer pour voir le document
                  </Button>
                </Box>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Dropzone>
  )
}

export default UploadPDFFile2
