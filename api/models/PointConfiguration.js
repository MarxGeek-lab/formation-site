const mongoose = require('mongoose');

const PointConfigurationSchema = new mongoose.Schema({
  // Catégorie de l'action (pour regrouper les actions similaires)
  category: {
    type: String,
    required: true,
    enum: ['property', 'referral', 'engagement', 'profile']
  },

  // Action spécifique
  action: {
    type: String,
    required: true,
    unique: true
  },

  // Nom affiché de l'action
  displayName: {
    type: String,
    required: true
  },

  // Description de l'action
  description: String,

  // Points attribués
  points: {
    type: Number,
    required: true,
    min: 0
  },

  // Limite de points par période
  limits: {
    maxPerDay: Number,     // Maximum par jour
    maxPerWeek: Number,    // Maximum par semaine
    maxPerMonth: Number,   // Maximum par mois
    maxTotal: Number       // Maximum total
  },

  // Conditions d'attribution
  conditions: {
    minAmount: Number,          // Montant minimum (pour les transactions)
    requiredLevel: String,      // Niveau requis
    requiredActions: [String]   // Actions préalables requises
  },

  // Statut de la configuration
  isActive: {
    type: Boolean,
    default: true
  },

  // Période de validité
  validityPeriod: {
    startDate: Date,
    endDate: Date
  },

  // Audit
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Valeurs par défaut pour les points
const DEFAULT_POINTS = {
  PROPERTY: {
    LISTING_CREATED: 100,
    LISTING_RENTED: 500,
    LISTING_SOLD: 1000,
    LISTING_UPDATED: 50,
    PHOTO_ADDED: 10
  },
  REFERRAL: {
    SIGNUP: 200,
    FIRST_LISTING: 300,
    FIRST_TRANSACTION: 500
  },
  ENGAGEMENT: {
    REVIEW_POSTED: 50,
    PROFILE_COMPLETED: 100,
    DAILY_LOGIN: 5
  },
  PROFILE: {
    EMAIL_VERIFIED: 50,
    PHONE_VERIFIED: 50,
    ID_VERIFIED: 200
  }
};

module.exports = {
  PointConfiguration: mongoose.model('PointConfiguration', PointConfigurationSchema),
  DEFAULT_POINTS
}; 