const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const CartController = require('../controllers/cartController');
const cartAbandonmentCron = require('../crons/cartAbandonmentCron');
const { sendAbandonedCartEmail } = require('../services/emailService');

/**
 * TEST D'INTÉGRATION COMPLÈTE DU SYSTÈME DE PANIER
 * 
 * Ce fichier teste toutes les fonctionnalités du système de panier
 * pour s'assurer que l'intégration fonctionne correctement
 */

class CartIntegrationTest {
  constructor() {
    this.testResults = [];
    this.sessionId = `test_session_${Date.now()}`;
    this.testEmail = 'test@academy.marxgeek.com.com';
  }

  log(message, success = true) {
    const timestamp = new Date().toISOString();
    const status = success ? '✅' : '❌';
    const logMessage = `${status} [${timestamp}] ${message}`;
    console.log(logMessage);
    this.testResults.push({ message, success, timestamp });
  }

  async connectToDatabase() {
    try {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/academy.marxgeek.com', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      this.log('Connexion à MongoDB établie');
      return true;
    } catch (error) {
      this.log(`Erreur connexion MongoDB: ${error.message}`, false);
      return false;
    }
  }

  async cleanupTestData() {
    try {
      await Cart.deleteMany({ sessionId: { $regex: /^test_session_/ } });
      this.log('Données de test nettoyées');
    } catch (error) {
      this.log(`Erreur nettoyage: ${error.message}`, false);
    }
  }

  async testCartCreation() {
    try {
      const cart = new Cart({
        sessionId: this.sessionId,
        email: this.testEmail,
        status: 'active'
      });
      
      await cart.save();
      this.log(`Panier créé avec ID: ${cart._id}`);
      return cart;
    } catch (error) {
      this.log(`Erreur création panier: ${error.message}`, false);
      return null;
    }
  }

  async testAddItems(cart) {
    try {
      const testProducts = [
        {
          productId: new mongoose.Types.ObjectId(),
          name: 'Formation JavaScript Avancé',
          price: 299,
          quantity: 1,
          category: 'Formation',
          image: 'https://example.com/js.jpg'
        },
        {
          productId: new mongoose.Types.ObjectId(),
          name: 'Ebook React Best Practices',
          price: 49,
          quantity: 2,
          category: 'Ebook'
        }
      ];

      for (const product of testProducts) {
        await cart.addItem(product);
        this.log(`Produit ajouté: ${product.name} (${product.quantity}x ${product.price}€)`);
      }

      this.log(`Total panier: ${cart.totalItems} articles, ${cart.totalPrice}€`);
      return cart;
    } catch (error) {
      this.log(`Erreur ajout produits: ${error.message}`, false);
      return null;
    }
  }

  async testCartOperations(cart) {
    try {
      // Test mise à jour quantité
      const firstItem = cart.items[0];
      await cart.updateItemQuantity(firstItem.productId, 3);
      this.log(`Quantité mise à jour: ${firstItem.name} -> 3`);

      // Test suppression d'un item
      const secondItem = cart.items[1];
      await cart.removeItem(secondItem.productId);
      this.log(`Produit supprimé: ${secondItem.name}`);

      this.log(`Nouveau total: ${cart.totalItems} articles, ${cart.totalPrice}€`);
      return true;
    } catch (error) {
      this.log(`Erreur opérations panier: ${error.message}`, false);
      return false;
    }
  }

  async testAbandonmentDetection() {
    try {
      // Créer un panier abandonné (simuler ancienne activité)
      const abandonedCart = new Cart({
        sessionId: `${this.sessionId}_abandoned`,
        email: this.testEmail,
        status: 'active',
        lastActivity: new Date(Date.now() - (13 * 60 * 60 * 1000)) // Il y a 13 heures
      });

      await abandonedCart.addItem({
        productId: new mongoose.Types.ObjectId(),
        name: 'Produit Abandonné',
        price: 99,
        quantity: 1,
        category: 'Test'
      });

      this.log('Panier abandonné créé pour test');

      // Détecter les paniers abandonnés
      const abandonedCarts = await Cart.findAbandonedCarts(12);
      this.log(`${abandonedCarts.length} panier(s) abandonné(s) détecté(s)`);

      if (abandonedCarts.length > 0) {
        const cart = abandonedCarts.find(c => c.sessionId === `${this.sessionId}_abandoned`);
        if (cart) {
          await cart.markAsAbandoned();
          this.log('Panier marqué comme abandonné');
          
          // Test envoi email
          await sendAbandonedCartEmail(cart);
          this.log('Email de relance envoyé (simulation)');
        }
      }

      return true;
    } catch (error) {
      this.log(`Erreur test abandon: ${error.message}`, false);
      return false;
    }
  }

  async testCartConversion() {
    try {
      const cart = await Cart.findOne({ sessionId: this.sessionId });
      if (!cart) {
        this.log('Panier non trouvé pour conversion', false);
        return false;
      }

      const orderId = new mongoose.Types.ObjectId();
      await cart.markAsConverted(orderId);
      this.log(`Panier converti en commande: ${orderId}`);

      return true;
    } catch (error) {
      this.log(`Erreur conversion: ${error.message}`, false);
      return false;
    }
  }

