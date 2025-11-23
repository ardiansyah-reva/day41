// backend/sync.js

const sequelize = require("./db");
require("./models"); // memuat SEMUA model & relasi dari models/index.js

async function syncDatabase() {
  try {
    console.log("Syncing database...");

    await sequelize.sync({ alter: true });
    // alter: true = update tabel tanpa menghapus data
    // force: true = DROP ALL TABLES lalu buat baru (HATI-HATI)

    console.log("Database synchronized with all tables & relations!");
    process.exit();
  } catch (error) {
    console.error("Failed to sync database:", error);
    process.exit(1);
  }
}

syncDatabase();