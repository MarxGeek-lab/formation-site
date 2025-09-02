const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');
const notificationController = require('../controllers/common');
const authMiddleware = require('../middleware/authenticateToken');

// Créer une question (accessible aux clients)
// router.post('/submit-quiz', authMiddleware, helpCenterController.createQuestion);

// notifications
router.post('/create-message', authMiddleware, messagesController.createMessage);

router.get('/notification/:id/:type', authMiddleware, notificationController.getNotifications);

// Récupérer toutes les questions
router.get('/owner/:owner', authMiddleware, messagesController.getAllMessageByOwner);

router.get('/tenant/:id', authMiddleware, messagesController.getAllMessageByTenant);

router.post('/add-message/:id', authMiddleware, messagesController.addMessageToChat);
router.post('/add-message2', authMiddleware, messagesController.addMessageToChat2);

// Ajouter une réponse (accessible aux administrateurs)
// router.post('/answer', authMiddleware, helpCenterController.addAnswer);

// Fermer une question (accessible aux administrateurs)
// router.post('/close', authMiddleware, helpCenterController.closeQuestion);

module.exports = router;
