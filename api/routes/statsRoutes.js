const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateToken')
const authAdmin = require('../middleware/authenticateAdminToken')

const statsController = require('../controllers/statsController');

router.get('/owner', authAdmin, statsController.getStatsByOwner);
router.get('/buyer/:id', auth, statsController.getStatsByBuyer);
router.get('/revenue', authAdmin, statsController.getRevenueStats);


module.exports = router;