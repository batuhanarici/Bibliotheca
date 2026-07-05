import React from 'react';
import { Book } from '../types/book';
import { Book as BookIcon } from 'lucide-react';
import { BookCard } from './BookCard';

interface BookListProps {
  books: Book[];
  onBookClick?: (book: Book) => void;
  onEditBook?: (book: Book) => void;
  onDeleteBook?: (book: Book) => void;
  onToggleFavorite?: (bookId: number) => void;
}

export function BookList({ books, onBookClick, onEditBook, onDeleteBook, onToggleFavorite }: BookListProps) {
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400">
        <BookIcon className="w-16 h-16 mb-4 opacity-50" />
        <p className="text-lg">Kitap bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 p-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
      {books.map((book) => (
        <BookCard 
          key={book.id} 
          book={book} 
          onClick={(b) => onBookClick?.(b)} 
          onEdit={(b) => onEditBook?.(b)}
          onDelete={(b) => onDeleteBook?.(b)}
          onToggleFavorite={(id) => onToggleFavorite?.(id)}
        />
      ))}
    </div>
  );
}
