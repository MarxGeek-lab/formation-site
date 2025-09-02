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

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import CustomInputVertical from '@core/components/custom-inputs/Vertical'
import CustomTextField from '@core/components/mui/TextField'
import DirectionalIcon from '@components/DirectionalIcon'
import { Alert, Card, CardContent, Divider, FormControl, FormControlLabel, FormLabel, InputAdornment, Radio, RadioGroup } from '@mui/material'
import { EditorContent, useEditor } from '@tiptap/react'


// Style Imports
import '@/libs/styles/tiptapEditor.css'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import CustomIconButton from '@/@core/components/mui/IconButton'
import { useCommonStore } from '@/contexts/GlobalContext'
import { getAllCities, getQuartiersByCity } from '@/data/benin-cities'
import ProductImage from '@/components/selectProductImages/ProductImage'

// Composant pour la sélection des couleurs
const ColorSelector = ({ selectedColors, onColorChange, label }) => {
  const availableColors = [
    { name: 'Rouge', value: 'rouge', color: '#f44336' },
    { name: 'Bleu', value: 'bleu', color: '#2196f3' },
    { name: 'Vert', value: 'vert', color: '#4caf50' },
    { name: 'Jaune', value: 'jaune', color: '#ffeb3b' },
    { name: 'Orange', value: 'orange', color: '#ff9800' },
    { name: 'Violet', value: 'violet', color: '#9c27b0' },
    { name: 'Rose', value: 'rose', color: '#e91e63' },
    { name: 'Noir', value: 'noir', color: '#000000' },
    { name: 'Blanc', value: 'blanc', color: '#ffffff' },
    { name: 'Gris', value: 'gris', color: '#9e9e9e' },
    { name: 'Marron', value: 'marron', color: '#795548' },
    { name: 'Beige', value: 'beige', color: '#f5f5dc' }
  ]

  const handleColorToggle = (colorValue) => {
    const isColorExist = selectedColors.includes(colorValue)
    if (isColorExist) {
      onColorChange(selectedColors.filter(color => color !== colorValue))
    } else {
      onColorChange([...selectedColors, colorValue])
    }
  }

  return (
    <Box>
      <Typography variant="body2" className="mb-2">{label}</Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
        {availableColors.map((colorOption) => {
          const isSelected = selectedColors.includes(colorOption.value)
          return (
            <Chip
              key={colorOption.value}
              label={colorOption.name}
              onClick={() => handleColorToggle(colorOption.value)}
              variant={isSelected ? "filled" : "outlined"}
              clickable
              sx={{
                backgroundColor: isSelected ? colorOption.color : 'transparent',
                color: isSelected ? (colorOption.value === 'blanc' || colorOption.value === 'jaune' || colorOption.value === 'beige' ? '#000' : '#fff') : 'inherit',
                borderColor: colorOption.color,
                cursor: 'pointer',
                boxShadow: colorOption.color === 'blanc' ? '10px 10px black' : 'none',
                '&:hover': {
                  backgroundColor: colorOption.color,
                  color: colorOption.value === 'blanc' || colorOption.value === 'jaune' || colorOption.value === 'beige' ? '#000' : '#fff'
                }
              }}
            />
          )
        })}
      </Stack>
    </Box>
  )
}

// Composant pour la sélection des tailles
const SizeSelector = ({ selectedSizes, onSizeChange, label }) => {
  const availableSizes = [
    { name: 'XS', value: 'xs' },
    { name: 'S', value: 's' },
    { name: 'M', value: 'm' },
    { name: 'L', value: 'l' },
    { name: 'XL', value: 'xl' },
    { name: 'XXL', value: 'xxl' },
    { name: 'XXXL', value: 'xxxl' },
    { name: 'Unique', value: 'unique' },
    { name: '36', value: '36' },
    { name: '37', value: '37' },
    { name: '38', value: '38' },
    { name: '39', value: '39' },
    { name: '40', value: '40' },
    { name: '41', value: '41' },
    { name: '42', value: '42' },
    { name: '43', value: '43' },
    { name: '44', value: '44' },
    { name: '45', value: '45' },
    { name: '46', value: '46' }
  ]

  const handleSizeToggle = (sizeValue) => {
    const isSizeExist = selectedSizes.includes(sizeValue)
    if (isSizeExist) {
      onSizeChange(selectedSizes.filter(size => size !== sizeValue))
    } else {
      onSizeChange([...selectedSizes, sizeValue])
    }
  }

  return (
    <Box>
      <Typography variant="body2" className="mb-2">{label}</Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
        {availableSizes.map((sizeOption) => {
          const isSelected = selectedSizes.includes(sizeOption.value)
          return (
            <Chip
              key={sizeOption.value}
              label={sizeOption.name}
              onClick={() => handleSizeToggle(sizeOption.value)}
              variant={isSelected ? "filled" : "outlined"}
              color={isSelected ? "primary" : "default"}
              clickable
              sx={{
                minWidth: '45px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white'
                }
              }}
            />
          )
        })}
      </Stack>
    </Box>
  )
}

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

