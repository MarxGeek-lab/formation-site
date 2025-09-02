const { body, query } = require('express-validator');

exports.validateReservation = [
    // Validation pour la création/mise à jour de réservation
    body('propertyId')
        .notEmpty()
        .withMessage('L\'ID de la propriété est requis'),
    
    body('checkIn')
        .notEmpty()
        .withMessage('La date d\'arrivée est requise')
        .isISO8601()
        .withMessage('Format de date invalide'),
    
    body('checkOut')
        .notEmpty()
        .withMessage('La date de départ est requise')
        .isISO8601()
        .withMessage('Format de date invalide')
        .custom((value, { req }) => {
            if (new Date(value) <= new Date(req.body.checkIn)) {
                throw new Error('La date de départ doit être après la date d\'arrivée');
            }
            return true;
        }),
    
    body('numberOfGuests')
        .notEmpty()
        .withMessage('Le nombre de voyageurs est requis')
        .isInt({ min: 1 })
        .withMessage('Le nombre de voyageurs doit être au moins 1'),
    
    body('totalPrice')
        .notEmpty()
        .withMessage('Le prix total est requis')
        .isFloat({ min: 0 })
        .withMessage('Le prix total doit être positif'),
    
    body('specialRequests')
        .optional()
        .isString()
        .withMessage('Les demandes spéciales doivent être un texte')
        .isLength({ max: 500 })
        .withMessage('Les demandes spéciales ne peuvent pas dépasser 500 caractères')
];

exports.validateAvailabilityCheck = [
    // Validation pour la vérification de disponibilité
    query('propertyId')
        .notEmpty()
        .withMessage('L\'ID de la propriété est requis'),
    
    query('checkIn')
        .notEmpty()
        .withMessage('La date d\'arrivée est requise')
        .isISO8601()
        .withMessage('Format de date invalide'),
    
    query('checkOut')
        .notEmpty()
        .withMessage('La date de départ est requise')
        .isISO8601()
        .withMessage('Format de date invalide')
        .custom((value, { req }) => {
            if (new Date(value) <= new Date(req.query.checkIn)) {
                throw new Error('La date de départ doit être après la date d\'arrivée');
            }
            return true;
        })
]; 