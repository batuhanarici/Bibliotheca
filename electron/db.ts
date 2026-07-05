import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { app } from 'electron';

// Veritabanı dosyasının kaydedileceği yeri belirle (kullanıcının appData klasörü)
const userDataPath = app.getPath('userData');
const dbDir = path.join(userDataPath, 'database');

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'bibliotheca.db');

// Veritabanı bağlantısı
const db = new Database(dbPath);

// Şema oluşturma (Faz 1)
export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      file_path TEXT NOT NULL UNIQUE,
      added_at TEXT NOT NULL,
      last_page INTEGER DEFAULT 0,
      is_favorite INTEGER DEFAULT 0
    )
  `);
}

export default db;
