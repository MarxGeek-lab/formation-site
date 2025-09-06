const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateToken')

const statsController = require('../controllers/statsController');

router.get('/owner', auth, statsController.getStatsByOwner);
router.get('/revenue', auth, statsController.getRevenueStats);


module.exports = router;