'use client'

import { useState, useEffect } from 'react'

// MUI
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

// Custom
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
  setSelectedFiles, 
  selectedFiles, 
  selectedFiles2,
  title, 
  textBtn, 
  subtitle, 
  type = 'pdf'
}) => {
  const [files, setFiles] = useState(null)
  const [filesPdf, setFilesPdf] = useState([])

  // Gestion Dropzone
  const { getRootProps, getInputProps } = useDropzone({
    accept: type === 'pdf' 
      ? { 'application/pdf': [] }
      : { 
          'video/*': [] // tu couvres tous les formats vidéo
        }, 
    onDrop: acceptedFiles => {
      if (type === 'pdf') {
        setFilesPdf([...filesPdf, ...acceptedFiles.map(file => Object.assign(file))]);
        // setFilesPdf(acceptedFiles)
        setSelectedFiles([...filesPdf, ...acceptedFiles.map(file => Object.assign(file))])
      } else {
        const file = acceptedFiles[0]
        console.log("file == ", file instanceof File)
        setFiles(file)
        setSelectedFiles(file)
      }
    }
  })

  // Cleanup URL.createObjectURL
  useEffect(() => {
    return () => {
      if (files) URL.revokeObjectURL(URL.createObjectURL(files))
      filesPdf.forEach(f => URL.revokeObjectURL(URL.createObjectURL(f)))
    }
  }, [files, filesPdf])

  const formatSize = (size) => {
    return size > 1024 * 1024
      ? `${(size / (1024 * 1024)).toFixed(1)} MB`
      : `${(size / 1024).toFixed(1)} KB`
  }

  const renderFilePreview = (file) => {
    if (file.type.startsWith('image')) {
      return <img width={50} height={50} alt={file.name} src={URL.createObjectURL(file)} />
    } else if (file.type.startsWith('video')) {
      return <i className='tabler-video' />
    } else {
      return <i className='tabler-file-description' />
    }
  }

  // Suppression fichiers
  const handleRemoveFile = () => {
    setFiles(null)
    setSelectedFiles(null)
  }

  const handleRemoveFilePdf = (file) => {
    const filtered = filesPdf.filter(i => i.name !== file.name)
    setFilesPdf(filtered)
    setSelectedFiles(filtered)
  }

  const handleRemoveAllFilesPdf = () => {
    setFilesPdf([])
    setSelectedFiles([])
  }


  return (
    <Dropzone>
      <Card>
        <CardHeader
          title={
            <Typography variant="h5" fontWeight={500}>
              {title} <Typography component="span" color="error">*</Typography>
            </Typography>
          }
          subheader={subtitle}
          sx={{ '& .MuiCardHeader-action': { alignSelf: 'center' }, color: '#1976d2' }}
        />
        <CardContent>
          <Typography variant='body2'>{subtitle}</Typography> 

          {/* Zone de drop */}
          <div {...getRootProps({ className: 'dropzone' })} 
            style={{
              border: '1px dashed #ccc',
              borderRadius: '8px',
              marginTop: '16px'
            }}>
            <input {...getInputProps()} />
            <div className='flex items-center flex-col gap-2 text-center'>
              <CustomAvatar variant='rounded' skin='light' color='secondary'>
                <i className='tabler-upload' />
              </CustomAvatar>
              <Typography variant='h5'>Glissez-déposez votre fichier ici.</Typography>
              <Typography color='text.disabled'>ou</Typography>
              <Button variant='tonal' size='small'>
                Parcourir les fichiers
              </Button>
            </div>
          </div>

          {/* Liste PDF */}
          {type === 'pdf' && filesPdf.length > 0 && (
            <>
              <List>
                {filesPdf.map(file => (
                  <ListItem key={file.name} className='pis-4 plb-3'>
                    <div className='file-details'>
                      <div className='file-preview'>{renderFilePreview(file)}</div>
                      <div>
                        <Typography className='file-name font-medium' color='text.primary'>
                          {file.name}
                        </Typography>
                        <Typography className='file-size' variant='body2'>
                          {formatSize(file.size)}
                        </Typography>
                      </div>
                    </div>
                    <IconButton onClick={() => handleRemoveFilePdf(file)}>
                      <i className='tabler-x text-xl' />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
              <Button color='error' variant='tonal' onClick={handleRemoveAllFilesPdf}>
                Supprimer tous
              </Button>
            </>
          )}

          {/* Preview Vidéo */}
          {type !== 'pdf' && files && (
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
              <Button color='error' variant='tonal' onClick={handleRemoveFile} className='mt-2'>
                Supprimer
              </Button>
            </div>
          )} 

          {/* Fichier déjà existant */}
          {selectedFiles2 && (
            <div className='mt-4'>
              <Typography variant='h6' className='mb-2'>Fichier existant :</Typography>
              {/\.(mp4|avi|mov|wmv|flv|webm|mkv)$/i.test(selectedFiles2) ? (
                <div>
                  <video width="100%" height="300" controls style={{ borderRadius: '8px', border: '1px solid #ccc' }}>
                    <source src={selectedFiles2} type="video/mp4" />
                  </video>
                  <Box className='mt-2'>
                    <Button variant='outlined' size='small' onClick={() => window.open(selectedFiles2, '_blank')}>
                      Ouvrir dans un nouvel onglet
                    </Button>
                  </Box>
                </div>
              ) : (
                Array.isArray(selectedFiles2) &&
                  selectedFiles2
                    ?.filter(f => f.endsWith('.pdf'))
                    .map(fileUrl => (
                      <ListItem key={fileUrl} className='pis-4 plb-3'>
                        <div className='file-details'>
                          <div className='file-preview'>
                            <i className='tabler-file-description' />
                          </div>
                          <div>
                            <Typography className='file-name font-medium'>
                              {fileUrl.split('/').pop()}
                            </Typography>
                          </div>
                        </div>
                        <Box className='flex gap-2'>
                          <Button
                            variant='outlined'
                            size='small'
                            onClick={() => window.open(fileUrl, '_blank')}
                          >
                            Ouvrir
                          </Button>
                          <IconButton onClick={() => handleRemoveExistingPdf(fileUrl)}>
                            <i className='tabler-x text-xl' />
                          </IconButton>
                        </Box>
                      </ListItem>
                    ))
                
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Dropzone>
  )
}

export default UploadPDFFile2
