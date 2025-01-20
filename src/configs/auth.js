

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db = require('./database');

module.exports = {
    // Fungsi untuk login dan menyimpan session
    loginAuth(req, res, next) {
        const { username, password } = req.body;

        const queryUser = `
        SELECT 'dokter' AS role, Id_Dhewan AS id, Pw_Dhewan AS password, Nama_Dhewan AS username 
        FROM dhewan 
        WHERE BINARY Nama_Dhewan = ? 
        UNION ALL 
        SELECT 'admin' AS role, Id_Admin AS id, Password AS password, Username AS username 
        FROM Admin 
        WHERE BINARY Username = ? 
        UNION ALL 
        SELECT 'keeper' AS role, Id_Keeper AS id, Pw_keeper AS password, Nama_Keeper AS username 
        FROM keeper 
        WHERE BINARY Nama_Keeper = ?`;

        // Fungsi untuk memeriksa kecocokan password
        function checkPassword(user, passwordInput) {
            const hashedInput = crypto.createHash('sha512').update(passwordInput).digest('hex');
            return hashedInput === user.password;
        }

        db.query(queryUser, [username, username, username], (err, results) => {
            if (err) {
                console.error("Database error:", err.message);
                return res.status(500).send(`Terjadi kesalahan pada database: ${err.message}`);
            }

            if (results.length > 0) {
                const user = results[0]; // Ambil data pengguna yang ditemukan

                // perubahan
                // Verifikasi password menggunakan bcrypt
                if (checkPassword(user, password)) {
                    // Tentukan role berdasarkan ID
                    let role = 'guest';
                    const userId = user.id;
                
                    if (userId.startsWith('DH')) {
                        role = 'dokter';
                    } else if (userId.startsWith('AD')) {
                        role = 'admin';
                    } else if (userId.startsWith('KP')) {
                        role = 'keeper';
                    }
                
                    // Menyimpan session
                    req.session.loggedin = true;
                    req.session.user = { 
                        id: user.id, 
                        username: user.username, 
                        role: role,
                        Id_Dhewan: userId.startsWith('DH') ? user.id : null, // Simpan hanya jika role dokter
                        Id_keeper: userId.startsWith('KP') ? user.id : null // Simpan hanya jika role keeper
                    };
                
                    // Log session untuk memastikan disimpan
                    console.log("Session disimpan: ", req.session);
                
                    if (req.originalUrl === `/${role}`) {
                        return next();  // Lanjutkan ke route yang diinginkan
                    } else {
                        return res.redirect(`/${role}`);  // Redirect ke halaman yang sesuai role
                    }
                }
                 else {
                    return res.status(401).send("Password yang Anda masukkan salah.");
                }
            } else {
                return res.status(401).send("Username tidak ditemukan.");
            }
        });
    },

    // Fungsi untuk logout
    logout(req, res, next) {
        req.session.destroy(function (err) {
            if (err) {
                return res.status(500).send("Terjadi kesalahan saat logout.");
            }
            res.redirect('/login');
        });
    },

    // Fungsi untuk memverifikasi otentikasi (untuk di middleware)
    // 
    
    checkAuth(req, res, next) {
        if (req.session.loggedin === true) {
            // Periksa apakah user memiliki role yang sesuai dengan URL yang diminta
            const userRole = req.session.user.role;
            const requestedUrl = req.path; // Gunakan req.path untuk menghindari query string
    
            // Daftar role dan endpoint yang diizinkan
            const allowedRoutes = {
                dokter: ['/dokter', '/dokter/save',  /^\/dokter\/update\/\w+$/, /^\/dokter\/delete\/\w+$/, '/dokter/print'],
                admin: ['/admin', '/admin/pemeriksaan', '/admin/pemeriksaan/save', /^\/admin\/pemeriksaan\/update\/\w+$/,/^\/admin\/pemeriksaan\/delete\/\w+$/,
                        '/admin/perawatan', '/admin/perawatan/save', /^\/admin\/perawatan\/update\/\w+$/,/^\/admin\/perawatan\/delete\/\w+$/,
                        '/admin/hewan', '/admin/hewan/save', /^\/admin\/hewan\/update\/\w+$/,/^\/admin\/hewan\/delete\/\w+$/,
                        '/admin/keeper', '/admin/keeper/save', /^\/admin\/keeper\/update\/\w+$/,/^\/admin\/keeper\/delete\/\w+$/,
                        '/admin/dokter', '/admin/dokter/save', /^\/admin\/dokter\/update\/\w+$/,/^\/admin\/dokter\/delete\/\w+$/, ],
                keeper: [
                    '/keeper', 
                    '/keeper/save', 
                    /^\/keeper\/update\/\w+$/, 
                    /^\/keeper\/delete\/\w+$/  // Diganti \w+ untuk mencocokkan ID berbentuk alphanumeric seperti PR00001
                ]
            };
    
            const isAuthorized = allowedRoutes[userRole] && 
                allowedRoutes[userRole].some(route => 
                    typeof route === 'string' ? route === requestedUrl : route.test(requestedUrl)
                );
    
            if (isAuthorized) {
                next(); // Lanjutkan ke route yang diminta
            } else {
                res.status(403).send('Akses dilarang: Anda tidak memiliki izin untuk mengakses halaman ini.');
            }
        } else {
            req.session.destroy(function (err) {
                res.redirect('/login'); // Redirect ke halaman login jika tidak otentikasi
            });
        }
    },    

    // Fungsi untuk mengecek apakah user sudah login atau belum (untuk route login dan registrasi)
    isLogout(req, res, next) {
        if (req.session.loggedin !== true) {
            next(); // Lanjutkan ke route login jika belum login
        } else {
            res.redirect('/'); // Redirect ke halaman utama jika sudah login
        }
    },
};
