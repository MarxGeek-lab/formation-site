const express = require('express');
const siteSettingsController = require('../controllers/siteSettingsController');
const auth = require('../middleware/authenticateAdminToken');
const upload = require('../middleware/multer');

const router = express.Router();

router
  .route('/')
  .get(siteSettingsController.getSiteSettings)
  .put(auth, upload.single('images'), siteSettingsController.updateSiteSettings);

module.exports = router;