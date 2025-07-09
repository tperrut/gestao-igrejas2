
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
    avatar_url?: string;
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
  description?: string;
  instructor: string;
  start_date: string;
  end_date: string;
  location?: string;
  max_students?: number;
  students?: number;
  status: string;
  category: string;
  prerequisites?: string;
  image_url?: string;
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
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: string;
  book_id: string;
  book: {
    id: string;
    title: string;
    author: string;
  };
  member_id: string;
  member: {
    id: string;
    name: string;
    email: string;
  };
  reservation_date: string;
  expires_at: string;
  status: 'active' | 'expired' | 'converted' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export type ReservationStatus = 'active' | 'expired' | 'converted' | 'cancelled';
