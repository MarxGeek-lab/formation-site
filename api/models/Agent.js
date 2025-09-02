const mongoose = require('mongoose');

const Agent = new mongoose.Schema({
  region: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  managedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
});

module.exports = mongoose.model('RealEstateAgent', Agent);
