const mongoose = require('mongoose');

// This model represents subscription products/plans that can be offered
const SubscriptionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  priceEUR: {
    type: Number,
    min: 0
  },
  period: {
    type: String,
    default: '/mois'
  },
  popular: {
    type: Boolean,
    default: false
  },
  features: [{
    type: String,
    trim: true
  }],
  duration: {
    type: Number,
    min: 0,
    comment: 'Duration in days'
  },
  products: [{
    type: String,
    trim: true,
    comment: 'List of included products/formations'
  }],
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  maxFormations: {
    type: Number,
  },
  relatedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false
  }],
  isPublished: {
    type: Boolean,
    default: true
  },
  admin: {
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

// Update the updatedAt field before saving
SubscriptionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Subscription', SubscriptionSchema); 