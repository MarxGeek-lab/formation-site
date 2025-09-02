const express = require('express');
const router = express.Router();
const helpCenterController = require('../controllers/helpCenterController');
const authMiddleware = require('../middleware/authenticateToken');

// Créer une question (accessible aux clients)
router.post('/submit-quiz', authMiddleware, helpCenterController.addMessageToChatSupport);

// Récupérer toutes les questions
router.get('/discussions/user/:id', helpCenterController.getDiscussionByUser);

// Ajouter une réponse (accessible aux administrateurs)
router.post('/answer', authMiddleware, helpCenterController.addAnswer);

// Fermer une question (accessible aux administrateurs)
router.post('/close', authMiddleware, helpCenterController.closeQuestion);

module.exports = router;
