const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateAdminToken');

const customerController = require('../controllers/customersController');

router.get('/owner', auth, customerController.getCustomerByOwner);

router.get('/:id', auth, customerController.getCustomerById);


module.exports = router;