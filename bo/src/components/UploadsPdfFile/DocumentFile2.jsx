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
import { Box } from '@mui/material'

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
    <div>
      <Typography variant='h6'>{title}</Typography>
      <Typography variant='body2'>{subtitle}</Typography>
      <div {...getRootProps()} className='mt-3'>
        <input {...getInputProps()} />
        <Button variant='contained' size='small' color='secondary' startIcon={<i className='tabler-upload' />}>
          {textBtn}
        </Button>
      </div>

      {files ? (
        <>
          <List>{fileList}</List>
          <div className='buttons'>
            <Button color='error' variant='tonal' onClick={handleRemoveAllFiles}>
              Supprimer
            </Button>
          </div>
        </>
      ) : null}
       {selectedFiles2 && (
          <div className='mt-4'>
            <Typography>Documents existant</Typography>
            <Box>
              <Button color='error' variant='tonal' onClick={() => {
                window.open(selectedFiles2, '__blank')
              }} size='small'>
                Cliquer pour voir
              </Button>
            </Box>
          </div>
        )}
    </div>
  )
}

export default UploadPDFFile2
