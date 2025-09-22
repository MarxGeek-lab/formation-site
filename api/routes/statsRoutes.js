const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateToken')
const authAdmin = require('../middleware/authenticateAdminToken')

const statsController = require('../controllers/statsController');

router.get('/owner', authAdmin, statsController.getStatsByOwner);
router.get('/buyer/:id', statsController.getStatsByBuyer);
router.get('/revenue', authAdmin, statsController.getRevenueStats);
router.get('/sales', authAdmin, statsController.getSalesStats);
router.get('/sales-by-country', authAdmin, statsController.getSalesByCountry);
router.get('/most-sold-products', authAdmin, statsController.getMostSoldProducts);


module.exports = router;