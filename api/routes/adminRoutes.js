const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateAdminToken');

const adminController = require('../controllers/admin/adminController');
const userController = require('../controllers/userController');
// const paymentController = require('../controllers/transactionController');
const categoryController = require('../controllers/categoryController');
const upload = require('../middleware/multer');

// product routes
router.get('/category', auth, categoryController.getAllCategoriesByAdmin);
router.post('/category', auth, categoryController.createCategory);

router.get('/products', auth, adminController.getAllProducts);
router.get('/orders', auth, adminController.getAllOrders);

// // Récupérere tout les utilisateurs
// router.get('/users', auth, adminController.getUsers);

// router.post('/update-user-status', auth, adminController.updateUserStatus);

// // Supports
// router.get('/supports', auth, adminController.getSupportsMessage);


// // admin routes
router.post('/login', adminController.login);
router.post('/reset-password', adminController.resetPassword);
router.post('/forgot-password', adminController.requestPasswordReset);

router.route('/') 
      .get(auth, adminController.getAllAdmins)
      .post(auth, adminController.createAdmin);
      
router.route('/:id') 
  .get(auth, adminController.getAdminById)
  .patch(auth, adminController.updateAdmin)
  .delete(auth, adminController.deleteAdmin);

// router.get('/user-info/:id', auth, adminController.getUserDataById);
router.put('/update-status/:id', auth, adminController.updateStatusAdmin);

// router.put('/transaction/:id/:adminId', auth, paymentController.updateWithdrawableAmount);

router.put('/desactive-user/:id', auth, userController.desactiveUser);
router.delete('/delete-user/:id', auth, userController.deleteUser);


router.put('/category/:id', auth, categoryController.updateCategory);

router.delete('/category/:id', auth, categoryController.deleteCategory);

module.exports = router;