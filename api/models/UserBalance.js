const mongoose = require('mongoose');

const UserBalanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  currentBalance: {
    type: Number,
    default: 0
  },
  pendingBalance: {
    type: Number,
    default: 0
  },
  totalEarned: {
    type: Number,
    default: 0
  },
  totalWithdrawn: {
    type: Number,
    default: 0
  },
  lastWithdrawal: {
    amount: Number,
    date: Date
  },
  transactionHistory: [{
    type: {
      type: String,
      enum: ['commission', 'withdrawal', 'refund', 'adjustment'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    relatedTransaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction'
    },
    description: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  withdrawalRequests: [{
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: 'pending'
    },
    bankDetails: {
      bankName: String,
      accountHolder: String,
      iban: String,
      bic: String
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    processedAt: Date,
    requestedAt: {
      type: Date,
      default: Date.now
    }
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware pour mettre à jour la date
UserBalanceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('UserBalance', UserBalanceSchema);