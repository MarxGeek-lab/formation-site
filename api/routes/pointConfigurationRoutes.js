const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateToken');
const pointConfigurationController = require('../controllers/pointConfigurationController');

// Routes publiques
router.get('/', pointConfigurationController.getAllConfigurations);
router.get('/category/:category', pointConfigurationController.getConfigurationsByCategory);

// Routes protégées (nécessitent authentification)
router.post('/check-eligibility', auth, pointConfigurationController.checkPointsEligibility);

// Routes admin (nécessitent authentification + rôle admin)
router.post('/initialize', auth, admin, pointConfigurationController.initializeDefaultConfigurations);
router.post('/', auth, admin, pointConfigurationController.createConfiguration);
router.put('/:id', auth, admin, pointConfigurationController.updateConfiguration);
router.patch('/:id/toggle', auth, admin, pointConfigurationController.toggleConfiguration);
router.get('/stats', auth, admin, pointConfigurationController.getPointsStats);

module.exports = router; 