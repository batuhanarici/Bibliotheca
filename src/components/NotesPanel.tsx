import React, { useState } from 'react';
import { FileText, Trash2, Edit2, Check, X } from 'lucide-react';
import { Note } from '../types/book';

interface NotesPanelProps {
  notes: Note[];
  currentPage: number;
  onAddNote: (content: string) => void;
  onUpdateNote: (id: number, content: string) => void;
  onDeleteNote: (id: number) => void;
  onNavigate: (pageNumber: number) => void;
}

export function NotesPanel({ notes, currentPage, onAddNote, onUpdateNote, onDeleteNote, onNavigate }: NotesPanelProps) {
  const [newContent, setNewContent] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');

  const currentPageNotes = notes.filter(n => n.page_number === currentPage);
  const otherNotes = notes.filter(n => n.page_number !== currentPage);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newContent.trim()) {
      onAddNote(newContent.trim());
      setNewContent('');
    }
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setEditingContent(note.content);
  };

  const saveEdit = (id: number) => {
    if (editingContent.trim()) {
      onUpdateNote(id, editingContent.trim());
    }
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingContent('');
  };

  const renderNoteList = (list: Note[]) => (
    <div className="flex flex-col gap-3">
      {list.map(note => (
        <div key={note.id} className="group bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span 
              className="cursor-pointer hover:text-slate-900 font-medium transition-colors"
              onClick={() => onNavigate(note.page_number)}
            >
              Sayfa {note.page_number}
            </span>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => startEdit(note)} className="p-1 hover:text-slate-900"><Edit2 className="w-3 h-3" /></button>
              <button onClick={() => onDeleteNote(note.id)} className="p-1 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
            </div>
          </div>
          
          {editingId === note.id ? (
            <div className="flex flex-col gap-2">
              <textarea
                value={editingContent}
                onChange={e => setEditingContent(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded p-2 focus:outline-none focus:border-slate-900 resize-y min-h-[80px]"
              />
              <div className="flex justify-end gap-1">
                <button onClick={cancelEdit} className="p-1 text-slate-500 hover:bg-slate-100 rounded"><X className="w-4 h-4" /></button>
                <button onClick={() => saveEdit(note.id)} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"><Check className="w-4 h-4" /></button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-800 whitespace-pre-wrap">{note.content}</p>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 border-l border-slate-200 w-80 shrink-0">
      <div className="p-4 border-b border-slate-200">
        <h3 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Sayfa {currentPage} Notları
        </h3>
        
        <form onSubmit={handleAdd} className="flex flex-col gap-2">
          <textarea 
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
            placeholder="Bu sayfaya not ekle..."
            className="w-full text-sm border border-slate-300 rounded p-2 focus:outline-none focus:border-slate-900 resize-y min-h-[80px]"
          />
          <button 
            type="submit"
            disabled={!newContent.trim()}
            className="w-full text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded py-2 transition-colors disabled:opacity-50"
          >
            Not Ekle
          </button>
        </form>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        {currentPageNotes.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Bu Sayfadaki Notlar</h4>
            {renderNoteList(currentPageNotes)}
          </div>
        )}
        
        {otherNotes.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Diğer Sayfalardaki Notlar</h4>
            {renderNoteList(otherNotes)}
          </div>
        )}
        
        {notes.length === 0 && (
          <p className="text-sm text-slate-500 text-center mt-4">Bu kitaba henüz not eklenmemiş.</p>
        )}
      </div>
    </div>
  );
}
