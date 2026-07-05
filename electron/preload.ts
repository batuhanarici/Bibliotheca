import { contextBridge, ipcRenderer } from 'electron';
import { Book, Shelf } from '../src/types/book';

const api = {
  selectFolder: (): Promise<string | null> => ipcRenderer.invoke('dialog:selectFolder'),
  scanFolderForPdfs: (folderPath: string): Promise<void> => ipcRenderer.invoke('db:scanFolderForPdfs', folderPath),
  
  // Book Reading
  getAllBooks: (): Promise<Book[]> => ipcRenderer.invoke('db:getAllBooks'),
  getBookFile: (bookId: number): Promise<{ filePath: string }> => ipcRenderer.invoke('db:getBookFile', bookId),
  updateLastPage: (bookId: number, page: number): Promise<void> => ipcRenderer.invoke('db:updateLastPage', bookId, page),
  readFile: (filePath: string): Promise<Uint8Array> => ipcRenderer.invoke('fs:readFile', filePath),

  // Phase 3: Metadata, Shelves, Filtering, Search
  updateBookMetadata: (bookId: number, metadata: { category?: string | null; author?: string | null }): Promise<void> => ipcRenderer.invoke('db:updateBookMetadata', bookId, metadata),
  toggleFavorite: (bookId: number): Promise<void> => ipcRenderer.invoke('db:toggleFavorite', bookId),
  
  createShelf: (name: string): Promise<Shelf> => ipcRenderer.invoke('db:createShelf', name),
  deleteShelf: (shelfId: number): Promise<void> => ipcRenderer.invoke('db:deleteShelf', shelfId),
  getAllShelves: (): Promise<Shelf[]> => ipcRenderer.invoke('db:getAllShelves'),
  
  assignBookToShelf: (bookId: number, shelfId: number): Promise<void> => ipcRenderer.invoke('db:assignBookToShelf', bookId, shelfId),
  removeBookFromShelf: (bookId: number, shelfId: number): Promise<void> => ipcRenderer.invoke('db:removeBookFromShelf', bookId, shelfId),
  getBookShelves: (bookId: number): Promise<Shelf[]> => ipcRenderer.invoke('db:getBookShelves', bookId),

  getBooksByShelf: (shelfId: number): Promise<Book[]> => ipcRenderer.invoke('db:getBooksByShelf', shelfId),
  getBooksByCategory: (category: string): Promise<Book[]> => ipcRenderer.invoke('db:getBooksByCategory', category),
  getFavoriteBooks: (): Promise<Book[]> => ipcRenderer.invoke('db:getFavoriteBooks'),
  searchBooks: (query: string): Promise<Book[]> => ipcRenderer.invoke('db:searchBooks', query),
  getAllCategories: (): Promise<string[]> => ipcRenderer.invoke('db:getAllCategories'),

  // Phase 4
  saveCoverImage: (bookId: number, base64Data: string): Promise<string> => ipcRenderer.invoke('fs:saveCoverImage', bookId, base64Data),
  saveBookText: (bookId: number, pagesText: { pageNumber: number; content: string }[]): Promise<void> => ipcRenderer.invoke('db:saveBookText', bookId, pagesText),
  fullTextSearch: (query: string): Promise<any[]> => ipcRenderer.invoke('db:fullTextSearch', query),
  
  addBookmark: (bookId: number, pageNumber: number, label?: string): Promise<any> => ipcRenderer.invoke('db:addBookmark', bookId, pageNumber, label),
  getBookmarks: (bookId: number): Promise<any[]> => ipcRenderer.invoke('db:getBookmarks', bookId),
  deleteBookmark: (bookmarkId: number): Promise<void> => ipcRenderer.invoke('db:deleteBookmark', bookmarkId),
  
  addNote: (bookId: number, pageNumber: number, content: string): Promise<any> => ipcRenderer.invoke('db:addNote', bookId, pageNumber, content),
  getNotes: (bookId: number): Promise<any[]> => ipcRenderer.invoke('db:getNotes', bookId),
  updateNote: (noteId: number, content: string): Promise<void> => ipcRenderer.invoke('db:updateNote', noteId, content),
  deleteNote: (noteId: number): Promise<void> => ipcRenderer.invoke('db:deleteNote', noteId),
  
  getLibraryStats: (): Promise<any> => ipcRenderer.invoke('db:getLibraryStats'),
};

contextBridge.exposeInMainWorld('api', api);

export type Api = typeof api;
