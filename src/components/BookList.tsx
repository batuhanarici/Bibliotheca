import { Book } from '../types/book';
import { Book as BookIcon } from 'lucide-react';

interface BookListProps {
  books: Book[];
}

export function BookList({ books }: BookListProps) {
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400">
        <BookIcon className="w-16 h-16 mb-4 opacity-50" />
        <p className="text-lg">Henüz kitap eklenmedi.</p>
        <p className="text-sm">Başlamak için bir klasör seçin.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 p-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
      {books.map((book) => {
        const addedDate = new Date(book.added_at).toLocaleDateString('tr-TR', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });

        return (
          <div 
            key={book.id} 
            className="group flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
          >
            {/* Kapak Görseli Alanı (Faz 1 için Placeholder) */}
            <div className="bg-slate-100 aspect-[3/4] flex items-center justify-center border-b border-slate-100 group-hover:bg-slate-50 transition-colors">
              <BookIcon className="w-12 h-12 text-slate-300" />
            </div>
            
            {/* Kitap Bilgileri */}
            <div className="p-3 flex flex-col flex-1">
              <h3 className="text-sm font-medium text-slate-800 line-clamp-2 mb-1" title={book.title}>
                {book.title}
              </h3>
              <div className="mt-auto flex items-center justify-between text-xs text-slate-500">
                <span>{addedDate}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
