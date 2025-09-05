const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateToken');

const paymentController = require('../controllers/transactionController');

router.post('/create', paymentController.createTransaction);

router.get('/tenant/:id', auth, paymentController.getPaymentsByUserTenant);

router.get('/owner', auth, paymentController.getPaymentsBySeller);

router.put('/status', paymentController.getStatusPayment);

router.get('/:id', auth, paymentController.getPaymentsById);
router.put('/update-status/:id', auth, paymentController.updateTransactionStatus);

module.exports = router;