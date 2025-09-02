const Category = require("../models/Categories");
const Product = require("../models/Product");
const path = require('path');
const fs = require('fs');

// Créer une nouvelle catégorie
exports.createCategory = async (req, res) => {
  try {
    console.log(req.body)
    const image = req.file?.filename || '';

    // Vérifier si la catégorie existe déjà par son nom
    const existingCategory = await Category.findOne({ name: req.body.name });

    if (existingCategory) {
      return res.status(400).json({
        status: 'fail',
        message: 'Une catégorie avec ce nom existe déjà.',
      });
    }

    const newCategory = await Category.create({ ...req.body, image });
    await newCategory.save();

    res.status(201).json({
      status: 'success',
      data: {
        category: newCategory,
      },
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Lire toutes les catégories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getAllCategoriesByAdmin = async (req, res) => {
  try {
    const categories = await Category.find();

    const categoriesWithProductCount = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({ category: category.name });
        return {
          _id: category._id,
          name: category.name,
          image: category.image || 'default_category.png',
          date: category.createdAt,
          propertyCount: productCount || 0,
          isActive: category.isActive || false,
          subcategories: category.subcategories || [],
          updatedAt: category.updatedAt,
          createdAt: category.createdAt
        };
      })
    );

    categoriesWithProductCount.sort((a, b) => b.date - a.date);

    res.status(200).json(categoriesWithProductCount);
  } catch (err) {
    console.log(err)
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Lire une catégorie par ID
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        category,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Mettre à jour une catégorie par ID
exports.updateCategory = async (req, res) => {
  try {
    const image = req.file?.filename || '';

    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json();

    category.name = req.body.name;
    if (image) {
      // Suppression des images
      const uploadDir = path.join(__dirname, '..', 'uploads', 'pictures');
      if (category.image) {
         const oldFile = path.join(uploadDir, category.image);
         if (fs.existsSync(oldFile)) {
            try {
                fs.unlinkSync(oldFile);
            } catch (error) {
                console.error('Erreur lors de la suppression du fichier :', error);
            }
         }
      }
      category.image = image;
    }
    category.isActive = req.body.isActive || category.isActive;
    const subcategories = req.body.subcategories ? JSON.parse(req.body.subcategories) : [];
    category.subcategories = subcategories;
    await category.save();

    res.status(200).json({
      status: 'success',
      data: {
        category,
      },
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Supprimer une catégorie par ID
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    console.log(err)
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.updateStatusCategory = async (req, res) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        status: 'fail',
        message: 'isActive doit être un booléen.',
      });
    }

    const category = await Category.findById(req.params.id);
    category.isActive = isActive;
    await category.save();

    res.status(200).json({ // Changed 204 to 200
      status: 'success',
      data: {
        message: 'Statut de la catégorie mis à jour avec succès.',
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};