const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateToken');
const authAdmin = require('../middleware/authenticateAdminToken');

const paymentController = require('../controllers/transactionController');

router.post('/create', paymentController.createTransaction);

router.get('/owner', authAdmin, paymentController.getPaymentsBySeller);

router.put('/status', paymentController.getStatusPayment);

router.get('/:id', authAdmin, paymentController.getPaymentsById);
router.put('/update-status/:id', auth, paymentController.updateTransactionStatus);

module.exports = router;