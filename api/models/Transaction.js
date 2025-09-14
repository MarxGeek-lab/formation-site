const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  totalAmountConvert: {
    type: Number,
  },
  currency: {
    type: String,
    required: true
  },
  paymentNumber: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'refunded'],
    default: 'pending'
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: false
  },
  paymentMethod: {
    type: String,
    default: 'Monero'
  },
  type: {
    type: String,
    enum: ['payment', 'refund'],
    default: 'payment'
  },
  reference: {
    type: String,
    required: false
  },
  description: {
    type: String,
    default: 'Paiement'
  },
  completedAt: Date,
  updatedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema); 