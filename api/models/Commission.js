const mongoose = require('mongoose');

const CommissionSchema = new mongoose.Schema({
  affiliate: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Affiliate", 
    required: true 
  },
  referral: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Referral", 
    required: true 
  },
  amount: { type: Number, required: true },
  paid: { type: Boolean, default: false },
  paidAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Commission", CommissionSchema);
