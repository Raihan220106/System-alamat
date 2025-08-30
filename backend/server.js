const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
const PORT = 5000; 

// Middleware
app.use(cors());
app.use(bodyParser.json());
const path = require("path");
app.use(express.static(path.join(__dirname, "../frontend")));

// Database connection
const db = mysql.createConnection({
host: "localhost",
user: 'raihan',
password: 'raihan123',
database: "sistem_alamat",
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");

  // Create database if not exists
  db.query("CREATE DATABASE IF NOT EXISTS sistem_alamat", (err) => {
    if (err) {
      console.error("Error creating database:", err);
      return;
    }

    // Use database
    db.changeUser({ database: "sistem_alamat" }, (err) => {
      if (err) {
        console.error("Error changing database:", err);
        return;
      }

      // Create tables
      createTables();
    });
  });
});

function createTables() {
  // Create provinsi table
  const createProvinsiTable = `
    CREATE TABLE IF NOT EXISTS provinsi (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nama VARCHAR(100) NOT NULL
    )
  `;

  // Create kota table
  const createKotaTable = `
    CREATE TABLE IF NOT EXISTS kota (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nama VARCHAR(100) NOT NULL,
      provinsi_id INT,
      FOREIGN KEY (provinsi_id) REFERENCES provinsi(id) ON DELETE CASCADE
    )
  `;

  // Create alamat table
  const createAlamatTable = `
    CREATE TABLE IF NOT EXISTS alamat (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nama VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      provinsi_id INT,
      kota_id INT,
      alamat_lengkap TEXT,
      FOREIGN KEY (provinsi_id) REFERENCES provinsi(id) ON DELETE SET NULL,
      FOREIGN KEY (kota_id) REFERENCES kota(id) ON DELETE SET NULL
    )
  `;

  db.query(createProvinsiTable, (err) => {
    if (err) {
      console.error("Error creating provinsi table:", err);
      return;
    }

    db.query(createKotaTable, (err) => {
      if (err) {
        console.error("Error creating kota table:", err);
        return;
      }

      db.query(createAlamatTable, (err) => {
        if (err) {
          console.error("Error creating alamat table:", err);
          return;
        }

        console.log("Tables created successfully");
        insertSampleData();
      });
    });
  });
}

function insertSampleData() {
  // Check if provinsi table is empty
  db.query("SELECT COUNT(*) as count FROM provinsi", (err, results) => {
    if (err) {
      console.error("Error checking provinsi data:", err);
      return;
    }

    if (results[0].count === 0) {
      // Insert complete Indonesian provinces
      const provinsiData = [
        "Aceh",
        "Sumatera Utara",
        "Sumatera Barat",
        "Riau",
        "Kepulauan Riau",
        "Jambi",
        "Sumatera Selatan",
        "Kepulauan Bangka Belitung",
        "Bengkulu",
        "Lampung",
        "DKI Jakarta",
        "Jawa Barat",
        "Banten",
        "Jawa Tengah",
        "Yogyakarta",
        "Jawa Timur",
        "Bali",
        "Nusa Tenggara Barat",
        "Nusa Tenggara Timur",
        "Kalimantan Barat",
        "Kalimantan Tengah",
        "Kalimantan Selatan",
        "Kalimantan Timur",
        "Kalimantan Utara",
        "Sulawesi Utara",
        "Gorontalo",
        "Sulawesi Tengah",
        "Sulawesi Selatan",
        "Sulawesi Tenggara",
        "Sulawesi Barat",
        "Maluku",
        "Maluku Utara",
        "Papua",
        "Papua Barat",
      ];

      const provinsiValues = provinsiData.map((p) => [p]);

      db.query(
        "INSERT INTO provinsi (nama) VALUES ?",
        [provinsiValues],
        (err) => {
          if (err) {
            console.error("Error inserting provinsi data:", err);
            return;
          }

          console.log("Provinsi data inserted successfully");

          // Insert complete Indonesian cities
          setTimeout(() => {
            insertKotaData();
          }, 1000);
        }
      );
    } else {
      console.log("Provinsi data already exists");
      // Cek apakah kota sudah ada
      insertKotaData();
    }
  });
}

