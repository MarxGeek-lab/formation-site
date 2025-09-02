const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateToken')

const statsController = require('../controllers/statsController');

router.get('/owner', auth, statsController.getStatsByOwner);

router.get('/balance/owner', auth, statsController.getBalanceOwner);

module.exports = router;