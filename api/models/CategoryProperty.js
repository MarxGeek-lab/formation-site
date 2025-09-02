const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    fr: { type: String },
    en: { type: String }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: false }
});

CategorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Property', CategorySchema);
