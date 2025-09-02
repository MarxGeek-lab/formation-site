const mongoose = require('mongoose');

// Définir le schéma pour les récompenses utilisateur
const UserRewardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // Référence au modèle User
    ref: 'User',
    required: true, // Le champ utilisateur est requis
    unique: true // Chaque utilisateur peut avoir un seul enregistrement de récompense
  },
  totalPoints: {
    type: Number, // Total des points accumulés par l'utilisateur
    default: 0 // Le nombre de points par défaut est 0
  },
  level: {
    type: String, // Niveau de récompense de l'utilisateur
    enum: ['bronze', 'silver', 'gold', 'platinum'], // Niveaux autorisés
    default: 'BRONZE' // Le niveau par défaut est BRONZE
  },
  pointsHistory: [{
    action: {
      type: String, // Action qui a conduit au changement de points
      required: true // L'action est requise
    },
    points: Number, // Points associés à l'action
    description: String, // Description de l'action
    date: {
      type: Date, // Date de l'action
      default: Date.now // Par défaut à la date actuelle
    }
  }],
  referralCode: {
    code: {
      type: String, // Code de parrainage unique
      unique: true // Le code doit être unique
    },
    referrals: [{
      referredUser: {
        type: mongoose.Schema.Types.ObjectId, // Utilisateur parrainé par ce code
        ref: 'User'
      },
      status: {
        type: String, // Statut du parrainage
        enum: ['pending', 'completed'], // Statuts autorisés
        default: 'pending' // Le statut par défaut est PENDING
      },
      pointsAwarded: {
        type: Boolean, // Si les points ont été attribués pour ce parrainage
        default: false // Par défaut, non attribué
      },
      date: {
        type: Date, // Date du parrainage
        default: Date.now // Par défaut à la date actuelle
      }
    }]
  }
});

// Exporter le modèle UserReward
module.exports = mongoose.model('UserReward', UserRewardSchema); 