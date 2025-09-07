const cron = require('node-cron');
const Cart = require('../models/Cart');
const { sendAbandonedCartEmail } = require('../services/emailService');

class CartAbandonmentCron {
  constructor() {
    this.isRunning = false;
  }

  // Détecter et marquer les paniers abandonnés
  async detectAbandonedCarts(hoursThreshold = 12) {
    if (this.isRunning) {
      console.log('Détection des paniers abandonnés déjà en cours...');
      return;
    }

    this.isRunning = true;
    console.log(`[${new Date().toISOString()}] Début de la détection des paniers abandonnés...`);

    try {
      // Trouver les paniers actifs non transformés après X heures
      const abandonedCarts = await Cart.findAbandonedCarts(hoursThreshold);
      
      console.log(`Trouvé ${abandonedCarts.length} panier(s) abandonné(s)`);

      let processedCount = 0;
      let emailsSentCount = 0;

      for (const cart of abandonedCarts) {
        try {
          // Marquer comme abandonné
          await cart.markAsAbandoned();
          processedCount++;

          // Envoyer email de relance si email disponible
          if (cart.email && !cart.abandonedEmailSent) {
            try {
              await sendAbandonedCartEmail(cart);
              cart.abandonedEmailSent = true;
              await cart.save();
              emailsSentCount++;
              console.log(`Email de relance envoyé pour le panier ${cart._id} (${cart.email})`);
            } catch (emailError) {
              console.error(`Erreur envoi email pour panier ${cart._id}:`, emailError.message);
            }
          }

          console.log(`Panier ${cart._id} marqué comme abandonné (${cart.totalItems} articles, ${cart.totalPrice}€)`);
        } catch (error) {
          console.error(`Erreur traitement panier ${cart._id}:`, error.message);
        }
      }

      console.log(`[${new Date().toISOString()}] Détection terminée:`);
      console.log(`- ${processedCount} panier(s) marqué(s) comme abandonné(s)`);
      console.log(`- ${emailsSentCount} email(s) de relance envoyé(s)`);

      return {
        processed: processedCount,
        emailsSent: emailsSentCount,
        total: abandonedCarts.length
      };

    } catch (error) {
      console.error('Erreur lors de la détection des paniers abandonnés:', error);
      throw error;
    } finally {
      this.isRunning = false;
    }
  }

  // Envoyer des emails de relance pour les paniers déjà abandonnés
  async sendReminderEmails() {
    console.log(`[${new Date().toISOString()}] Début de l'envoi des emails de relance...`);

    try {
      const cartsForReminder = await Cart.findCartsForEmailReminder();
      console.log(`Trouvé ${cartsForReminder.length} panier(s) pour relance email`);

      let emailsSentCount = 0;

      for (const cart of cartsForReminder) {
        try {
          await sendAbandonedCartEmail(cart);
          cart.abandonedEmailSent = true;
          await cart.save();
          emailsSentCount++;
          console.log(`Email de relance envoyé pour le panier ${cart._id} (${cart.email})`);
        } catch (error) {
          console.error(`Erreur envoi email pour panier ${cart._id}:`, error.message);
        }
      }

      console.log(`[${new Date().toISOString()}] ${emailsSentCount} email(s) de relance envoyé(s)`);
      return emailsSentCount;

    } catch (error) {
      console.error('Erreur lors de l\'envoi des emails de relance:', error);
      throw error;
    }
  }

  // Nettoyer les anciens paniers abandonnés (optionnel)
  async cleanupOldCarts(daysOld = 30) {
    console.log(`[${new Date().toISOString()}] Nettoyage des anciens paniers...`);

    try {
      const cutoffDate = new Date(Date.now() - (daysOld * 24 * 60 * 60 * 1000));
      
      const result = await Cart.deleteMany({
        status: 'abandoned',
        abandonedAt: { $lt: cutoffDate },
        totalItems: 0 // Seulement les paniers vides
      });

      console.log(`${result.deletedCount} ancien(s) panier(s) vide(s) supprimé(s)`);
      return result.deletedCount;

    } catch (error) {
      console.error('Erreur lors du nettoyage:', error);
      throw error;
    }
  }

  // Démarrer les tâches cron
  start() {
    console.log('Démarrage des tâches cron pour la gestion des paniers...');

    // Détection des paniers abandonnés - toutes les heures
    cron.schedule('0 * * * *', async () => {
      try {
        await this.detectAbandonedCarts(12); // 12 heures
      } catch (error) {
        console.error('Erreur dans le cron de détection:', error);
      }
    });

    // Envoi des emails de relance - toutes les 4 heures
    cron.schedule('0 */4 * * *', async () => {
      try {
        await this.sendReminderEmails();
      } catch (error) {
        console.error('Erreur dans le cron d\'emails:', error);
      }
    });

    // Nettoyage des anciens paniers - tous les jours à 2h du matin
    cron.schedule('0 2 * * *', async () => {
      try {
        await this.cleanupOldCarts(30); // 30 jours
      } catch (error) {
        console.error('Erreur dans le cron de nettoyage:', error);
      }
    });

    console.log('Tâches cron démarrées:');
    console.log('- Détection paniers abandonnés: toutes les heures');
    console.log('- Envoi emails de relance: toutes les 4 heures');
    console.log('- Nettoyage anciens paniers: tous les jours à 2h');
  }

  // Arrêter les tâches cron
  stop() {
    cron.getTasks().forEach(task => task.stop());
    console.log('Tâches cron arrêtées');
  }

  // Exécution manuelle pour tests
  async runManual(options = {}) {
    const {
      detectAbandoned = true,
      sendEmails = true,
      cleanup = false,
      hoursThreshold = 12,
      cleanupDays = 30
    } = options;

    console.log('Exécution manuelle des tâches de gestion des paniers...');

    const results = {};

    if (detectAbandoned) {
      results.abandoned = await this.detectAbandonedCarts(hoursThreshold);
    }

    if (sendEmails) {
      results.emails = await this.sendReminderEmails();
    }

    if (cleanup) {
      results.cleanup = await this.cleanupOldCarts(cleanupDays);
    }

    return results;
  }

  // Obtenir les statistiques
  async getStats() {
    try {
      const stats = await Promise.all([
        Cart.countDocuments({ status: 'active' }),
        Cart.countDocuments({ status: 'abandoned' }),
        Cart.countDocuments({ status: 'converted' }),
        Cart.countDocuments({ 
          status: 'abandoned', 
          email: { $exists: true, $ne: null },
          abandonedEmailSent: false 
        }),
        Cart.aggregate([
          { $match: { status: 'abandoned' } },
          { $group: { _id: null, totalValue: { $sum: '$totalPrice' } } }
        ])
      ]);

      return {
        activeCarts: stats[0],
        abandonedCarts: stats[1],
        convertedCarts: stats[2],
        pendingEmails: stats[3],
        abandonedValue: stats[4][0]?.totalValue || 0,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des stats:', error);
      throw error;
    }
  }
}

// Instance singleton
const cartAbandonmentCron = new CartAbandonmentCron();

module.exports = cartAbandonmentCron;
