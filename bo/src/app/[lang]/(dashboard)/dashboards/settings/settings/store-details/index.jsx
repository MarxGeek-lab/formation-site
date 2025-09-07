'use client';

import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { Button, Card, CardHeader, CardContent, TextField, Switch, FormControlLabel, Typography, Divider, Box } from '@mui/material';
import { useAuthStore, useSiteSettingsStore } from '@/contexts/GlobalContext';
import api from '@/configs/api';
import { hideLoader, showLoader } from '@/components/Loader/loaderService';
import { showToast } from '@/components/ToastNotification/ToastNotification';
import SocialLinks from './SocialLinks';

const StoreDetails = () => {
  const { updateSettings } = useSiteSettingsStore()
  const { user } = useAuthStore();

  const [supportEmail, setSupportEmail] = useState('');
  const [contactPhoneCall, setContactPhoneCall] = useState('');
  const [contactPhoneWhatsapp, setContactPhoneWhatsapp] = useState('');
  const [country, setCountry] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  const [currency, setCurrency] = useState('');
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

  // États pour les paramètres de relance de panier
  const [cartReminderSettings, setCartReminderSettings] = useState({
    firstReminderDelay: 24,
    secondReminderDelay: 72,
    thirdReminderDelay: 168,
    enableEmailReminders: true,
    enableSmsReminders: false,
    enablePushNotifications: false,
    abandonmentThreshold: 24,
    defaultEmailSubject: 'Votre panier vous attend - Finalisez votre commande !',
    defaultEmailMessage: 'Vous avez laissé des articles dans votre panier. Finalisez votre commande maintenant pour ne pas les perdre !',
    defaultSmsMessage: 'Votre panier vous attend ! Finalisez votre commande sur {site_url}',
    maxRemindersPerCart: 3,
    minCartValue: 0
  })

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

    // Ajout des paramètres de relance de panier
    if (cartReminderSettings) {
      formData.append('cartReminderSettings', JSON.stringify(cartReminderSettings));
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
        
        // Charger les paramètres de relance de panier
        if (data?.cartReminderSettings) {
          setCartReminderSettings(data.cartReminderSettings);
        }
      }
    } catch (err) {
      console.log("=====", err)
    } 
  };

  useEffect(() => {
    fetchSiteSettingss();
  }, []);

  // Fonction pour gérer les changements des paramètres de relance
  const handleCartReminderChange = (field, value) => {
    setCartReminderSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Fonction pour convertir les heures en texte lisible
  const convertHoursToText = (hours) => {
    if (hours < 24) {
      return `${hours} heure${hours > 1 ? 's' : ''}`
    } else {
      const days = Math.floor(hours / 24)
      return `${days} jour${days > 1 ? 's' : ''}`
    }
  }

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
      {/* <Grid size={{ xs: 12 }}>
        <SocialLinks
          facebookUrl={facebookUrl} setFacebookUrl={setFacebookUrl}
          linkedinUrl={linkedinUrl} setLinkedinUrl={setLinkedinUrl}
          twitterUrl={twitterUrl} setTwitterUrl={setTwitterUrl}
          instagramUrl={instagramUrl} setInstagramUrl={setInstagramUrl}
          youtubeUrl={youtubeUrl} setYoutubeUrl={setYoutubeUrl}
        />
      </Grid> */}
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
      {/* <Grid size={{ xs: 12 }}>
        <OrderIdFormat
          taxe={taxe}
          setTaxe={setTaxe}
          shipping={shipping}
          setShipping={setShipping}
          warranty={warranty}
          setWarranty={setWarranty}
          currency={currency} setCurrency={setCurrency}
        />
      </Grid> */}
      {/* <Grid size={{ xs: 12 }}>
        <StoreCurrency
          currency={currency}
          setCurrency={setCurrency}
          paymentGateways={paymentGateways}
          setPaymentGateways={setPaymentGateways}
         
        />
      </Grid> */}
      {/* Configuration des Relances de Panier */}
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader 
            title="Configuration des Relances de Panier"
            subheader="Configurez les délais et messages pour les paniers abandonnés"
          />
          <CardContent>
            <Grid container spacing={4}>
              {/* Délais de relance */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom>
                  Délais de Relance
                </Typography>
              </Grid>
              
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Seuil d'abandon (heures)"
                  value={cartReminderSettings.abandonmentThreshold}
                  onChange={(e) => handleCartReminderChange('abandonmentThreshold', parseInt(e.target.value))}
                  helperText="Délai d'inactivité avant marquage comme abandonné"
                  inputProps={{ min: 1, max: 168 }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="1ère relance (heures)"
                  value={cartReminderSettings.firstReminderDelay}
                  onChange={(e) => handleCartReminderChange('firstReminderDelay', parseInt(e.target.value))}
                  helperText={`Soit ${convertHoursToText(cartReminderSettings.firstReminderDelay)} après abandon`}
                  inputProps={{ min: 1, max: 168 }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="2ème relance (heures)"
                  value={cartReminderSettings.secondReminderDelay}
                  onChange={(e) => handleCartReminderChange('secondReminderDelay', parseInt(e.target.value))}
                  helperText={`Soit ${convertHoursToText(cartReminderSettings.secondReminderDelay)} après abandon`}
                  inputProps={{ min: 1, max: 336 }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="3ème relance (heures)"
                  value={cartReminderSettings.thirdReminderDelay}
                  onChange={(e) => handleCartReminderChange('thirdReminderDelay', parseInt(e.target.value))}
                  helperText={`Soit ${convertHoursToText(cartReminderSettings.thirdReminderDelay)} après abandon`}
                  inputProps={{ min: 1, max: 720 }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Nombre max de relances"
                  value={cartReminderSettings.maxRemindersPerCart}
                  onChange={(e) => handleCartReminderChange('maxRemindersPerCart', parseInt(e.target.value))}
                  helperText="Maximum de relances par panier"
                  inputProps={{ min: 1, max: 10 }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Valeur minimale (FCFA)"
                  value={cartReminderSettings.minCartValue}
                  onChange={(e) => handleCartReminderChange('minCartValue', parseInt(e.target.value))}
                  helperText="Valeur minimale du panier pour déclencher une relance"
                  inputProps={{ min: 0 }}
                />
              </Grid>

              {/* Types de relance */}
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Types de Relance
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={cartReminderSettings.enableEmailReminders}
                      onChange={(e) => handleCartReminderChange('enableEmailReminders', e.target.checked)}
                    />
                  }
                  label="Relances par Email"
                />
                <Typography variant="body2" color="text.secondary">
                  Envoyer des relances par email aux clients
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={cartReminderSettings.enableSmsReminders}
                      onChange={(e) => handleCartReminderChange('enableSmsReminders', e.target.checked)}
                    />
                  }
                  label="Relances par SMS"
                />
                <Typography variant="body2" color="text.secondary">
                  Envoyer des relances par SMS
                </Typography>
              </Grid>

              {/* <Grid size={{ xs: 12, md: 4 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={cartReminderSettings.enablePushNotifications}
                      onChange={(e) => handleCartReminderChange('enablePushNotifications', e.target.checked)}
                    />
                  }
                  label="Notifications Push"
                />
                <Typography variant="body2" color="text.secondary">
                  Envoyer des notifications push
                </Typography>
              </Grid> */}

              {/* Messages par défaut */}
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Messages par Défaut
                </Typography>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Sujet Email par défaut"
                  value={cartReminderSettings.defaultEmailSubject}
                  onChange={(e) => handleCartReminderChange('defaultEmailSubject', e.target.value)}
                  helperText="Sujet par défaut pour les emails de relance"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Message Email par défaut"
                  value={cartReminderSettings.defaultEmailMessage}
                  onChange={(e) => handleCartReminderChange('defaultEmailMessage', e.target.value)}
                  helperText="Message par défaut pour les emails de relance"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Message SMS par défaut"
                  value={cartReminderSettings.defaultSmsMessage}
                  onChange={(e) => handleCartReminderChange('defaultSmsMessage', e.target.value)}
                  helperText="Message par défaut pour les SMS de relance. Utilisez {site_url} pour l'URL du site"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <div className="flex justify-end gap-4">
          <Button variant="contained" onClick={handleSave}>
            Enregistrer
          </Button>
        </div>
      </Grid>
    </Grid>
  );
};

export default StoreDetails;