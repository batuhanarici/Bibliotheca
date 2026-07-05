/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { BookList } from './components/BookList';
import { Book } from './types/book';
import { Library, FolderSearch } from 'lucide-react';

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isElectron, setIsElectron] = useState(true);

  // Uygulama açıldığında kitapları yükle
  const loadBooks = async () => {
    if (window.api) {
      try {
        const loadedBooks = await window.api.getAllBooks();
        setBooks(loadedBooks);
      } catch (error) {
        console.error("Kitaplar yüklenirken hata:", error);
      }
    } else {
      setIsElectron(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleScanFolder = async () => {
    if (!window.api) {
      alert("Bu özellik sadece Electron uygulamasında (Masaüstü) çalışır.");
      return;
    }

    try {
      const folderPath = await window.api.selectFolder();
      
      if (folderPath) {
        setIsScanning(true);
        await window.api.scanFolderForPdfs(folderPath);
        await loadBooks();
      }
    } catch (error) {
      console.error("Klasör taranırken hata:", error);
      alert("Klasör taranırken bir hata oluştu.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Üst Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10" style={{ WebkitAppRegion: 'drag' } as any}>
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 p-2 rounded-lg">
            <Library className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-medium tracking-tight">Bibliotheca</h1>
        </div>
        
        <button
          onClick={handleScanFolder}
          disabled={isScanning}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          style={{ WebkitAppRegion: 'no-drag' } as any}
        >
          <FolderSearch className="w-4 h-4" />
          {isScanning ? 'Taranıyor...' : 'Klasör Seç ve Tara'}
        </button>
      </header>

      {/* Web Önizleme Uyarısı */}
      {!isElectron && (
        <div className="bg-amber-50 border-b border-amber-200 p-4 text-amber-800 text-sm text-center">
          <strong>Not:</strong> Şu anda web önizlemesindesiniz. Dosya sistemi ve SQLite işlemleri için uygulamayı indirip masaüstünde çalıştırmanız gerekmektedir.
        </div>
      )}

      {/* Ana İçerik */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <BookList books={books} />
        </div>
      </main>
    </div>
  );
}
