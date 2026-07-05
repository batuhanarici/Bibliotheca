import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { ViewerToolbar } from './ViewerToolbar';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface PdfViewerProps {
  bookId: number;
  title: string;
  onBack: () => void;
}

export function PdfViewer({ bookId, title, onBack }: PdfViewerProps) {
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce saving last page
  const saveTimeoutRef = useRef<number | null>(null);

  const saveLastPage = useCallback((page: number) => {
    if (saveTimeoutRef.current !== null) {
      window.clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = window.setTimeout(() => {
      window.api?.updateLastPage(bookId, page).catch(console.error);
    }, 500);
  }, [bookId]);

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
        
        // Load initial page (try to get last_page from books array logic, or we just rely on last_page property of book. Wait, book object has last_page, we should pass it or load it!)
        // Wait, the easiest is to just query all books again or pass the book object entirely to PdfViewer! Let's assume we pass the initial page.
        // Actually, let's fetch it from the DB here or let the parent pass it. For now let's just render page 1 and then update it, or we can fetch the book again. 
        // We will fetch the book directly:
        const books = await window.api.getAllBooks();
        const thisBook = books.find(b => b.id === bookId);
        if (thisBook && thisBook.last_page && thisBook.last_page > 0) {
           setCurrentPage(thisBook.last_page);
        }
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
      };

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

      <div 
        ref={containerRef}
        className="flex-1 overflow-auto flex justify-center p-8 bg-slate-200"
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
          <canvas
            ref={canvasRef}
            className="shadow-xl bg-white max-w-full h-auto"
            style={{ display: 'block' }} // removes inline bottom space
          />
        )}
      </div>
    </div>
  );
}
