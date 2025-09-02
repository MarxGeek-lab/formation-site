'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stepper from '@mui/material/Stepper'
import MuiStep from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import StepPhotos from './StepImages'
import StepPropertyDetails from './StepPropertyDetails'

// Styled Component Imports
import StepperWrapper from '@core/styles/stepper'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useAuthStore, usePropertyStore } from '@/contexts/GlobalContext'
import { hideLoader, showLoader } from '@/components/Loader/loaderService'
import { showToast } from '@/components/ToastNotification/ToastNotification'
import { useParams, useSearchParams } from 'next/navigation'
import FeaturedProductCard from '@components/FeaturedProductCard/FeaturedProductCard';

// Vars
const steps = [
  {
    icon: 'tabler-package',
    title: 'Détails du produit',
    subtitle: 'informations de base'
  },
  // {
  //   icon: 'tabler-photo',
  //   title: 'Images du produit',
  //   subtitle: 'photos et visuels'
  // }
]

const Step = styled(MuiStep)({
  '&.Mui-completed .step-title , &.Mui-completed .step-subtitle': {
    color: 'var(--mui-palette-text-disabled)'
  }
})

const PropertyListingWizard = () => {
  // States
  const { lang: locale } = useParams();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const { createProperty, updateProperty, getPropertyById } = usePropertyStore();
  const { user, getUserById } = useAuthStore();

  const [activeStep, setActiveStep] = useState(0)
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [taxe, setTaxe] = useState(0);
  const [stock, setStock] = useState(1);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFiles2, setSelectedFiles2] = useState([]);

  // Nouveaux états pour les champs produit
  const [color, setColor] = useState([]);
  const [size, setSize] = useState([]);
  const [brand, setBrand] = useState('');
  const [productCode, setProductCode] = useState('');
  const [material, setMaterial] = useState('');
  const [weight, setWeight] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [wholesalePrice, setWholesalePrice] = useState('');
  const [minStock, setMinStock] = useState('');
  const [productStatus, setProductStatus] = useState('active');
  const [tags, setTags] = useState('');
  const [barcode, setBarcode] = useState('');
  const [isFragile, setIsFragile] = useState('false');
  const [isFeatured, setIsFeatured] = useState('false');
  const [isPromotion, setIsPromotion] = useState('false');
  const [promotionRate, setPromotionRate] = useState(0);

  const [property, setProperty] = useState(null);
  const [open, setOpen] = useState(false);
  const [customService, setCustomService] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [characteristics, setCharacteristics] = useState([{ key: '', value: '' }]);

  // Récupérer le profil
  const [ userProfile, setUserProfile ] = useState();
  const fetchUserProfile = async () => {
    if (user) {
      try {
          const { data, status } = await getUserById(user._id);
          setUserProfile(data);
      } catch (error) {
          console.log(error);
      }
    }
  }
  
  useEffect(() => {
      fetchUserProfile();
  }, [user]);


  const getStepContent = (step, handleNext, handlePrev) => {

    if (step === 0) {
      return <StepPropertyDetails 
        activeStep={step} 
        handleNext={handleNext} handlePrev={handlePrev} steps={steps}
        // Informations générales
        setCategory={setCategory} setProductName={setProductName} setDescription={setDescription}
        category={category} productName={productName} description={description}
        subCategory={subCategory} setSubCategory={setSubCategory}
        customService={customService} setCustomService={setCustomService}
        customCategory={customCategory} setCustomCategory={setCustomCategory}
        // Nouveaux champs produit
        productCode={productCode} setProductCode={setProductCode}
        brand={brand} setBrand={setBrand}
        // Caractéristiques
        color={color} setColor={setColor}
        size={size} setSize={setSize}
        material={material} setMaterial={setMaterial}
        weight={weight} setWeight={setWeight}
        dimensions={dimensions} setDimensions={setDimensions}
        // Prix et stock
        price={price} setPrice={setPrice}
        wholesalePrice={wholesalePrice} setWholesalePrice={setWholesalePrice}
        taxe={taxe} setTaxe={setTaxe}
        stock={stock} setStock={setStock}
        minStock={minStock} setMinStock={setMinStock}
        productStatus={productStatus} setProductStatus={setProductStatus}
        // Options avancées
        tags={tags} setTags={setTags}
        barcode={barcode} setBarcode={setBarcode}
        isFragile={isFragile} setIsFragile={setIsFragile}
        isFeatured={isFeatured} setIsFeatured={setIsFeatured}
        isPromotion={isPromotion} setIsPromotion={setIsPromotion}
        promotionRate={promotionRate} setPromotionRate={setPromotionRate}
        // Images
        selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles}
        selectedFiles2={selectedFiles2} setSelectedFiles2={setSelectedFiles2}
        // Caractéristiques personnalisées
        characteristics={characteristics} setCharacteristics={setCharacteristics}

         />
    } 
  }


    // Validation et soumission
    const handleSubmit = async () => {

      if (!productName) {
        showToast("Veuillez saisir le nom du produit.", 'info', 5000);
        setActiveStep(0)
        return;
      }

      if ((!category || !subCategory) && (!customCategory || !customService)) {
        showToast("Veuillez sélectionner une catégorie.", 'info', 5000);
        setActiveStep(0)
        return;
      }

      if (!price || price <= 0) {
        showToast("Veuillez définir un prix valide.", 'info', 5000);
        setActiveStep(0)
        return;
      }

      if (isPromotion === 'true' && (promotionRate <= 0 || promotionRate >= 100)) {
        showToast("Veuillez définir un taux de promotion valide.", 'info', 5000);
        setActiveStep(0)
        return;
      }


      // Validation des images
      if (selectedFiles.length < 1) {
        if (selectedFiles2.length < 1) {
          showToast("Veuillez sélectionner au moins 1 image du produit.", 'info', 5000);
          return;
        }
      }

      const formData = new FormData();
  
      // Informations de base du produit
      if (productName) formData.append("name", productName);
      if (description) formData.append("description", description);
      if (category || customService) {
        formData.append("category", category !== 'Autres' ? category : customService);
      }
      if (subCategory || customCategory) formData.append("subCategory", subCategory !== "Autres" ? subCategory : customCategory);
      
      // Caractéristiques personnalisées
      if (characteristics.length > 0 && characteristics[0].key) {
        formData.append("characteristics", JSON.stringify(characteristics));
      }
      
      // Nouveaux champs produit
      if (productCode) formData.append("productCode", productCode);
      if (brand) formData.append("brand", brand);
      if (color) formData.append("color", JSON.stringify(color));
      if (size) formData.append("size", JSON.stringify(size));
      if (material) formData.append("material", material);
      if (weight) formData.append("weight", weight);
      if (dimensions) formData.append("dimensions", dimensions);
      
      // Prix et stock
      if (price) formData.append("price", price);
      if (wholesalePrice) formData.append("wholesalePrice", wholesalePrice);
      if (taxe) formData.append("taxe", taxe);
      if (stock > 0) formData.append("stock", stock);
      if (minStock) formData.append("minStock", minStock);
      if (productStatus) formData.append("productStatus", productStatus);
      
      // Options avancées
      if (tags) formData.append("tags", tags);
      if (barcode) formData.append("barcode", barcode);
      if (isFragile) formData.append("isFragile", isFragile);
      if (isFeatured) formData.append("isFeatured", isFeatured);
      if (isPromotion) formData.append("isPromotion", isPromotion);
      if (promotionRate) formData.append("promotionRate", promotionRate);
      
      // Propriétaire
      formData.append("owner", user?._id);
  
      // Ajout des images
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          formData.append("images", file);
        }
      }
      
      // Images existantes pour la modification
      if (productId && selectedFiles2.length > 0) {
        formData.append("photos2", JSON.stringify(selectedFiles2));
      }

      // show load
      showLoader();
  
      try {
        let res;
        if (!productId) {
          res = await createProperty(formData);
        } else {
          res = await updateProperty(productId, formData);
        }

        // hide load
        hideLoader();

        if (res) {  
          if (res === 201) {
            showToast("Produit ajouté avec succès !", "success", 5000);
            setTimeout(() => {
              // window.location.reload();
            }, 3000); 
          } else if (res === 200) {
            localStorage.removeItem("productId")
            showToast("Produit modifié avec succès !", "success", 5000);
            setTimeout(() => {
              // window.location.href = `/${locale}/dashboards/products/list`;
            }, 3000);
          } else {
            showToast("Une erreur s'est produite lors de la création. Veuillez réessayer", "error", 5000);
          }
        }
        
      } catch (error) {
        console.log(error);
        showToast("Une erreur s'est produite lors de la création. Veuillez réessayer", "error", 5000);
      }
    }

  const handleNext = () => {
    if (activeStep !== steps.length - 1) {
      setActiveStep(activeStep + 1)
    } else {
      handleSubmit();
    }
  }

  useEffect(() => {
    const fetchData = async() => {
      if (productId) {
        const { data } = await getPropertyById(productId);

        function isValid(value) {
          return value !== null && value !== undefined && !(typeof value === "string" && value.trim() === "") &&
                !(Array.isArray(value) && value.length === 0) &&
                !(typeof value === "object" && Object.keys(value).length === 0);
        }

        if (data && typeof data === "object" && Object.keys(data).length > 0) {
          setProperty(data);
          console.log(data)
          // Informations de base du produit
          if (isValid(data.name)) setProductName(data.name);
          if (isValid(data.category)) setCategory(data.category);
          if (isValid(data.subCategory)) setSubCategory(data.subCategory);
          if (isValid(data.description)) setDescription(data.description);
          
          // Images du produit
          if (isValid(data.photos)) {
            setSelectedFiles2(data.photos);
          }
          
          // Nouveaux champs produit
          if (isValid(data.productCode)) setProductCode(data.productCode);
          if (isValid(data.brand)) setBrand(data.brand);
          if (isValid(data.material)) setMaterial(data.material);
          if (isValid(data.weight)) setWeight(data.weight);
          if (isValid(data.dimensions)) setDimensions(data.dimensions);
          
          // Prix et stock
          if (isValid(data.price)) setPrice(data.price);
          if (isValid(data.wholesalePrice)) setWholesalePrice(data.wholesalePrice);
          if (isValid(data.taxe)) setTaxe(data.taxe);
          if (isValid(data.stock)) {
            if (typeof data.stock === 'object' && data.stock.total) {
              setStock(data.stock.total);
            } else {
              setStock(data.stock);
            }
          }
          if (isValid(data.minStock)) setMinStock(data.minStock);
          if (isValid(data.productStatus)) setProductStatus(data.productStatus);
          
          // Options avancées
          if (isValid(data.tags)) setTags(data.tags);
          if (isValid(data.barcode)) setBarcode(data.barcode);
          if (isValid(data.isFragile)) setIsFragile(data.isFragile);
          if (isValid(data.isFeatured)) setIsFeatured(data.isFeatured);
          setIsPromotion(data.isPromotion ? 'true' : 'false');
          if (isValid(data.promotionRate)) setPromotionRate(data.promotionRate);
          
          // Caractéristiques personnalisées
          if (isValid(data.characteristics)) {
            setCharacteristics(data.characteristics);
          }
          
          // Couleurs
          if (data.color && data.color.length > 0) {
            setColor([...data.color]);
          }
          
          // Tailles
          if (data.size && data.size.length > 0) {
            setSize([...data.size]);
          }

          if (data.photos && data.photos.length > 0) {
            setSelectedFiles2([...data.photos]);
          }
        }
      }
    }
    fetchData();
  }, [productId]);

  const handlePrev = () => {
    if (activeStep !== 0) {
      setActiveStep(activeStep - 1)
    }
  }

  const goToProfile = async () => {
    window.location.href = `/${locale}/dashboards/user-profile`;
    sessionStorage.setItem('showDialogProfil', 'true');
  }

  return (
    <Card className='flex '
      sx={{
        flexDirection: {xs: 'column-reverse', md: 'row'}
      }}>
      <Dialog open={open}>
          <DialogTitle>Profil incomplet</DialogTitle>
          <DialogContent>
            <Typography>
            ℹ️ Pour publier une annonce, vous devez d'abord <strong>compléter votre profil</strong> en soumettant les documents nécessaires à la vérification.
            </Typography>
          </DialogContent>
          <DialogActions>
            {/* <Button onClick={handleClose} color="inherit">Fermer</Button> */}
            <Button onClick={goToProfile} variant="contained" color="primary">
              Compléter mon profil
            </Button>
          </DialogActions>
        </Dialog>
      {/* <CardContent className='max-lg:border-be lg:border-ie lg:min-is-[300px]'>
        <StepperWrapper>
          <Stepper
            activeStep={activeStep}
            orientation='vertical'
            connector={<></>}
            className='flex flex-col gap-4 min-is-[220px]'
          >
            {steps.map((label, index) => {
              return (
                <Step key={index} onClick={() => setActiveStep(index)}>
                  <StepLabel icon={<></>} className='p-1 cursor-pointer'>
                    <div className='step-label'>
                      <CustomAvatar
                        variant='rounded'
                        skin={activeStep === index ? 'filled' : 'light'}
                        {...(activeStep >= index && { color: 'primary' })}
                        {...(activeStep === index && { className: 'shadow-primarySm' })}
                        size={38}
                      >
                        <i className={classnames(label.icon, '!text-[22px]')} />
                      </CustomAvatar>
                      <div className='flex flex-col'>
                        <Typography color='text.primary' className='step-title'>
                          {label.title}
                        </Typography>
                        <Typography className='step-subtitle'>{label.subtitle}</Typography>
                      </div>
                    </div>
                  </StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </StepperWrapper>
      </CardContent> */}

      <CardContent className='flex-1 pbs-6'>{getStepContent(activeStep, handleNext, handlePrev)}</CardContent>

    </Card>
  )
}

export default PropertyListingWizard
