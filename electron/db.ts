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

// Yabancı anahtar (foreign key) kısıtlamalarını etkinleştir
db.pragma('foreign_keys = ON');

// Şema oluşturma ve migrasyon
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

  // Basit migrasyon kontrolü (books tablosu için eksik sütunları ekle)
  const columnsInfo = db.prepare("PRAGMA table_info(books)").all() as { name: string }[];
  const columns = columnsInfo.map(col => col.name);

  if (!columns.includes('category')) {
    db.exec(`ALTER TABLE books ADD COLUMN category TEXT DEFAULT NULL`);
  }
  if (!columns.includes('author')) {
    db.exec(`ALTER TABLE books ADD COLUMN author TEXT DEFAULT NULL`);
  }

  // Yeni tabloları oluştur
  db.exec(`
    CREATE TABLE IF NOT EXISTS shelves (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS book_shelves (
      book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
      shelf_id INTEGER NOT NULL REFERENCES shelves(id) ON DELETE CASCADE,
      PRIMARY KEY (book_id, shelf_id)
    );
  `);
}

export default db;
