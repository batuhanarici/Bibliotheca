import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-slate-400" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-slate-50 placeholder-slate-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-slate-900 sm:text-sm transition-colors"
        placeholder="Kitap veya yazar ara..."
      />
    </div>
  );
}
