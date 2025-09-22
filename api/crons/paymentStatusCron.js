const cron = require('node-cron');
const { checkPendingOrdersPaymentStatus } = require('../controllers/orderController');

// Cron job pour vérifier le statut des paiements toutes les 10 minutes
const paymentStatusCron = cron.schedule('*/1 * * * *', async () => {
  console.log('🚀 Exécution du cron de vérification des paiements:', new Date().toISOString());
  
  try {
    const result = await checkPendingOrdersPaymentStatus();
    
    if (result.success) {
      console.log(`✅ Cron exécuté avec succès:`, {
        processedOrders: result.processedOrders,
        updatedOrders: result.updatedOrders,
        errors: result.errors
      });
    } else {
      console.error('❌ Erreur dans le cron de paiement:', result.error);
    }
  } catch (error) {
    console.error('❌ Erreur critique dans le cron de paiement:', error);
  }
}, {
  scheduled: false, // Ne démarre pas automatiquement
  timezone: "Africa/Kinshasa" // Timezone pour le Congo
});

// Fonction pour démarrer le cron
const startPaymentStatusCron = () => {
  paymentStatusCron.start();
  console.log('🎯 Cron de vérification des paiements démarré - Exécution toutes les 10 minutes');
};

// Fonction pour arrêter le cron
const stopPaymentStatusCron = () => {
  paymentStatusCron.stop();
  console.log('⏹️ Cron de vérification des paiements arrêté');
};

// Fonction pour exécuter manuellement le cron
const runPaymentStatusCronManually = async () => {
  console.log('🔧 Exécution manuelle du cron de vérification des paiements');
  try {
    const result = await checkPendingOrdersPaymentStatus();
    return result;
  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution manuelle:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  paymentStatusCron,
  startPaymentStatusCron,
  stopPaymentStatusCron,
  runPaymentStatusCronManually
};
