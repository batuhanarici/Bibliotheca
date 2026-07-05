import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { ViewerToolbar } from './ViewerToolbar';
import { OutlinePanel } from './OutlinePanel';
import { BookmarksPanel } from './BookmarksPanel';
import { NotesPanel } from './NotesPanel';
import { Bookmark, Note } from '../types/book';
import { List, Bookmark as BookmarkIcon, FileText } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

type PanelType = 'none' | 'outline' | 'bookmarks' | 'notes';

interface PdfViewerProps {
  bookId: number;
  title: string;
  initialPage?: number;
  onBack: () => void;
}

export function PdfViewer({ bookId, title, initialPage, onBack }: PdfViewerProps) {
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage || 1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activePanel, setActivePanel] = useState<PanelType>('none');
  const [outline, setOutline] = useState<any[] | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce saving last page
  const saveTimeoutRef = useRef<number | null>(null);

  const extractAndSaveCover = async (doc: pdfjsLib.PDFDocumentProxy, id: number) => {
    try {
      const page = await doc.getPage(1);
      const viewport = page.getViewport({ scale: 1.0 });
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: ctx, viewport } as any).promise;
      const dataUrl = canvas.toDataURL('image/png');
      await window.api.saveCoverImage(id, dataUrl);
    } catch (err) {
      console.error("Kapak çıkarılamadı:", err);
    }
  };

  const indexPdfDocument = async (doc: pdfjsLib.PDFDocumentProxy, id: number) => {
    try {
      // Chunking for non-blocking
      const total = doc.numPages;
      const pagesText = [];
      for (let i = 1; i <= total; i++) {
        const page = await doc.getPage(i);
        const textContent = await page.getTextContent();
        const text = textContent.items.map((item: any) => item.str).join(' ');
        pagesText.push({ pageNumber: i, content: text });
        
        // Every 50 pages, yield to main thread so UI doesn't freeze
        if (i % 50 === 0) {
           await new Promise(r => setTimeout(r, 10));
        }
      }
      
      await window.api.saveBookText(id, pagesText);
      console.log(`Kitap ${id} indekslendi.`);
    } catch (err) {
      console.error("PDF indekslenemedi:", err);
    }
  };

  const saveLastPage = useCallback((page: number) => {
    if (saveTimeoutRef.current !== null) {
      window.clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = window.setTimeout(() => {
      window.api?.updateLastPage(bookId, page).catch(console.error);
    }, 500);
  }, [bookId]);

  // Handlers for Bookmarks
  const handleAddBookmark = async (label: string) => {
    if (!window.api) return;
    const newBookmark = await window.api.addBookmark(bookId, currentPage, label);
    setBookmarks(prev => [...prev, newBookmark]);
  };
  
  const handleDeleteBookmark = async (id: number) => {
    if (!window.api) return;
    await window.api.deleteBookmark(id);
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  // Handlers for Notes
  const handleAddNote = async (content: string) => {
    if (!window.api) return;
    const newNote = await window.api.addNote(bookId, currentPage, content);
    setNotes(prev => [...prev, newNote]);
  };
  
  const handleUpdateNote = async (id: number, content: string) => {
    if (!window.api) return;
    await window.api.updateNote(id, content);
    setNotes(prev => prev.map(n => n.id === id ? { ...n, content } : n));
  };
  
  const handleDeleteNote = async (id: number) => {
    if (!window.api) return;
    await window.api.deleteNote(id);
    setNotes(prev => prev.filter(n => n.id !== id));
  };
  
  const handleNavigateOutline = async (dest: any) => {
    if (!pdfDoc) return;
    try {
      let destArray = dest;
      if (typeof dest === 'string') {
        destArray = await pdfDoc.getDestination(dest);
      }
      if (Array.isArray(destArray) && destArray.length > 0) {
        const pageRef = destArray[0];
        // pageRef is an object with {num, gen} or a number
        let pageNumber = -1;
        if (typeof pageRef === 'object' && pageRef !== null) {
          pageNumber = await pdfDoc.getPageIndex(pageRef) + 1; // getPageIndex returns 0-based
        } else if (typeof pageRef === 'number') {
          pageNumber = await pdfDoc.getPageIndex({ num: pageRef, gen: 0 }) + 1;
        }
        
        if (pageNumber > 0) {
          setCurrentPage(pageNumber);
        }
      }
    } catch (e) {
      console.error('Outline navigasyon hatası', e);
    }
  };

  // Load the PDF Document
  useEffect(() => {
    let isMounted = true;
    
    const loadPdf = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!window.api) throw new Error("API bulunamadı");
        
        // 1. Get file path
        const { filePath } = await window.api.getBookFile(bookId);
        
        // 2. Load file data via IPC to avoid browser local file restrictions
        const fileData = await window.api.readFile(filePath);
        
        // 3. Load with pdf.js
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(fileData) });
        const doc = await loadingTask.promise;
        
        if (!isMounted) return;
        
        setPdfDoc(doc);
        setTotalPages(doc.numPages);
        
        const books = await window.api.getAllBooks();
        const thisBook = books.find(b => b.id === bookId);
        
        if (initialPage) {
          setCurrentPage(initialPage);
        } else if (thisBook && thisBook.last_page && thisBook.last_page > 0) {
          setCurrentPage(thisBook.last_page);
        }
        
        if (thisBook) {
           // Phase 4: Cover extraction
           if (!thisBook.cover_image) {
             extractAndSaveCover(doc, bookId);
           }
           
           // Phase 4: Full text indexing
           if (!thisBook.is_indexed) {
             indexPdfDocument(doc, bookId);
           }
        }
        
        // Phase 4: Load Outline, Bookmarks, Notes
        try {
          const outlineData = await doc.getOutline();
          setOutline(outlineData);
        } catch (e) { console.error(e); }
        
        try {
          setBookmarks(await window.api.getBookmarks(bookId));
          setNotes(await window.api.getNotes(bookId));
        } catch(e) { console.error(e); }
        
      } catch (err) {
        console.error("PDF Yükleme hatası:", err);
        if (isMounted) setError("PDF yüklenirken bir hata oluştu.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadPdf();

    return () => {
      isMounted = false;
      if (pdfDoc) {
        pdfDoc.destroy();
      }
      if (saveTimeoutRef.current !== null) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [bookId]);

  // Render the current page
  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current || !containerRef.current) return;

    // Cancel previous render task if exists
    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
      renderTaskRef.current = null;
    }

    try {
      const page = await pdfDoc.getPage(currentPage);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Base scale: fit to container width if zoomLevel is 1.0, minus some padding
      const unscaledViewport = page.getViewport({ scale: 1.0 });
      const containerWidth = containerRef.current.clientWidth - 64; // 64px padding (p-8 = 32px each side)
      const baseScale = Math.min(1.5, containerWidth / unscaledViewport.width); // Cap base scale
      const effectiveScale = baseScale * zoomLevel;

      const viewport = page.getViewport({ scale: effectiveScale });
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
      } as any;

      const renderTask = page.render(renderContext);
      renderTaskRef.current = renderTask;
      
      await renderTask.promise;
      renderTaskRef.current = null;
    } catch (err: any) {
      if (err?.name === 'RenderingCancelledException') {
        // Ignored
      } else {
        console.error("Render hatası:", err);
      }
    }
  }, [pdfDoc, currentPage, zoomLevel]);

  // Handle window resize with debounce
  useEffect(() => {
    let resizeTimer: number;
    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        renderPage();
      }, 300);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [renderPage]);

  // Trigger render when deps change
  useEffect(() => {
    renderPage();
  }, [renderPage]);

  // Notify DB of page change
  useEffect(() => {
    if (pdfDoc) {
      saveLastPage(currentPage);
    }
  }, [currentPage, pdfDoc, saveLastPage]);

  // Responsive canvas resizing (simple debounce logic if needed, but zoom level handles manual zoom)
  // We can add a ResizeObserver if we want "fit to width" logic.

  return (
    <div className="flex flex-col h-screen bg-slate-100 font-sans text-slate-900">
      <ViewerToolbar
        title={title}
        currentPage={currentPage}
        totalPages={totalPages}
        zoomLevel={zoomLevel}
        onBack={onBack}
        onPrevPage={() => setCurrentPage(p => Math.max(1, p - 1))}
        onNextPage={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        onPageChange={(p) => setCurrentPage(p)}
        onZoomIn={() => setZoomLevel(z => Math.min(3.0, z + 0.25))}
        onZoomOut={() => setZoomLevel(z => Math.max(0.5, z - 0.25))}
      />

      <div className="flex flex-1 overflow-hidden">
        <div 
          ref={containerRef}
          className="flex-1 overflow-auto flex justify-center p-8 bg-slate-200 relative"
        >
          {loading ? (
            <div className="flex items-center justify-center text-slate-500 h-full">
              Yükleniyor...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center text-red-500 h-full">
              {error}
            </div>
          ) : (
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="shadow-xl bg-white max-w-full h-auto"
                style={{ display: 'block' }} // removes inline bottom space
              />
              {/* Note indicator on canvas area could be added here if desired */}
            </div>
          )}

          {/* Panel Toggles floating on right side */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 bg-white p-1 rounded-lg shadow-sm border border-slate-200">
            <button 
              onClick={() => setActivePanel(p => p === 'outline' ? 'none' : 'outline')}
              className={`p-2 rounded ${activePanel === 'outline' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              title="İçindekiler"
            >
              <List className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setActivePanel(p => p === 'bookmarks' ? 'none' : 'bookmarks')}
              className={`p-2 rounded ${activePanel === 'bookmarks' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              title="Yer İmleri"
            >
              <BookmarkIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setActivePanel(p => p === 'notes' ? 'none' : 'notes')}
              className={`p-2 rounded ${activePanel === 'notes' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              title="Notlar"
            >
              <FileText className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Sidebar Panels */}
        {activePanel === 'outline' && (
          <div className="w-80 shrink-0 border-l border-slate-200 bg-white flex flex-col h-full">
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-medium text-slate-800 flex items-center gap-2">
                <List className="w-4 h-4" />
                İçindekiler
              </h3>
            </div>
            <div className="flex-1 overflow-hidden">
              <OutlinePanel outline={outline} onNavigate={handleNavigateOutline} />
            </div>
          </div>
        )}

        {activePanel === 'bookmarks' && (
          <BookmarksPanel 
            bookmarks={bookmarks}
            currentPage={currentPage}
            onAddBookmark={handleAddBookmark}
            onDeleteBookmark={handleDeleteBookmark}
            onNavigate={setCurrentPage}
          />
        )}

        {activePanel === 'notes' && (
          <NotesPanel 
            notes={notes}
            currentPage={currentPage}
            onAddNote={handleAddNote}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
            onNavigate={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
