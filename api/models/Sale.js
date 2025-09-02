const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  property: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  payment: {
    type: Schema.Types.ObjectId,
    ref: 'Transaction',
    default: null,
  },
  status: {
    type: String,
    enum: ['cancelled', 'completed', 'progress', 'pending'],
    default: 'pending',
  },
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
saleSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;
