const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  // Informations de base du produit
  category: { type: String, required: true, trim: true },
  subCategory: { type: String, trim: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  
  // Identification du produit
  productCode: { type: String, trim: true, unique: true, sparse: true }, // SKU
  brand: { type: String, trim: true },
  barcode: { type: String, trim: true },
  
  // Caractéristiques physiques
  color: [String], // Couleurs séparées par virgules
  size: [String],  // Tailles séparées par virgules
  material: { type: String, trim: true },
  weight: { type: Number }, // en kg
  dimensions: { type: String, trim: true }, // LxlxH en cm
  
  // Prix et gestion financière
  price: { type: Number, required: true, min: 0 },
  wholesalePrice: { type: Number, min: 0 },
  taxe: { type: Number, default: 0, min: 0, max: 100 }, // TVA en pourcentage
  
  // Gestion des stocks
  stock: {
    total: { type: Number, default: 1, min: 0 },
    available: { type: Number, default: 1, min: 0 },
    sold: { type: Number, default: 0, min: 0 }
  },
  minStock: { type: Number, default: 0, min: 0 }, // Alerte stock minimum
  
  // Statut et état du produit
  productStatus: { 
    type: String, 
    enum: ['active', 'inactive', 'draft'], 
    default: 'active' 
  },
  state: { 
    type: String, 
    enum: ['available', 'unavailable', 'out_of_stock'], 
    default: 'available' 
  },
  
  // Options avancées
  tags: { type: String, trim: true }, // Mots-clés séparés par virgules
  isFeatured: { type: Boolean, default: false },
  
  // Images du produit
  photos: [String],
  
  // Caractéristiques personnalisées
  characteristics: [{
    key: { type: String, trim: true },
    value: { type: String, trim: true }
  }],

  isPromotion: { type: Boolean, default: false },
  promotionRate: { type: Number, default: 0 },

  // Gestion administrative
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Gestion par les administrateurs
  managedBy: [{
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    action: String,
    date: { type: Date, default: Date.now }
  }],
  
  // Avis et évaluations
  reviews: [{
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    }
  }],
  
  // Métadonnées
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

ProductSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', ProductSchema);
