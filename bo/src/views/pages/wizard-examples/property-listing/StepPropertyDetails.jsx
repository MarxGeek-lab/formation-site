// React Imports
import { useState } from 'react'

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
    value: 'sale',
    title: 'Sell the property',
    content: (
      <Content>
        Post your property for sale.
        <br />
        Unlimited free listing.
      </Content>
    ),
    asset: 'tabler-home',
    isSelected: true
  },
  {
    value: 'rent',
    title: 'Rent the property',
    content: (
      <Content>
        Post your property for sale.
        <br />
        Unlimited free listing.
      </Content>
    ),
    asset: 'tabler-wallet'
  }
]



const StepPropertyDetails = ({ activeStep, handleNext, handlePrev, steps }) => {
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
          placeholder: 'Write something here...'
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph']
        }),
        Underline
      ],   
      immediatelyRender: false,
      content: `
        <p>
          Keep your account secure with authentication step.
        </p>
      `
    })

  return (
    <Grid container spacing={6}>
      {data.map((item, index) => {
        let asset

        if (item.asset && typeof item.asset === 'string') {
          asset = <i className={classnames(item.asset, 'text-[28px]')} />
        }

        return (
          <CustomInputVertical
            type='radio'
            key={index}
            gridProps={{ size: { xs: 12, sm: 6 } }}
            selected={selectedOption}
            name='custom-radios-basic'
            handleChange={handleOptionChange}
            data={typeof item.asset === 'string' ? { ...item, asset } : item}
          />
        )
      })}
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomTextField select fullWidth label='Property Type' id='validation-property-select' defaultValue=''>
          <MenuItem value=''>Select Property Type</MenuItem>
          <MenuItem value='residential'>Residential</MenuItem>
          <MenuItem value='commercial'>Commercial</MenuItem>
        </CustomTextField>
      </Grid>
   
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomTextField fullWidth type='number' label='Zip Code' placeholder='99950' />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomTextField
          select
          fullWidth
          label='Country'
          id='country-select'
          aria-describedby='country-select'
          defaultValue=''
        >
          <MenuItem value=''>Select Country</MenuItem>
          <MenuItem value='UK'>UK</MenuItem>
          <MenuItem value='USA'>USA</MenuItem>
          <MenuItem value='India'>India</MenuItem>
          <MenuItem value='Australia'>Australia</MenuItem>
          <MenuItem value='Germany'>Germany</MenuItem>
        </CustomTextField>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomTextField fullWidth label='Landmark' placeholder='Nr. Hard Rock Cafe' />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomTextField fullWidth label='City' placeholder='Los Angeles' />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomTextField fullWidth label='State' placeholder='California' />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <CustomTextField fullWidth multiline minRows={2} label='Address' placeholder='12, Business Park' />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Typography className='mbe-1'>Description (Optional)</Typography>
        <Card className='p-0 border shadow-none'>
          <CardContent className='p-0'>
            <EditorToolbar editor={editor} />
            <Divider className='mli-6' />
            <EditorContent editor={editor} className='bs-[135px] overflow-y-auto flex ' />
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <div className='flex items-center justify-between'>
          <Button
            variant='tonal'
            color='secondary'
            disabled={activeStep === 0}
            onClick={handlePrev}
            startIcon={<DirectionalIcon ltrIconClass='tabler-arrow-left' rtlIconClass='tabler-arrow-right' />}
          >
            Previous
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
            {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
          </Button>
        </div>
      </Grid>
   
    </Grid>
  )
}

export default StepPropertyDetails
