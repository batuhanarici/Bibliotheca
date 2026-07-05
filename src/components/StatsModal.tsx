import React, { useEffect, useState } from 'react';
import { Book, Star, BookOpen, Bookmark, FileText, X } from 'lucide-react';
import { LibraryStats } from '../types/book';

interface StatsModalProps {
  onClose: () => void;
}

export function StatsModal({ onClose }: StatsModalProps) {
  const [stats, setStats] = useState<LibraryStats | null>(null);

  useEffect(() => {
    if (window.api) {
      window.api.getLibraryStats().then(setStats).catch(console.error);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-medium text-slate-800">Okuma İstatistikleri</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          {!stats ? (
            <div className="text-center text-slate-500 text-sm">İstatistikler yükleniyor...</div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-lg"><Book className="w-6 h-6" /></div>
                <div>
                  <div className="text-2xl font-semibold text-slate-800">{stats.totalBooks}</div>
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Toplam Kitap</div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4">
                <div className="bg-amber-100 text-amber-600 p-3 rounded-lg"><Star className="w-6 h-6" /></div>
                <div>
                  <div className="text-2xl font-semibold text-slate-800">{stats.totalFavorites}</div>
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Favoriler</div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4">
                <div className="bg-emerald-100 text-emerald-600 p-3 rounded-lg"><BookOpen className="w-6 h-6" /></div>
                <div>
                  <div className="text-2xl font-semibold text-slate-800">{stats.totalPagesRead}</div>
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Okunan Sayfa</div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4">
                <div className="bg-purple-100 text-purple-600 p-3 rounded-lg flex flex-col items-center">
                  <div className="flex gap-2">
                    <Bookmark className="w-5 h-5" />
                    <FileText className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-slate-800">{stats.totalBookmarks} / {stats.totalNotes}</div>
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">İm / Not</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
