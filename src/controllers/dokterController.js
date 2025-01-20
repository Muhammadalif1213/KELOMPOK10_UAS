const db = require('../configs/database');  
const xlsx = require('xlsx');

// membaca file Excel
const workbook = xlsx.readFile('zoo.xlsx');
const sheetName = workbook.SheetNames[0];
const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

console.log(data);

module.exports = {
    // Menampilkan daftar pemeriksaan untuk dokter
    getPemeriksaan(req, res) {
        // Periksa apakah user dan Id_Dhewan tersedia di sesi
        const idDhewan = req.session.user?.Id_Dhewan;
        if (!idDhewan) {
            return res.status(401).send("Unauthorized: Id_Dhewan not found in session.");
        }
    
        // Query untuk mendapatkan data pemeriksaan berdasarkan Id_Dhewan
        db.query('SELECT * FROM pemeriksaan WHERE Id_Dhewan = ?;', [idDhewan], function (error, results) {
            if (error) {
                console.error("Error fetching pemeriksaan:", error);
                return res.status(500).send("Internal Server Error");
            }
    
            // Query untuk mendapatkan ID maksimum dan generate ID baru
            db.query('SELECT MAX(Id_periksa) AS maxId FROM pemeriksaan;', function (error, resultsMax) {
                if (error) {
                    console.error("Error generating new Id_periksa:", error);
                    return res.status(500).send("Internal Server Error");
                }
    
                let newId = 'PM0001'; // Default ID jika tabel kosong
                if (resultsMax[0]?.maxId) {
                    let maxId = resultsMax[0].maxId;
                    let num = parseInt(maxId.substring(2)) + 1;
                    newId = 'PM' + num.toString().padStart(4, '0');
                }
    
                // Render view dan kirim data
                res.render('pemeriksaan', {
                    pemeriksaans: results,
                    userName: req.session.user?.username,
                    newId: newId,
                    userIdDhewan: req.session.user?.Id_Dhewan // Mengirim Id_Dhewan ke view
                });
            });
        });
    },
    
    

    // Menyimpan pemeriksaan baru ke database
    savePemeriksaan(req, res) {
        let { Id_Dhewan, Id_hewan, Tgl_periksa, Diagnosis, Pengobatan, Saran } = req.body;
        if (Id_Dhewan && Id_hewan && Tgl_periksa && Diagnosis && Pengobatan && Saran) {
            db.query('SELECT MAX(Id_periksa) AS maxId FROM pemeriksaan;', function (error, results) {
                if (error) throw error;
    
                let newId = 'PM0001'; // Default ID 
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
                        res.redirect('/dokter');
                    }
                );
            });
        } else {
            res.send('Data tidak lengkap');
        }
    },    

    // Memperbarui data pemeriksaan di database
    updatePemeriksaan(req, res) {
        const { id } = req.params;
        const { Id_Dhewan, Id_hewan, Diagnosis, Pengobatan, Saran } = req.body;
    
        db.query(
            `UPDATE Pemeriksaan SET Id_Dhewan = ?, Id_hewan = ?,  Diagnosis = ?, Pengobatan = ?, Saran = ? WHERE Id_periksa = ?`,
            [Id_Dhewan, Id_hewan, Diagnosis, Pengobatan, Saran, id],
            function (error, results) {
                if (error) throw error;
                req.flash('color', 'success');
                req.flash('status', 'Yes..');
                req.flash('message', 'Pemeriksaan berhasil diperbarui');
                res.redirect('/dokter');
            }
        );
    },
    
    // Menghapus pemeriksaan berdasarkan ID
    deletePemeriksaan(req, res) {
        const { id } = req.params;
        db.query(
            'DELETE FROM pemeriksaan WHERE Id_periksa = ?', 
            [id], 
            function (error, results) {
                if (error) throw error;
                req.flash('color', 'success');
                req.flash('status', 'Yes..');
                req.flash('message', 'Pemeriksaan berhasil dihapus');
                res.redirect('/dokter');
            }
        );
    },
    
    // Fungsi untuk mencetak semua data pemeriksaan ke file Excel
    printToExcel(req, res) {
        db.query('SELECT * FROM pemeriksaan', function (error, results) {
            if (error) {
                console.error('Error fetching data:', error);
                return res.status(500).send('Terjadi kesalahan pada database.');
            }

            // Membuat workbook baru
            const workbook = xlsx.utils.book_new();
            const worksheet = xlsx.utils.json_to_sheet(results);

            // Menambahkan worksheet ke workbook
            xlsx.utils.book_append_sheet(workbook, worksheet, 'Pemeriksaan');

            // Menulis ke file Excel
            const filePath = './zoo.xlsx'; // Path file output
            xlsx.writeFile(workbook, filePath);

            // Kirim link file ke client atau unduh langsung
            res.download(filePath, 'pemeriksaan.xlsx', (err) => {
                if (err) {
                    console.error('Error downloading file:', err);
                    return res.status(500).send('Terjadi kesalahan saat mengunduh file.');
                }
            });
        });
    }
};
