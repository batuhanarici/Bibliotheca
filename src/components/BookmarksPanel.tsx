import React, { useState } from 'react';
import { Bookmark as BookmarkIcon, Trash2 } from 'lucide-react';
import { Bookmark } from '../types/book';

interface BookmarksPanelProps {
  bookmarks: Bookmark[];
  currentPage: number;
  onAddBookmark: (label: string) => void;
  onDeleteBookmark: (id: number) => void;
  onNavigate: (pageNumber: number) => void;
}

export function BookmarksPanel({ bookmarks, currentPage, onAddBookmark, onDeleteBookmark, onNavigate }: BookmarksPanelProps) {
  const [newLabel, setNewLabel] = useState('');
  
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    onAddBookmark(newLabel);
    setNewLabel('');
  };

  const isCurrentPageBookmarked = bookmarks.some(b => b.page_number === currentPage);

  return (
    <div className="flex flex-col h-full bg-slate-50 border-l border-slate-200 w-64 shrink-0">
      <div className="p-4 border-b border-slate-200">
        <h3 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
          <BookmarkIcon className="w-4 h-4" />
          Yer İmleri
        </h3>
        
        {!isCurrentPageBookmarked ? (
          <form onSubmit={handleAdd} className="flex flex-col gap-2">
            <input 
              type="text" 
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              placeholder="İsteğe bağlı not..."
              className="w-full text-sm border border-slate-300 rounded px-2 py-1.5 focus:outline-none focus:border-slate-900"
            />
            <button 
              type="submit"
              className="w-full text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded py-1.5 transition-colors"
            >
              Sayfa {currentPage}'i Ekle
            </button>
          </form>
        ) : (
          <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
            Bu sayfa yer imlerine ekli.
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {bookmarks.length === 0 ? (
          <p className="text-sm text-slate-500 p-2 text-center">Henüz yer imi yok.</p>
        ) : (
          <div className="flex flex-col gap-1">
            {bookmarks.map(bookmark => (
              <div 
                key={bookmark.id}
                className="group flex flex-col p-2 hover:bg-slate-100 rounded cursor-pointer transition-colors"
                onClick={() => onNavigate(bookmark.page_number)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Sayfa {bookmark.page_number}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteBookmark(bookmark.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-opacity"
                    title="Sil"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                {bookmark.label && (
                  <span className="text-xs text-slate-500 truncate mt-1">{bookmark.label}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
