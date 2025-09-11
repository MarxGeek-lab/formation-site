const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticateToken');
const uploadFile = require('../middleware/multer');
const upload = require('../middleware/multer');

// Routes utilisateur
router.post("/test", (req, res) => res.send("coo"))
router.post('/signup', userController.signUp);
router.post('/signin', userController.signIn);
router.post('/active-account', userController.activeAccount);
router.post('/resend-activation-code', userController.resendActivationCode);
router.post('/resend-code-otp', userController.resendCodeOtp);
router.post('/verify-email-client-auth', userController.verifyEmailLoginClientAuth);
router.post('/verify-email', userController.verifyEmail);
router.post('/confirm-email', userController.confirmEmail);
router.post('/reset-password', userController.resetPwd);
router.post('/reset-password2', userController.resetPwdMobile);

router.get('/:id', authenticateToken, userController.getUserById);
router.put('/update/:id', authenticateToken, upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'images', maxCount: 1 },
]), userController.updateUser);
router.put('/update-photo/:id', authenticateToken, upload.single('profile'), userController.updateUserPhoto);
router.put('/deactivate/:id', authenticateToken, userController.desactiveUser);
router.put('/delete/:id', authenticateToken, userController.deleteUser);
router.put('/validate/:id', authenticateToken, userController.validUser);
router.get('/:id', authenticateToken, userController.getUserById);

module.exports = router;
