// React Imports
import { useEffect, useState } from 'react'

// MUI IMports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'

// Component Imports
import CustomInputVertical from '@core/components/custom-inputs/Vertical'
import CustomTextField from '@core/components/mui/TextField'
import DirectionalIcon from '@components/DirectionalIcon'
import { Alert, Card, CardContent, CardHeader, Divider, FormControl, FormControlLabel, FormLabel, IconButton, InputAdornment, Radio, RadioGroup, TextField } from '@mui/material'
import { EditorContent, useEditor } from '@tiptap/react'


// Style Imports
import '@/libs/styles/tiptapEditor.css'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import CustomIconButton from '@/@core/components/mui/IconButton'
import { useAdminStore, useCommonStore, useSubscriptionContext } from '@/contexts/GlobalContext'
import { getAllCities, getQuartiersByCity } from '@/data/benin-cities'
import ProductImage from '@/components/selectProductImages/ProductImage'
import classnames from 'classnames'
import UploadPDFFile2 from '@/components/UploadsPdfFile/DocumentFile2'
import UploadPDFFile from '@/components/UploadsPdfFile/DocumentFile '

const EditorToolbar = ({ editor }) => {
  console.log(editor)
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

const StepPropertyDetails = ({ 
  activeStep, handleNext, steps,
  // Informations de base
  category, setCategory, productName, setProductName, description, setDescription,
  customService, setCustomService,
  // Type et tarification
  isSubscriptionBased, setIsSubscriptionBased, subscriptionId, setSubscriptionId,
  price, setPrice, wholesalePrice, setWholesalePrice,
  // Type de produit
  productType, setProductType,
  // Stock et statut
  productStatus, setProductStatus,
  // Attribution admin
  assignedAdminId, setAssignedAdminId, availableAdmins, availableSubscriptions,
  // Promotion
  // Images
  selectedFiles, setSelectedFiles, selectedFiles2, setSelectedFiles2,
  // PDF
  selectedFilesSale, setSelectedFilesSale, 
  selectedFilesSale2,
  selectedVideo, setSelectedVideo,
  selectedVideo2, advantage, setAdvantage,
  descriptionEn, setDescriptionEn,
  advantageEn, setAdvantageEn,
  productNameEn, setProductNameEn,
}) => {
  const { allCategories, allAdmin, getAllAdmin } = useAdminStore();
  const { subscriptionPlans, fetchSubscription } = useSubscriptionContext();
  const [showCustomService, setShowCustomService] = useState(false);

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
      immediatelyRender: true,
      content: description,
      onUpdate: ({ editor }) => {
        setDescription(editor.getHTML() || description); // Récupère le contenu en HTML
      },
  })

  const editorEn = useEditor({
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
    immediatelyRender: true,
    content: descriptionEn,
    onUpdate: ({ editor }) => {
      setDescriptionEn(editor.getHTML() || descriptionEn); // Récupère le contenu en HTML
    },
  })

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);
    setSubCategory('');
    setCustomCategory('');
    if (value !== 'Autres') {
      setCustomService('');
    }
  };

  useEffect(() => {
    if (category) {
      if (category === 'Autres') {
        setShowCustomService(true);
        setSubCategories(['Autres']);
      } else {
        setShowCustomService(false);
        const selectedCategory = allCategories.find(item => item.name === category);
        if (selectedCategory) {
          setSubCategories(selectedCategory.subcategories);
        }
      }
    }
  }, [category, allCategories]);

  useEffect(() => {
    fetchSubscription();
    getAllAdmin();
  }, []);

