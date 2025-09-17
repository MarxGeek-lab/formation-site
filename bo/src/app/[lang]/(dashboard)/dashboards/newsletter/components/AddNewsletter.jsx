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
import { useAuthStore, useNewsletterStore } from '@/contexts/GlobalContext'
import { showToast } from '@/components/ToastNotification/ToastNotification'
import { hideLoader, showLoader } from '@/components/Loader/loaderService'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import { Card, CardContent, Chip, InputAdornment } from '@mui/material'
import { permissionsArray2 } from '@/data/constant'
import CustomIconButton from '@/@core/components/mui/IconButton'
import { EditorContent, useEditor } from '@tiptap/react'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import classnames from 'classnames'

const EditorToolbar = ({ editor }) => {
  if (!editor) {
    return null
  }

  return (
    <div className='flex w-full flex-wrap gap-x-3 gap-y-1 pbs-6 pbe-4 pli-6'>
      <CustomIconButton
        {...(editor.isActive('bold') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <i className={classnames('tabler-bold', { 'text-textSecondary': !editor.isActive('bold') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('underline') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <i className={classnames('tabler-underline', { 'text-textSecondary': !editor.isActive('underline') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('italic') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <i className={classnames('tabler-italic', { 'text-textSecondary': !editor.isActive('italic') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('strike') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <i className={classnames('tabler-strikethrough', { 'text-textSecondary': !editor.isActive('strike') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'left' }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <i
          className={classnames('tabler-align-left', { 'text-textSecondary': !editor.isActive({ textAlign: 'left' }) })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'center' }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <i
          className={classnames('tabler-align-center', {
            'text-textSecondary': !editor.isActive({ textAlign: 'center' })
          })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'right' }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <i
          className={classnames('tabler-align-right', {
            'text-textSecondary': !editor.isActive({ textAlign: 'right' })
          })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'justify' }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
      >
        <i
          className={classnames('tabler-align-justified', {
            'text-textSecondary': !editor.isActive({ textAlign: 'justify' })
          })}
        />
      </CustomIconButton>
    </div>
  )
}

const AddNewsletter = props => {
  // Props
  const { open, handleClose, messageData, setData, fetchNewsletterMessage, setMessageData } = props

  const { addMessage, updateMessage } = useNewsletterStore();
  const { user } = useAuthStore();

  // States
  const [file, setFile] = useState(null)
  const [file2, setFile2] = useState('')
  const [description, setDescription] = useState('')
  const [title, setTitle] = useState('')
  
  // Refs
  const fileInputRef = useRef(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Écrivez quelque chose ici...'
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Underline
    ],   
    immediatelyRender: false,
    content: description || `
      <p>
        Entrer la description de la propriété...
      </p>
    `,
    
    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML()); // Récupère le contenu en HTML
    },
  })

  // Handle Form Submit
  const handleFormSubmit = async () => {

    if (title && description) {
      const newData = new FormData();
      if (title) newData.append('subject', title);
      if (description) newData.append('htmlContent', description);

      if (file) {
        newData.append('images', file);
      }

      showLoader();

      try {
        let res;
        if (messageData) {
          res = await updateMessage(messageData?._id, newData);
        } else {
          res = await addMessage(newData);
          console.log("crer")
        }
        hideLoader();
        console.log(res);

        if (res === 201) {
          handleReset();
          fetchNewsletterMessage();
          showToast('Administrateur ajouté avec succès', 'success', 5000);
        } else if (res === 200) {
          fetchNewsletterMessage();
          setMessageData(null)
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
    setTitle('')
    setDescription('')
    setFile(null)
    setFile2('')
  }

  useEffect(() => {
    if (messageData) {
      setTitle(messageData?.subject);
      setDescription(messageData?.htmlContent);
      setFile2(messageData?.image);
      editor.state
    }
  },[messageData]);

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
        <Typography variant='h5'>{messageData ? 'Modifier':'Nouveau'}</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='tabler-x text-textSecondary text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='flex flex-col gap-5 p-6'>
        {/* <form onSubmit={handleSubmit(data => handleFormSubmit(data))} className='flex flex-col gap-5'> */}
          <CustomTextField
            fullWidth
            label='Titre'
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder='...'
          /> 

          <Grid size={{ xs: 12 }}>
            <Typography className='mbe-1'>Contenu</Typography>
            <Card className='p-0 border shadow-none'>
              <CardContent className='p-0'>
                <EditorToolbar editor={editor} />
                <Divider className='mli-6' />
                <EditorContent editor={editor} className='bs-[135px] w-full overflow-y-auto flex ' 
                  value={description} onChange={(e) => setDescription(e.target.value)}/>
              </CardContent>
            </Card>
          </Grid>

          <div className='flex items-end gap-4'>
            <CustomTextField
              label='Image'
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
          <div className='flex items-center gap-4'>
            <Button variant='contained' onClick={handleFormSubmit}>
              {messageData ? 'Enrégistrer':'Ajouter'}
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

export default AddNewsletter
