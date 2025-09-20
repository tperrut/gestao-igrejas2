export interface SundaySchoolTeacher {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  specialization?: string;
  status: 'active' | 'inactive';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SundaySchoolClass {
  id: string;
  name: string;
  age_group: string;
  description?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface SundaySchoolClassTeacher {
  id: string;
  class_id: string;
  teacher_id: string;
  is_primary: boolean;
  assigned_at: string;
  created_at: string;
  teacher?: SundaySchoolTeacher;
  class?: SundaySchoolClass;
}

export interface SundaySchoolEnrollment {
  id: string;
  member_id: string;
  class_id: string;
  enrollment_date: string;
  status: 'active' | 'inactive' | 'transferred';
  notes?: string;
  created_at: string;
  updated_at: string;
  member?: {
    id: string;
    name: string;
    email: string;
    birth_date?: string;
  };
  class?: SundaySchoolClass;
}

export interface SundaySchoolLesson {
  id: string;
  class_id: string;
  teacher_id: string;
  lesson_date: string;
  topic?: string;
  offering_amount: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  teacher?: SundaySchoolTeacher;
  class?: SundaySchoolClass;
  attendance?: SundaySchoolAttendance[];
}

export interface SundaySchoolAttendance {
  id: string;
  lesson_id: string;
  member_id: string | null;
  present: boolean;
  arrival_time?: string;
  notes?: string;
  visitor_name?: string;
  created_at: string;
  member?: {
    id: string;
    name: string;
    email: string;
  };
}

export type SundaySchoolTeacherFormValues = {
  name: string;
  email?: string;
  phone?: string;
  specialization?: string;
  status: 'active' | 'inactive';
  notes?: string;
};

export type SundaySchoolClassFormValues = {
  name: string;
  age_group: string;
  description?: string;
  status: 'active' | 'inactive';
};

export type SundaySchoolLessonFormValues = {
  class_id: string;
  teacher_id: string;
  lesson_date: string;
  topic?: string;
  offering_amount: number;
  notes?: string;
};