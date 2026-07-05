/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useCallback } from 'react';
import { BookList } from './components/BookList';
import { PdfViewer } from './components/PdfViewer';
import { Sidebar, FilterType } from './components/Sidebar';
import { SearchBar } from './components/SearchBar';
import { BookEditModal } from './components/BookEditModal';
import { FullTextSearchModal } from './components/FullTextSearchModal';
import { StatsModal } from './components/StatsModal';
import { Book, Shelf } from './types/book';
import { Library, FolderSearch } from 'lucide-react';

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  
  const [isScanning, setIsScanning] = useState(false);
  const [isElectron, setIsElectron] = useState(true);
  
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  
  // Phase 3 states
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editingBookShelves, setEditingBookShelves] = useState<Shelf[]>([]);
  
  // Phase 4 states
  const [isFtsModalOpen, setIsFtsModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [initialPdfPage, setInitialPdfPage] = useState<number | undefined>(undefined);

  // Verileri yükle
  const loadData = useCallback(async () => {
    if (!window.api) {
      setIsElectron(false);
      return;
    }

    try {
      let loadedBooks: Book[] = [];
      
      if (searchQuery.trim()) {
        loadedBooks = await window.api.searchBooks(searchQuery.trim());
      } else {
        if (activeFilter === 'all') {
          loadedBooks = await window.api.getAllBooks();
        } else if (activeFilter === 'favorites') {
          loadedBooks = await window.api.getFavoriteBooks();
        } else if (typeof activeFilter === 'object') {
          if (activeFilter.type === 'shelf') {
            loadedBooks = await window.api.getBooksByShelf(activeFilter.id);
          } else if (activeFilter.type === 'category') {
            loadedBooks = await window.api.getBooksByCategory(activeFilter.name);
          }
        }
      }

      setBooks(loadedBooks);

      // Ayrıca rafları ve kategorileri yenile (arama/filtre bağımsız)
      const loadedShelves = await window.api.getAllShelves();
      setShelves(loadedShelves);
      
      const loadedCategories = await window.api.getAllCategories();
      setCategories(loadedCategories);
    } catch (error) {
      console.error("Veriler yüklenirken hata:", error);
    }
  }, [activeFilter, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
        await loadData();
      }
    } catch (error) {
      console.error("Klasör taranırken hata:", error);
      alert("Klasör taranırken bir hata oluştu.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleToggleFavorite = async (bookId: number) => {
    if (window.api) {
      await window.api.toggleFavorite(bookId);
      await loadData();
    }
  };

  const handleCreateShelf = async (name: string) => {
    if (window.api) {
      await window.api.createShelf(name);
      await loadData();
    }
  };

  const handleDeleteShelf = async (id: number) => {
    if (window.api) {
      await window.api.deleteShelf(id);
      if (typeof activeFilter === 'object' && activeFilter.type === 'shelf' && activeFilter.id === id) {
        setActiveFilter('all');
      } else {
        await loadData();
      }
    }
  };

  const handleEditBook = async (book: Book) => {
    if (window.api) {
      const shelves = await window.api.getBookShelves(book.id);
      setEditingBookShelves(shelves);
      setEditingBook(book);
    }
  };

  const handleSaveBookMetadata = async (
    metadata: { category: string | null; author: string | null }, 
    assignedShelves: number[], 
    unassignedShelves: number[]
  ) => {
    if (!window.api || !editingBook) return;

    await window.api.updateBookMetadata(editingBook.id, metadata);

    for (const shelfId of assignedShelves) {
      await window.api.assignBookToShelf(editingBook.id, shelfId);
    }
    for (const shelfId of unassignedShelves) {
      await window.api.removeBookFromShelf(editingBook.id, shelfId);
    }

    setEditingBook(null);
    await loadData();
  };

  if (selectedBook) {
    return (
      <PdfViewer 
        bookId={selectedBook.id} 
        title={selectedBook.title} 
        initialPage={initialPdfPage}
        onBack={async () => {
          setSelectedBook(null);
          setInitialPdfPage(undefined);
          await loadData(); // Kitabın son sayfasını vs. yenilemek için
        }} 
      />
    );
  }

  const isMac = navigator.userAgent.includes('Mac');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 h-screen overflow-hidden">
      {/* Üst Bar */}
      <header className={`bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10 shrink-0 ${!isMac ? 'pr-[140px]' : ''}`} style={{ WebkitAppRegion: 'drag' } as any}>
        <div className="flex items-center gap-3 w-64 shrink-0">
          <div className="bg-slate-900 p-1.5 rounded-lg">
            <Library className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-medium tracking-tight">Bibliotheca</h1>
        </div>
        
        <div className="flex-1 max-w-xl mx-4 flex justify-center" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <SearchBar onSearch={setSearchQuery} />
        </div>

        <div className="shrink-0" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <button
            onClick={handleScanFolder}
            disabled={isScanning}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <FolderSearch className="w-4 h-4" />
            {isScanning ? 'Taranıyor...' : 'Klasör Seç ve Tara'}
          </button>
        </div>
      </header>

      {/* Web Önizleme Uyarısı */}
      {!isElectron && (
        <div className="bg-amber-50 border-b border-amber-200 p-2 text-amber-800 text-sm text-center shrink-0">
          <strong>Not:</strong> Şu anda web önizlemesindesiniz. Dosya sistemi ve SQLite işlemleri için uygulamayı indirip masaüstünde çalıştırmanız gerekmektedir.
        </div>
      )}

      {/* Ana İçerik */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          shelves={shelves} 
          categories={categories} 
          activeFilter={activeFilter} 
          onSelectFilter={setActiveFilter}
          onCreateShelf={handleCreateShelf}
          onDeleteShelf={handleDeleteShelf}
          onOpenStats={() => setIsStatsModalOpen(true)}
          onOpenFts={() => setIsFtsModalOpen(true)}
        />

        {/* Kitap Grid */}
        <main className={`flex-1 overflow-y-auto ${searchQuery ? 'bg-slate-100' : 'bg-transparent'}`}>
          <div className="max-w-7xl mx-auto">
            <BookList 
              books={books} 
              onBookClick={(book) => {
                setInitialPdfPage(undefined);
                setSelectedBook(book);
              }}
              onEditBook={handleEditBook}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        </main>
      </div>

      {editingBook && (
        <BookEditModal 
          book={editingBook}
          allShelves={shelves}
          allCategories={categories}
          bookShelves={editingBookShelves}
          onClose={() => setEditingBook(null)}
          onSave={handleSaveBookMetadata}
        />
      )}

      {isFtsModalOpen && (
        <FullTextSearchModal
          onClose={() => setIsFtsModalOpen(false)}
          onSelectResult={async (bookId, pageNumber) => {
            setIsFtsModalOpen(false);
            let bookToOpen = books.find(b => b.id === bookId);
            if (!bookToOpen && window.api) {
              bookToOpen = await window.api.getBookById(bookId);
            }
            if (bookToOpen) {
              setInitialPdfPage(pageNumber);
              setSelectedBook(bookToOpen);
            }
          }}
        />
      )}

      {isStatsModalOpen && (
        <StatsModal onClose={() => setIsStatsModalOpen(false)} />
      )}
    </div>
  );
}
