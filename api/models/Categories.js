const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  nameEn: {
    type: String,
    required: true,
  },
  nameFr: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalProduct: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

categorySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;