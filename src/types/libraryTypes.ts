
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
  birth_date?: string;
  avatar_url?: string;
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

export interface Course {
  id: string;
  title: string;
  instructor: string;
  description?: string;
  start_date: string;
  end_date: string;
  category: string;
  status: string;
  location?: string;
  max_students?: number;
  students?: number;
  prerequisites?: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  type: string;
  capacity?: number;
  created_at: string;
  updated_at: string;
}
