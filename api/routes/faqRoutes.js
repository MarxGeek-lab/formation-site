const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');
const { authenticateAdmin } = require('../middleware/authenticateAdminToken'); // Assuming you have auth middleware

// Public routes
router.get('/', faqController.getAllFaqs);
router.get('/:id', faqController.getFaqById);

// Protected routes (admin only)
/* router.post('/', authenticateAdmin, faqController.createFaq);
router.put('/:id', authenticateAdmin, faqController.updateFaq);
router.delete('/:id', authenticateAdmin, faqController.deleteFaq);
 */
module.exports = router;
