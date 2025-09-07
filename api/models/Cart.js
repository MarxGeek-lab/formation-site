const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  image: {
    type: String
  },
  category: {
    type: String
  },
  options: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

const cartSchema = new mongoose.Schema({
  // Identifiants
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  email: {
    type: String,
    default: null,
    validate: {
      validator: function(email) {
        if (!email) return true; // Email optionnel
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: 'Format email invalide'
    }
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  
  // Contenu du panier
  items: [cartItemSchema],
  
  // Calculs
  totalItems: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  
  // Statut du panier
  status: {
    type: String,
    enum: ['active', 'abandoned', 'converted'],
    default: 'active'
  },
  
  // Configuration de relance
  reminderConfig: {
    type: { type: String, enum: ['email', 'sms', 'notification'] },
    delay: { type: Number }, // en heures
    message: { type: String },
    scheduledDate: { type: Date },
    sent: { type: Boolean, default: false },
    sentAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
  },

  // Métadonnées
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastActivity: { type: Date, default: Date.now },
  convertedAt: {
    type: Date,
    default: null
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null
  },
  
  // Données pour relance
  abandonedEmailSent: {
    type: Boolean,
    default: false
  },
  abandonedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index pour optimiser les requêtes
cartSchema.index({ userId: 1 });
cartSchema.index({ email: 1 });
cartSchema.index({ sessionId: 1 });
cartSchema.index({ status: 1 });
cartSchema.index({ lastActivity: 1 });
cartSchema.index({ createdAt: 1 });

// Middleware pour calculer les totaux avant sauvegarde
cartSchema.pre('save', function(next) {
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  this.totalPrice = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  this.updatedAt = new Date();
  this.lastActivity = new Date();
  next();
});

// Méthodes d'instance
cartSchema.methods.addItem = function(productData) {
  const existingItem = this.items.find(item => 
    item.productId.toString() === productData.productId.toString()
  );
  
  if (existingItem) {
    existingItem.quantity += productData.quantity || 1;
  } else {
    this.items.push({
      productId: productData.productId,
      name: productData.name,
      price: productData.price,
      quantity: productData.quantity || 1,
      image: productData.image,
      category: productData.category,
      options: productData.options || {}
    });
  }
  
  return this.save();
};

cartSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(item => 
    item.productId.toString() !== productId.toString()
  );
  return this.save();
};

cartSchema.methods.updateItemQuantity = function(productId, quantity) {
  const item = this.items.find(item => 
    item.productId.toString() === productId.toString()
  );
  
  if (item) {
    if (quantity <= 0) {
      return this.removeItem(productId);
    }
    item.quantity = quantity;
    return this.save();
  }
  
  throw new Error('Produit non trouvé dans le panier');
};

cartSchema.methods.clear = function() {
  this.items = [];
  return this.save();
};

cartSchema.methods.markAsConverted = function(orderId) {
  this.status = 'converted';
  this.convertedAt = new Date();
  this.orderId = orderId;
  return this.save();
};

cartSchema.methods.markAsAbandoned = function() {
  this.status = 'abandoned';
  this.abandonedAt = new Date();
  return this.save();
};

// Méthodes statiques
cartSchema.statics.findByUserOrSession = function(userId, sessionId) {
  if (userId) {
    // Si userId fourni, chercher d'abord par userId, puis par sessionId
    return this.findOne({
      $or: [
        { userId },
        { sessionId, userId: null }
      ]
    });
  } else {
    // Si pas d'userId, chercher seulement par sessionId
    return this.findOne({ sessionId });
  }
};

cartSchema.statics.findAbandonedCarts = function(hoursAgo = 12) {
  const cutoffTime = new Date(Date.now() - (hoursAgo * 60 * 60 * 1000));
  return this.find({
    status: 'active',
    lastActivity: { $lt: cutoffTime },
    $or: [
      { items: { $exists: true, $not: { $size: 0 } } },
      { totalItems: { $gt: 0 } }
    ]
  });
};

cartSchema.statics.findCartsForEmailReminder = function() {
  return this.find({
    status: 'abandoned',
    email: { $exists: true, $ne: null },
    abandonedEmailSent: false,
    totalItems: { $gt: 0 }
  });
};

module.exports = mongoose.model('Cart', cartSchema);
