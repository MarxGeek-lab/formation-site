const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  // Informations de base du produit
  category: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  nameEn: { type: String, trim: true },
  description: { type: String, trim: true },
  descriptionEn: { type: String, trim: true },
  
  // Type de produit
  productType: { 
    type: String, 
    enum: ['standard', 'mystere'], 
    default: 'standard',
    required: true 
  },
  

  // Prix et gestion financière
  isSubscriptionBased: { type: Boolean, default: false },
  subscriptionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Subscription',
    required: function() { return this.isSubscriptionBased; }
  },
  price: { 
    type: Number, 
    min: 0,
  },

  pricePromo: { 
    type: Number, 
    min: 0,
  },

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
  // Images du produit
  photos: [String],
  
  // Documents et médias
  saleDocument: [String], // PDF de vente
  demoVideo: { type: String }, // Vidéo de démonstration
  
  // Caractéristiques personnalisées
  characteristics: [{
    key: { type: String, trim: true },
    value: { type: String, trim: true }
  }],


  // Gestion administrative
  assignedAdminId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Admin' // Référence vers un utilisateur admin
  },

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

  // Visuel
  isvisual: { type: Boolean, default: true },
  visualPrice: { type: Number, default: 2500 },

  // Avantages
  advantage: [{
    type: String,
    trim: true
  }],
  advantageEn: [{
    type: String,
    trim: true
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
