const express = require("express");
const router = express.Router();
const homeController = require('../controllers/homeController');
const authController = require('../controllers/authController');
const auth = require('../configs/auth');

router.get('/', homeController.home);
router.get('/login', auth.isLogout, authController.login);
module.exports = router;