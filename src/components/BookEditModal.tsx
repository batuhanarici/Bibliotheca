import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Book, Shelf } from '../types/book';

interface BookEditModalProps {
  book: Book;
  allShelves: Shelf[];
  allCategories: string[];
  bookShelves: Shelf[];
  onClose: () => void;
  onSave: (metadata: { category: string | null; author: string | null }, assignedShelves: number[], unassignedShelves: number[]) => Promise<void>;
}

export function BookEditModal({ book, allShelves, allCategories, bookShelves, onClose, onSave }: BookEditModalProps) {
  const [author, setAuthor] = useState(book.author || '');
  const [category, setCategory] = useState(book.category || '');
  
  // Raf ID'lerini tutalım
  const initialShelfIds = new Set<number>(bookShelves.map(s => s.id));
  const [selectedShelfIds, setSelectedShelfIds] = useState<Set<number>>(initialShelfIds);

  const [isSaving, setIsSaving] = useState(false);

  const handleToggleShelf = (shelfId: number) => {
    const newSet = new Set(selectedShelfIds);
    if (newSet.has(shelfId)) {
      newSet.delete(shelfId);
    } else {
      newSet.add(shelfId);
    }
    setSelectedShelfIds(newSet);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const finalAuthor = author.trim() || null;
    const finalCategory = category.trim() || null;

    const assigned = Array.from<number>(selectedShelfIds).filter(id => !initialShelfIds.has(id));
    const unassigned = Array.from<number>(initialShelfIds).filter(id => !selectedShelfIds.has(id));

    await onSave({ category: finalCategory, author: finalAuthor }, assigned, unassigned);
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-medium text-slate-800">Kitap Düzenle</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-y-auto">
          <div className="p-6 flex flex-col gap-5">
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kitap Adı</label>
              <div className="text-sm text-slate-900 bg-slate-50 border border-slate-200 p-2 rounded line-clamp-2">
                {book.title}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Yazar</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="Örn: Fyodor Dostoyevski"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
              <input
                type="text"
                list="categories-list"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="Örn: Felsefe, Roman, Bilim..."
              />
              <datalist id="categories-list">
                {allCategories.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>

            {allShelves.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Raflar</label>
                <div className="flex flex-col gap-2 max-h-40 overflow-y-auto border border-slate-200 rounded p-2 bg-slate-50">
                  {allShelves.map(shelf => (
                    <label key={shelf.id} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer p-1 hover:bg-slate-100 rounded">
                      <input
                        type="checkbox"
                        checked={selectedShelfIds.has(shelf.id)}
                        onChange={() => handleToggleShelf(shelf.id)}
                        className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                      />
                      {shelf.name}
                    </label>
                  ))}
                </div>
              </div>
            )}

          </div>

          <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50 rounded-b-xl mt-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-70"
            >
              {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
