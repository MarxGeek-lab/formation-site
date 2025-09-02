const express = require('express');
const router = express.Router();
const visitRequestController = require('../controllers/visitRequestController');
const authMiddleware = require('../middleware/authenticateToken'); // Middleware d'authentification

router.post('/', authMiddleware, visitRequestController.createVisitRequest);

router.get('/', authMiddleware, visitRequestController.getAllVisitRequests);

router.get('/my-requests/:id', authMiddleware, visitRequestController.getUserVisitRequests);

router.get('/requests/owner/:id', authMiddleware, visitRequestController.getOwnerVisitRequests);

router.put('/:id', authMiddleware, visitRequestController.updateVisitRequestStatus);

router.delete('/:id', authMiddleware, visitRequestController.deleteVisitRequest);

module.exports = router;
