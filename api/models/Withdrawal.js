const mongoose = require('mongoose');

const WithdrawalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assurez-vous que ce modèle existe
    required: true
  },
  typeUser: {
    type: String,
    enum: ['owner', 'tenant'],
    default: 'owner'
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  numberWithdraw: {
    type: String,
    require: true
  },
  method: {
    type: String,
    require: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'paid'],
    default: 'pending'
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  processedAt: {
    type: Date
  },
  paymentDetails: {
    reference: { type: String },
    status: { type: String },
    date: Date
  },
  reason: {
    type: String // utile en cas de rejet
  },
  validatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  }
}, {
  timestamps: true // ajoute createdAt et updatedAt automatiquement
});

const Withdrawal = mongoose.model('Withdrawal', WithdrawalSchema);

module.exports = Withdrawal;