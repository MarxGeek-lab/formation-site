const mongoose = require('mongoose');
const Category = require('../models/Categories');
require('dotenv').config();

// Catégories prédéfinies avec traductions
const predefinedCategories = [
  {
    name: "ebooks",
    nameEn: "E-books",
    nameFr: "Livres numériques"
  },
  {
    name: "subscriptions", 
    nameEn: "Subscriptions",
    nameFr: "Abonnements"
  },
  {
    name: "business",
    nameEn: "Business",
    nameFr: "Business"
  },
  {
    name: "graphicDesign",
    nameEn: "Graphic Design", 
    nameFr: "Design graphique"
  },
  {
    name: "entertainment",
    nameEn: "Entertainment",
    nameFr: "Divertissement"
  },
  {
    name: "training",
    nameEn: "Training",
    nameFr: "Formation"
  },
  {
    name: "ai",
    nameEn: "Artificial Intelligence",
    nameFr: "Intelligence artificielle"
  },
  {
    name: "videoEditing",
    nameEn: "Video Editing",
    nameFr: "Montage vidéo"
  },
  {
    name: "mysteries",
    nameEn: "Mysteries",
    nameFr: "Mystères"
  },
  {
    name: "premiumTools",
    nameEn: "Premium Tools",
    nameFr: "Outils premium"
  },
  {
    name: "spirituality",
    nameEn: "Spirituality",
    nameFr: "Spiritualité"
  },
  {
    name: "templates",
    nameEn: "Templates",
    nameFr: "Modèles"
  }
];

const seedCategories = async () => {
  try {
    // Connexion à la base de données
    await mongoose.connect(process.env.MONGODB_URL || "mongodb://azrexchange:azrexchange2024@198.7.125.60:27017/marketDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connexion à MongoDB réussie');

    // Supprimer toutes les catégories existantes (optionnel)
    await Category.deleteMany({});
    console.log('Catégories existantes supprimées');

    // Insérer les nouvelles catégories
    const insertedCategories = await Category.insertMany(predefinedCategories);
    
    console.log(`${insertedCategories.length} catégories ajoutées avec succès:`);
    insertedCategories.forEach(category => {
      console.log(`- ${category.name} (EN: ${category.nameEn}, FR: ${category.nameFr})`);
    });

  } catch (error) {
    console.error('Erreur lors de l\'insertion des catégories:', error);
  } finally {
    // Fermer la connexion
    await mongoose.connection.close();
    console.log('Connexion fermée');
  }
};

// Exécuter le script
if (require.main === module) {
  seedCategories();
}

module.exports = { seedCategories, predefinedCategories };
