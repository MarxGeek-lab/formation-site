const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: true
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'CANCELLED', 'EXPIRED', 'PENDING'],
    default: 'PENDING'
  },
  startDate: Date,
  endDate: Date,
  nextBillingDate: Date,
  cancelledAt: Date,
  paymentHistory: [{
    amount: Number,
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED', 'PENDING']
    },
    transactionId: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Subscription', SubscriptionSchema); 