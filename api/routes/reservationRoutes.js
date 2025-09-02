const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const auth = require('../middleware/authenticateToken');
const upload = require('../middleware/multer');

// Routes publiques
router.get('/check-availability', 
    reservationController.checkAvailabilityProperty
);

// Routes protégées (nécessitant une authentification)
// Création et gestion des réservations
router.post('/create',
    // auth,
    reservationController.createReservation
);

// Obtenir les réservations de l'utilisateur connecté
router.get('/tenant/:id/:status',
    auth,
    reservationController.getTenantReservations
);

router.get('/owner/:id',
    auth,
    reservationController.getOwnerReservations
);

router.get('/owner/:id/:status',
    auth,
    reservationController.getOwnerReservationsMobile
);

// Obtenir les réservations d'une propriété spécifique (pour le propriétaire)
router.get('/property/:propertyId',
    auth,
    reservationController.getPropertyReservations
);

// Obtenir une réservation spécifique
router.get('/:id',
    auth,
    reservationController.getReservationsById
);

// Mettre à jour une réservation
router.put('/:id',
    auth,
    reservationController.updateReservation
);

// Annuler une réservation
router.put('/:id/cancel',
    auth,
    reservationController.cancelReservation
);

router.delete('/:id/delete',
    auth,
    reservationController.deleteReservation
)   

router.put('/:id/reply',
    auth,
    reservationController.replyToClient
)

router.get('/verify-qrcode/:id',
    // auth,
    reservationController.externeRouteVerifyTransaction
)

router.get('/:id/generate-ticket',
    auth,
    reservationController.generateReservationTicket
)

router.put('/:id/confirm-property-state',
    auth,
    upload.fields([
        { name: 'images', maxCount: 5 },
    ]),
    reservationController.confirmPropertyState
)

router.get('/:id/reminder',
    auth,
    reservationController.reminderReservation
)

module.exports = router; 