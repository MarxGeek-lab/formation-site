const express = require('express');

const commonController = require('../controllers/common');
const userVisitController = require('../controllers/userVisitController')
const router = express.Router();

router.post('/contact-us', commonController.contactUs);

router.get('/localisation', commonController.getAllLocalisation);

router.post('/save-user-visit', userVisitController.saveUserVisit);

module.exports = router;