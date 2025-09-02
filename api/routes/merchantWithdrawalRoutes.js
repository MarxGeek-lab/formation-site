const express = require('express');
const router = express.Router();
const controller = require('../controllers/merchantWithdrawalController');
const auth = require('../middleware/authenticateToken');

router.post('/', auth, controller.createWithdrawalRequest);
router.get('/owner/:id', auth, controller.getWithdrawalsByMerchant);
router.get('/:id', auth, controller.getWithdrawalsById);
router.patch('/:id', auth, controller.updateWithdrawal);
router.delete('/:id', auth, controller.deleteWithdrawal);

module.exports = router;
