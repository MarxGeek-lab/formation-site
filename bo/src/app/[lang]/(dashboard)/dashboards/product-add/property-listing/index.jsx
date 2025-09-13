'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import Grid from "@mui/material/Grid2"
import StepPropertyDetails from './StepPropertyDetails'
import { useAuthStore, usePropertyStore } from '@/contexts/GlobalContext'
import { hideLoader, showLoader } from '@/components/Loader/loaderService'
import { showToast } from '@/components/ToastNotification/ToastNotification'
import { useParams, useSearchParams } from 'next/navigation'
import ProductCard from './ProductCard'

// Vars
const steps = [
  {
    icon: 'tabler-package',
    title: 'Détails du produit',
    subtitle: 'informations de base'
  },
]


const PropertyListingWizard = () => {
  // States
  const { lang: locale } = useParams();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const { createProduct, updateProduct, getProductById } = usePropertyStore();
  const { user, getUserById } = useAuthStore();

  const [activeStep, setActiveStep] = useState(0)
  const [category, setCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [productNameEn, setProductNameEn] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [price, setPrice] = useState(0);
  const [wholesalePrice, setWholesalePrice] = useState('');
  const [productStatus, setProductStatus] = useState('active');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFiles2, setSelectedFiles2] = useState([]);
  
  // États pour fichiers PDF et vidéos
  const [selectedFilesSale, setSelectedFilesSale] = useState([]);
  const [selectedFilesSale2, setSelectedFilesSale2] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedVideo2, setSelectedVideo2] = useState(null);

  // États pour abonnement et admin
  const [isSubscriptionBased, setIsSubscriptionBased] = useState('false');
  const [subscriptionId, setSubscriptionId] = useState('');
  const [assignedAdminId, setAssignedAdminId] = useState('');
  const [availableAdmins, setAvailableAdmins] = useState([]);
  const [availableSubscriptions, setAvailableSubscriptions] = useState([]);
  const [withVisual, setWithVisual] = useState('true');
  const [advantage, setAdvantage] = useState(['']);
  const [advantageEn, setAdvantageEn] = useState(['']);

  // Type de produit
  const [productType, setProductType] = useState('standard');

  const [product, setProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [customService, setCustomService] = useState('');

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
        handleNext={handleNext} steps={steps}
        // Informations de base
        category={category} setCategory={setCategory} 
        productName={productName} setProductName={setProductName} 
        description={description} setDescription={setDescription}
        customService={customService} setCustomService={setCustomService}
        // Type et tarification
        isSubscriptionBased={isSubscriptionBased} setIsSubscriptionBased={setIsSubscriptionBased}
        subscriptionId={subscriptionId} setSubscriptionId={setSubscriptionId}
        price={price} setPrice={setPrice}
        wholesalePrice={wholesalePrice} setWholesalePrice={setWholesalePrice}
        // Type de produit
        productType={productType} setProductType={setProductType}
        // Stock et statut
        productStatus={productStatus} setProductStatus={setProductStatus}
        // Attribution admin
        assignedAdminId={assignedAdminId} setAssignedAdminId={setAssignedAdminId}
        availableAdmins={availableAdmins} availableSubscriptions={availableSubscriptions}
        // Images
        selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles}
        selectedFiles2={selectedFiles2} setSelectedFiles2={setSelectedFiles2}
        // PDF et vidéos
        selectedFilesSale={selectedFilesSale} setSelectedFilesSale={setSelectedFilesSale}
        selectedFilesSale2={selectedFilesSale2} setSelectedFilesSale2={setSelectedFilesSale2}
        selectedVideo={selectedVideo} setSelectedVideo={setSelectedVideo}
        selectedVideo2={selectedVideo2} setSelectedVideo2={setSelectedVideo2}
        // Visuel
        withVisual={withVisual} setWithVisual={setWithVisual}
        advantage={advantage} setAdvantage={setAdvantage}
        descriptionEn={descriptionEn} setDescriptionEn={setDescriptionEn}
        advantageEn={advantageEn} setAdvantageEn={setAdvantageEn}
        productNameEn={productNameEn} setProductNameEn={setProductNameEn}
        />
    } 
  }


    // Validation et soumission
    const handleSubmit = async () => {
console.log(assignedAdminId)
      if (!productName) {
        showToast("Veuillez saisir le nom du produit.", 'info', 5000);
        setActiveStep(0)
        return;
      }

      if (!category && !customService) {
        showToast("Veuillez sélectionner une catégorie.", 'info', 5000);
        setActiveStep(0)
        return;
      }

      // Validation du prix selon le type de tarification
      if (isSubscriptionBased === 'false' && (!price || price <= 0)) {
        showToast("Veuillez définir un prix valide.", 'info', 5000);
        setActiveStep(0)
        return;
      }

      if (isSubscriptionBased === 'true' && !subscriptionId) {
        showToast("Veuillez sélectionner un abonnement.", 'info', 5000);
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
      if (productNameEn) formData.append("nameEn", productNameEn);
      if (description) formData.append("description", description);
      if (descriptionEn) formData.append("descriptionEn", descriptionEn);
      if (withVisual) formData.append("withVisual", 'true');
      if (advantage.length > 0) formData.append("advantage", JSON.stringify(advantage));
      if (advantageEn.length > 0) formData.append("advantageEn", JSON.stringify(advantageEn));

      if (category || customService) {
        formData.append("category", category !== 'Autres' ? category : customService);
      }
      
      // Type de produit
      if (productType) formData.append("productType", productType);
      
      // Tarification
      formData.append("isSubscriptionBased", isSubscriptionBased);
      if (isSubscriptionBased === 'true' && subscriptionId) {
        formData.append("subscriptionId", subscriptionId);
      } else if (isSubscriptionBased === 'false') {
        if (price) formData.append("price", price);
        if (wholesalePrice) formData.append("wholesalePrice", wholesalePrice);
      }
      
      // Statut du produit
      if (productStatus) formData.append("productStatus", productStatus);
      
      // Attribution admin
      if (assignedAdminId)  {
        if (product) {
          formData.append("assignedAdminId", assignedAdminId?._id);
        } else {
                formData.append("assignedAdminId", assignedAdminId);
        }
      } 


      // Ajout des images
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          formData.append("images", file);
        }
      }

      if (selectedFiles2.length > 0) {
        formData.append("images2", JSON.stringify(selectedFiles2));
      }
      
      // Images existantes pour la modification
      if (selectedFilesSale.length > 0) {
        for (const file of selectedFilesSale) {
          formData.append("pdf", file);
        }
      }

      if (selectedFilesSale2.length > 0) {
        formData.append("pdf2", JSON.stringify(selectedFilesSale2));
      }

      if (selectedVideo) {
        formData.append("videos", selectedVideo);
      }

      if (selectedVideo2) {
        formData.append("videos2", selectedVideo2);
      }

      // show load
      showLoader();
  
      try {
        let res;
        if (!productId) {
          res = await createProduct(formData);
        } else {
          res = await updateProduct(productId, formData);
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
              window.location.href = `/${locale}/dashboards/products/list`;
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
        const { data } = await getProductById(productId);
        function isValid(value) {
          return value !== null && value !== undefined && !(typeof value === "string" && value.trim() === "") &&
                !(Array.isArray(value) && value.length === 0) &&
                !(typeof value === "object" && Object.keys(value).length === 0);
        }

        if (data && typeof data === "object" && Object.keys(data).length > 0) {
          setProduct(data);
          
          // Informations de base du produit
          if (isValid(data.name)) setProductName(data.name);
          if (isValid(data.nameEn)) setProductNameEn(data.nameEn);
          if (isValid(data.category)) setCategory(data.category);
          if (isValid(data.description)) setDescription(data.description);
          if (isValid(data.descriptionEn)) setDescriptionEn(data.descriptionEn);
          
          // Type de produit
          if (isValid(data.productType)) setProductType(data.productType);
          
          // Tarification
          if (isValid(data.isSubscriptionBased)) {
            setIsSubscriptionBased(data.isSubscriptionBased ? 'true' : 'false');
          }
          if (isValid(data.subscriptionId)) setSubscriptionId(data.subscriptionId?._id);
          if (isValid(data.price)) setPrice(data.price);
          if (isValid(data.wholesalePrice)) setWholesalePrice(data.wholesalePrice);
          
          // Statut et admin
          if (isValid(data.productStatus)) setProductStatus(data.productStatus);
          if (data.assignedAdminId) setAssignedAdminId(data.assignedAdminId);
          
          // Images du produit
          if (data.photos?.length > 0) {
            setSelectedFiles2(data.photos);
          }
          
          // Documents et vidéos
          if (isValid(data.saleDocument)) setSelectedFilesSale2(data.saleDocument);
          if (isValid(data.demoVideo)) setSelectedVideo2(data.demoVideo);

          // Visuel
          if (isValid(data.withVisual)) setWithVisual(data.withVisual);
          if (isValid(data.advantage)) setAdvantage(data.advantage);
          if (isValid(data.advantageEn)) setAdvantageEn(data.advantageEn);
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

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 8 }}>
          <CardContent className='flex-1 pbs-6'>{getStepContent(activeStep, handleNext, handlePrev)}</CardContent>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <ProductCard
            title={productName}
            category={category}
            price={price}
            pricePromo={wholesalePrice}
            image={selectedFiles[0]}
            image2={selectedFiles2[0]}                                                                                                              
            demoVideo={selectedVideo}
            demoVideo2={selectedVideo2}
          />
        </Grid>
      </Grid>
    </Card>
  )
}

export default PropertyListingWizard
