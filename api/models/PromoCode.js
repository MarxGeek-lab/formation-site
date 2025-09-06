// models/PromoCode.js
const mongoose = require("mongoose");

const promoCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true, // pour uniformiser
    trim: true
  },
  discountType: {
    type: String,
    enum: ["percentage", "fixed"],
    required: true
  },
  discountValue: {
    type: Number,
    required: true
  },
  minPurchase: {
    type: Number,
    default: 0
  },
  maxUsage: {
    type: Number,
    default: 1 // nombre d’utilisations max
  },
  usedCount: {
    type: Number,
    default: 0
  },
  expiresAt: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model("PromoCode", promoCodeSchema);
