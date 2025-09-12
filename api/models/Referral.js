const mongoose = require('mongoose');

const ReferralSchema = new mongoose.Schema({
  affiliate: { type: mongoose.Schema.Types.ObjectId, ref: "Affiliate", required: true },
  refCode: { type: String, required: true },
  type: { type: String, enum: ["signup", "order"], default: "order", required: true },
  orderId: { type: String },
  amount: { type: Number },
  commissionAmount: { type: Number },
  status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Referral", ReferralSchema);
