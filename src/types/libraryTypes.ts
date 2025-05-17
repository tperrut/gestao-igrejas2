
export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn?: string;
  publisher?: string;
  publication_year?: string;
  copies: number;
  available_copies: number;
  cover_url?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}
