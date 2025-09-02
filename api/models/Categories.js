const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  subcategories: [String],
  image: {
    type: String,
    default: 'categories.png'
  },
  isActive: {
    type: Boolean,
    default: false
  },
  totalProduct: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

categorySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;