function insertKotaData() {
  // Check if kota table is empty
  db.query("SELECT COUNT(*) as count FROM kota", (err, results) => {
    if (err) {
      console.error("Error checking kota data:", err);
      return;
    }

    if (results[0].count === 0) {
      console.log("Starting to insert kota data...");

      const kotaData = [
        // DKI Jakarta (provinsi_id: 11)
        { nama: "Jakarta Pusat", provinsi_id: 11 },
        { nama: "Jakarta Utara", provinsi_id: 11 },
        { nama: "Jakarta Barat", provinsi_id: 11 },
        { nama: "Jakarta Selatan", provinsi_id: 11 },
        { nama: "Jakarta Timur", provinsi_id: 11 },
        { nama: "Kepulauan Seribu", provinsi_id: 11 },

        // Jawa Barat (provinsi_id: 12)
        { nama: "Bandung", provinsi_id: 12 },
        { nama: "Bogor", provinsi_id: 12 },
        { nama: "Cirebon", provinsi_id: 12 },
        { nama: "Bekasi", provinsi_id: 12 },
        { nama: "Depok", provinsi_id: 12 },
        { nama: "Sukabumi", provinsi_id: 12 },
        { nama: "Tasikmalaya", provinsi_id: 12 },
        { nama: "Banjar", provinsi_id: 12 },
        { nama: "Cimahi", provinsi_id: 12 },

        // Jawa Tengah (provinsi_id: 14)
        { nama: "Semarang", provinsi_id: 14 },
        { nama: "Surakarta", provinsi_id: 14 },
        { nama: "Magelang", provinsi_id: 14 },
        { nama: "Pekalongan", provinsi_id: 14 },
        { nama: "Tegal", provinsi_id: 14 },
        { nama: "Salatiga", provinsi_id: 14 },

        // Jawa Timur (provinsi_id: 16)
        { nama: "Surabaya", provinsi_id: 16 },
        { nama: "Malang", provinsi_id: 16 },
        { nama: "Kediri", provinsi_id: 16 },
        { nama: "Blitar", provinsi_id: 16 },
        { nama: "Mojokerto", provinsi_id: 16 },
        { nama: "Pasuruan", provinsi_id: 16 },
        { nama: "Probolinggo", provinsi_id: 16 },
        { nama: "Madiun", provinsi_id: 16 },
        { nama: "Batu", provinsi_id: 16 },

        // Aceh (provinsi_id: 1)
        { nama: "Banda Aceh", provinsi_id: 1 },
        { nama: "Sabang", provinsi_id: 1 },
        { nama: "Langsa", provinsi_id: 1 },
        { nama: "Lhokseumawe", provinsi_id: 1 },
        { nama: "Meulaboh", provinsi_id: 1 },

        // Sumatera Utara (provinsi_id: 2)
        { nama: "Medan", provinsi_id: 2 },
        { nama: "Binjai", provinsi_id: 2 },
        { nama: "Pematangsiantar", provinsi_id: 2 },
        { nama: "Tebing Tinggi", provinsi_id: 2 },
        { nama: "Padang Sidempuan", provinsi_id: 2 },

        // Sumatera Barat (provinsi_id: 3)
        { nama: "Padang", provinsi_id: 3 },
        { nama: "Solok", provinsi_id: 3 },
        { nama: "Sawahlunto", provinsi_id: 3 },
        { nama: "Padang Panjang", provinsi_id: 3 },
        { nama: "Bukittinggi", provinsi_id: 3 },

        // Riau (provinsi_id: 4)
        { nama: "Pekanbaru", provinsi_id: 4 },
        { nama: "Dumai", provinsi_id: 4 },

        // Kepulauan Riau (provinsi_id: 5)
        { nama: "Tanjung Pinang", provinsi_id: 5 },
        { nama: "Batam", provinsi_id: 5 },

        // Jambi (provinsi_id: 6)
        { nama: "Jambi", provinsi_id: 6 },
        { nama: "Sungai Penuh", provinsi_id: 6 },

        // Sumatera Selatan (provinsi_id: 7)
        { nama: "Palembang", provinsi_id: 7 },
        { nama: "Prabumulih", provinsi_id: 7 },
        { nama: "Pagar Alam", provinsi_id: 7 },

        // Kepulauan Bangka Belitung (provinsi_id: 8)
        { nama: "Pangkalpinang", provinsi_id: 8 },

        // Bengkulu (provinsi_id: 9)
        { nama: "Bengkulu", provinsi_id: 9 },

        // Lampung (provinsi_id: 10)
        { nama: "Bandar Lampung", provinsi_id: 10 },
        { nama: "Metro", provinsi_id: 10 },

        // Banten (provinsi_id: 13)
        { nama: "Serang", provinsi_id: 13 },
        { nama: "Cilegon", provinsi_id: 13 },
        { nama: "Tangerang", provinsi_id: 13 },
        { nama: "Tangerang Selatan", provinsi_id: 13 },

        // Yogyakarta (provinsi_id: 15)
        { nama: "Yogyakarta", provinsi_id: 15 },

        // Bali (provinsi_id: 17)
        { nama: "Denpasar", provinsi_id: 17 },

        // Nusa Tenggara Barat (provinsi_id: 18)
        { nama: "Mataram", provinsi_id: 18 },
        { nama: "Bima", provinsi_id: 18 },

        // Nusa Tenggara Timur (provinsi_id: 19)
        { nama: "Kupang", provinsi_id: 19 },

        // Kalimantan Barat (provinsi_id: 20)
        { nama: "Pontianak", provinsi_id: 20 },
        { nama: "Singkawang", provinsi_id: 20 },

        // Kalimantan Tengah (provinsi_id: 21)
        { nama: "Palangkaraya", provinsi_id: 21 },

        // Kalimantan Selatan (provinsi_id: 22)
        { nama: "Banjarmasin", provinsi_id: 22 },
        { nama: "Banjarbaru", provinsi_id: 22 },

        // Kalimantan Timur (provinsi_id: 23)
        { nama: "Samarinda", provinsi_id: 23 },
        { nama: "Balikpapan", provinsi_id: 23 },
        { nama: "Bontang", provinsi_id: 23 },

        // Kalimantan Utara (provinsi_id: 24)
        { nama: "Tanjung Selor", provinsi_id: 24 },
        { nama: "Tarakan", provinsi_id: 24 },

        // Sulawesi Utara (provinsi_id: 25)
        { nama: "Manado", provinsi_id: 25 },
        { nama: "Bitung", provinsi_id: 25 },
        { nama: "Tomohon", provinsi_id: 25 },

        // Gorontalo (provinsi_id: 26)
        { nama: "Gorontalo", provinsi_id: 26 },

        // Sulawesi Tengah (provinsi_id: 27)
        { nama: "Palu", provinsi_id: 27 },

        // Sulawesi Selatan (provinsi_id: 28)
        { nama: "Makassar", provinsi_id: 28 },
        { nama: "Palopo", provinsi_id: 28 },
        { nama: "Pare-pare", provinsi_id: 28 },

        // Sulawesi Tenggara (provinsi_id: 29)
        { nama: "Kendari", provinsi_id: 29 },
        { nama: "Baubau", provinsi_id: 29 },

        // Sulawesi Barat (provinsi_id: 30)
        { nama: "Mamuju", provinsi_id: 30 },

        // Maluku (provinsi_id: 31)
        { nama: "Ambon", provinsi_id: 31 },

        // Maluku Utara (provinsi_id: 32)
        { nama: "Ternate", provinsi_id: 32 },
        { nama: "Tidore", provinsi_id: 32 },

        // Papua (provinsi_id: 33)
        { nama: "Jayapura", provinsi_id: 33 },
        { nama: "Merauke", provinsi_id: 33 },

        // Papua Barat (provinsi_id: 34)
        { nama: "Manokwari", provinsi_id: 34 },
        { nama: "Sorong", provinsi_id: 34 },
      ];

      // Insert data kota secara berurutan
      let currentIndex = 0;

      function insertNextKota() {
        if (currentIndex >= kotaData.length) {
          console.log(
            "All kota data inserted successfully! Total:",
            kotaData.length,
            "records"
          );
          return;
        }

        const kota = kotaData[currentIndex];
        db.query(
          "INSERT INTO kota (nama, provinsi_id) VALUES (?, ?)",
          [kota.nama, kota.provinsi_id],
          (err, result) => {
            if (err) {
              console.error("Error inserting kota:", kota.nama, "Error:", err);
            } else {
              console.log(
                `Inserted kota: ${kota.nama} (ID: ${result.insertId}) for provinsi_id: ${kota.provinsi_id}`
              );
            }

            currentIndex++;
            setTimeout(insertNextKota, 50); // Delay kecil untuk menghindari overload
          }
        );
      }

      insertNextKota();
    } else {
      console.log("Kota data already exists:", results[0].count, "records");
    }
  });
}

