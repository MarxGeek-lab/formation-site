const mongoose = require('mongoose');

/**
 * Schéma pour les éléments multilingues
 */
const TranslatedElementSchema = new mongoose.Schema({
  fr: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  en: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  }
}, { _id: false });

/**
 * Schéma principal de la catégorie
 */
const CategorySchema = new mongoose.Schema({
  // Nom de la catégorie dans différentes langues
  name: {
    type: TranslatedElementSchema,
    required: true,
    unique: true
  },

  // Slug pour l'URL (généré automatiquement)
  slug: {
    fr: { 
      type: String, 
      unique: true,
      lowercase: true
    },
    en: { 
      type: String, 
      unique: true,
      lowercase: true
    }
  },

  // Description de la catégorie
  description: {
    fr: { 
      type: String,
      trim: true,
      maxlength: 500
    },
    en: { 
      type: String,
      trim: true,
      maxlength: 500
    }
  },

  // Éléments de la catégorie
  elements: [{
    type: TranslatedElementSchema,
  }],

  // Icône de la catégorie
  icon: {
    type: String,
    default: 'default-category'
  },

  // Ordre d'affichage
  order: {
    type: Number,
    default: 0
  },

  // Statut de la catégorie
  isActive: {
    type: Boolean,
    default: true
  },

  // Métadonnées SEO
  meta: {
    fr: {
      title: String,
      description: String,
      keywords: [String]
    },
    en: {
      title: String,
      description: String,
      keywords: [String]
    }
  },

  // Audit
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date
  }
});

/**
 * Middleware pre-save
 */
CategorySchema.pre('save', function(next) {
  // Mettre à jour updatedAt
  this.updatedAt = new Date();

  // Générer les slugs si nécessaire
  if (this.isModified('name.fr')) {
    this.slug.fr = this.generateSlug(this.name.fr);
  }
  if (this.isModified('name.en')) {
    this.slug.en = this.generateSlug(this.name.en);
  }

  next();
});


/**
 * Index pour optimiser les recherches
 */
CategorySchema.index({ 'slug.fr': 1, 'slug.en': 1 });
CategorySchema.index({ order: 1 });
CategorySchema.index({ isActive: 1 });
CategorySchema.index({ createdAt: -1 });


module.exports = mongoose.model('Category', CategorySchema);
