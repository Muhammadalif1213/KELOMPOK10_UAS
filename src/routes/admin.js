const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authController = require('../controllers/authController');
const verifyUser = require("../configs/auth");

router.get('/logout', authController.logout);

// Route untuk Admin
router.get('/admin', verifyUser.checkAuth, adminController.getAdmin);

// CRUD untuk dokter
router.get("/admin/dokter", verifyUser.checkAuth, adminController.getDokter);  // Melihat daftar dokter
router.post("/admin/dokter/save", verifyUser.checkAuth, adminController.saveDokter);  // Menambah dokter
router.post("/admin/dokter/update/:id", verifyUser.checkAuth, adminController.updateDokter);  // Update dokter
router.get("/admin/dokter/delete/:id", verifyUser.checkAuth, adminController.deleteDokter);  // Hapus dokter

// // CRUD untuk hewan
router.get("/admin/hewan", verifyUser.checkAuth, adminController.getHewan);  // Melihat daftar hewan
router.post("/admin/hewan/save", verifyUser.checkAuth, adminController.saveHewan);  // Menambah hewan
router.post("/admin/hewan/update/:id", verifyUser.checkAuth, adminController.updateHewan);  // Update hewan
router.get("/admin/hewan/delete/:id", verifyUser.checkAuth, adminController.deleteHewan);  // Hapus hewan

// // CRUD untuk keeper
router.get("/admin/keeper", verifyUser.checkAuth, adminController.getKeeper);  // Melihat daftar keeper
router.post("/admin/keeper/save", verifyUser.checkAuth, adminController.saveKeeper);  // Menambah keeper
router.post("/admin/keeper/update/:id", verifyUser.checkAuth, adminController.updateKeeper);  // Update keeper
router.get("/admin/keeper/delete/:id", verifyUser.checkAuth, adminController.deleteKeeper);  // Hapus keeper

// CRUD untuk pemeriksaan
router.get("/admin/pemeriksaan", verifyUser.checkAuth, adminController.getPemeriksaan);
router.post("/admin/pemeriksaan/save", verifyUser.checkAuth, adminController.savePemeriksaan);  // Melihat daftar pemeriksaan
router.post("/admin/pemeriksaan/update/:id", verifyUser.checkAuth, adminController.updatePemeriksaan);  // Update pemeriksaan
router.get("/admin/pemeriksaan/delete/:id", verifyUser.checkAuth, adminController.deletePemeriksaan);  // Hapus pemeriksaan

// CRUD untuk perawatan
router.get("/admin/perawatan", verifyUser.checkAuth, adminController.getPerawatan);  // Melihat daftar perawatan
router.post("/admin/perawatan/save", verifyUser.checkAuth, adminController.savePerawatan);  // Menambah perawatan
router.post("/admin/perawatan/update/:id", verifyUser.checkAuth, adminController.updatePerawatan);  // Update perawatan
router.get("/admin/perawatan/delete/:id", verifyUser.checkAuth, adminController.deletePerawatan);  // Hapus perawatan

module.exports = router;
