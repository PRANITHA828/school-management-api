const Database = require("better-sqlite3");

const db = new Database("schools.db");

// Create table
db.prepare(`
  CREATE TABLE IF NOT EXISTS schools (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    address TEXT,
    latitude REAL,
    longitude REAL
  )
`).run();

module.exports = db;