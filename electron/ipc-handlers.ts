import { ipcMain, dialog } from 'electron';
import fs from 'fs';
import path from 'path';
import db from './db';
import { Book } from '../src/types/book';

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
}