console.log("allAdmin == ", allAdmin)
  return (
    <Grid container spacing={6}>
      {/* Section 1: Informations de base */}
      <Grid size={{ xs: 12 }}>
        <Typography variant="h4" className="mb-4">
          Informations de base
        </Typography>
        <Alert severity="info" className="mb-4">
          Les champs marqués d'un astérisque (*) sont obligatoires
        </Alert>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <CustomTextField
          fullWidth
          placeholder="Ex: iPhone 15 Pro Max 256GB"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          label={
            <Typography component="span">
              Nom du produit <Typography component="span" color="error">*</Typography>
            </Typography>
          }
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomTextField
          fullWidth
          placeholder="Ex: iPhone 15 Pro Max 256GB"
          value={productNameEn}
          onChange={(e) => setProductNameEn(e.target.value)}
          label={
            <Typography component="span">
              Nom du produit en anglais <Typography component="span" color="error">*</Typography>
            </Typography>
          }
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <CustomTextField
          select
          fullWidth
          value={category}
          onChange={handleCategoryChange}
          label={
            <Typography component="span">
              Catégorie <Typography component="span" color="error">*</Typography>
            </Typography>
          }
        >
          <MenuItem value="">Sélectionner la catégorie</MenuItem>
          {allCategories.map((item) => (
            <MenuItem key={item._id} value={item.nameFr}>
              {item.nameFr}
            </MenuItem>
          ))}
          <MenuItem value="Autres">Autres</MenuItem>
        </CustomTextField>
      </Grid>

      {showCustomService && (
        <Grid size={{ xs: 12, md: 6 }}>
          <CustomTextField
            fullWidth
            value={customService}
            onChange={(e) => setCustomService(e.target.value)}
            label={
              <Typography component="span">
                Préciser la catégorie <Typography component="span" color="error">*</Typography>
              </Typography>
            }
          />
        </Grid>
      )}

      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend">
            <Typography component="span">
              Type de produit <Typography component="span" color="error">*</Typography>
            </Typography>
          </FormLabel>
          <RadioGroup
            row
            value={productType || 'standard'}
            onChange={(e) => setProductType(e.target.value)}
          >
            <FormControlLabel value="standard" control={<Radio />} label="Standard" />
            <FormControlLabel value="mystere" control={<Radio />} label="Mystère" />
          </RadioGroup>
        </FormControl>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Typography className="mbe-1">Description</Typography>
        <Card className="p-0 border shadow-none">
          <CardContent className="p-0">
            <EditorToolbar editor={editor} />
            <Divider className="mli-6" />
            <EditorContent
              editor={editor}
              className="bs-[135px] overflow-y-auto flex"
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Typography className="mbe-1">Description en anglais</Typography>
        <Card className="p-0 border shadow-none">
          <CardContent className="p-0">
            <EditorToolbar editor={editorEn} />
            <Divider className="mli-6" />
            <EditorContent
              editor={editorEn}
              className="bs-[135px] overflow-y-auto flex"
            />
          </CardContent>
        </Card>
      </Grid>
      {/* <Grid size={{ xs: 12 }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">
            <Typography component="span">
              Avec visuel <Typography component="span" color="error">*</Typography>
            </Typography>
          </FormLabel>
          <RadioGroup
            row
            value={withVisual || 'false'}
            onChange={(e) => setWithVisual(e.target.value)}
          >
            <FormControlLabel value="false" control={<Radio />} label="Non" />
            <FormControlLabel value="true" control={<Radio />} label="Oui" />
          </RadioGroup>
        </FormControl>
      </Grid> */}

      <Grid size={{ xs: 12 }}>
        <Typography variant="h4" className="mb-2 mt-6">
          Avantages
        </Typography>
        <Card>
          <CardContent>
            {advantage.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
                <TextField
                  fullWidth
                  label={`Avantage ${index + 1}`}
                  value={item}
                  onChange={(e) => {
                    const newAdvantages = [...advantage];
                    newAdvantages[index] = e.target.value;
                    setAdvantage(newAdvantages);
                  }}
                  variant="outlined"
                  size="small"
                />
                <IconButton
                  color="error"
                  onClick={() => {
                    const newAdvantages = advantage.filter((_, i) => i !== index);
                    setAdvantage(newAdvantages);
                  }}
                  disabled={advantage.length === 1}
                >
                  <i className="tabler-minus" />
                </IconButton>
              </Box>
            ))}
            <Button
              variant="outlined"
              startIcon={<i className="tabler-plus" />}
              onClick={() => setAdvantage([...advantage, ''])}
              sx={{ mt: 1 }}
            >
              Ajouter un avantage
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Typography variant="h4" className="mb-2 mt-6">
          Avantages en anglais
        </Typography>
        <Card>
          <CardContent>
            {advantageEn.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
                <TextField
                  fullWidth
                  label={`Avantage ${index + 1}`}
                  value={item}
                  onChange={(e) => {
                    const newAdvantages = [...advantageEn];
                    newAdvantages[index] = e.target.value;
                    setAdvantageEn(newAdvantages);
                  }}
                  variant="outlined"
                  size="small"
                />
                <IconButton
                  color="error"
                  onClick={() => {
                    const newAdvantages = advantageEn.filter((_, i) => i !== index);
                    setAdvantageEn(newAdvantages);
                  }}
                  disabled={advantageEn.length === 1}
                >
                  <i className="tabler-minus" />
                </IconButton>
              </Box>
            ))}
            <Button
              variant="outlined"
              startIcon={<i className="tabler-plus" />}
              onClick={() => setAdvantageEn([...advantageEn, ''])}
              sx={{ mt: 1 }}
            >
              Ajouter un avantage
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Section 2: Tarification */}
      <Grid size={{ xs: 12 }}>
        <Typography variant="h4" className="mb-4 mt-6">
          Tarification
        </Typography>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">
            <Typography component="span">
              Type de tarification <Typography component="span" color="error">*</Typography>
            </Typography>
          </FormLabel>
          <RadioGroup
            row
            value={isSubscriptionBased || 'false'}
            onChange={(e) => setIsSubscriptionBased(e.target.value)}
          >
            <FormControlLabel value="false" control={<Radio />} label="Prix fixe" />
            <FormControlLabel value="true" control={<Radio />} label="Abonnement" />
          </RadioGroup>
        </FormControl>
      </Grid>

      {isSubscriptionBased === 'true' ? (
        <Grid size={{ xs: 12, md: 6 }}>
          <CustomTextField
            select
            fullWidth
            value={subscriptionId || ''}
            onChange={(e) => {
              setSubscriptionId(e.target.value)
              console.log(e.target.value)
            }}
            label={
              <Typography component="span">
                Abonnement <Typography component="span" color="error">*</Typography>
              </Typography>
            }
          >
            <MenuItem value="">Choisir un abonnement</MenuItem>
            {subscriptionPlans?.map((subscription) => (
              <MenuItem key={subscription._id} value={subscription._id}>
                {subscription.title} - {subscription.price} F CFA
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>
      ) : (
        <>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField
              fullWidth
              type="number"
              label={
                <Typography component="span">
                  Prix de vente <Typography component="span" color="error">*</Typography>
                </Typography>
              }
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              InputProps={{
                inputProps: { min: 0 },
                endAdornment: <InputAdornment position="end">F CFA</InputAdornment>
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField
              fullWidth
              type="number"
              label="Prix promo"
              value={wholesalePrice || ''}
              onChange={(e) => setWholesalePrice && setWholesalePrice(e.target.value)}
              InputProps={{
                inputProps: { min: 0 },
                endAdornment: <InputAdornment position="end">F CFA</InputAdornment>
              }}
              helperText="Optionnel"
            />
          </Grid>
        </>
      )}

      <Grid size={{ xs: 12, md: 6 }}>
        <CustomTextField
          select
          fullWidth
          value={productStatus || 'active'}
          onChange={(e) => setProductStatus && setProductStatus(e.target.value)}
          label="Statut"
        >
          <MenuItem value="active">Actif</MenuItem>
          <MenuItem value="inactive">Inactif</MenuItem>
          <MenuItem value="draft">Brouillon</MenuItem>
        </CustomTextField>
      </Grid>

      {/* Section 4: Attribution et promotion */}
      <Grid size={{ xs: 12 }}>
        <Typography variant="h4" className="mb-0 mt-6">
          Attribution
        </Typography>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <CustomTextField
          select
          fullWidth
          value={assignedAdminId}
          onChange={(e) => setAssignedAdminId(e.target.value)}
          label="Administrateur responsable"
          helperText="Optionnel"
        >
          <MenuItem value="">Aucun</MenuItem>
          {allAdmin?.map((admin) => (
            <MenuItem key={admin._id} value={admin._id}>
              {admin?.name} - {admin?.email}
            </MenuItem>
          ))}
        </CustomTextField>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <ProductImage
          setSelectedFiles={setSelectedFiles}
          selectedFiles={selectedFiles}
          setSelectedFiles2={setSelectedFiles2}
          selectedFiles2={selectedFiles2}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <UploadPDFFile2
          setSelectedFiles={setSelectedFilesSale}
          selectedFiles={selectedFilesSale}
          selectedFiles2={selectedFilesSale2}
          textBtn="Importer un fichier PDF de vente"
          type='pdf'
          title={'Fichier PDF à télécharger'}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <UploadPDFFile2
          setSelectedFiles={setSelectedVideo}
          selectedFiles={selectedVideo}
          selectedFiles2={selectedVideo2}
          textBtn="Importer un fichier vidéo de démonstration"
          type='video'
          title={'Fichier vidéo de démonstration'}
        />
      </Grid>

      {/* Navigation */}
      <Grid size={{ xs: 12 }}>
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="contained"
            color={activeStep === steps.length - 1 ? 'success' : 'primary'}
            onClick={handleNext}
            endIcon={
              activeStep === steps.length - 1 ? (
                <i className="tabler-check" />
              ) : (
                <DirectionalIcon ltrIconClass="tabler-arrow-right" rtlIconClass="tabler-arrow-left" />
              )
            }
          >
            {activeStep === steps.length - 1 ? 'Enregistrer' : 'Suivant'}
          </Button>
        </div>
      </Grid>
    </Grid>
  )
}

export default StepPropertyDetails
