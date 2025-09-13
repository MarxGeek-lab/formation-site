const mongoose = require("mongoose");

const PayoutSchema = new mongoose.Schema({
  affiliate: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Affiliate", 
    required: true 
  },
  amount: { type: Number, required: true },
  method: { type: String, required: true },
  country: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["requested", "approved", "paid", "rejected"], 
    default: "requested" 
  },
  requestedAt: { type: Date, default: Date.now },
  processedAt: { type: Date },
  meta: { type: mongoose.Schema.Types.Mixed },
});

module.exports = mongoose.model("Payout", PayoutSchema);
