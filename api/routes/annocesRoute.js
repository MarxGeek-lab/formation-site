const express = require('express');
const annonceController = require('../controllers/annonceController');
const upload = require('../middleware/multer');
const auth = require('../middleware/authenticateAdminToken');

const router = express.Router();

router
  .route('/')
  .get(annonceController.getAllAnnonces)
  .post(auth, upload.single('images'), annonceController.createAnnonce);

router
  .route('/:id')
  .get(annonceController.getAnnonce)
  .patch(auth, upload.single('images'), annonceController.updateAnnonce)
  .delete(auth, annonceController.deleteAnnonce);

router.put('/:id/status', auth, annonceController.updateAnnonceStatus);

module.exports = router;