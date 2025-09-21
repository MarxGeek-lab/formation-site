const Category = require("../models/Categories");
const Product = require("../models/Product");

// Créer une nouvelle catégorie
exports.createCategory = async (req, res) => {
  try {
    console.log(req.body)
    const { nameEn, nameFr, isActive } = req.body;

    // Vérifier si la catégorie existe déjà par son nom
    const existingCategory = await Category.findOne({ nameEn });

    if (existingCategory) {
      return res.status(400).json({
        status: 'fail',
        message: 'Une catégorie avec ce nom existe déjà.',
      });
    }

    const newCategory = await Category.create({
      nameEn,
      nameFr,
      isActive: isActive !== undefined ? isActive : true
    });

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
          nameEn: category.nameEn,
          nameFr: category.nameFr,
          date: category.createdAt,
          productCount: productCount || 0,
          totalProduct: category.totalProduct || productCount || 0,
          isActive: category.isActive || false,
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
    const { nameEn, nameFr, isActive } = req.body;
    console.log(req.body)
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        status: 'fail',
        message: 'Catégorie non trouvée'
      });
    }

    // Mettre à jour les champs
    category.nameEn = nameEn || category.nameEn;
    category.nameFr = nameFr || category.nameFr;
    category.isActive = isActive || category.isActive;
    
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
    console.log(req.params.id)
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