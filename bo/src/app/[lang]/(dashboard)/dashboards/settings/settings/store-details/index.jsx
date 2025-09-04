'use client';

import Grid from '@mui/material/Grid2';
import Profile from './Profile';
import BillingInformation from './BillingInformation';
import OrderIdFormat from './OrderIdFormat';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useAuthStore, useSiteSettings, useSiteSettingsStore } from '@/contexts/GlobalContext';
import api from '@/configs/api';
import { hideLoader, showLoader } from '@/components/Loader/loaderService';
import { showToast } from '@/components/ToastNotification/ToastNotification';
import SocialLinks from './SocialLinks';

const StoreDetails = () => {
  const { fetchSiteSettings, updateSettings } = useSiteSettingsStore()
  const { user } = useAuthStore();

  const [supportEmail, setSupportEmail] = useState('');
  const [contactPhoneCall, setContactPhoneCall] = useState('');
  const [contactPhoneWhatsapp, setContactPhoneWhatsapp] = useState('');
  const [country, setCountry] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [disputeCancellationFee, setDisputeCancellationFee] = useState(0);
  const [platformCommission, setPlatformCommission] = useState({
    owner: 0,
    buyer: 0
  });
  const [currency, setCurrency] = useState('');
  const [paymentGateways, setPaymentGateways] = useState(['MTN']);
  const [websiteTitle, setWebsiteTitle] = useState('');
  const [description, setDescription] = useState('');
  const [logoFile, setLogoFile] = useState(null)
  const [taxe, setTaxe] = useState(0)
  const [facebookUrl, setFacebookUrl] = useState('')
  const [twitterUrl, setTwitterUrl] = useState('')
  const [instagramUrl, setInstagramUrl] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [warranty, setWarranty] = useState('')
  const [shipping, setShipping] = useState([
    {
      name: '',
      delay: {
        min: 1,
        max: 2,
        unit: 'jour'
      },
      fee: 0,
      isDefault: false,
      availableCountries: ['BJ', 'TG', 'CI'],
      description: ''
    }
  ])

  const prepareDataForBackend = () => {
    const formData = new FormData();

    // Vérification et ajout de supportEmail
    if (supportEmail) {
      formData.append('supportEmail', supportEmail);
    }

    // Vérification et ajout de contactPhoneCall
    if (contactPhoneCall) {
      formData.append('contactPhoneCall', contactPhoneCall);
    }

    // Vérification et ajout de contactPhoneWhatsapp
    if (contactPhoneWhatsapp) {
      formData.append('contactPhoneWhatsapp', contactPhoneWhatsapp);
    }

    // Vérification et ajout de country
    if (country) {
      formData.append('country', country);
    }

    // Vérification et ajout de businessName
    if (businessName) {
      formData.append('businessName', businessName);
    }

    // Vérification et ajout de address
    if (address) {
      formData.append('address', address);
    }

    // Vérification et ajout de city
    if (city) {
      formData.append('city', city);
    }

    // Vérification et ajout de currency
    if (currency) {
      formData.append('currency', currency);
    }

    if (logoFile) {
      formData.append('images', logoFile);
    }

    if (taxe) {
      formData.append('taxe', taxe);
    }

    if (facebookUrl) {
      formData.append('facebookUrl', facebookUrl);
    }

    if (twitterUrl) {
      formData.append('twitterUrl', twitterUrl);
    }

    if (instagramUrl) {
      formData.append('instagramUrl', instagramUrl);
    }

    if (linkedinUrl) {
      formData.append('linkedinUrl', linkedinUrl);
    }

    if (youtubeUrl) {
      formData.append('youtubeUrl', youtubeUrl);
    }

    if (warranty) {
      formData.append('warranty', warranty);
    }

    if (shipping.length > 0) {
      formData.append('shipping', JSON.stringify(shipping));
    }

    return formData;
  };

  const handleSave = async () => {
    const dataToSend = prepareDataForBackend();
    console.log(dataToSend)
    showLoader()
    try {
      const response = await updateSettings(dataToSend)
      hideLoader();
      console.log(response)
      if (response === 200) {
        showToast('Paramètres mis à jour avec succès', 'success', 5000);
        fetchSiteSettingss()

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSiteSettingss = async () => {
    try {
      const response = await api.get('settings'); // Remplacez par votre endpoint
      const data = response.data;

      if (data) {
        setBusinessName(data?.businessName);
        setContactPhoneCall(data?.contactPhoneCall);
        setSupportEmail(data?.supportEmail);
        setCountry(data?.country);
        setCity(data?.city);
        setAddress(data?.address);
        setBusinessName(data?.businessName);
        setContactPhoneWhatsapp(data?.contactPhoneWhatsapp);
        setCurrency(data?.currency);
        setTaxe(data?.taxe);
        setWarranty(data?.warranty);
        setShipping(data?.shippingMethods);
        setFacebookUrl(data?.facebookUrl);
        setTwitterUrl(data?.twitterUrl);
        setInstagramUrl(data?.instagramUrl);
        setLinkedinUrl(data?.linkedinUrl);
        setYoutubeUrl(data?.youtubeUrl);
        setDescription(data?.description);
        setWebsiteTitle(data?.websiteTitle);
      }
    } catch (err) {
      console.log("=====", err)
    } 
  };

  useEffect(() => {
    fetchSiteSettingss();
  }, []);

  return (
    <Grid container spacing={6}>
      {/* <Grid size={{ xs: 12 }}>
        <Profile
          supportEmail={supportEmail}
          setSupportEmail={setSupportEmail}
          contactPhoneCall={contactPhoneCall}
          setContactPhoneCall={setContactPhoneCall}
          contactPhoneWhatsapp={contactPhoneWhatsapp}
          setContactPhoneWhatsapp={setContactPhoneWhatsapp}
          description={description} setDescription={setDescription}
          websiteTitle={websiteTitle} setWebsiteTitle={setWebsiteTitle}
          logoFile={logoFile} setLogoFile={setLogoFile}
        />
      </Grid> */}
      <Grid size={{ xs: 12 }}>
        <SocialLinks
          facebookUrl={facebookUrl} setFacebookUrl={setFacebookUrl}
          linkedinUrl={linkedinUrl} setLinkedinUrl={setLinkedinUrl}
          twitterUrl={twitterUrl} setTwitterUrl={setTwitterUrl}
          instagramUrl={instagramUrl} setInstagramUrl={setInstagramUrl}
          youtubeUrl={youtubeUrl} setYoutubeUrl={setYoutubeUrl}
        />
      </Grid>
      {/* <Grid size={{ xs: 12 }}>
        <BillingInformation
          country={country}
          setCountry={setCountry}
          businessName={businessName}
          setBusinessName={setBusinessName}
          address={address}
          setAddress={setAddress}
          city={city}
          setCity={setCity}
        />
      </Grid> */}
      <Grid size={{ xs: 12 }}>
        <OrderIdFormat
          taxe={taxe}
          setTaxe={setTaxe}
          shipping={shipping}
          setShipping={setShipping}
          warranty={warranty}
          setWarranty={setWarranty}
          currency={currency} setCurrency={setCurrency}
        />
      </Grid>
      {/* <Grid size={{ xs: 12 }}>
        <StoreCurrency
          currency={currency}
          setCurrency={setCurrency}
          paymentGateways={paymentGateways}
          setPaymentGateways={setPaymentGateways}
         
        />
      </Grid> */}
      <Grid size={{ xs: 12 }}>
        <div className="flex justify-end gap-4">
          {/* <Button variant="tonal" color="secondary">
            Annuler
          </Button> */}
          <Button variant="contained" onClick={handleSave}>
            Enregistrer
          </Button>
        </div>
      </Grid>
    </Grid>
  );
};

export default StoreDetails;