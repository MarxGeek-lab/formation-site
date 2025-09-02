const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateToken');

const rentalController = require('../controllers/rentalController');

router.get('/owner/:id', rentalController.getRentalByOwner);

router.get('/tenant/:id/:status', rentalController.getRentalByTenant);

// router.get('/tenant/:id', rentalController.getRentalByTenant);

router.get('/:id', rentalController.getRentalById);

// Annuler une réservation
router.put('/:id/cancel',
    auth,
    rentalController.cancelRental
);

module.exports = router;