import React, { useState, useEffect } from 'react';
import { Search, X, Book as BookIcon } from 'lucide-react';
import { SearchResult } from '../types/book';

interface FullTextSearchModalProps {
  onClose: () => void;
  onSelectResult: (bookId: number, pageNumber: number) => void;
}

export function FullTextSearchModal({ onClose, onSelectResult }: FullTextSearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 2) {
        setIsSearching(true);
        try {
          if (window.api) {
            const res = await window.api.fullTextSearch(query.trim());
            setResults(res);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col max-h-[80vh] overflow-hidden">
        
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Kitap içeriklerinde kelime ara..."
            className="flex-1 text-lg bg-transparent border-none focus:outline-none text-slate-800 placeholder-slate-400"
          />
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-2">
          {query.trim().length > 0 && query.trim().length <= 2 && (
            <div className="p-4 text-center text-sm text-slate-500">
              Aramak için en az 3 karakter girin...
            </div>
          )}
          
          {isSearching && (
            <div className="p-4 text-center text-sm text-slate-500">
              Aranıyor...
            </div>
          )}
          
          {!isSearching && query.trim().length > 2 && results.length === 0 && (
            <div className="p-4 text-center text-sm text-slate-500">
              "{query}" için sonuç bulunamadı. Sadece indekslenmiş kitaplarda arama yapılır.
            </div>
          )}

          {!isSearching && results.length > 0 && (
            <div className="flex flex-col gap-1 p-2">
              {results.map((res, i) => (
                <div 
                  key={i}
                  className="flex flex-col p-3 bg-white border border-slate-200 rounded-lg hover:border-slate-400 cursor-pointer transition-colors"
                  onClick={() => onSelectResult(res.book_id, res.page_number)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-800 flex items-center gap-2">
                      <BookIcon className="w-3.5 h-3.5 text-slate-400" />
                      {res.title}
                    </span>
                    <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      Sayfa {res.page_number}
                    </span>
                  </div>
                  <div 
                    className="text-sm text-slate-600 text-ellipsis overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: res.snippet }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
