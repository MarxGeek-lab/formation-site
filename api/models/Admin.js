const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
  },
  name: { type: String },
  phoneNumber: { type: String },
  role: { 
    type: String, 
    enum: ['super_admin', 'admin', 'moderator'], 
    default: 'admin' 
  },
  permissions: [{
    type: String,
    enum: [
      "all", "dashboard","users","statistics","orders",
      "categories","settings","subscriptions","payments",
      "newsletter","reviews", "admin", "customers", "add_products",
      "view_products", "codePromo"
    ]
  }],
  isActive: { 
    type: Boolean, 
    default: true 
  },
  lastLogin: { 
    type: Date 
  },
  requestPasswordToken: {
    type: String
  },
  requestPasswordTokenExpiry: {
    type: Date
  },
  passwordToken: {
    type: String
  },
  passwordTokenExpiry: {
    type: Date
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
});

// Middleware pour mettre à jour la date de modification
AdminSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Admin', AdminSchema); 