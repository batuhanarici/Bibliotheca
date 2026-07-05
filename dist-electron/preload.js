import { contextBridge as d, ipcRenderer as o } from "electron";
const a = {
  selectFolder: () => o.invoke("dialog:selectFolder"),
  scanFolderForPdfs: (e) => o.invoke("db:scanFolderForPdfs", e),
  // Book Reading
  getAllBooks: () => o.invoke("db:getAllBooks"),
  getBookFile: (e) => o.invoke("db:getBookFile", e),
  updateLastPage: (e, t) => o.invoke("db:updateLastPage", e, t),
  readFile: (e) => o.invoke("fs:readFile", e),
  // Phase 3: Metadata, Shelves, Filtering, Search
  updateBookMetadata: (e, t) => o.invoke("db:updateBookMetadata", e, t),
  toggleFavorite: (e) => o.invoke("db:toggleFavorite", e),
  createShelf: (e) => o.invoke("db:createShelf", e),
  deleteShelf: (e) => o.invoke("db:deleteShelf", e),
  getAllShelves: () => o.invoke("db:getAllShelves"),
  assignBookToShelf: (e, t) => o.invoke("db:assignBookToShelf", e, t),
  removeBookFromShelf: (e, t) => o.invoke("db:removeBookFromShelf", e, t),
  getBookShelves: (e) => o.invoke("db:getBookShelves", e),
  getBooksByShelf: (e) => o.invoke("db:getBooksByShelf", e),
  getBooksByCategory: (e) => o.invoke("db:getBooksByCategory", e),
  getFavoriteBooks: () => o.invoke("db:getFavoriteBooks"),
  searchBooks: (e) => o.invoke("db:searchBooks", e),
  getAllCategories: () => o.invoke("db:getAllCategories"),
  // Phase 4
  saveCoverImage: (e, t) => o.invoke("fs:saveCoverImage", e, t),
  saveBookText: (e, t) => o.invoke("db:saveBookText", e, t),
  fullTextSearch: (e) => o.invoke("db:fullTextSearch", e),
  addBookmark: (e, t, k) => o.invoke("db:addBookmark", e, t, k),
  getBookmarks: (e) => o.invoke("db:getBookmarks", e),
  deleteBookmark: (e) => o.invoke("db:deleteBookmark", e),
  addNote: (e, t, k) => o.invoke("db:addNote", e, t, k),
  getNotes: (e) => o.invoke("db:getNotes", e),
  updateNote: (e, t) => o.invoke("db:updateNote", e, t),
  deleteNote: (e) => o.invoke("db:deleteNote", e),
  getLibraryStats: () => o.invoke("db:getLibraryStats")
};
d.exposeInMainWorld("api", a);
