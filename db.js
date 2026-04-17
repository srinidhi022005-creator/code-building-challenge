const sqlite3 = require("sqlite3").verbose();

// Create / connect database
const db = new sqlite3.Database("database.db", (err) => {
  if (err) {
    console.error("Error connecting to database", err);
  } else {
    console.log("Connected to SQLite database");
  }
});

// Create tables
db.serialize(() => {
  // Submissions table (for later)
  db.run(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      code TEXT,
      score INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Users table (for signup/login)
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      password TEXT
    )
  `);

});

module.exports = db;