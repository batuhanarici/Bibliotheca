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
      WHERE title LIKE ? COLLATE NOCASE OR author LIKE ? COLLATE NOCASE 
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

  // Phase 4: Kapak görseli kaydetme
  ipcMain.handle('fs:saveCoverImage', async (_, bookId: number, base64Data: string) => {
    // Base64 string'i buffer'a çevir (data:image/png;base64,... kısmını atla)
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Geçersiz base64 verisi');
    }
    const buffer = Buffer.from(matches[2], 'base64');
    
    // covers klasörüne import edilen coversDir kullanılamayacağı için doğrudan path hesaplayalım
    // veya db.ts'den export ettiğimiz coversDir'i içe aktaralım. Üstte db.ts import edildi zaten.
    const { coversDir } = require('./db');
    const fileName = `cover_${bookId}_${Date.now()}.png`;
    const filePath = path.join(coversDir, fileName);
    
    fs.writeFileSync(filePath, buffer);
    
    // DB güncelle
    const stmt = db.prepare('UPDATE books SET cover_image = ? WHERE id = ?');
    stmt.run(filePath, bookId);
    
    return filePath;
  });

  // Phase 4: FTS5 Indexing
  ipcMain.handle('db:saveBookText', async (_, bookId: number, pagesText: { pageNumber: number; content: string }[]) => {
    const insertMany = db.transaction((pages: { pageNumber: number; content: string }[]) => {
      const stmt = db.prepare('INSERT INTO book_text (book_id, page_number, content) VALUES (?, ?, ?)');
      for (const p of pages) {
        if (p.content && p.content.trim().length > 0) {
          stmt.run(bookId, p.pageNumber, p.content);
        }
      }
      
      const updateStmt = db.prepare('UPDATE books SET is_indexed = 1 WHERE id = ?');
      updateStmt.run(bookId);
    });

    insertMany(pagesText);
  });

  // Phase 4: FTS5 Arama
  ipcMain.handle('db:fullTextSearch', async (_, query: string) => {
    // FTS5'te güvenli arama için çift tırnak içine alıyoruz veya sadece basic match
    // SNIPPET fonksiyonu (tablo_adı, kolon_index, açılış_tag, kapanış_tag, etrafındaki_kelime_sayısı, max_token_sayısı)
    // kolon index 2 = content
    const stmt = db.prepare(`
      SELECT 
        bt.book_id, 
        bt.page_number, 
        b.title, 
        SNIPPET(book_text, 2, '<b>', '</b>', '...', 15) as snippet
      FROM book_text bt
      JOIN books b ON b.id = bt.book_id
      WHERE book_text MATCH ?
      ORDER BY rank
      LIMIT 100
    `);
    
    // Basit MATCH syntax'ı, aranan kelimeye yıldız ekleyebiliriz (örn: "query*")
    // Güvenlik için SQLite stringi düzgün escape etmeli.
    try {
      // FTS5 query string
      const ftsQuery = `"${query}"*`;
      return stmt.all(ftsQuery) as any[];
    } catch (e) {
      console.error("FTS Arama hatası:", e);
      return [];
    }
  });

  // Phase 4: Yer İmleri (Bookmarks)
  ipcMain.handle('db:addBookmark', async (_, bookId: number, pageNumber: number, label?: string) => {
    const stmt = db.prepare('INSERT INTO bookmarks (book_id, page_number, label, created_at) VALUES (?, ?, ?, ?)');
    const result = stmt.run(bookId, pageNumber, label || null, new Date().toISOString());
    return {
      id: result.lastInsertRowid,
      book_id: bookId,
      page_number: pageNumber,
      label: label || null,
      created_at: new Date().toISOString()
    };
  });

  ipcMain.handle('db:getBookmarks', async (_, bookId: number) => {
    const stmt = db.prepare('SELECT * FROM bookmarks WHERE book_id = ? ORDER BY page_number ASC');
    return stmt.all(bookId) as any[];
  });

  ipcMain.handle('db:deleteBookmark', async (_, bookmarkId: number) => {
    const stmt = db.prepare('DELETE FROM bookmarks WHERE id = ?');
    stmt.run(bookmarkId);
  });

  // Phase 4: Notlar (Notes)
  ipcMain.handle('db:addNote', async (_, bookId: number, pageNumber: number, content: string) => {
    const now = new Date().toISOString();
    const stmt = db.prepare('INSERT INTO notes (book_id, page_number, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)');
    const result = stmt.run(bookId, pageNumber, content, now, now);
    return {
      id: result.lastInsertRowid,
      book_id: bookId,
      page_number: pageNumber,
      content,
      created_at: now,
      updated_at: now
    };
  });

  ipcMain.handle('db:getNotes', async (_, bookId: number) => {
    const stmt = db.prepare('SELECT * FROM notes WHERE book_id = ? ORDER BY page_number ASC');
    return stmt.all(bookId) as any[];
  });

  ipcMain.handle('db:updateNote', async (_, noteId: number, content: string) => {
    const stmt = db.prepare('UPDATE notes SET content = ?, updated_at = ? WHERE id = ?');
    stmt.run(content, new Date().toISOString(), noteId);
  });

  ipcMain.handle('db:deleteNote', async (_, noteId: number) => {
    const stmt = db.prepare('DELETE FROM notes WHERE id = ?');
    stmt.run(noteId);
  });

  // Phase 4: İstatistikler
  ipcMain.handle('db:getLibraryStats', async () => {
    const totalBooksStmt = db.prepare('SELECT COUNT(*) as count FROM books');
    const totalFavoritesStmt = db.prepare('SELECT COUNT(*) as count FROM books WHERE is_favorite = 1');
    const totalPagesReadStmt = db.prepare('SELECT SUM(last_page) as sum FROM books');
    const totalBookmarksStmt = db.prepare('SELECT COUNT(*) as count FROM bookmarks');
    const totalNotesStmt = db.prepare('SELECT COUNT(*) as count FROM notes');

    return {
      totalBooks: (totalBooksStmt.get() as any).count || 0,
      totalFavorites: (totalFavoritesStmt.get() as any).count || 0,
      totalPagesRead: (totalPagesReadStmt.get() as any).sum || 0,
      totalBookmarks: (totalBookmarksStmt.get() as any).count || 0,
      totalNotes: (totalNotesStmt.get() as any).count || 0,
    };
  });
}
