const express = require("express");
const router = express.Router();
const dokterController = require("../controllers/dokterController");
const authController = require('../controllers/authController');
const verifyUser = require("../configs/auth");

// CRUD untuk pemeriksaan
router.get("/dokter", verifyUser.checkAuth, dokterController.getPemeriksaan);  // Melihat daftar pemeriksaan
router.post("/dokter/save", verifyUser.checkAuth, dokterController.savePemeriksaan);  // Menambah pemeriksaan
router.post("/dokter/update/:id", verifyUser.checkAuth, dokterController.updatePemeriksaan);  // Update pemeriksaan
router.get("/dokter/delete/:id", verifyUser.checkAuth, dokterController.deletePemeriksaan); 
router.get("/dokter/print", verifyUser.checkAuth, dokterController.printToExcel);
 // Hapus pemeriksaan
router.get('/logout', authController.logout);

module.exports = router;
