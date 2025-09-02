const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateToken');

const reviewController = require('../controllers/reviewController');

router.post('/', auth, reviewController.addReview);
router.get('/owner', auth, reviewController.getProductReviews);
router.get('/:id', auth, reviewController.getReviewById);
router.delete('/:id', auth, reviewController.deleteReview)

router.get('/product/:id', reviewController.getPropertyReviews);

router.post('/:id/like', auth, reviewController.likeReview);
router.post('/:id/dislike', auth, reviewController.dislikeReview);



module.exports = router;