const express = require("express");
const router = express.Router();
const keeperController = require("../controllers/keeperController");
const authController = require('../controllers/authController');
const verifyUser = require("../configs/auth");

// CRUD untuk perawatan
router.get("/keeper", verifyUser.checkAuth, keeperController.getPerawatan);  // Melihat daftar perawatan
router.post("/keeper/save", verifyUser.checkAuth, keeperController.savePerawatan);  // Menambah perawatan
router.post("/keeper/update/:id", verifyUser.checkAuth, keeperController.updatePerawatan);  // Update perawatan
router.get("/keeper/delete/:id", verifyUser.checkAuth, keeperController.deletePerawatan);  // Hapus perawatan
router.get('/logout', authController.logout);
module.exports = router;
