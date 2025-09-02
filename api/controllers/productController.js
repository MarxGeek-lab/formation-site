const { propertyKey, notificationsKey } = require("../constant");
const Product = require("../models/Product");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");
const excel = require("exceljs");
const path = require("path");
const fs = require("fs");
const Notifications = require("../models/Notifications");
const EmailService = require("../services/emailService");
const Admin = require("../models/Admin");
const { generateTemplateHtml } = require("../services/generateTemplateHtml");
const Category = require("../models/Categories");
const { getGreeting } = require("../utils/helpers");
// const { connectToRedis } = require("../config/redis_connection");

const productController = {
  // Fonction pour créer un nouveau produit
  createProduct: async (req, res) => {
    console.log(req.body)
    try {
      // Récupération des fichiers images
      const photos = req.files['images']?.map((file) => process.env.API_URL+file.filename) || [];
      console.log("Photos uploadées: ", photos)

      const {
        name, description, category, subCategory, owner,
        productCode, brand, barcode, color, size, material, weight, dimensions,
        price, wholesalePrice, taxe, stock, minStock, productStatus,
        tags, isFeatured, characteristics, isPromotion, promotionRate
      } = req.body;

      console.log('Données produit reçues:', req.body);

      // Validation des champs obligatoires
      if (!name || !category || !price || !owner) {
        return res.status(400).json({
          success: false,
          message: 'Les champs nom, catégorie, sous-catégorie, prix et propriétaire sont obligatoires'
        });
      }

      // Créer un nouveau produit
      const newProduct = new Product({
        name,
        description,
        category,
        subCategory,
        owner,
        photos,
        price: parseFloat(price),
        
        // Gestion du stock
        stock: {
          total: parseInt(stock) || 1,
          available: parseInt(stock) || 1,
          sold: 0
        },
        
        // Caractéristiques personnalisées
        characteristics: characteristics ? JSON.parse(characteristics) : [],
        
        // Champs optionnels avec validation
        ...(isPromotion !== undefined && { isPromotion: isPromotion === 'true' }),
        ...(promotionRate && { promotionRate: parseFloat(promotionRate) }),
        ...(productCode && { productCode }),
        ...(brand && { brand }),
        ...(barcode && { barcode }),
        ...(color && { color: JSON.parse(color) }),
        ...(size && { size: JSON.parse(size) }),
        ...(material && { material }),
        ...(weight && { weight: parseFloat(weight) }),
        ...(dimensions && { dimensions }),
        ...(wholesalePrice && { wholesalePrice: parseFloat(wholesalePrice) }),
        ...(taxe && { taxe: parseFloat(taxe) }),
        ...(minStock && { minStock: parseInt(minStock) }),
        ...(productStatus && { productStatus }),
        ...(tags && { tags }),
        ...(isFeatured !== undefined && { isFeatured: isFeatured === 'true' }),
      });

      // Sauvegarder dans la base de données
      await newProduct.save();

      // Créer la catégorie s'il n'existe pas
      const categoryExist = await Category.findOne({ name: category });
      if (!categoryExist) {
        const newCategory = new Category({
          name: category,
          subcategories: [subCategory]
        });
        await newCategory.save();
      } else {
        if (!categoryExist.subcategories.includes(subCategory)) {
          categoryExist.subcategories.push(subCategory);
          await categoryExist.save();
        }
      }

      // // Notifications par mail aux administrateurs
      // const admins = await Admin.find({ isActive: true });
      // const product = await Product.findById(newProduct._id).populate('owner');

      // const emailService = new EmailService();
      // emailService.setSubject(`Nouveau produit ajouté sur STORE`);
      // emailService.setFrom(process.env.EMAIL_HOST_USER, "STORE");
      // emailService.addTo(admins.map(admin => admin.email));
      // emailService.setHtml(generateTemplateHtml("templates/notificationMessage.html", {
      //   salutation: getGreeting(),
      //   message: `Un nouveau produit "${product.name}" a été ajouté par ${product?.owner?.name}.
      //   Veuillez vous rendre sur votre espace admin pour valider le nouveau produit.`,
      // }));

      // await emailService.send();

      // // Notifications
      // const notification = new Notifications({
      //   title: "Nouveau produit",
      //   content: `Un nouveau produit "${product.name}" a été ajouté par ${product?.owner?.name}`,
      //   user: null,
      //   type: 'admin',
      //   activity: 'product',
      //   data: JSON.stringify(product),
      //   read: false
      // });

      // await notification.save();

      return res.status(201).json({
        success: true,
        message: "Produit créé avec succès",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error", error });
    } 
  },

  // Fonction pour mettre à jour un produit
  updateProduct: async (req, res) => {
    try {
      // Récupération des fichiers images
      const photos = req.files['images']?.map((file) => process.env.API_URL+file.filename) || [];
console.log(req.body)
      const {
        name, description, category, subCategory, 
        productCode, brand, barcode, color, size, material, weight, dimensions,
        price, wholesalePrice, taxe, stock, minStock, productStatus,
        tags, isFragile, isFeatured, characteristics, photos2,
        isPromotion, promotionRate
      } = req.body;
  
      const productId = req.params.id;

      // Vérifier si le produit existe
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ 
          success: false,
          message: 'Produit non trouvé' 
        });
      }

      // Gestion des images supprimées
      const existingPhotos = photos2 ? JSON.parse(photos2) : [];
      const difference = product.photos.filter(item => !existingPhotos.includes(item));

      // Suppression des images obsolètes
      const uploadDir = path.join(__dirname, '..', 'uploads', 'images');
      for (const file of difference) {
        const fileName = file.replace(process.env.API_URL, '');
        const oldFile = path.join(uploadDir, fileName);
        if (fs.existsSync(oldFile)) {
          fs.unlinkSync(oldFile);
        }
      }

      // Combiner les anciennes et nouvelles images
      const newPhotos = [...existingPhotos, ...photos];

      // Mettre à jour les champs du produit
      product.name = name || product.name;
      product.description = description || product.description;
      product.category = category || product.category;
      product.subCategory = subCategory || product.subCategory;
      product.photos = newPhotos;
      
      // Champs d'identification
      if (productCode !== undefined) product.productCode = productCode;
      if (brand !== undefined) product.brand = brand;
      if (barcode !== undefined) product.barcode = barcode;
      
      // Caractéristiques physiques
      if (color.length > 0) product.color = JSON.parse(color);
      if (size.length > 0) product.size = JSON.parse(size);
      if (material !== undefined) product.material = material;
      if (weight !== undefined) product.weight = parseFloat(weight);
      if (dimensions !== undefined) product.dimensions = dimensions;
      
      // Prix et finance
      if (price !== undefined) product.price = parseFloat(price);
      if (wholesalePrice !== undefined) product.wholesalePrice = parseFloat(wholesalePrice);
      if (taxe !== undefined) product.taxe = parseFloat(taxe);
      
      // Gestion des stocks
      if (stock !== undefined) {
        const newStock = parseInt(stock);
        const difference = newStock - product.stock.total;
        product.stock.total = newStock;
        product.stock.available = Math.max(0, product.stock.available + difference);
      }
      if (minStock !== undefined) product.minStock = parseInt(minStock);
      if (productStatus !== undefined) product.productStatus = productStatus;
      
      // Options avancées
      if (tags !== undefined) product.tags = tags;
      if (isFeatured !== undefined) product.isFeatured = isFeatured === 'true';
      if (isPromotion !== undefined) product.isPromotion = isPromotion === 'true';
      if (promotionRate !== undefined) product.promotionRate = parseFloat(promotionRate);
      
      // Caractéristiques personnalisées
      if (characteristics) {
        product.characteristics = JSON.parse(characteristics);
      }

      // Sauvegarder les modifications
      await product.save();

      return res.status(200).json({ 
        success: true,
        message: 'Produit mis à jour avec succès', 
        product: product 
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error', error });
    }
  },

  // Fonction pour supprimer un produit
  deleteProduct: async (req, res) => {
    try {
      const productId = req.params.id;

      // Vérifier si le produit existe
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ 
          success: false,
          message: 'Produit non trouvé' 
        });
      }

      // Suppression des images
      const uploadDir = path.join(__dirname, '..', 'uploads', 'images');
      for (const file of product.photos) {
        const fileName = file.replace(process.env.API_URL, '');
        const oldFile = path.join(uploadDir, fileName);
        if (fs.existsSync(oldFile)) {
          fs.unlinkSync(oldFile);
        }
      }

      // Suppression du produit
      await product.deleteOne();

      return res.status(200).json({ 
        success: true,
        message: 'Produit supprimé avec succès' 
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ 
        success: false,
        message: 'Erreur serveur', 
        error: error.message 
      });
    }
  },

  // Fonction pour obtenir tous les produits
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find({ 
        isDeleted: false, 
        'stock.available': { $gt: 0 },
      })
        .populate('owner')
        .sort({ createdAt: -1 });

      const productsWithSubcategories = await Promise.all(products.map(async (product) => {
        const category = await Category.findOne({ name: product.category });
        return {
          ...product.toObject(),
          subcategories: category?.subcategories || []
        };
      }));

      const productsNoFeaturedPromotion = productsWithSubcategories.filter(product => !product.isFeatured && !product.isPromotion);

      const productsFeatured = productsWithSubcategories.filter(product => product.isFeatured);
      const productsPromotion = productsWithSubcategories.filter(product => product.isPromotion);

      return res.status(200).json({productsFeatured, productsPromotion, productsNoFeaturedPromotion});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ 
        success: false,
        message: 'Erreur serveur', 
        error: error.message 
      });
    }
  },

  // Fonction pour obtenir un produit par ID
  getProductById: async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId)
        .populate('owner')
        .populate({
          path: 'reviews.review',
          populate: { path: 'user' }  
        });

      if (!product) {
        return res.status(404).json({ 
          success: false,
          message: 'Produit non trouvé' 
        });
      }

      return res.status(200).json(product);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ 
        success: false,
        message: 'Erreur serveur', 
        error: error.message 
      });
    }
  },

  // Fonction pour obtenir les produits par pages
  getProductsByPage: async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Récupérer les paramètres de pagination

    try {
      const products = await Product.find({ isDeleted: false })
        .populate('owner', 'name email picture description _id')
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

      const totalProducts = await Product.countDocuments({ 
        isDeleted: false, 
        statusValidate: 'approved' 
      });

      return res.status(200).json({
        success: true,
        products: products,
        pagination: {
          totalPages: Math.ceil(totalProducts / limit),
          currentPage: Number(page),
          totalItems: totalProducts
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ 
        success: false,
        message: 'Erreur serveur', 
        error: error.message 
      });
    }
  },


  // Fonction de filtrage de produits
  getProductByFilter: async (req, res) => {
    const { category, subCategory, priceLimit, brand, color, size, tags, productStatus } = req.body;

    try {
      // Créer un objet de filtre dynamique
      const filter = { 
        isDeleted: false,
        statusValidate: 'approved'
      };

      // Filtrer par catégorie
      if (category) filter.category = category;
      if (subCategory) filter.subCategory = subCategory;

      // Filtrer par marque
      if (brand) filter.brand = { $regex: brand, $options: 'i' };

      // Filtrer par couleur
      if (color) filter.color = { $regex: color, $options: 'i' };

      // Filtrer par taille
      if (size) filter.size = { $regex: size, $options: 'i' };

      // Filtrer par tags
      if (tags) filter.tags = { $regex: tags, $options: 'i' };

      // Filtrer par statut du produit
      if (productStatus) filter.productStatus = productStatus;

      // Filtrer par limite de prix
      if (priceLimit) {
        const [min, max] = priceLimit.trim().split("-").map(Number);
        if (!Number.isNaN(min) && !Number.isNaN(max)) {
          filter.price = { $gte: min, $lte: max };
        }
      }

      // S'assurer que le stock est disponible
      filter['stock.available'] = { $gt: 0 };

      const products = await Product.find(filter)
        .populate('owner')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        products: products
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ 
        success: false,
        message: `Erreur lors du filtrage des produits`,
        error: error.message
      });
    }
  },

  // Récupérer les produits en fonction de la catégorie
  getProductsByCategory: async (req, res) => {
    const { category } = req.query;

    try {
      // Vérifiez que la catégorie est valide avant de procéder
      if (!category) {
        return res.status(400).json({ 
          success: false,
          message: "Veuillez fournir une catégorie." 
        });
      }

      // Rechercher les produits en fonction de la catégorie
      const products = await Product.find({ 
        category: category, 
        isDeleted: false, 
        statusValidate: "approved",
        'stock.available': { $gt: 0 }
      })
        .populate('owner', 'name email')
        .sort({ createdAt: -1 });

      // Vérifiez si des produits ont été trouvés
      if (products.length === 0) {
        return res.status(404).json({ 
          success: false,
          message: "Aucun produit trouvé pour cette catégorie." 
        });
      }

      return res.status(200).json({
        success: true,
        products: products
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des produits par catégorie:", error);
      return res.status(500).json({ 
        success: false,
        message: `Erreur lors de la récupération des produits par catégorie`,
        error: error.message
      });
    }
  },

  // Obtenir les produits d'un utilisateur
  getProductsByUser: async (req, res) => {
    try {
      const products = await Product.find({
        owner: req.params.userId,
        isDeleted: false
      }).populate('owner')
      .sort({createdAt: -1});

      res.status(200).json(products);
    } catch (error) {
      console.log(error)
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des produits de l\'utilisateur',
        error: error.message
      });
    }
  },

  // Télécharger les produits par utilisateur
  downloadProductsByUser: async (req, res) => {
    console.log(req.params)
    try {
      const products = await Product.find({
        owner: req.params.id,
        isDeleted: false
      });

      const workbook = new excel.Workbook();
      const worksheet = workbook.addWorksheet('Liste des produits');

      worksheet.columns = [
        { header: "N°", key: "num", width: 10 },
        { header: "Catégorie", key: "category", width: 20 },
        { header: "Sous-catégorie", key: "subCategory", width: 20 },
        { header: "Nom", key: "name", width: 25 },
        { header: "Description", key: "description", width: 30 },
        { header: "Prix", key: "price", width: 15 },
        { header: "Marque", key: "brand", width: 15 },
        { header: "Code produit", key: "productCode", width: 15 },
        { header: "Stock total", key: "stockTotal", width: 15 },
        { header: "Stock disponible", key: "stockAvailable", width: 15 },
        { header: "Statut", key: "productStatus", width: 15 },
        { header: "État", key: "state", width: 15 },
        { header: "Créé le", key: "createdAt", width: 20 },
        { header: "Validé le", key: "validatedAt", width: 20 },
      ];

      for (const [index, product] of products.entries()) {
        worksheet.addRow({
            num: index + 1,
            category: product.category,
            subCategory: product.subCategory,
            name: product.name,
            description: product.description,
            price: product.price,
            brand: product.brand,
            productCode: product.productCode,
            stockTotal: product.stock?.total || 0,
            stockAvailable: product.stock?.available || 0,
            productStatus: product.productStatus,
            state: product.state,
            createdAt: product.createdAt?.toLocaleDateString(),
            validatedAt: product.validatedAt ? product.validatedAt.toLocaleDateString() : "Non validé",
        });
      }

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=produits.xlsx');

      await workbook.xlsx.write(res);
      return res.end();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des produits de l\'utilisateur',
        error: error.message
      });
    }
  },

  // Mettre à jour le statut d'un produit
  updateProductStatus: async (req, res) => {
    try {
      const { productStatus } = req.body;
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { productStatus },
        { new: true }
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Produit non trouvé'
        });
      }

      res.status(200).json({
        success: true,
        product: product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du statut',
        error: error.message
      });
    }
  },

  // Gestion des favoris
  addToFavorites: async (req, res) => {
    const { productId, userId } = req.body;
    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: 'Utilisateur non trouvé' 
        });
      }

      if (!user.favorites.includes(productId)) {
        user.favorites.push(productId);
      } else {
        const newTab = user.favorites.filter((item) => String(item) !== productId );
        user.favorites = newTab;
      }

      await user.save();

      res.status(200).json({
        success: true,
        message: 'Produit ajouté aux favoris'
      });
    } catch (error) {
      console.log(error)
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'ajout aux favoris',
        error: error.message
      });
    }
  },

  getUserFavorites: async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
        .populate({
          path: 'favorites',
          populate: {
            path: 'owner',
            select: 'name email phoneNumber picture'
          }
        });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      res.status(200).json(user.favorites);
    } catch (error) {
      console.log(error)
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des favoris',
        error: error.message
      });
    }
  },

  searchProduct: async (req, res) => {
    const { search } = req.params;
console.log(req.params)
    try {
      const products = await Product.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { subCategory: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
        ]
      })
        .populate('owner')
        .sort({ createdAt: -1 });

      return res.status(200).json(products);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ 
        success: false,
        message: 'Erreur serveur', 
        error: error.message 
      });
    }
  },
};

module.exports = productController;
