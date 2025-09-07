const Cart = require('../models/Cart');
const { v4: uuidv4 } = require('uuid');

class CartController {
  // Récupérer le panier d'un utilisateur
  static async getCart(req, res) {
    try {
      const userId = req.user?.user?._id || null;
      const { cartId, sessionId } = req.query;
      
      let cart;
      
      if (cartId) {
        // Recherche par ID de panier spécifique
        cart = await Cart.findById(cartId);
      } else if (userId) {
        // Utilisateur connecté
        cart = await Cart.findByUserOrSession(userId, null);
      } else if (sessionId) {
        // Utilisateur non connecté avec sessionId
        cart = await Cart.findByUserOrSession(null, sessionId);
      }
      
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: 'Panier non trouvé'
        });
      }
      
      res.json({
        success: true,
        data: cart
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du panier:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }
  
  // Créer un nouveau panier ou récupérer existant
  static async createOrGetCart(req, res) {
    try {
      console.log(req.user);
      const userId = req.user?.user?._id || null;
      const { sessionId, email } = req.body;
      
      if (!sessionId) {
        return res.status(400).json({
          success: false,
          message: 'sessionId requis'
        });
      }
      
      // Chercher un panier existant
      let cart = await Cart.findByUserOrSession(userId, sessionId);
      
      if (!cart) {
        // Créer un nouveau panier
        cart = new Cart({
          userId: userId || null,
          email: email || null,
          sessionId: sessionId || uuidv4(),
          status: 'active'
        });
        await cart.save();
      } else if (email && !cart.email) {
        // Mettre à jour l'email si fourni
        cart.email = email;
        await cart.save();
      }
      
      res.status(201).json({
        success: true,
        data: cart
      });
    } catch (error) {
      console.error('Erreur lors de la création du panier:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }
  
  // Ajouter un produit au panier
  static async addItem(req, res) {
    try {
      console.log(req.body)
      const userId = req.user?.user?._id || null;
      const { sessionId, productId, name, price, quantity = 1, image, category, options, email } = req.body;
      
      if (!sessionId || !productId || !name || !price) {
        return res.status(400).json({
          success: false,
          message: 'sessionId, productId, name et price sont requis'
        });
      }
      
      // Chercher ou créer le panier
      let cart = await Cart.findByUserOrSession(userId, sessionId);
      console.log('userId:', userId, 'sessionId:', sessionId, 'cart found:', !!cart);
      
      if (!cart) {
        // Vérifier s'il existe déjà un panier avec ce sessionId (cas de race condition)
        const existingCart = await Cart.findOne({ sessionId });
        if (existingCart) {
          cart = existingCart;
          if (userId && !cart.userId) {
            cart.userId = userId;
            await cart.save();
          }
        } else {
          cart = new Cart({
            userId: userId || null,
            email: email || null,
            sessionId,
            status: 'active'
          });
          await cart.save();
        }
      } else if (userId && !cart.userId) {
        // Si l'utilisateur s'est connecté après avoir créé le panier, associer le userId
        cart.userId = userId;
        await cart.save();
      }
      
      // Ajouter le produit
      await cart.addItem({
        productId,
        name,
        price,
        quantity,
        image,
        category,
        options,
        userId: userId || null,
      });
      
      res.json({
        success: true,
        message: 'Produit ajouté au panier',
        data: cart
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }
  
  // Supprimer un produit du panier
  static async removeItem(req, res) {
    try {
      console.log(req.params)
      console.log(req.user)
      const userId = req.user?.user?._id || null;
      const { sessionId } = req.query;
      const { productId } = req.params;
      
      if (!sessionId || !productId) {
        return res.status(400).json({
          success: false,
          message: 'sessionId et productId sont requis'
        });
      }
      
      const cart = await Cart.findByUserOrSession(userId, sessionId);
      
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: 'Panier non trouvé'
        });
      }
      
      await cart.removeItem(productId);
      
      res.json({
        success: true,
        message: 'Produit supprimé du panier',
        data: cart
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }
  
  // Mettre à jour la quantité d'un produit
  static async updateItemQuantity(req, res) {
    try {
      console.log(req.body)
      console.log(req.user)
      console.log(req.params)
      const userId = req.user?.user?._id || null;
      const { sessionId, quantity } = req.body;
      const { productId } = req.params;
      
      if (!sessionId || !productId || quantity === undefined) {
        return res.status(400).json({
          success: false,
          message: 'sessionId, productId et quantity sont requis'
        });
      }
      
      const cart = await Cart.findByUserOrSession(userId, sessionId);
      
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: 'Panier non trouvé'
        });
      }
      
      await cart.updateItemQuantity(productId, quantity,userId);
      
      res.json({
        success: true,
        message: 'Quantité mise à jour',
        data: cart
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }
  
  // Vider le panier
  static async clearCart(req, res) {
    try {
      const userId = req.user?.user?._id || null;
      const { sessionId } = req.body;
      
      if (!sessionId) {
        return res.status(400).json({
          success: false,
          message: 'sessionId requis'
        });
      }
      
      const cart = await Cart.findByUserOrSession(userId, sessionId);
      
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: 'Panier non trouvé'
        });
      }
      
      await cart.clear();
      
      res.json({
        success: true,
        message: 'Panier vidé',
        data: cart
      });
    } catch (error) {
      console.error('Erreur lors du vidage:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }
  
  // Marquer le panier comme converti (commande validée)
  static async convertCart(req, res) {
    try {
     
      const userId = req.user?.user?._id || null;
      const { sessionId, orderId, email } = req.body;
      
      if (!sessionId) {
        return res.status(400).json({
          success: false,
          message: 'sessionId requis'
        });
      }
      
      const cart = await Cart.findByUserOrSession(userId, sessionId);
      
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: 'Panier non trouvé'
        });
      }
      
      // Mettre à jour l'email si fourni
      if (email && !cart.email) {
        cart.email = email;
      }
      
      await cart.markAsConverted(orderId);
      
      res.json({
        success: true,
        message: 'Panier marqué comme converti',
        data: cart
      });
    } catch (error) {
      console.error('Erreur lors de la conversion:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }
  
  // Associer un panier à un utilisateur (lors de la connexion)
  static async associateWithUser(req, res) {
    try {
      const userId = req.user?.user?._id || null;
      const { sessionId } = req.body;
      
      if (!userId || !sessionId) {
        return res.status(400).json({
          success: false,
          message: 'userId et sessionId sont requis'
        });
      }
      
      // Chercher le panier de session
      const sessionCart = await Cart.findOne({ sessionId, userId: null });
      
      if (!sessionCart) {
        return res.status(404).json({
          success: false,
          message: 'Panier de session non trouvé'
        });
      }
      
      // Chercher un panier existant pour cet utilisateur
      const userCart = await Cart.findOne({ userId, status: 'active' });
      
      if (userCart) {
        // Fusionner les paniers
        for (const item of sessionCart.items) {
          await userCart.addItem(item);
        }
        
        // Supprimer le panier de session
        await Cart.findByIdAndDelete(sessionCart._id);
        
        res.json({
          success: true,
          message: 'Paniers fusionnés',
          data: userCart
        });
      } else {
        // Associer le panier de session à l'utilisateur
        sessionCart.userId = userId;
        await sessionCart.save();
        
        res.json({
          success: true,
          message: 'Panier associé à l\'utilisateur',
          data: sessionCart
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'association:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }
  
  // Obtenir les statistiques des paniers (admin)
  static async getCartStats(req, res) {
    try {
      const stats = await Promise.all([
        Cart.countDocuments({ status: 'active' }),
        Cart.countDocuments({ status: 'abandoned' }),
        Cart.countDocuments({ status: 'converted' }),
        Cart.aggregate([
          { $match: { status: 'active', totalItems: { $gt: 0 } } },
          { $group: { _id: null, avgValue: { $avg: '$totalPrice' } } }
        ]),
        Cart.find({ status: 'active', totalItems: { $gt: 0 } })
          .sort({ totalPrice: -1 })
          .limit(10)
          .select('totalPrice totalItems lastActivity')
      ]);
      
      res.json({
        success: true,
        data: {
          activeCarts: stats[0],
          abandonedCarts: stats[1],
          convertedCarts: stats[2],
          averageCartValue: stats[3][0]?.avgValue || 0,
          topCarts: stats[4]
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des stats:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }
}

module.exports = CartController;
