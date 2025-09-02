const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');
const auth = require('../middleware/authenticateToken');
const newsletterMessageController = require('../controllers/newsletterMessageController');
const upload = require('../middleware/multer');

// Routes publiques (pas d'authentification requise)
router.post('/subscriptions', newsletterController.subscribe); // Créer un abonnement
router.delete('/subscriptions', newsletterController.unsubscribe); // Supprimer un abonnement

// Routes protégées (authentification requise)
router.get('/subscriptions', auth, newsletterController.getActiveSubscribers); // Récupérer tous les abonnés actifs
router.patch('/subscriptions/last-sent', auth, newsletterController.updateLastEmailSent); // Mettre à jour la date du dernier envoi d'email

// Routes pour les messages de newsletter (protégées)
router.route('/messages')
    .post(auth, upload.single('images'), newsletterMessageController.createMessage) // Créer un message
    .get(auth, newsletterMessageController.getAllMessages); // Récupérer tous les messages

router.route('/messages/:id')
    .get(auth, newsletterMessageController.getMessage) 
    .patch(auth, upload.single('images'), newsletterMessageController.updateMessage) // Mettre à jour un message spécifique
    .delete(auth, newsletterMessageController.deleteMessage);

router.post('/messages/:id/send', auth, newsletterMessageController.sendMessage); // Envoyer un message spécifique

module.exports = router;