// React Imports
import { useEffect, useState } from 'react'

// MUI IMports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import CustomInputVertical from '@core/components/custom-inputs/Vertical'
import CustomTextField from '@core/components/mui/TextField'
import DirectionalIcon from '@components/DirectionalIcon'
import { Card, CardContent, Divider } from '@mui/material'
import { EditorContent, useEditor } from '@tiptap/react'


// Style Imports
import '@/libs/styles/tiptapEditor.css'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import CustomIconButton from '@/@core/components/mui/IconButton'
import DocumentFile from '@/components/UploadsPdfFile/DocumentFile '

const EditorToolbar = ({ editor }) => {
  if (!editor) {
    return null
  }

  return (
    <div className='flex flex-wrap gap-x-3 gap-y-1 pbs-6 pbe-4 pli-6'>
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


// Styled Components
const Content = styled(Typography, {
  name: 'MuiCustomInputVertical',
  slot: 'content'
})(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center'
}))

// Vars
const data = [
  {
    value: 'À vendre',
    value2: 'forSale',
    title: 'Vendre le bien',
    content: (
      <Content>
        {/* Post your property for sale.
        <br />
        Unlimited free listing. */}
      </Content>
    ),
    asset: 'tabler-home',
    isSelected: true
  },
  {
    value: 'À louer',
    value2: 'forRent',
    title: 'Louer le bien',
    content: (
      <Content>
        {/* Post your property for sale.
        <br />
        Unlimited free listing. */}
      </Content>
    ),
    asset: 'tabler-wallet'
  }
]



const StepOtherDetails = ({ 
  activeStep, handleNext, handlePrev, steps,
  setSelectedFiles, selectedFiles, condition, setCondition,
  setSelectedFiles2, selectedFiles2,
}) => {
  // Vars
  const initialSelectedOption = data.filter(item => item.isSelected)[data.filter(item => item.isSelected).length - 1]
    .value

  // States
  const [selectedOption, setSelectedOption] = useState(initialSelectedOption)

  const handleOptionChange = prop => {
    if (typeof prop === 'string') {
      setSelectedOption(prop)
    } else {
      setSelectedOption(prop.target.value)
    }
  }

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
      content: `
        <p>
        </p>
      `,
      onUpdate: ({ editor }) => {
        console.log(editor.getHTML())
        setCondition(editor.getHTML()); // Récupère le contenu en HTML
      },
    })


  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Typography className='mbe-1'>Condition d'acquisition (facultatif)</Typography>
        <Card className='p-0 border shadow-none'>
          <CardContent className='p-0'>
            <EditorToolbar editor={editor} />
            <Divider className='mli-6' />
            <EditorContent editor={editor} className='bs-[135px] overflow-y-auto flex' />
          </CardContent>
        </Card>
      </Grid>
     {/*  <Grid size={{ xs: 12 }}>
        <DocumentFile setSelectedFiles={setSelectedFiles} selectedFiles={selectedFiles}
          setSelectedFiles2={setSelectedFiles2} selectedFiles2={selectedFiles2} />
      </Grid>
       */}
      
      <Grid size={{ xs: 12 }}>
        <div className='flex items-center justify-between'>
          <Button
            variant='tonal'
            color='secondary'
            disabled={activeStep === 0}
            onClick={handlePrev}
            startIcon={<DirectionalIcon ltrIconClass='tabler-arrow-left' rtlIconClass='tabler-arrow-right' />}
          >
            Précédent
          </Button>
          <Button
            variant='contained'
            color={activeStep === steps.length - 1 ? 'success' : 'primary'}
            onClick={handleNext}
            endIcon={
              activeStep === steps.length - 1 ? (
                <i className='tabler-check' />
              ) : (
                <DirectionalIcon ltrIconClass='tabler-arrow-right' rtlIconClass='tabler-arrow-left' />
              )
            }
          >
            {activeStep === steps.length - 1 ? 'Enrégistrer' : 'Suivant'}
          </Button>
        </div>
      </Grid>
   
    </Grid>
  )
}

export default StepOtherDetails
