const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = 3003;

app.use(cors());
app.use(express.json());

// Koneksi ke MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "alamat_user", // sesuaikan
  password: "passwordku", // sesuaikan
  database: "sistem_alamat", // sesuaikan
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Endpoint GET provinsi
app.get("/api/provinsi", (req, res) => {
  db.query("SELECT * FROM provinsi", (err, results) => {
    if (err) {
      console.error("Error fetching provinsi:", err);
      return res.status(500).json({ error: "Error fetching provinsi" });
    }
    res.json(results);
  });
});

// Endpoint GET kota berdasarkan provinsi_id
app.get("/api/kota/:provinsi_id", (req, res) => {
  const provinsiId = req.params.provinsi_id;
  db.query(
    "SELECT * FROM kota WHERE provinsi_id = ?",
    [provinsiId],
    (err, results) => {
      if (err) {
        console.error("Error fetching kota:", err);
        return res.status(500).json({ error: "Error fetching kota" });
      }
      res.json(results);
    }
  );
});

// Endpoint GET alamat
app.get("/api/alamat", (req, res) => {
  db.query(
    "SELECT a.id, a.jalan, k.nama AS kota, p.nama AS provinsi " +
      "FROM alamat a " +
      "JOIN kota k ON a.kota_id = k.id " +
      "JOIN provinsi p ON k.provinsi_id = p.id",
    (err, results) => {
      if (err) {
        console.error("Error fetching alamat:", err);
        return res.status(500).json({ error: "Error fetching alamat" });
      }
      res.json(results);
    }
  );
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
