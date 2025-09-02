const express = require('express');
const router = express.Router();

const purchaseController = require('../controllers/purchaseController');

router.get('/tenant/:id', purchaseController.getPurchaseByTenant);

router.get('/:id', purchaseController.getPurchaseById);

module.exports = router;