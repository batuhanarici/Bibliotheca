import React, { useState } from 'react';
import { Library, Star, Folder, Hash, Plus, X, Search, BarChart2 } from 'lucide-react';
import { Shelf } from '../types/book';

export type FilterType = 'all' | 'favorites' | { type: 'shelf', id: number } | { type: 'category', name: string };

interface SidebarProps {
  shelves: Shelf[];
  categories: string[];
  activeFilter: FilterType;
  onSelectFilter: (filter: FilterType) => void;
  onCreateShelf: (name: string) => Promise<void>;
  onDeleteShelf: (id: number) => Promise<void>;
  onOpenStats: () => void;
  onOpenFts: () => void;
}

export function Sidebar({ shelves, categories, activeFilter, onSelectFilter, onCreateShelf, onDeleteShelf, onOpenStats, onOpenFts }: SidebarProps) {
  const [isCreatingShelf, setIsCreatingShelf] = useState(false);
  const [newShelfName, setNewShelfName] = useState('');

  const handleCreateShelf = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newShelfName.trim()) {
      await onCreateShelf(newShelfName.trim());
      setNewShelfName('');
      setIsCreatingShelf(false);
    }
  };

  const isFilterActive = (filter: FilterType) => {
    if (typeof filter === 'string' && typeof activeFilter === 'string') {
      return filter === activeFilter;
    }
    if (typeof filter === 'object' && typeof activeFilter === 'object') {
      if (filter.type === 'shelf' && activeFilter.type === 'shelf') return filter.id === activeFilter.id;
      if (filter.type === 'category' && activeFilter.type === 'category') return filter.name === activeFilter.name;
    }
    return false;
  };

  const getNavItemClass = (filter: FilterType) => {
    const active = isFilterActive(filter);
    return `flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
      active ? 'bg-slate-200 text-slate-900 font-medium' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;
  };

  return (
    <aside className="w-64 border-r border-slate-200 bg-slate-50 flex flex-col h-full overflow-y-auto">
      <div className="p-4 flex flex-col gap-1 border-b border-slate-200">
        <div className={getNavItemClass('all')} onClick={() => onSelectFilter('all')}>
          <Library className="w-4 h-4" />
          <span>Tüm Kitaplar</span>
        </div>
        <div className={getNavItemClass('favorites')} onClick={() => onSelectFilter('favorites')}>
          <Star className="w-4 h-4" />
          <span>Favoriler</span>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-1 border-b border-slate-200">
        <div 
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          onClick={onOpenFts}
        >
          <Search className="w-4 h-4" />
          <span>İçerikte Ara</span>
        </div>
        <div 
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          onClick={onOpenStats}
        >
          <BarChart2 className="w-4 h-4" />
          <span>İstatistikler</span>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          <span>Raflar</span>
          <button onClick={() => setIsCreatingShelf(true)} className="hover:text-slate-900 p-1" title="Yeni Raf">
            <Plus className="w-3 h-3" />
          </button>
        </div>
        <div className="flex flex-col gap-1">
          {isCreatingShelf && (
            <form onSubmit={handleCreateShelf} className="flex items-center gap-2 px-2 py-1">
              <input
                type="text"
                autoFocus
                value={newShelfName}
                onChange={(e) => setNewShelfName(e.target.value)}
                onBlur={() => setIsCreatingShelf(false)}
                className="w-full text-sm border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-slate-900"
                placeholder="Raf adı..."
              />
            </form>
          )}
          {shelves.map((shelf) => (
            <div key={shelf.id} className="group flex items-center justify-between">
              <div 
                className={`flex-1 ${getNavItemClass({ type: 'shelf', id: shelf.id })}`}
                onClick={() => onSelectFilter({ type: 'shelf', id: shelf.id })}
              >
                <Folder className="w-4 h-4" />
                <span className="truncate">{shelf.name}</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); onDeleteShelf(shelf.id); }}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-opacity"
                title="Rafı Sil"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {shelves.length === 0 && !isCreatingShelf && (
            <div className="text-xs text-slate-400 px-3 py-1">Henüz raf yok</div>
          )}
        </div>
      </div>

      <div className="px-4 py-2 mt-4">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Kategoriler
        </div>
        <div className="flex flex-col gap-1">
          {categories.map((category) => (
            <div 
              key={category}
              className={getNavItemClass({ type: 'category', name: category })}
              onClick={() => onSelectFilter({ type: 'category', name: category })}
            >
              <Hash className="w-4 h-4" />
              <span className="truncate">{category}</span>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="text-xs text-slate-400 px-3 py-1">Henüz kategori yok</div>
          )}
        </div>
      </div>
    </aside>
  );
}
