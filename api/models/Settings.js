const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  currency: {
    type: String,
    default: 'XOF',
  },
  paymentGateways: {
    type: [String], // Tableau de passerelles de paiement
    default: ['MTN', 'MOOV'], // Valeur par défaut : Stripe
  },
  defaultLanguage: {
    type: String,
    default: 'fr',
  },
  supportEmail: {
    type: String,
    default: 'mgangbala610@gmail.com',
  },
  contactPhoneWhatsapp: {
    type: String,
    default: '+2290169816413',
  },
  contactPhoneCall: {
    type: String,
    default: '+2290169816413',
  },
  websiteTitle: {
    type: String,
    default: 'Market',
  },
  description: {
    type: String,
    default: 'Description de la boutique',
  },
  country: {
    type: String,
    default: 'Bénin',
  },
  city: {
    type: String,
    default: 'Cotonou',
  },
  address: {
    type: String,
    default: '123 Rue du Commerce',
  },
  businessName: {
    type: String,
    default: '',
  },
  logoUrl: {
    type: String,
    default: 'logo.png'
  },
  linkSocial: {
    facebook: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    youtube: { type: String, default: '' },
  },

  shippingMethods: {
      type: [
        {
          name: { type: String, required: true },         // Nom de la méthode (standard, express, etc.)
          delay: { 
            min: { type: Number, default: 1 },
            max: { type: Number, default: 2 },
            unit: { type: String, enum: ['jour', 'heure'], default: 'jour' },
          },            // Délai estimé en jours
          fee: { type: Number, default: 0 },              // Frais en XOF ou autre
          isDefault: { type: Boolean, default: false },   // Si c'est la méthode par défaut
          availableCountries: {                           // Liste des pays où c’est dispo
            type: [String],
            default: ['BJ', 'TG', 'CI']
          },
          description: { type: String, default: '' },
        }
      ],
      default: [
        {
          name: 'Livraison express',
          delay: {
            min: 1,
            max: 2,
            unit: 'jour'
          },
          fee: 2500,
          isDefault: false,
          availableCountries: ['BJ', 'TG', 'CI'],
          description: 'Livraison rapide à domicile',
        },
        {
          name: 'Retirer en magasin',
          delay: {
            min: 0,
            max: 0,
            unit: 'jour'
          },
          fee: 0,
          isDefault: false,
          availableCountries: ['BJ', 'TG', 'CI'],
          description: 'Retrait gratuit en point relais',
        }
      ]    
  },
  warranty: { type: Number, default: 30 },
  taxe: { type: Number, default: 1.8}
  // Ajoutez d'autres paramètres selon vos besoins
});

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);

module.exports = SiteSettings;