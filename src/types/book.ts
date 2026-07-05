export interface Book {
  id: number;
  title: string;
  file_path: string;
  added_at: string;
  last_page: number;
  is_favorite: number;
  category: string | null;
  author: string | null;
  cover_image: string | null;
  is_indexed: number;
  file_size?: number;
}

export interface Shelf {
  id: number;
  name: string;
  created_at: string;
}

export interface Bookmark {
  id: number;
  book_id: number;
  page_number: number;
  label: string | null;
  created_at: string;
}

export interface Note {
  id: number;
  book_id: number;
  page_number: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface SearchResult {
  book_id: number;
  page_number: number;
  title: string;
  snippet: string;
}

export interface LibraryStats {
  totalBooks: number;
  totalFavorites: number;
  totalPagesRead: number;
  totalBookmarks: number;
  totalNotes: number;
}
