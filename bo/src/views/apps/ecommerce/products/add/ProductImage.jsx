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
import { useDropzone } from 'react-dropzone'

// Component Imports
import Link from '@components/Link'
import CustomAvatar from '@core/components/mui/Avatar'

// Styled Component Imports
import AppReactDropzone from '@/libs/styles/AppReactDropzone'

// Styled Dropzone Component
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

const ProductImage = ({ setSelectedFiles, selectedFiles, selectedFiles2, setSelectedFiles2 }) => {
  // States
  const [files, setFiles] = useState([])

  // Hooks
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file)));
      setSelectedFiles(acceptedFiles.map(file => Object.assign(file)));
    }
  })

  const renderFilePreview = file => {
    if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file)} />
    } else {
      return <i className='tabler-file-description' />
    }
  }

  const handleRemoveFile = file => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter(i => i.name !== file.name)

    setFiles([...filtered])
  }

  const fileList = files.map(file => (
    <ListItem key={file.name} className='pis-4 plb-3'>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div>
          <Typography className='file-name font-medium' color='text.primary'>
            {file.name}
          </Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <i className='tabler-x text-xl' />
      </IconButton>
    </ListItem>
  ))

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  return (
    <Dropzone>
      <Card>
      <CardHeader
        title={
          <Typography component="span">
            Images de la propriété <Typography component="span" color="error" variant=''>*</Typography>
          </Typography>
        }
        subheader="La première image téléchargée sera définie comme image principale."
        sx={{ '& .MuiCardHeader-action': { alignSelf: 'center' }, color: '#1976d2' }}
      />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Veuillez télécharger des images de haute qualité pour une meilleure présentation.
              📌 Taille idéale : <strong>1200x800 px</strong> | Poids max : <strong>2 Mo</strong> | Formats acceptés : <strong>JPEG, PNG, WebP</strong>.
            </Typography>
          </CardContent>
        <CardContent>
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <div className='flex items-center flex-col gap-2 text-center'>
              <CustomAvatar variant='rounded' skin='light' color='secondary'>
                <i className='tabler-upload' />
              </CustomAvatar>
              <Typography variant='h4'>Glissez-déposez votre image ici.</Typography>
              <Typography color='text.disabled'>or</Typography>
              <Button variant='tonal' size='small'>
                Parcourir les images
              </Button>
            </div>
          </div>
          {files.length ? (
            <>
              <List>{fileList}</List>
              <div className='buttons'>
                <Button color='error' variant='tonal' onClick={handleRemoveAllFiles}>
                Supprimer tout
                </Button>
                <Button variant='contained'>Télécharger les fichiers</Button>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>
    </Dropzone>
  )
}

export default ProductImage
