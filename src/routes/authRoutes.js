const router = require('express').Router();
const authController = require('../controllers/authController');
const auth = require('../configs/auth');

// Halaman login
router.get('/login', auth.isLogout, authController.login);

// Menghandle autentikasi login
router.post('/auth', authController.loginAuth);

// Logout
router.get('/logout', auth.checkAuth, authController.logout);

module.exports = router;
