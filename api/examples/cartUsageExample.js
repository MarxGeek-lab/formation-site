const express = require('express');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Cart = require('../models/Cart');
const CartController = require('../controllers/cartController');
const cartAbandonmentCron = require('../crons/cartAbandonmentCron');
const cartConfig = require('../config/cartConfig');

/**
 * EXEMPLE D'UTILISATION DU SYSTÈME DE GESTION DE PANIERS
 * 
 * Ce fichier montre comment intégrer et utiliser le système de paniers
 * dans votre application Node.js + MongoDB
 */

class CartUsageExample {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  setupRoutes() {
    // Intégrer les routes de panier
    this.app.use('/api/cart', require('../routes/cartRoutes'));
    
    // Route de démonstration
    this.app.get('/demo', this.demoHandler.bind(this));
  }

  async demoHandler(req, res) {
    try {
      console.log('=== DÉMONSTRATION DU SYSTÈME DE PANIERS ===\n');

      // 1. Créer un nouveau panier pour un utilisateur non connecté
      console.log('1. Création d\'un panier pour utilisateur non connecté...');
      const sessionId = uuidv4();
      const cart1 = new Cart({
        sessionId,
        email: 'test@example.com',
        status: 'active'
      });
      await cart1.save();
      console.log(`✓ Panier créé avec l'ID: ${cart1._id}\n`);

      // 2. Ajouter des produits au panier
      console.log('2. Ajout de produits au panier...');
      await cart1.addItem({
        productId: new mongoose.Types.ObjectId(),
        name: 'Formation JavaScript Avancé',
        price: 299,
        quantity: 1,
        category: 'Formation',
        image: 'https://example.com/js-course.jpg'
      });

      await cart1.addItem({
        productId: new mongoose.Types.ObjectId(),
        name: 'Ebook React Best Practices',
        price: 49,
        quantity: 2,
        category: 'Ebook'
      });

      console.log(`✓ Produits ajoutés. Total: ${cart1.totalItems} articles, ${cart1.totalPrice}€\n`);

      // 3. Simuler l'abandon du panier
      console.log('3. Simulation de l\'abandon du panier...');
      // Modifier la date de dernière activité pour simuler l'abandon
      cart1.lastActivity = new Date(Date.now() - (13 * 60 * 60 * 1000)); // Il y a 13 heures
      await cart1.save();
      console.log('✓ Panier marqué comme inactif depuis 13 heures\n');

      // 4. Détecter les paniers abandonnés
      console.log('4. Détection des paniers abandonnés...');
      const abandonedCarts = await Cart.findAbandonedCarts(12);
      console.log(`✓ ${abandonedCarts.length} panier(s) abandonné(s) détecté(s)\n`);

      // 5. Marquer comme abandonné et envoyer email
      console.log('5. Marquage comme abandonné et envoi d\'email...');
      if (abandonedCarts.length > 0) {
        const cart = abandonedCarts[0];
        await cart.markAsAbandoned();
        
        // Simuler l'envoi d'email
        const { sendAbandonedCartEmail } = require('../services/emailService');
        await sendAbandonedCartEmail(cart);
        
        cart.abandonedEmailSent = true;
        await cart.save();
        console.log('✓ Email de relance envoyé\n');
      }

      // 6. Créer un panier converti
      console.log('6. Création d\'un panier converti...');
      const cart2 = new Cart({
        sessionId: uuidv4(),
        userId: new mongoose.Types.ObjectId(),
        email: 'customer@example.com',
        status: 'active'
      });

      await cart2.addItem({
        productId: new mongoose.Types.ObjectId(),
        name: 'Formation Node.js Complete',
        price: 399,
        quantity: 1,
        category: 'Formation'
      });

      // Marquer comme converti
      const orderId = new mongoose.Types.ObjectId();
      await cart2.markAsConverted(orderId);
      console.log(`✓ Panier converti en commande: ${orderId}\n`);

      // 7. Statistiques
      console.log('7. Statistiques des paniers...');
      const stats = await cartAbandonmentCron.getStats();
      console.log('📊 Statistiques:');
      console.log(`   - Paniers actifs: ${stats.activeCarts}`);
      console.log(`   - Paniers abandonnés: ${stats.abandonedCarts}`);
      console.log(`   - Paniers convertis: ${stats.convertedCarts}`);
      console.log(`   - Emails en attente: ${stats.pendingEmails}`);
      console.log(`   - Valeur abandonnée: ${stats.abandonedValue}€\n`);

      res.json({
        success: true,
        message: 'Démonstration terminée avec succès',
        stats
      });

    } catch (error) {
      console.error('Erreur dans la démonstration:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async start() {
    try {
      // Connexion à MongoDB
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rafly', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ...cartConfig.database.options
      });
      console.log('✓ Connexion MongoDB établie');

      // Démarrer les tâches cron
      if (cartConfig.cron.enabled) {
        cartAbandonmentCron.start();
        console.log('✓ Tâches cron démarrées');
      }

      // Démarrer le serveur
      const PORT = process.env.PORT || 3000;
      this.app.listen(PORT, () => {
        console.log(`🚀 Serveur démarré sur le port ${PORT}`);
        console.log(`📋 Démonstration disponible sur: http://localhost:${PORT}/demo`);
        console.log('\n=== ENDPOINTS DISPONIBLES ===');
        console.log('GET    /api/cart              - Récupérer un panier');
        console.log('POST   /api/cart              - Créer/récupérer un panier');
        console.log('POST   /api/cart/items        - Ajouter un produit');
        console.log('PUT    /api/cart/items/:id    - Modifier quantité');
        console.log('DELETE /api/cart/items/:id    - Supprimer un produit');
        console.log('DELETE /api/cart/clear        - Vider le panier');
        console.log('POST   /api/cart/convert      - Marquer comme converti');
        console.log('POST   /api/cart/associate    - Associer à un utilisateur');
        console.log('GET    /api/cart/stats        - Statistiques (admin)');
        console.log('GET    /demo                  - Démonstration complète');
      });

    } catch (error) {
      console.error('Erreur de démarrage:', error);
      process.exit(1);
    }
  }
}

