const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateToken');

const customerController = require('../controllers/customersController');

router.get('/owner', auth, customerController.getCustomerByOwner);

router.get('/:id', auth, customerController.getCustomerById);

router.get('/data/:id/:ownerId', auth, customerController.getCustomerData);

module.exports = router;