const mongoose = require('mongoose');

const AffiliateSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true, 
    unique: true 
  },
  refCode: { 
    type: String, 
    required: true, 
    unique: true 
  },
  referrals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  referralLink: { type: String },
  commissionRate: { type: Number, default: 10 },
  balance: { type: Number, default: 0 },
  paid: { type: Number, default: 0 },
  meta: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Affiliate", AffiliateSchema);
