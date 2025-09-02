const mongoose = require('mongoose');

const annonceSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: false,
  },
  image: {
    type: String, // URL de l'image du flyer
    required: true,
  },
  typeUser: {
    type: [String], // Un tableau de chaînes de caractères
    enum: ['user', 'owner', 'agent'],
    required: true,
  },
  statut: {
    type: String,
    enum: ['published', 'unPublished'],
    default: 'unPublished',
  },
  publishedAt: {
      type: Date,
      default: Date.now,
  },
  createdAt: {
      type: Date,
      default: Date.now,
  },
});

const Annonce = mongoose.model('Annonce', annonceSchema);

module.exports = Annonce;