  async testApiEndpoints() {
    try {
      // Simuler les requêtes API
      const mockReq = {
        body: {
          sessionId: `${this.sessionId}_api`,
          email: this.testEmail
        },
        user: null,
        query: {}
      };

      const mockRes = {
        json: (data) => {
          this.log(`API Response: ${data.success ? 'Success' : 'Error'}`);
          return data;
        },
        status: (code) => ({
          json: (data) => {
            this.log(`API Status ${code}: ${data.message || 'OK'}`);
            return data;
          }
        })
      };

      // Test création panier via API
      await CartController.createOrGetCart(mockReq, mockRes);

      // Test ajout produit via API
      mockReq.body = {
        sessionId: `${this.sessionId}_api`,
        productId: new mongoose.Types.ObjectId().toString(),
        name: 'Produit API Test',
        price: 150,
        quantity: 1,
        category: 'Test API'
      };

      await CartController.addItem(mockReq, mockRes);

      this.log('Tests API terminés');
      return true;
    } catch (error) {
      this.log(`Erreur tests API: ${error.message}`, false);
      return false;
    }
  }

  async testCronJobs() {
    try {
      // Test exécution manuelle des tâches cron
      const results = await cartAbandonmentCron.runManual({
        detectAbandoned: true,
        sendEmails: true,
        cleanup: false,
        hoursThreshold: 12
      });

      this.log(`Cron exécuté: ${results.abandoned?.processed || 0} paniers traités`);
      
      // Test statistiques
      const stats = await cartAbandonmentCron.getStats();
      this.log(`Stats: ${stats.activeCarts} actifs, ${stats.abandonedCarts} abandonnés, ${stats.convertedCarts} convertis`);

      return true;
    } catch (error) {
      this.log(`Erreur tests cron: ${error.message}`, false);
      return false;
    }
  }

  async runAllTests() {
    console.log('🚀 DÉBUT DES TESTS D\'INTÉGRATION DU SYSTÈME DE PANIER\n');

    // Connexion base de données
    const connected = await this.connectToDatabase();
    if (!connected) return this.generateReport();

    // Nettoyage initial
    await this.cleanupTestData();

    try {
      // Test 1: Création de panier
      console.log('\n📝 Test 1: Création de panier');
      const cart = await this.testCartCreation();
      if (!cart) return this.generateReport();

      // Test 2: Ajout de produits
      console.log('\n🛒 Test 2: Ajout de produits');
      const cartWithItems = await this.testAddItems(cart);
      if (!cartWithItems) return this.generateReport();

      // Test 3: Opérations sur le panier
      console.log('\n⚙️ Test 3: Opérations sur le panier');
      await this.testCartOperations(cartWithItems);

      // Test 4: Détection d'abandon
      console.log('\n⏰ Test 4: Détection d\'abandon');
      await this.testAbandonmentDetection();

      // Test 5: Conversion de panier
      console.log('\n💰 Test 5: Conversion de panier');
      await this.testCartConversion();

      // Test 6: Endpoints API
      console.log('\n🌐 Test 6: Endpoints API');
      await this.testApiEndpoints();

      // Test 7: Tâches cron
      console.log('\n⏲️ Test 7: Tâches cron');
      await this.testCronJobs();

    } catch (error) {
      this.log(`Erreur générale: ${error.message}`, false);
    } finally {
      // Nettoyage final
      await this.cleanupTestData();
      await mongoose.disconnect();
      this.log('Connexion MongoDB fermée');
    }

    return this.generateReport();
  }

  generateReport() {
    console.log('\n📊 RAPPORT DE TESTS\n');
    
    const successful = this.testResults.filter(r => r.success).length;
    const total = this.testResults.length;
    const percentage = Math.round((successful / total) * 100);

    console.log(`✅ Tests réussis: ${successful}/${total} (${percentage}%)`);
    
    const failed = this.testResults.filter(r => !r.success);
    if (failed.length > 0) {
      console.log('\n❌ Tests échoués:');
      failed.forEach(test => {
        console.log(`   - ${test.message}`);
      });
    }

    console.log('\n🎯 RÉSUMÉ:');
    if (percentage >= 90) {
      console.log('🟢 Système de panier intégré avec succès !');
    } else if (percentage >= 70) {
      console.log('🟡 Intégration partiellement réussie, quelques ajustements nécessaires');
    } else {
      console.log('🔴 Problèmes d\'intégration détectés, révision nécessaire');
    }

    return {
      successful,
      total,
      percentage,
      failed: failed.length,
      details: this.testResults
    };
  }
}

// Exécution des tests si le fichier est lancé directement
if (require.main === module) {
  const tester = new CartIntegrationTest();
  tester.runAllTests()
    .then(report => {
      console.log('\n✨ Tests terminés');
      process.exit(report.percentage >= 90 ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Erreur lors des tests:', error);
      process.exit(1);
    });
}

module.exports = CartIntegrationTest;
