const db = require('../configs/database');  // Pastikan path-nya benar

module.exports = {
    // Menampilkan daftar perawatan untuk keeper
    getPerawatan(req, res) {
        // Periksa apakah user dan Id_keeper tersedia di sesi
        const idKeeper = req.session.user?.Id_keeper;
        if (!idKeeper) {
            return res.status(401).send("Unauthorized: Id_keeper not found in session.");
        }
    
        // Query untuk mendapatkan data perawatan berdasarkan Id_keeper yang ada di session
        db.query('SELECT * FROM perawatan WHERE Id_keeper = ?;', [idKeeper], function (error, results) {
            if (error) throw error;
    
            // Generate a new ID for the form
            db.query('SELECT MAX(Id_prwtn) AS maxId FROM perawatan;', function (error, resultsMax) {
                if (error) throw error;
    
                let newId = 'PR0001'; // Default ID 
                if (resultsMax[0].maxId) {
                    let maxId = resultsMax[0].maxId;
                    let num = parseInt(maxId.substring(2)) + 1;
                    newId = 'PR' + num.toString().padStart(4, '0');
                }
    
                // Render the view and pass `newId`, `idKeeper` along with other data
                res.render('perawatan', {
                    perawatans: results,
                    userName: req.session.user?.username, // Ambil username dari session
                    newId: newId, // Pass the newId to the view
                    idKeeper: req.session.user?.Id_keeper // Pass the Id_keeper to the view
                });
            });
        });
    },
    
    // Menyimpan perawatan baru ke database
    savePerawatan(req, res) {
        let { Id_prwtn, Id_keeper, Id_hewan, Tgl_prwtn, Kondisi_hewan, Detail_prwtn } = req.body;
        if (Id_prwtn && Id_keeper && Id_hewan && Tgl_prwtn && Kondisi_hewan && Detail_prwtn) {
            db.query('SELECT MAX(Id_prwtn) AS maxId FROM perawatan;', function (error, results) {
                if (error) throw error;
    
                let newId = 'PR0001'; // Default ID if the table is empty
                if (results[0].maxId) {
                    let maxId = results[0].maxId;
                    let num = parseInt(maxId.substring(2)) + 1;
                    newId = 'PR' + num.toString().padStart(4, '0');
                }
    
                // Insert Perawatan data using newId
                db.query(
                    `INSERT INTO perawatan (Id_prwtn, Id_keeper, Id_hewan, Tgl_prwtn, Kondisi_hewan, Detail_prwtn) 
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    [newId, Id_keeper, Id_hewan, Tgl_prwtn, Kondisi_hewan, Detail_prwtn],
                    function (error, results) {
                        if (error) {
                            console.error(error);
                            res.send('Gagal menyimpan data');
                            return;
                        }
                        req.flash('color', 'success');
                        req.flash('status', 'Yes..');
                        req.flash('message', 'Perawatan berhasil disimpan');
                        res.redirect('/keeper');
                    }
                );
            });
        } else {
            res.send('Data tidak lengkap');
        }
    },  

    // Memperbarui data perawatan di database
    updatePerawatan(req, res) {
        const { id } = req.params;
        const { Id_keeper, Id_hewan, Kondisi_hewan, Detail_prwtn } = req.body;
        db.query(
            `UPDATE perawatan SET Id_keeper = ?,  Id_hewan = ?, Kondisi_hewan = ?, Detail_prwtn = ? WHERE Id_Prwtn = ?`,
            [Id_keeper, Id_hewan, Kondisi_hewan, Detail_prwtn, id],
            function (error, results) {
                if (error) throw error;
                req.flash('color', 'success');
                req.flash('status', 'Yes..');
                req.flash('message', 'Perawatan berhasil diperbarui');
                res.redirect('/keeper');
            }
        );
    },

    // Menghapus perawatan berdasarkan ID
    deletePerawatan(req, res) {
        const { id } = req.params;
        db.query(
            'DELETE FROM perawatan WHERE Id_prwtn = ?', 
            [id], 
            function (error, results) {
                if (error) throw error;
                req.flash('color', 'success');
                req.flash('status', 'Yes..');
                req.flash('message', 'Perawatan berhasil dihapus');
                res.redirect('/keeper');
            }
        );
    },
};