// API Routes

// Get all provinsi
app.get("/api/provinsi", (req, res) => {
  db.query("SELECT * FROM provinsi ORDER BY nama", (err, results) => {
    if (err) {
      console.error("Error getting provinsi:", err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// Get kota by provinsi_id
app.get("/api/kota/:provinsiId", (req, res) => {
  const provinsiId = req.params.provinsiId;
  console.log("Requesting kota for provinsi_id:", provinsiId);

  // Validasi input
  if (!provinsiId || isNaN(provinsiId)) {
    console.log("Invalid provinsi_id:", provinsiId);
    res.status(400).json({ error: "Invalid provinsi_id" });
    return;
  }

  db.query(
    "SELECT * FROM kota WHERE provinsi_id = ? ORDER BY nama",
    [parseInt(provinsiId)],
    (err, results) => {
      if (err) {
        console.error("Error getting kota:", err);
        res.status(500).json({ error: err.message });
        return;
      }

      console.log(
        "Kota results for provinsi",
        provinsiId,
        ":",
        results.length,
        "records"
      );

      res.json(results);
    }
  );
});

// CRUD Alamat

// Get all alamat
app.get("/api/alamat", (req, res) => {
  const query = `
    SELECT a.*, p.nama as provinsi_nama, k.nama as kota_nama 
    FROM alamat a 
    LEFT JOIN provinsi p ON a.provinsi_id = p.id 
    LEFT JOIN kota k ON a.kota_id = k.id 
    ORDER BY a.id DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error getting alamat:", err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// Create alamat
app.post("/api/alamat", (req, res) => {
  const { nama, email, provinsi_id, kota_id, alamat_lengkap } = req.body;

  db.query(
    "INSERT INTO alamat (nama, email, provinsi_id, kota_id, alamat_lengkap) VALUES (?, ?, ?, ?, ?)",
    [nama, email, provinsi_id, kota_id, alamat_lengkap],
    (err, results) => {
      if (err) {
        console.error("Error creating alamat:", err);
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        id: results.insertId,
        message: "Alamat berhasil ditambahkan",
      });
    }
  );
});

// Update alamat
app.put("/api/alamat/:id", (req, res) => {
  const id = req.params.id;
  const { nama, email, provinsi_id, kota_id, alamat_lengkap } = req.body;

  db.query(
    "UPDATE alamat SET nama = ?, email = ?, provinsi_id = ?, kota_id = ?, alamat_lengkap = ? WHERE id = ?",
    [nama, email, provinsi_id, kota_id, alamat_lengkap, id],
    (err, results) => {
      if (err) {
        console.error("Error updating alamat:", err);
        res.status(500).json({ error: err.message });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ error: "Alamat tidak ditemukan" });
        return;
      }
      res.json({ message: "Alamat berhasil diupdate" });
    }
  );
});

// Delete alamat
app.delete("/api/alamat/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM alamat WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Error deleting alamat:", err);
      res.status(500).json({ error: err.message });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ error: "Alamat tidak ditemukan" });
      return;
    }
    res.json({ message: "Alamat berhasil dihapus" });
  });
});

// Debug endpoints
app.get("/api/debug/kota-count", (req, res) => {
  db.query("SELECT COUNT(*) as count FROM kota", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results[0]);
  });
});

app.get("/api/debug/all-kota", (req, res) => {
  db.query("SELECT * FROM kota ORDER BY provinsi_id, nama", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.get("/api/debug/kota-by-provinsi/:provinsiId", (req, res) => {
  const provinsiId = req.params.provinsiId;
  db.query(
    "SELECT * FROM kota WHERE provinsi_id = ? ORDER BY nama",
    [provinsiId],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(results);
    }
  );
});

app.listen(PORT, "0.0.0.0", (err) => {
  if (err) {
    console.error("Server failed to start:", err);
  } else {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  }
});

