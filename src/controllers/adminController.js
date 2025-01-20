const db = require('../configs/database');

module.exports = {

    // CRUD untuk Admin (admin)
    getAdmin(req, res) {
        let totalData = {};
    
        // Query untuk total dokter
        db.query('SELECT COUNT(*) AS totalDokter FROM dhewan;', function (error, results) {
            if (error) throw error;
            totalData.totalDokter = results[0].totalDokter;
    
            // Query untuk total hewan
            db.query('SELECT COUNT(*) AS totalHewan FROM hewan;', function (error, results) {
                if (error) throw error;
                totalData.totalHewan = results[0].totalHewan;
    
                // Query untuk total keeper
                db.query('SELECT COUNT(*) AS totalKeeper FROM keeper;', function (error, results) {
                    if (error) throw error;
                    totalData.totalKeeper = results[0].totalKeeper;
    
                    // Kirim data ke EJS
                    res.render('admin', {
                        totalData: totalData,
                        userName: req.session.username // Menambahkan username ke tampilan
                    });
                });
            });
        });
    },      

    // CRUD untuk Dokter (Dhewan)
    getDokter(req, res) {
        db.query('SELECT * FROM dhewan;', function (error, results) {
            if (error) throw error;
    
            // Generate a new ID for the form
            db.query('SELECT MAX(Id_Dhewan) AS maxId FROM dhewan;', function (error, resultsMax) {
                if (error) throw error;
    
                let newId = 'DH001'; // Default ID if the table is empty
                if (resultsMax[0].maxId) {
                    let maxId = resultsMax[0].maxId;
                    let num = parseInt(maxId.substring(2)) + 1;
                    newId = 'DH' + num.toString().padStart(3, '0');
                }
    
                // Render the view and pass `newId` along with other data
                res.render('adminDokter', {
                    dhewans: results,
                    userName: req.session.username,
                    newId: newId // Pass the `newId` to the view
                });
            });
        });
    },

    formDokter(req, res) {
        res.render("admin/formDokter", {
            url: 'http://localhost:5050/',
        });
    },

    saveDokter(req, res) {
        let { Nama_Dhewan, Almt_Dhewan, Notlp_Dhewan, Email_Dhewan, Pw_Dhewan } = req.body;
        if ( Nama_Dhewan && Almt_Dhewan && Notlp_Dhewan && Email_Dhewan && Pw_Dhewan) {
            db.query('SELECT MAX(Id_Dhewan) AS maxId FROM dhewan;', function (error, results) {
                if (error) throw error;

                let newId = 'DH001'; // Default ID if the table is empty
                if (results[0].maxId) {
                    let maxId = results[0].maxId;
                    let num = parseInt(maxId.substring(2)) + 1;
                    newId = 'DH' + num.toString().padStart(3, '0');
                }

                // Insert data Dhewan
                db.query(
                    `INSERT INTO Dhewan (Id_Dhewan, Nama_Dhewan, Almt_Dhewan, Notlp_Dhewan, Email_Dhewan, Pw_Dhewan) 
                    VALUES (?, ?, ?, ?, ?, SHA2(?,512));`,
                    [newId, Nama_Dhewan, Almt_Dhewan, Notlp_Dhewan, Email_Dhewan, Pw_Dhewan],
                    function (error, results) {
                        if (error) {
                            console.error(error);
                            res.send('Gagal menyimpan data');
                            return;
                        }
                        req.flash('color', 'success');
                        req.flash('status', 'Yes..');
                        req.flash('message', 'Data berhasil disimpan');
                        res.redirect('/admin/dokter');
                    }
                );
            });
        } else {
            res.send('Data tidak lengkap');
        }
    },

    editDokter(req, res) {
        const { id } = req.params;
        db.query('SELECT * FROM Dhewan WHERE Id_Dhewan = ?', [id], function (error, results) {
            if (error) throw error;
            if (results.length > 0) {
                res.render('admin/editDokter', {
                    url: 'http://localhost:5050/',
                    dokter: results[0]
                });
            } else {
                res.redirect('/admin/dokter');
            }
        });
    },

    updateDokter(req, res) {
        const { id } = req.params;
        const { Nama_Dhewan, Almt_Dhewan, Notlp_Dhewan, Email_Dhewan, Pw_Dhewan } = req.body;
        db.query(
            'UPDATE dhewan SET Nama_Dhewan = ?, Almt_Dhewan = ?, Notlp_Dhewan = ?, Email_Dhewan = ?, Pw_Dhewan = SHA2(?,512) WHERE Id_Dhewan = ?',
            [Nama_Dhewan, Almt_Dhewan, Notlp_Dhewan, Email_Dhewan, Pw_Dhewan, id],
            function (error, results) {
                if (error) throw error;
                res.redirect('/admin/dokter');
            }
        );
    },

    deleteDokter(req, res) {
        const { id } = req.params;
        db.query('DELETE FROM dhewan WHERE Id_Dhewan = ?', [id], function (error, results) {
            if (error) throw error;
            res.redirect('/admin/dokter');
        });
    },

    // CRUD untuk Keeper (Pengasuh Hewan)
    getKeeper(req, res) {
        db.query('SELECT * FROM keeper;', function (error, results) {
            if (error) throw error;
    
            // Generate a new ID for the form
            db.query('SELECT MAX(Id_Keeper) AS maxId FROM keeper;', function (error, resultsMax) {
                if (error) throw error;
    
                let newId = 'KP001'; // Default ID if the table is empty
                if (resultsMax[0].maxId) {
                    let maxId = resultsMax[0].maxId;
                    let num = parseInt(maxId.substring(2)) + 1;
                    newId = 'KP' + num.toString().padStart(3, '0');
                }
    
                // Render the view and pass `newId` along with other data
                res.render('adminKeeper', {
                    keepers: results,
                    userName: req.session.username,
                    newId: newId // Pass the `newId` to the view
                });
            });
        });
    },

    saveKeeper(req, res) {
        let { Nama_Keeper, Almt_keeper, Notlp_keeper, Email_keeper, Pw_keeper } = req.body;
        if (Nama_Keeper && Almt_keeper && Notlp_keeper && Email_keeper && Pw_keeper) {
            db.query('SELECT MAX(Id_Keeper) AS maxId FROM keeper;', function (error, results) {
                if (error) throw error;

                let newId = 'KP001'; // Default ID jika tabel kosong
                if (results[0].maxId) {
                    let maxId = results[0].maxId;
                    let num = parseInt(maxId.substring(2)) + 1;
                    newId = 'KP' + num.toString().padStart(3, '0');
                }

                // Insert data Keeper
                db.query(
                    `INSERT INTO Keeper (Id_Keeper, Nama_Keeper, Almt_keeper, Notlp_keeper, Email_keeper, Pw_keeper) 
                    VALUES (?, ?, ?, ?, ?, SHA2(?,512));`,
                    [newId, Nama_Keeper, Almt_keeper, Notlp_keeper, Email_keeper, Pw_keeper],
                    function (error, results) {
                        if (error) {
                            console.error(error);
                            res.send('Gagal menyimpan data');
                            return;
                        }
                        req.flash('color', 'success');
                        req.flash('status', 'Yes..');
                        req.flash('message', 'Data berhasil disimpan');
                        res.redirect('/admin/keeper');
                    }
                );
            });
        } else {
            res.send('Data tidak lengkap');
        }
    },

    updateKeeper(req, res) {
        const { id } = req.params;
        const { Nama_Keeper, Almt_keeper, Notlp_keeper, Email_keeper, Pw_keeper } = req.body;
        db.query(
            'UPDATE keeper SET Nama_Keeper = ?, Almt_keeper = ?, Notlp_keeper = ?, Email_keeper = ?, Pw_keeper = SHA2(?,512) WHERE Id_Keeper = ?',
            [Nama_Keeper, Almt_keeper, Notlp_keeper, Email_keeper, Pw_keeper, id],
            function (error, results) {
                if (error) throw error;
                res.redirect('/admin/keeper');
            }
        );
    },

    deleteKeeper(req, res) {
        const { id } = req.params;
        db.query('DELETE FROM keeper WHERE Id_Keeper = ?', [id], function (error, results) {
            if (error) throw error;
            res.redirect('/admin/keeper');
        });
    },

    // CRUD untuk Hewan
    getHewan(req, res) {
        db.query('SELECT * FROM hewan;', function (error, results) {
            if (error) throw error;
    
            // Generate a new ID for the form
            db.query('SELECT MAX(Id_hewan) AS maxId FROM hewan;', function (error, resultsMax) {
                if (error) throw error;
    
                let newId = 'HE000001'; // Default ID if the table is empty
                if (resultsMax[0].maxId) {
                    let maxId = resultsMax[0].maxId;
                    let num = parseInt(maxId.substring(2)) + 1;
                    newId = 'HE' + num.toString().padStart(6, '0');
                }
    
                // Render the view and pass `newId` along with other data
                res.render('adminHewan', {
                    hewans: results,
                    userName: req.session.username,
                    newId: newId // Pass the `newId` to the view
                });
            });
        });
    },

    saveHewan(req, res) {
        let { Nama_hewan, Jenis_hewan, Spesies_hewan, JK_hewan, Tgl_lahir, Tgl_masuk, Berat } = req.body;
        if ( Nama_hewan && Jenis_hewan && Spesies_hewan && JK_hewan && Tgl_lahir && Tgl_masuk && Berat) {
            db.query('SELECT MAX(Id_hewan) AS maxId FROM hewan;', function (error, results) {
                if (error) throw error;

                let newId = 'HE000001'; // Default ID jika tabel kosong
                if (results[0].maxId) {
                    let maxId = results[0].maxId;
                    let num = parseInt(maxId.substring(2)) + 1;
                    newId = 'HE' + num.toString().padStart(6, '0');
                }

                // Insert data Hewan
                db.query(
                    `INSERT INTO hewan (Id_hewan, Nama_hewan, Jenis_hewan, Spesies_hewan, JK_hewan, Tgl_lahir, Tgl_masuk, Berat) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
                    [newId, Nama_hewan, Jenis_hewan, Spesies_hewan, JK_hewan, Tgl_lahir, Tgl_masuk, Berat],
                    function (error, results) {
                        if (error) {
                            console.error(error);
                            res.send('Gagal menyimpan data');
                            return;
                        }
                        req.flash('color', 'success');
                        req.flash('status', 'Yes..');
                        req.flash('message', 'Data berhasil disimpan');
                        res.redirect('/admin/hewan');
                    }
                );
            });
        } else {
            res.send('Data tidak lengkap');
        }
    },

    updateHewan(req, res) {
        const { id } = req.params;
        const { Nama_hewan, Jenis_hewan, Spesies_hewan, JK_hewan, Tgl_lahir, Tgl_masuk, Berat } = req.body;
        db.query(
            'UPDATE hewan SET Nama_hewan = ?, Jenis_hewan = ?, Spesies_hewan = ?, JK_hewan = ?, Tgl_lahir = ?, Tgl_masuk = ?,  Berat = ? WHERE Id_hewan = ?',
            [Nama_hewan, Jenis_hewan, Spesies_hewan, JK_hewan, Tgl_lahir, Tgl_masuk, Berat, id],
            function (error, results) {
                if (error) throw error;
                res.redirect('/admin/hewan');
            }
        );
    },

    deleteHewan(req, res) {
        const { id } = req.params;
        db.query('DELETE FROM hewan WHERE Id_hewan = ?', [id], function (error, results) {
            if (error) throw error;
            res.redirect('/admin/hewan');
        });
    },

    // CRUD untuk Pemeriksaan dan Perawatan Hewan
    getPemeriksaan(req, res) {
        db.query('SELECT * FROM pemeriksaan;', function (error, results) {
            if (error) throw error;
    
            // Generate a new ID for the form
            db.query('SELECT MAX(Id_periksa) AS maxId FROM pemeriksaan;', function (error, resultsMax) {
                if (error) throw error;
    
                let newId = 'PM0001'; // Default ID if the table is empty
                if (resultsMax[0].maxId) {
                    let maxId = resultsMax[0].maxId;
                    let num = parseInt(maxId.substring(2)) + 1;
                    newId = 'PM' + num.toString().padStart(4, '0');
                }
    
                // Render the view and pass `newId` along with other data
                res.render('adminPeriksa', {
                    pemeriksaans: results,
                    userName: req.session.username,
                    newId: newId // Pass the `newId` to the view
                });
            });
        });
    },

    savePemeriksaan(req, res) {
        let { Id_Dhewan, Id_hewan, Tgl_periksa, Diagnosis, Pengobatan, Saran } = req.body;
        if (Id_Dhewan && Id_hewan && Tgl_periksa && Diagnosis && Pengobatan && Saran) {
            db.query('SELECT MAX(Id_periksa) AS maxId FROM pemeriksaan;', function (error, results) {
                if (error) throw error;
    
                let newId = 'PM0001'; // Default ID if the table is empty
                if (results[0].maxId) {
                    let maxId = results[0].maxId;
                    let num = parseInt(maxId.substring(2)) + 1;
                    newId = 'PM' + num.toString().padStart(4, '0');
                }
    
                // Insert Pemeriksaan data using newId
                db.query(
                    `INSERT INTO pemeriksaan (Id_periksa, Id_Dhewan, Id_hewan, Tgl_periksa, Diagnosis, Pengobatan, Saran) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [newId, Id_Dhewan, Id_hewan, Tgl_periksa, Diagnosis, Pengobatan, Saran],
                    function (error, results) {
                        if (error) {
                            console.error(error);
                            res.send('Gagal menyimpan data');
                            return;
                        }
                        req.flash('color', 'success');
                        req.flash('status', 'Yes..');
                        req.flash('message', 'Pemeriksaan berhasil disimpan');
                        res.redirect('/admin/pemeriksaan');
                    }
                );
            });
        } else {
            res.send('Data tidak lengkap');
        }
    },    


    updatePemeriksaan(req, res) {
        const { id } = req.params;
        const { Id_Dhewan, Id_hewan, Diagnosis, Pengobatan, Saran } = req.body;
        db.query(
           `UPDATE Pemeriksaan SET Id_Dhewan = ?, Id_hewan = ?, Diagnosis = ?, Pengobatan = ?, Saran = ? WHERE Id_periksa = ?`,
            [Id_Dhewan, Id_hewan, Diagnosis, Pengobatan, Saran, id],
            function (error, results) {
                if (error) throw error;
                res.redirect('/admin/pemeriksaan');
            }
        );
    },

    deletePemeriksaan(req, res) {
        const { id } = req.params;
        db.query('DELETE FROM pemeriksaan WHERE Id_periksa = ?', [id], function (error, results) {
            if (error) throw error;
            res.redirect('/admin/pemeriksaan');
        });
    },

    // CRUD untuk Perawatan Hewan
    getPerawatan(req, res) {
        db.query('SELECT * FROM perawatan;', function (error, results) {
            if (error) throw error;
    
            // Generate a new ID for the form
            db.query('SELECT MAX(Id_prwtn) AS maxId FROM perawatan;', function (error, resultsMax) {
                if (error) throw error;
    
                let newId = 'PR0001'; // Default ID if the table is empty
                if (resultsMax[0].maxId) {
                    let maxId = resultsMax[0].maxId;
                    let num = parseInt(maxId.substring(2)) + 1;
                    newId = 'PR' + num.toString().padStart(4, '0');
                }
    
                // Render the view and pass `newId` along with other data
                res.render('adminPerawatan', {
                    perawatans: results,
                    userName: req.session.username,
                    newId: newId // Pass the `newId` to the view
                });
            });
        });
    },    

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
                        res.redirect('/admin/perawatan');
                    }
                );
            });
        } else {
            res.send('Data tidak lengkap');
        }
    },      


    updatePerawatan(req, res) {
        const { id } = req.params;
        const { Id_keeper, Id_hewan, Kondisi_hewan, Detail_prwtn  } = req.body;
        db.query(
           `UPDATE perawatan SET Id_keeper = ?,  Id_hewan = ?, Kondisi_hewan = ?, Detail_prwtn = ? WHERE Id_Prwtn = ?`,
            [Id_keeper, Id_hewan, Kondisi_hewan, Detail_prwtn, id],
            function (error, results) {
                if (error) throw error;
                res.redirect('/admin/perawatan');
            }
        );
    },

    deletePerawatan(req, res) {
        const { id } = req.params;
        db.query('DELETE FROM perawatan WHERE Id_prwtn = ?', [id], function (error, results) {
            if (error) throw error;
            res.redirect('/admin/perawatan');
        });
    },
};
