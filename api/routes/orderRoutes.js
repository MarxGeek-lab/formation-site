const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder);
router.get('/user/:customerId', orderController.getUserOrders);
router.get('/:id', orderController.getOrderById);
router.patch('/:id/status', orderController.updateOrderStatus);
router.patch('/:id/deliver', orderController.markAsDelivered);
router.patch('/:id/cancel', orderController.cancelOrder);
router.patch('/:id/reminder', orderController.reminderOrder);
router.patch('/:id/invoice', orderController.sendInvoice);
router.get('/:id/invoice', orderController.generateInvoice);

module.exports = router;