// Exemples d'utilisation des méthodes du contrôleur
class CartAPIExamples {
  
  // Exemple: Ajouter un produit au panier (frontend)
  static async addToCartExample() {
    const response = await fetch('/api/cart/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_TOKEN' // Optionnel
      },
      body: JSON.stringify({
        sessionId: 'session-123',
        productId: '64f123456789abcdef123456',
        name: 'Formation React',
        price: 199,
        quantity: 1,
        image: 'https://example.com/react.jpg',
        category: 'Formation',
        email: 'user@example.com' // Optionnel
      })
    });
    
    const result = await response.json();
    console.log('Produit ajouté:', result);
  }

  // Exemple: Récupérer le panier
  static async getCartExample() {
    const response = await fetch('/api/cart?sessionId=session-123', {
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN' // Optionnel
      }
    });
    
    const result = await response.json();
    console.log('Panier récupéré:', result);
  }

  // Exemple: Convertir le panier en commande
  static async convertCartExample() {
    const response = await fetch('/api/cart/convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sessionId: 'session-123',
        orderId: '64f123456789abcdef654321',
        email: 'user@example.com'
      })
    });
    
    const result = await response.json();
    console.log('Panier converti:', result);
  }
}

// Exemple d'intégration dans votre application existante
class ExistingAppIntegration {
  
  constructor(existingApp) {
    this.app = existingApp;
    this.integrateCartSystem();
  }

  integrateCartSystem() {
    // 1. Ajouter les routes de panier
    this.app.use('/api/cart', require('../routes/cartRoutes'));

    // 2. Middleware pour associer les paniers lors de la connexion
    this.app.post('/api/auth/login', async (req, res, next) => {
      // Votre logique de connexion existante
      // ...

      // Après connexion réussie, associer le panier de session
      if (req.body.sessionId && req.user) {
        try {
          await CartController.associateWithUser({
            user: req.user,
            body: { sessionId: req.body.sessionId }
          }, { json: () => {} });
        } catch (error) {
          console.error('Erreur association panier:', error);
        }
      }

      next();
    });

    // 3. Middleware pour marquer les paniers comme convertis après commande
    this.app.post('/api/orders', async (req, res, next) => {
      // Votre logique de commande existante
      // ...

      // Après création de commande réussie
      if (req.body.sessionId && res.locals.orderId) {
        try {
          await CartController.convertCart({
            user: req.user,
            body: {
              sessionId: req.body.sessionId,
              orderId: res.locals.orderId,
              email: req.body.email
            }
          }, { json: () => {} });
        } catch (error) {
          console.error('Erreur conversion panier:', error);
        }
      }

      next();
    });
  }
}

// Démarrage si ce fichier est exécuté directement
if (require.main === module) {
  const example = new CartUsageExample();
  example.start();
}

module.exports = {
  CartUsageExample,
  CartAPIExamples,
  ExistingAppIntegration
};
