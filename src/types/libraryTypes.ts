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

export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  role?: string;
  join_date: string;
  created_at: string;
  updated_at: string;
}

export interface Loan {
  id: string;
  book_id: string;
  book: {
    id: string;
    title: string;
  };
  member_id: string;
  member: {
    id: string;
    name: string;
  };
  borrow_date: string;
  due_date: string;
  return_date: string | null;
  notes: string | null;
  status: LoanStatus;
}

export type LoanStatus = 'active' | 'returned' | 'overdue' | 'reserved';