const StepPropertyDetails = ({ 
  activeStep, handleNext, handlePrev, steps,
  // Informations générales
  setCategory, setProductName, setDescription, category, productName, description,
  subCategory, setSubCategory, customService, setCustomService, 
  customCategory, setCustomCategory,
  // Nouveaux champs produit
  productCode, setProductCode, brand, setBrand,
  // Caractéristiques
  color, setColor, size, setSize, material, setMaterial,
  weight, setWeight, dimensions, setDimensions,
  // Prix et stock
  price, setPrice, wholesalePrice, setWholesalePrice, taxe, setTaxe,
  stock, setStock, minStock, setMinStock, productStatus, setProductStatus,
  // Options avancées
  tags, setTags, barcode, setBarcode, 
  isFeatured, setIsFeatured,
  // Images
  selectedFiles, setSelectedFiles, selectedFiles2, setSelectedFiles2,
  // Anciens champs conservés pour compatibilité
  characteristics, setCharacteristics, isPromotion, setIsPromotion, promotionRate, setPromotionRate,
}) => {
  const { allCategories } = useCommonStore();
  const [subcategories, setSubCategories] = useState([]);
  const [showCustomService, setShowCustomService] = useState(false);
  const [showCustomCategory, setShowCustomCategory] = useState(false);

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
      content: description,
      onUpdate: ({ editor }) => {
        setDescription(editor.getHTML()); // Récupère le contenu en HTML
      },
    })

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
    if (subCategory === 'Autres') {
      setShowCustomCategory(true);
    } else {
      setShowCustomCategory(false);
    }
  }, [subCategory]);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);
    setSubCategory('');
    setCustomCategory('');
    if (value !== 'Autres') {
      setCustomService('');
    }
  };

  const handleSubCategoryChange = (e) => {
    const value = e.target.value;
    setSubCategory(value);
    if (value !== 'Autres') {
      // setCustomCategory('');
    }
  };

  const handleAddCharacteristic = () => {
    setCharacteristics([...characteristics, { key: '', value: '' }]);
  };

  const handleCharacteristicChange = (index, field, value) => {
    const newCharacteristics = [...characteristics];
    newCharacteristics[index][field] = value;
    setCharacteristics(newCharacteristics);
  };

  const handleRemoveCharacteristic = (index) => {
    const newCharacteristics = [...characteristics];
    newCharacteristics.splice(index, 1);
    setCharacteristics(newCharacteristics);
  };

  return (
    <Grid container spacing={6}>
      {/* Section 1: Informations générales */}
      <Grid size={{ xs: 12 }}>
        <Typography variant="h4" className="mb-4">
          Informations générales
        </Typography>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Alert severity="info" className="mx-4 mt-2">
          Les champs suivants sont obligatoires *
        </Alert>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomTextField
          select
          fullWidth
          id="validation-property-select"
          defaultValue=""
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
            <MenuItem key={item._id} value={item.name}>
              {item.name}
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

      {!showCustomService && (
        <Grid size={{ xs: 12, md: 6 }}>
          <CustomTextField
            select
            fullWidth
            value={subCategory}
            onChange={handleSubCategoryChange}
            label={
              <Typography component="span">
                Sous-catégorie <Typography component="span" color="error">*</Typography>
              </Typography>
            }
          >
            <MenuItem value="">Sélectionner la sous-catégorie</MenuItem>
            {subcategories.map((sub) => (
              <MenuItem key={sub} value={sub}>
                {sub}
              </MenuItem>
            ))}
            <MenuItem value="Autres">Autres</MenuItem>
          </CustomTextField>
        </Grid>
      )}

      {(showCustomService || (category && showCustomCategory)) && (
        <Grid size={{ xs: 12, md: 6 }}>
          <CustomTextField
            fullWidth
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            label={
              <Typography component="span">
                Préciser la sous-catégorie <Typography component="span" color="error">*</Typography>
              </Typography>
            }
          />
        </Grid>
      )}

      <Grid size={{ xs: 12 }}>
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
          placeholder="Ex: PROD-001"
          value={productCode || ''}
          onChange={(e) => setProductCode && setProductCode(e.target.value)}
          label="Code produit (SKU)"
          helperText="Identifiant unique du produit"
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <CustomTextField
          fullWidth
          placeholder="Ex: Apple, Samsung, Nike"
          value={brand || ''}
          onChange={(e) => setBrand && setBrand(e.target.value)}
          label="Marque/Fabricant"
        />
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Section 2: Caractéristiques du produit */}
      <Grid size={{ xs: 12 }}>
        <Typography variant="h4" className="mb-4 mt-6">
          Caractéristiques du produit
        </Typography>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <ColorSelector
          selectedColors={color || []}
          onColorChange={(colors) => {
            console.log('Couleurs sélectionnées:', colors);
            if (colors.length > 0) {
              setColor([...colors]);
            }
          }}
          label="Couleurs disponibles"
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <SizeSelector
          selectedSizes={size || ''}
          onSizeChange={(sizes) => {
            console.log('Tailles sélectionnées:', sizes);
            if (sizes.length > 0) {
              setSize([...sizes]);
            }
          }}
          label="Tailles disponibles"
        />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <CustomTextField
          fullWidth
          placeholder="Ex: Coton, Plastique, Métal"
          value={material || ''}
          onChange={(e) => setMaterial && setMaterial(e.target.value)}
          label="Matériau"
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <CustomTextField
          fullWidth
          type="number"
          placeholder="0.5"
          value={weight || ''}
          onChange={(e) => setWeight && setWeight(e.target.value)}
          label="Poids (kg)"
          InputProps={{
            inputProps: { min: 0, step: 0.1 },
            endAdornment: <InputAdornment position="end">kg</InputAdornment>
          }}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <CustomTextField
          fullWidth
          placeholder="Ex: 20x15x5"
          value={dimensions || ''}
          onChange={(e) => setDimensions && setDimensions(e.target.value)}
          label="Dimensions (L×l×h)"
          helperText="En centimètres"
        />
      </Grid>

       {characteristics.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Typography variant="span" className="mbs-4">
              Autres caractéristiques du produit
            </Typography>
            {characteristics.map((char, index) => (
              <Grid container spacing={2} key={index} className="mbs-2 flex items-end">
                <Grid size={{ xs: 12, md: 5 }}>
                  <CustomTextField
                    fullWidth
                    value={char.key}
                    onChange={(e) => handleCharacteristicChange(index, 'key', e.target.value)}
                    label={<Typography component="span">
                      Nom de la caractéristique <Typography component="span" color="error">*</Typography>
                    </Typography>}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 5 }}>
                  <CustomTextField
                    fullWidth
                    value={char.value}
                    onChange={(e) => handleCharacteristicChange(index, 'value', e.target.value)}
                    label={<Typography component="span">
                      Valeur <Typography component="span" color="error">*</Typography>
                    </Typography>}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }} className="flex items-center">
                  {index === characteristics.length - 1 ? (
                    <Button
                      variant="contained"
                      onClick={handleAddCharacteristic}
                      className="mie-2"
                    >
                      <i className="tabler-plus" />
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemoveCharacteristic(index)}
                    >
                      <i className="tabler-trash" />
                    </Button>
                  )}
                </Grid>
              </Grid>
            ))}
          </Grid>
      )}

      {/* Section 3: Prix et gestion des stocks */}
      <Grid size={{ xs: 12 }}>
        <Typography variant="h4" className="mb-4 mt-6">
          Prix et gestion des stocks
        </Typography>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
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

      <Grid size={{ xs: 12, md: 4 }}>
        <CustomTextField
          fullWidth
          type="number"
          label="Prix de gros"
          value={wholesalePrice || ''}
          onChange={(e) => setWholesalePrice && setWholesalePrice(e.target.value)}
          InputProps={{
            inputProps: { min: 0 },
            endAdornment: <InputAdornment position="end">F CFA</InputAdornment>
          }}
          helperText="Prix pour les achats en gros"
        />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <CustomTextField
          fullWidth
          type="number"
          label="TVA"
          value={taxe}
          onChange={(e) => setTaxe(e.target.value)}
          InputProps={{
            inputProps: { min: 0, max: 100 },
            endAdornment: <InputAdornment position="end">%</InputAdornment>
          }}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <CustomTextField
          fullWidth
          type="number"
          placeholder="0"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          label={
            <Typography component="span">
              Stock initial <Typography component="span" color="error">*</Typography>
            </Typography>
          }
          InputProps={{
            inputProps: { min: 0 }
          }}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <CustomTextField
          fullWidth
          type="number"
          placeholder="5"
          value={minStock || ''}
          onChange={(e) => setMinStock && setMinStock(Number(e.target.value))}
          label="Stock minimum"
          helperText="Alerte quand le stock atteint ce niveau"
          InputProps={{
            inputProps: { min: 0 }
          }}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <CustomTextField
          select
          fullWidth
          value={productStatus || 'active'}
          onChange={(e) => setProductStatus && setProductStatus(e.target.value)}
          label="Statut du produit"
        >
          <MenuItem value="active">Actif</MenuItem>
          <MenuItem value="inactive">Inactif</MenuItem>
          <MenuItem value="draft">Brouillon</MenuItem>
        </CustomTextField>
      </Grid>

      {/* Section 4: Options avancées */}
      <Grid size={{ xs: 12 }}>
        <Typography variant="h4" className="mb-4 mt-6">
          Options avancées
        </Typography>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">En promotion</FormLabel>
          <RadioGroup
            row
            value={isPromotion || 'false'}
            onChange={(e) => setIsPromotion && setIsPromotion(e.target.value)}
          >
            <FormControlLabel value="true" control={<Radio />} label="Oui" />
            <FormControlLabel value="false" control={<Radio />} label="Non" />
          </RadioGroup>
        </FormControl>
        {isPromotion === 'true' && (
          <CustomTextField
            fullWidth
            type="number"
            placeholder="0"
            value={promotionRate || ''}
            onChange={(e) => setPromotionRate && setPromotionRate(Number(e.target.value))}
            label="Taux de promotion"
            helperText="En pourcentage"
            InputProps={{
              inputProps: { min: 0, max: 100 },
              endAdornment: <InputAdornment position="end">%</InputAdornment>
            }}
          />
        )}
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Produit vedette</FormLabel>
          <RadioGroup
            row
            value={isFeatured || 'false'}
            onChange={(e) => setIsFeatured && setIsFeatured(e.target.value)}
          >
            <FormControlLabel value="true" control={<Radio />} label="Oui" />
            <FormControlLabel value="false" control={<Radio />} label="Non" />
          </RadioGroup>
        </FormControl>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <CustomTextField
          fullWidth
          placeholder="Ex: smartphone, électronique, apple"
          value={tags || ''}
          onChange={(e) => setTags && setTags(e.target.value)}
          label="Mots-clés (tags)"
          helperText="Séparez les mots-clés par des virgules"
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <CustomTextField
          fullWidth
          placeholder="1234567890123"
          value={barcode || ''}
          onChange={(e) => setBarcode && setBarcode(e.target.value)}
          label="Code-barres (EAN/UPC)"
        />
      </Grid>

      {/* <Grid size={{ xs: 12, md: 6 }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Produit fragile</FormLabel>
          <RadioGroup
            row
            value={isFragile || 'false'}
            onChange={(e) => setIsFragile && setIsFragile(e.target.value)}
          >
            <FormControlLabel value="true" control={<Radio />} label="Oui" />
            <FormControlLabel value="false" control={<Radio />} label="Non" />
          </RadioGroup>
        </FormControl>
      </Grid> */}

      {/* Section 5: Images du produit */}
      <Grid size={{ xs: 12 }}>
        <Typography variant="h4" className="mb-4 mt-6">
          Images du produit
        </Typography>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <ProductImage
          setSelectedFiles={setSelectedFiles}
          selectedFiles={selectedFiles}
          setSelectedFiles2={setSelectedFiles2}
          selectedFiles2={selectedFiles2}
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
