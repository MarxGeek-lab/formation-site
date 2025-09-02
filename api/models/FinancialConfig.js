const mongoose = require('mongoose');

const FinancialConfigSchema = new mongoose.Schema({
  commissionRates: [{
    type: {
      type: String,
      enum: ['sale', 'rental'],
      required: true
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    isActive: {
      type: Boolean,
      default: true
    },
    effectiveDate: {
      type: Date,
      default: Date.now
    }
  }],
  minimumWithdrawalAmount: {
    type: Number,
    required: true,
    default: 100
  },
  paymentMethods: [{
    name: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    fees: {
      type: Number,
      default: 0
    }
  }],
  currency: {
    type: String,
    default: 'EUR'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FinancialConfig', FinancialConfigSchema);