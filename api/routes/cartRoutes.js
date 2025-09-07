const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');
const authenticateToken = require('../middleware/authenticateToken');

// Middleware optionnel pour l'authentification (utilisateur connecté ou non)
const optionalAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (token) {
    // Si un token est fourni, on essaie de l'authentifier
    authenticateToken(req, res, (err) => {
      if (err) {
        // Si le token est invalide, on continue sans utilisateur
        req.user = null;
      }
      next();
    });
  } else {
    // Pas de token, on continue sans utilisateur
    req.user = null;
    next();
  }
};

// Routes publiques (avec authentification optionnelle)

/**
 * @route GET /api/cart
 * @desc Récupérer le panier d'un utilisateur
 * @access Public (avec auth optionnelle)
 * @query {string} sessionId - ID de session (requis si pas connecté)
 * @query {string} cartId - ID du panier (optionnel, prioritaire)
 */
router.get('/', optionalAuth, CartController.getCart);

/**
 * @route POST /api/cart
 * @desc Créer un nouveau panier ou récupérer existant
 * @access Public (avec auth optionnelle)
 * @body {string} sessionId - ID de session (requis)
 * @body {string} email - Email de l'utilisateur (optionnel)
 */
router.post('/', optionalAuth, CartController.createOrGetCart);

/**
 * @route POST /api/cart/items
 * @desc Ajouter un produit au panier
 * @access Public (avec auth optionnelle)
 * @body {string} sessionId - ID de session (requis)
 * @body {string} productId - ID du produit (requis)
 * @body {string} name - Nom du produit (requis)
 * @body {number} price - Prix du produit (requis)
 * @body {number} quantity - Quantité (optionnel, défaut: 1)
 * @body {string} image - URL de l'image (optionnel)
 * @body {string} category - Catégorie (optionnel)
 * @body {object} options - Options du produit (optionnel)
 * @body {string} email - Email de l'utilisateur (optionnel)
 */
router.post('/items', optionalAuth, CartController.addItem);

/**
 * @route DELETE /api/cart/items/:productId
 * @desc Supprimer un produit du panier
 * @access Public (avec auth optionnelle)
 * @param {string} productId - ID du produit à supprimer
 * @query {string} sessionId - ID de session (requis)
 */
router.delete('/items/:productId', optionalAuth, CartController.removeItem);

/**
 * @route PUT /api/cart/items/:productId
 * @desc Mettre à jour la quantité d'un produit
 * @access Public (avec auth optionnelle)
 * @param {string} productId - ID du produit
 * @body {string} sessionId - ID de session (requis)
 * @body {number} quantity - Nouvelle quantité
 */
router.put('/items/:productId', optionalAuth, CartController.updateItemQuantity);

/**
 * @route DELETE /api/cart/clear
 * @desc Vider le panier
 * @access Public (avec auth optionnelle)
 * @body {string} sessionId - ID de session (requis)
 */
router.delete('/clear', optionalAuth, CartController.clearCart);

/**
 * @route POST /api/cart/convert
 * @desc Marquer le panier comme converti (commande validée)
 * @access Public (avec auth optionnelle)
 * @body {string} sessionId - ID de session (requis)
 * @body {string} orderId - ID de la commande (optionnel)
 * @body {string} email - Email de l'utilisateur (optionnel)
 */
router.post('/convert', optionalAuth, CartController.convertCart);

// Routes nécessitant une authentification

// router.post('/associate', authenticateToken, CartController.associateWithUser);

/**
 * @route GET /api/cart/stats
 * @desc Obtenir les statistiques des paniers (admin)
 * @access Private (authentification requise)
 */
// router.get('/stats', authenticateToken, CartController.getCartStats);

module.exports = router;
