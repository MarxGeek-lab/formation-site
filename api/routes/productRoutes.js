const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authenticateToken = require('../middleware/authenticateToken');
const upload = require('../middleware/multer');

// Routes publiques
router.get('/',  productController.getAllProducts);
router.get('/:id', /* authenticateToken */ productController.getProductById);
router.get('/download-products/:id', authenticateToken, productController.downloadProductsByUser);
router.get('/category/:categoryId', productController.getProductsByCategory);
router.get('/user/:userId', /* authenticateToken */ productController.getProductsByUser);

// Routes protégées (nécessitant une authentification)
router.post('/create', 
    // authenticateToken, 
    upload.fields([
        { name: 'images', maxCount: 20 },
        { name: 'videos', maxCount: 1 },
        { name: 'pdf', maxCount: 1 },
    ]), 
    productController.createProduct
);

router.put('/update/:id', 
    authenticateToken, 
    upload.fields([
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 1 },
        { name: 'pdf', maxCount: 1 },
    ]),
    productController.updateProduct
);

router.delete('/delete/:id', 
    authenticateToken, 
    productController.deleteProduct
);

// Routes de gestion des statuts
router.put('/status/:id', 
    authenticateToken, 
    productController.updateProductStatus
);

// Routes de gestion des favoris
router.post('/favorites', 
    authenticateToken, 
    productController.addToFavorites
);

router.get('/favorites/:id', 
    authenticateToken, 
    productController.getUserFavorites
);
/* 
// Routes de gestion des avis
router.post('/:id/reviews', 
    authenticateToken, 
    propertyController.addReview
);

router.put('/reviews/:reviewId', 
    authenticateToken, 
    propertyController.updateReview
);

router.delete('/reviews/:reviewId', 
    authenticateToken, 
    propertyController.deleteReview
);

router.get('/:id/reviews', 
    propertyController.getPropertyReviews
); */

module.exports = router; 