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
      // Récupération des fichiers
      const photos = req.files['images']?.map((file) => process.env.API_URL+file.filename) || [];
      const saleDocument = req.files['pdf']?.[0] ? process.env.API_URL+req.files['pdf'][0].filename : null;
      const demoVideo = req.files['videos']?.[0] ? process.env.API_URL+req.files['videos'][0].filename : null;
      console.log("Fichiers uploadés: ", { photos, saleDocument, demoVideo });

      const {
        name, description, category, productType,
        isSubscriptionBased, subscriptionId, assignedAdminId,
        price, wholesalePrice, productStatus,
        characteristics, advantage, withVisual,
      } = req.body;

      console.log('Données produit reçues:', req.body);

      // Validation des champs obligatoires
      if (!name || !category) {
        return res.status(400).json({
          success: false,
          message: 'Les champs nom et catégorie sont obligatoires'
        });
      }

      // Validation conditionnelle selon le type de tarification
      if (isSubscriptionBased === 'true' && !subscriptionId) {
        return res.status(400).json({
          success: false,
          message: 'Un abonnement doit être sélectionné pour la tarification par abonnement'
        });
      }

      if (isSubscriptionBased === 'false' && (!price || price <= 0)) {
        return res.status(400).json({
          success: false,
          message: 'Le prix est obligatoire pour la tarification fixe'
        });
      }

      // Créer un nouveau produit
      const newProduct = new Product({
        name,
        description,
        category,
        photos,
        
        // Nouveaux champs
        productType: productType || 'standard',
        isSubscriptionBased: isSubscriptionBased === 'true',
        ...(subscriptionId && { subscriptionId }),
        ...(assignedAdminId && { assignedAdminId }),
        
        // Fichiers
        ...(saleDocument && { saleDocument }),
        ...(demoVideo && { demoVideo }),
        
        // Prix conditionnel
        ...(isSubscriptionBased === 'false' && price && { price: parseFloat(price) }),
        
        // Caractéristiques personnalisées
        characteristics: characteristics ? JSON.parse(characteristics) : [],
        advantage: advantage ? JSON.parse(advantage) : [],
        ...(wholesalePrice && { pricePromo: wholesalePrice }),
        ...(price && { price }),
        ...(productStatus && { productStatus }),
        ...(withVisual && { isvisual: withVisual === 'true' }),
      });

      // Sauvegarder dans la base de données
      await newProduct.save();

      // Créer la catégorie s'il n'existe pas
        const categoryExist = await Category.findOne({ nameFr: category });
        if (!categoryExist) {
          const newCategory = new Category({
            nameFr: category,
            nameEn: category,
          });
          await newCategory.save();
        } 

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
      // Récupération des fichiers
      const photos = req.files['images']?.map((file) => process.env.API_URL+file.filename) || [];
      const pdf = req.files['pdf']?.[0] ? process.env.API_URL+req.files['pdf'][0].filename : null;
      const videos = req.files['videos']?.[0] ? process.env.API_URL+req.files['videos'][0].filename : null;
console.log(req.body)
      const {
        name, description, category, productType,
        isSubscriptionBased, subscriptionId, assignedAdminId,
        price, wholesalePrice, productStatus,
        characteristics, images2, videos2,
        pdf2, advantage, isvisual
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
      const existingPhotos = images2 ? JSON.parse(images2) : [];
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
      
      // Gestion des fichiers PDF et vidéos
      const finalPdf = pdf || pdf2 || product.pdf;
      const finalVideos = videos || videos2 || product.videos;

      // Mettre à jour les champs du produit
      product.name = name || product.name;
      product.description = description || product.description;
      product.category = category || product.category;
      product.photos = newPhotos;
      
      // Nouveaux champs
      if (productType !== undefined) product.productType = productType;
      if (isSubscriptionBased !== undefined) product.isSubscriptionBased = isSubscriptionBased === 'true';
      if (subscriptionId !== undefined) product.subscriptionId = subscriptionId;
      if (assignedAdminId !== undefined) product.assignedAdminId = assignedAdminId;
      
      // Fichiers
      if (finalPdf) product.saleDocument = finalPdf;
      if (finalVideos) product.demoVideo = finalVideos;
      
      // Prix et finance
      product.price = price ? Number(price) : product.price;
      product.pricePromo = wholesalePrice ? Number(wholesalePrice) : product.pricePromo;

      if (productStatus !== undefined) product.productStatus = productStatus;
      if (isvisual !== undefined) product.isvisual = isvisual === 'true';
      if (advantage) product.advantage = JSON.parse(advantage);
      // Caractéristiques personnalisées
      if (characteristics) {
        product.characteristics = JSON.parse(characteristics);
      }

      if (isSubscriptionBased === 'true') {
        product.price = null;
        product.pricePromo = null;
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
        productStatus: 'active'
      })
      .populate('subscriptionId')
      .populate('assignedAdminId')
      .sort({ createdAt: -1 });

      const productsWithSubcategories = await Promise.all(products.map(async (product) => {
        const category = await Category.findOne({ name: product.category });
        return {
          ...product.toObject(),
        };
      }));

      return res.status(200).json(productsWithSubcategories);
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
            .populate('subscriptionId')
            .populate('assignedAdminId')
        // .populate({
        //   path: 'reviews.review',
        //   populate: { path: 'user' }  
        // });

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
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Produit non trouvé'
        });
      }

      if (product.productStatus === 'active') {
        product.productStatus = 'inactive';
      } else {
        product.productStatus = 'active';
      }

      await product.save();

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
};

module.exports = productController;
