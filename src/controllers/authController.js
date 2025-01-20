const auth = require('../configs/auth');

module.exports = {
    // Menampilkan halaman login
    login(req, res) {
        console.log("Flash Messages:", req.flash());
        res.render("login", {
            url: 'http://localhost:3000/',
            colorFlash: req.flash('color') || null,
            statusFlash: req.flash('status') || null,
            pesanFlash: req.flash('message') || "Tidak ada pesan",
        });
    },

    // Menghandle autentikasi login
    loginAuth(req, res, next) {
        auth.loginAuth(req, res, next);
    },

    // Menangani logout
    logout(req, res, next) {
        auth.logout(req, res, next);
    }
};
