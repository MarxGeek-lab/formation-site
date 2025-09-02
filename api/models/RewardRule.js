const mongoose = require('mongoose');

// Définition du schéma pour les règles de récompense
const RewardRuleSchema = new mongoose.Schema({
  // Nom de la règle de récompense
  name: {
    type: String,
    required: true,
    unique: true
  },
  // Code d'action associé à la règle
  actionCode: {
    type: String,
    required: true,
    unique: true,
    enum: [
      'PROPERTY_LISTING',    // Publication d'une annonce
      'PROPERTY_RENTED',     // Location réussie
      'PROPERTY_SOLD',       // Vente réussie
      'REFERRAL_SIGNUP',     // Parrainage réussi
      'REFERRAL_FIRST_LISTING', // Première annonce du filleul
      'PROFILE_COMPLETE',    // Profil complété
      'REVIEW_POSTED'        // Avis posté
    ]
  },
  // Points attribués pour l'action
  points: {
    type: Number,
    required: true,
    min: 0
  },
  // Description de la règle de récompense
  description: String,
  // Indicateur si la règle est active
  isActive: {
    type: Boolean,
    default: true
  }
});

// Exportation du modèle RewardRule basé sur le schéma
module.exports = mongoose.model('RewardRule', RewardRuleSchema); 