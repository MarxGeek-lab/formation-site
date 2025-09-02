const mongoose = require('mongoose');

const VisitRequestSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property', // Référence au modèle de la propriété
    required: true
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Référence au modèle de l'utilisateur qui fait la demande
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Référence au modèle de l'utilisateur qui fait la demande
    required: true
  },
  type: {
    type: String,
    enum: ['sale', 'longtime'], // Demande de visite pour vente ou location longue durée
    required: true
  },
  preferredDates: [
    {
      date: { type: Date, required: true },
      timeSlot: { type: String, enum: ['morning', 'afternoon', 'evening'], required: true }
    }
  ],
  userInfo: { type: String },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  message: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const VisitRequest = mongoose.model('VisitRequest', VisitRequestSchema);

module.exports = VisitRequest;
