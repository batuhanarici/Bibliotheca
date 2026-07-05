import { ipcMain, dialog } from 'electron';
import fs from 'fs';
import path from 'path';
import db from './db';
import { Book, Shelf } from '../src/types/book';

export function setupIpcHandlers() {
  // Klasör seçme işlevi
  ipcMain.handle('dialog:selectFolder', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      title: 'PDF Klasörünü Seçin',
    });
    
    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }
    
    return result.filePaths[0];
  });

  // Klasör tarama ve veritabanına ekleme
  ipcMain.handle('db:scanFolderForPdfs', async (_, folderPath: string) => {
    const findPdfs = (dir: string, fileList: string[] = []) => {
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
          findPdfs(filePath, fileList);
        } else if (file.toLowerCase().endsWith('.pdf')) {
          fileList.push(filePath);
        }
      }
      return fileList;
    };

    const pdfFiles = findPdfs(folderPath);
    
    // İşlem için transaction kullanmak hız kazandırır
    const insertMany = db.transaction((files: string[]) => {
      const stmt = db.prepare(`
        INSERT OR IGNORE INTO books (title, file_path, added_at)
        VALUES (?, ?, ?)
      `);
      
      for (const filePath of files) {
        const title = path.basename(filePath, '.pdf');
        const addedAt = new Date().toISOString();
        stmt.run(title, filePath, addedAt);
      }
    });

    insertMany(pdfFiles);
  });

  // Tüm kitapları getirme
  ipcMain.handle('db:getAllBooks', async () => {
    const stmt = db.prepare('SELECT * FROM books ORDER BY added_at DESC');
    return stmt.all() as Book[];
  });

  // Bir kitabın dosya yolunu getirme
  ipcMain.handle('db:getBookFile', async (_, bookId: number) => {
    const stmt = db.prepare('SELECT file_path FROM books WHERE id = ?');
    const row = stmt.get(bookId) as { file_path: string } | undefined;
    if (!row) {
      throw new Error('Kitap bulunamadı');
    }
    return { filePath: row.file_path };
  });

  // Kaldığın sayfayı güncelleme
  ipcMain.handle('db:updateLastPage', async (_, bookId: number, page: number) => {
    const stmt = db.prepare('UPDATE books SET last_page = ? WHERE id = ?');
    stmt.run(page, bookId);
  });

  // Dosya içeriğini ArrayBuffer olarak okuma (Renderer'ın güvenli okuması için)
  ipcMain.handle('fs:readFile', async (_, filePath: string) => {
    const buffer = fs.readFileSync(filePath);
    return buffer;
  });

  // Kitap meta verilerini güncelleme (Kategori, Yazar vb.)
  ipcMain.handle('db:updateBookMetadata', async (_, bookId: number, metadata: { category?: string | null; author?: string | null }) => {
    const updates: string[] = [];
    const values: any[] = [];

    if (metadata.category !== undefined) {
      updates.push('category = ?');
      values.push(metadata.category);
    }
    if (metadata.author !== undefined) {
      updates.push('author = ?');
      values.push(metadata.author);
    }

    if (updates.length > 0) {
      values.push(bookId);
      const query = `UPDATE books SET ${updates.join(', ')} WHERE id = ?`;
      const stmt = db.prepare(query);
      stmt.run(...values);
    }
  });

  // Favori durumunu değiştirme
  ipcMain.handle('db:toggleFavorite', async (_, bookId: number) => {
    const getStmt = db.prepare('SELECT is_favorite FROM books WHERE id = ?');
    const book = getStmt.get(bookId) as { is_favorite: number } | undefined;
    
    if (book) {
      const newStatus = book.is_favorite === 1 ? 0 : 1;
      const setStmt = db.prepare('UPDATE books SET is_favorite = ? WHERE id = ?');
      setStmt.run(newStatus, bookId);
    }
  });

  // Raf işlemleri
  ipcMain.handle('db:createShelf', async (_, name: string) => {
    const stmt = db.prepare('INSERT INTO shelves (name, created_at) VALUES (?, ?)');
    const result = stmt.run(name, new Date().toISOString());
    const newShelfStmt = db.prepare('SELECT * FROM shelves WHERE id = ?');
    return newShelfStmt.get(result.lastInsertRowid) as Shelf;
  });

  ipcMain.handle('db:deleteShelf', async (_, shelfId: number) => {
    const stmt = db.prepare('DELETE FROM shelves WHERE id = ?');
    stmt.run(shelfId);
  });

  ipcMain.handle('db:getAllShelves', async () => {
    const stmt = db.prepare('SELECT * FROM shelves ORDER BY name ASC');
    return stmt.all() as Shelf[];
  });

  // Kitap - Raf ilişkileri
  ipcMain.handle('db:assignBookToShelf', async (_, bookId: number, shelfId: number) => {
    const stmt = db.prepare('INSERT OR IGNORE INTO book_shelves (book_id, shelf_id) VALUES (?, ?)');
    stmt.run(bookId, shelfId);
  });

  ipcMain.handle('db:removeBookFromShelf', async (_, bookId: number, shelfId: number) => {
    const stmt = db.prepare('DELETE FROM book_shelves WHERE book_id = ? AND shelf_id = ?');
    stmt.run(bookId, shelfId);
  });

  // Bir kitabın raflarını getirme
  ipcMain.handle('db:getBookShelves', async (_, bookId: number) => {
    const stmt = db.prepare(`
      SELECT s.* FROM shelves s
      JOIN book_shelves bs ON s.id = bs.shelf_id
      WHERE bs.book_id = ?
    `);
    return stmt.all(bookId) as Shelf[];
  });

  // Filtreleme
  ipcMain.handle('db:getBooksByShelf', async (_, shelfId: number) => {
    const stmt = db.prepare(`
      SELECT b.* FROM books b
      JOIN book_shelves bs ON b.id = bs.book_id
      WHERE bs.shelf_id = ?
      ORDER BY b.added_at DESC
    `);
    return stmt.all(shelfId) as Book[];
  });

  ipcMain.handle('db:getBooksByCategory', async (_, category: string) => {
    const stmt = db.prepare('SELECT * FROM books WHERE category = ? ORDER BY added_at DESC');
    return stmt.all(category) as Book[];
  });

  ipcMain.handle('db:getFavoriteBooks', async () => {
    const stmt = db.prepare('SELECT * FROM books WHERE is_favorite = 1 ORDER BY added_at DESC');
    return stmt.all() as Book[];
  });

  // Arama
  ipcMain.handle('db:searchBooks', async (_, query: string) => {
    const stmt = db.prepare(`
      SELECT * FROM books 
      WHERE title LIKE ? OR author LIKE ? COLLATE NOCASE 
      ORDER BY added_at DESC
    `);
    const searchString = `%${query}%`;
    return stmt.all(searchString, searchString) as Book[];
  });

  // Kategorileri getirme
  ipcMain.handle('db:getAllCategories', async () => {
    const stmt = db.prepare('SELECT DISTINCT category FROM books WHERE category IS NOT NULL AND category != "" ORDER BY category ASC');
    const rows = stmt.all() as { category: string }[];
    return rows.map(r => r.category);
  });
}
