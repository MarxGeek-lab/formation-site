const express = require('express');
const router = express.Router();
const TrackingController = require('../controllers/trackingController');
const authenticateAdminToken = require('../middleware/authenticateAdminToken');

// Route pixel publique (pas d'authentification requise)
router.get('/pixel', TrackingController.trackPixel);

// Route pour associer une session à un utilisateur
router.post('/associate-session', TrackingController.associateSessionToUser);

// Routes admin protégées
router.get('/admin/stats', authenticateAdminToken, TrackingController.getTrackingStats);
router.get('/admin/events', authenticateAdminToken, TrackingController.getTrackingEvents);

module.exports = router;
