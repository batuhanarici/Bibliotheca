export interface Book {
  id: number;
  title: string;
  file_path: string;
  added_at: string;
  last_page: number;
  is_favorite: number;
  category: string | null;
  author: string | null;
}

export interface Shelf {
  id: number;
  name: string;
  created_at: string;
}
