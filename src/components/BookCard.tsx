import React from 'react';
import { Book as BookIcon, Star, Edit2 } from 'lucide-react';
import { Book } from '../types/book';
import { toFileUrl } from '../utils/path';

interface BookCardProps {
  key?: number | string;
  book: Book;
  onClick: (book: Book) => void;
  onEdit: (book: Book) => void;
  onToggleFavorite: (bookId: number) => void;
}

export function BookCard({ book, onClick, onEdit, onToggleFavorite }: BookCardProps) {
  const addedDate = new Date(book.added_at).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const formatSize = (bytes?: number) => {
    if (!bytes) return null;
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(0)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const sizeLabel = formatSize(book.file_size);

  return (
    <div 
      onClick={() => onClick(book)}
      className="group relative flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* Kapak Görseli Alanı */}
      {book.cover_image ? (
        <div className="bg-slate-100 aspect-[3/4] flex items-center justify-center border-b border-slate-100 group-hover:bg-slate-50 transition-colors overflow-hidden">
          <img src={toFileUrl(book.cover_image)} alt={book.title} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="bg-slate-100 aspect-[3/4] flex items-center justify-center border-b border-slate-100 group-hover:bg-slate-50 transition-colors relative">
          <BookIcon className="w-12 h-12 text-slate-300" />
        </div>
      )}
      
      {/* Overlay Actions */}
      <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(book.id);
          }}
          className={`p-1.5 rounded-full bg-white shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors ${book.is_favorite ? 'text-amber-400' : 'text-slate-400 hover:text-amber-400'}`}
          title={book.is_favorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
        >
          <Star className="w-4 h-4" fill={book.is_favorite ? "currentColor" : "none"} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(book);
          }}
          className="p-1.5 rounded-full bg-white shadow-sm border border-slate-200 hover:bg-slate-50 text-slate-400 transition-colors hover:text-slate-900"
          title="Düzenle"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>

      {sizeLabel && (
        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-slate-900/60 backdrop-blur-sm text-[10px] font-medium text-white shadow-sm z-10">
          {sizeLabel}
        </div>
      )}

      {/* Kitap Bilgileri */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-sm font-medium text-slate-800 line-clamp-2 mb-1" title={book.title}>
          {book.title}
        </h3>
        {book.author && (
          <p className="text-xs text-slate-500 line-clamp-1 mb-1" title={book.author}>
            {book.author}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between text-xs text-slate-400">
          <span className="truncate">{book.category || 'Kategorisiz'}</span>
        </div>
      </div>
    </div>
  );
}
