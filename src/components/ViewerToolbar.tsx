import React from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Printer } from 'lucide-react';

interface ViewerToolbarProps {
  title: string;
  currentPage: number;
  totalPages: number;
  zoomLevel: number;
  onBack: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onPageChange: (page: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onPrint: () => void;
}

export function ViewerToolbar({
  title,
  currentPage,
  totalPages,
  zoomLevel,
  onBack,
  onPrevPage,
  onNextPage,
  onPageChange,
  onZoomIn,
  onZoomOut,
  onPrint,
}: ViewerToolbarProps) {
  const [inputValue, setInputValue] = React.useState(currentPage.toString());

  React.useEffect(() => {
    setInputValue(currentPage.toString());
  }, [currentPage]);

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(inputValue, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
    } else {
      setInputValue(currentPage.toString());
    }
  };

  return (
    <div className="flex items-center justify-between bg-white border-b border-slate-200 px-4 py-2 print:hidden" style={{ WebkitAppRegion: 'drag' } as any}>
      <div className="flex items-center gap-4" style={{ WebkitAppRegion: 'no-drag' } as any}>
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
          title="Kütüphaneye Dön"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-sm font-medium text-slate-800 truncate max-w-[200px] md:max-w-[400px]">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' } as any}>
        <button
          onClick={onPrevPage}
          disabled={currentPage <= 1}
          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <form onSubmit={handlePageSubmit} className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handlePageSubmit}
            className="w-12 px-1 text-center border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
          />
          <span>/ {totalPages || '-'}</span>
        </form>

        <button
          onClick={onNextPage}
          disabled={currentPage >= totalPages}
          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' } as any}>
        <button
          onClick={onPrint}
          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600"
          title="Yazdır / PDF Olarak Kaydet"
        >
          <Printer className="w-5 h-5" />
        </button>
        <button
          onClick={onZoomOut}
          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600"
          title="Uzaklaştır"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <span className="text-sm text-slate-600 w-12 text-center">
          {Math.round(zoomLevel * 100)}%
        </span>
        <button
          onClick={onZoomIn}
          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600"
          title="Yakınlaştır"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
