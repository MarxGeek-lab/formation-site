const mongoose = require('mongoose');

const reminderSettingsSchema = new mongoose.Schema({
  // Délais de relance (en heures)
  firstReminderDelay: {
    type: Number,
    default: 24, // 24 heures après abandon
    min: 1,
    max: 168 // Maximum 1 semaine
  },
  
  secondReminderDelay: {
    type: Number,
    default: 72, // 72 heures (3 jours) après abandon
    min: 1,
    max: 336 // Maximum 2 semaines
  },
  
  thirdReminderDelay: {
    type: Number,
    default: 168, // 168 heures (1 semaine) après abandon
    min: 1,
    max: 720 // Maximum 1 mois
  },
  
  // Configuration des types de relance
  enableEmailReminders: {
    type: Boolean,
    default: true
  },
  
  enableSmsReminders: {
    type: Boolean,
    default: false
  },
  
  enablePushNotifications: {
    type: Boolean,
    default: false
  },
  
  // Seuil d'abandon automatique (en heures)
  abandonmentThreshold: {
    type: Number,
    default: 24, // Marquer comme abandonné après 24h d'inactivité
    min: 1,
    max: 168
  },
  
  // Messages par défaut
  defaultEmailSubject: {
    type: String,
    default: 'Votre panier vous attend - Finalisez votre commande !'
  },
  
  defaultEmailMessage: {
    type: String,
    default: 'Vous avez laissé des articles dans votre panier. Finalisez votre commande maintenant pour ne pas les perdre !'
  },
  
  defaultSmsMessage: {
    type: String,
    default: 'Votre panier vous attend ! Finalisez votre commande sur {site_url}'
  },
  
  // Paramètres avancés
  maxRemindersPerCart: {
    type: Number,
    default: 3, // Maximum 3 relances par panier
    min: 1,
    max: 10
  },
  
  minCartValue: {
    type: Number,
    default: 0, // Valeur minimale du panier pour déclencher une relance
    min: 0
  },
  
  // Métadonnées
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Middleware pour mettre à jour updatedAt
reminderSettingsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Méthode statique pour récupérer les paramètres (singleton)
reminderSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  
  if (!settings) {
    // Créer les paramètres par défaut s'ils n'existent pas
    settings = new this();
    await settings.save();
  }
  
  return settings;
};

// Méthode statique pour mettre à jour les paramètres
reminderSettingsSchema.statics.updateSettings = async function(updates, userId) {
  let settings = await this.getSettings();
  
  Object.assign(settings, updates);
  if (userId) {
    settings.updatedBy = userId;
  }
  
  await settings.save();
  return settings;
};

module.exports = mongoose.model('ReminderSettings', reminderSettingsSchema);
