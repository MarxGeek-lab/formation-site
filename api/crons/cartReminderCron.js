const cron = require('node-cron');
const reminderService = require('../services/reminderService');

class CartReminderCron {
  constructor() {
    this.isRunning = false;
  }

  // Démarrer les tâches cron
  start() {
    console.log('🚀 Démarrage des tâches cron pour les paniers...');

    // Traiter les relances toutes les heures
    cron.schedule('0 * * * *', async () => {
      if (this.isRunning) {
        console.log('⏳ Traitement des relances déjà en cours, passage ignoré');
        return;
      }

      this.isRunning = true;
      console.log('🔄 Début du traitement des relances de panier');
      
      try {
        const result = await reminderService.processReminders();
        console.log(`✅ Traitement terminé: ${result.processed} relance(s) traitée(s)`);
      } catch (error) {
        console.error('❌ Erreur lors du traitement des relances:', error);
      } finally {
        this.isRunning = false;
      }
    });

    // Marquer les paniers abandonnés toutes les 6 heures
    cron.schedule('0 */6 * * *', async () => {
      console.log('🗂️ Marquage des paniers abandonnés');
      
      try {
        const count = await reminderService.markAbandonedCarts();
        console.log(`✅ ${count} panier(s) marqué(s) comme abandonné(s)`);
      } catch (error) {
        console.error('❌ Erreur marquage paniers abandonnés:', error);
      }
    });

    // Nettoyer les anciens paniers tous les jours à 2h du matin
    cron.schedule('0 2 * * *', async () => {
      console.log('🧹 Nettoyage des anciens paniers');
      
      try {
        const count = await reminderService.cleanupOldCarts();
        console.log(`✅ ${count} ancien(s) panier(s) supprimé(s)`);
      } catch (error) {
        console.error('❌ Erreur nettoyage paniers:', error);
      }
    });

    console.log('✅ Tâches cron des paniers configurées:');
    console.log('  - Relances: toutes les heures');
    console.log('  - Marquage abandonnés: toutes les 6 heures');
    console.log('  - Nettoyage: tous les jours à 2h');
  }

  // Arrêter les tâches cron
  stop() {
    cron.destroy();
    console.log('🛑 Tâches cron des paniers arrêtées');
  }

  // Exécuter manuellement le traitement des relances
  async runRemindersManually() {
    if (this.isRunning) {
      throw new Error('Traitement déjà en cours');
    }

    this.isRunning = true;
    console.log('🔄 Exécution manuelle du traitement des relances');
    
    try {
      const result = await reminderService.processReminders();
      console.log(`✅ Traitement manuel terminé: ${result.processed} relance(s) traitée(s)`);
      return result;
    } finally {
      this.isRunning = false;
    }
  }
}

module.exports = new CartReminderCron();
