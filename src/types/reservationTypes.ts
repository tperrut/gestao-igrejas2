
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
