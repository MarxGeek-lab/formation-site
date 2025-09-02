const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  property: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  tenant: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    default: null,
  },
  deposit: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  payment: {
    type: Schema.Types.ObjectId,
    ref: 'Transaction',
    default: null,
  },
  status: {
    type: String,
    enum: ['cancelled', 'completed', 'pending', 'progress'],
    default: 'pending',
  },
  type: {
    type: String,
    default: 'rental'
  },
  ticketName: {
    type: String,
  },
  optionPay: {
    type: String,
    enum: ['full', 'partial'],
    default: 'full'
  },
  agreeTerms: { type: Boolean, default: false },
  cancelledAt: { type: Date },
  userInfo: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Met à jour automatiquement "updatedAt" avant chaque sauvegarde
rentalSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Rental = mongoose.model('Rental', rentalSchema);

module.exports = Rental;
