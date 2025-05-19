
export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  startDate: string;
  endDate: string;
  location: string;
  capacity: number;
  enrolledCount: number;
  status: 'active' | 'inactive' | 'completed';
  imageUrl?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  organizer: string;
  status: 'scheduled' | 'cancelled' | 'completed';
  imageUrl?: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  birthdate: string;
  joinDate: string;
  status: 'active' | 'inactive';
  role: string;
  imageUrl?: string;
}

export type MemberFormValues = {
  name: string;
  email: string;
  phone: string;
  address: string;
  birthdate: string;
  joinDate: string;
  status: 'active' | 'inactive';
  role: string;
  imageUrl?: string;
}
