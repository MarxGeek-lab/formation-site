const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String },
  phoneNumber: { type: String, trim: true },
  phoneCode: { type: String, trim: true },
  gender: { type: String, trim: true },
  picture: { type: String, trim: true },
  pictureBack: { type: String, trim: true },
  country: { type: String, trim: true },
  city: { type: String, trim: true },
  address: { type: String, trim: true },
  district: { type: String, trim: true },
  facebookId: { type: String, trim: true },
  googleId: { type: String, trim: true },
  authToken: { type: String },
  account: { type: String },
  expiresIn: { type: Date },
  otp: { type: Number },
  addressShipping: [{
    type: {
      type: String,
      enum: ['home', 'work'], // si tu veux limiter les valeurs
      default: 'home'
    },
    apartment: { type: String, trim: true },
    city: { type: String, trim: true },
    district: { type: String, trim: true },
    country: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    fullName: { type: String, trim: true },
    isDefault: { type: Boolean, default: false },
  }],
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
    },
    language: { type: String, default: 'fr' },
  },
  subscribeNewsletter: { type: Boolean, default: false },
  acceptTerms: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  loginCount: { type: Number, default: 0 },
  lastLogin: { type: Date },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

module.exports = mongoose.model('User', userSchema);
