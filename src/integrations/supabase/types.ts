export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      books: {
        Row: {
          author: string
          available_copies: number
          category: string
          copies: number
          cover_url: string | null
          created_at: string
          description: string | null
          id: string
          isbn: string | null
          publication_year: string | null
          publisher: string | null
          tenant_id: string
          title: string
          updated_at: string
        }
        Insert: {
          author: string
          available_copies?: number
          category: string
          copies?: number
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          isbn?: string | null
          publication_year?: string | null
          publisher?: string | null
          tenant_id: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          available_copies?: number
          category?: string
          copies?: number
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          isbn?: string | null
          publication_year?: string | null
          publisher?: string | null
          tenant_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "books_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant_branding"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "books_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          capacity: number | null
          category: string
          created_at: string
          description: string | null
          end_date: string
          enrolled_count: number | null
          id: string
          image_url: string | null
          instructor: string
          location: string | null
          max_students: number | null
          prerequisites: string | null
          start_date: string
          status: string
          students: number | null
          tenant_id: string
          title: string
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          category: string
          created_at?: string
          description?: string | null
          end_date: string
          enrolled_count?: number | null
          id?: string
          image_url?: string | null
          instructor: string
          location?: string | null
          max_students?: number | null
          prerequisites?: string | null
          start_date: string
          status: string
          students?: number | null
          tenant_id: string
          title: string
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          category?: string
          created_at?: string
          description?: string | null
          end_date?: string
          enrolled_count?: number | null
          id?: string
          image_url?: string | null
          instructor?: string
          location?: string | null
          max_students?: number | null
          prerequisites?: string | null
          start_date?: string
          status?: string
          students?: number | null
          tenant_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant_branding"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          capacity: number | null
          created_at: string
          date: string
          description: string | null
          id: string
          image_url: string | null
          location: string
          organizer: string
          status: string | null
          tenant_id: string
          time: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          date: string
          description?: string | null
          id?: string
          image_url?: string | null
          location: string
          organizer: string
          status?: string | null
          tenant_id: string
          time: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string
          organizer?: string
          status?: string | null
          tenant_id?: string
          time?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant_branding"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      loans: {
        Row: {
          book_id: string
          borrow_date: string
          created_at: string
          due_date: string
          id: string
          member_id: string
          notes: string | null
          return_date: string | null
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          book_id: string
          borrow_date: string
          created_at?: string
          due_date: string
          id?: string
          member_id: string
          notes?: string | null
          return_date?: string | null
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          book_id?: string
          borrow_date?: string
          created_at?: string
          due_date?: string
          id?: string
          member_id?: string
          notes?: string | null
          return_date?: string | null
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "loans_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loans_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loans_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant_branding"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loans_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          avatar_url: string | null
          birth_date: string | null
          created_at: string
          email: string
          id: string
          join_date: string
          name: string
          phone: string | null
          role: string | null
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          email: string
          id?: string
          join_date: string
          name: string
          phone?: string | null
          role?: string | null
          status: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          email?: string
          id?: string
          join_date?: string
          name?: string
          phone?: string | null
          role?: string | null
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "members_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant_branding"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      pastoral_appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string
          id: string
          member_email: string
          member_id: string | null
          member_name: string
          member_phone: string | null
          message: string | null
          pastor_notes: string | null
          reason: string
          status: string
          tenant_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string
          id?: string
          member_email: string
          member_id?: string | null
          member_name: string
          member_phone?: string | null
          message?: string | null
          pastor_notes?: string | null
          reason: string
          status?: string
          tenant_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string
          id?: string
          member_email?: string
          member_id?: string | null
          member_name?: string
          member_phone?: string | null
          message?: string | null
          pastor_notes?: string | null
          reason?: string
          status?: string
          tenant_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pastoral_appointments_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pastoral_appointments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant_branding"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pastoral_appointments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      pastoral_schedules: {
        Row: {
          created_at: string
          date: string
          id: string
          is_available: boolean
          notes: string | null
          tenant_id: string
          time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          is_available?: boolean
          notes?: string | null
          tenant_id: string
          time: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          is_available?: boolean
          notes?: string | null
          tenant_id?: string
          time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pastoral_schedules_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant_branding"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pastoral_schedules_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant_branding"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          book_id: string
          created_at: string
          expires_at: string
          id: string
          member_id: string
          reservation_date: string
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          book_id: string
          created_at?: string
          expires_at?: string
          id?: string
          member_id: string
          reservation_date?: string
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          book_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          member_id?: string
          reservation_date?: string
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant_branding"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      security_logs: {
        Row: {
          action: string
          details: Json | null
          id: string
          record_id: string | null
          table_name: string
          tenant_id: string
          timestamp: string
          user_id: string | null
        }
        Insert: {
          action: string
          details?: Json | null
          id?: string
          record_id?: string | null
          table_name: string
          tenant_id: string
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          details?: Json | null
          id?: string
          record_id?: string | null
          table_name?: string
          tenant_id?: string
          timestamp?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "security_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant_branding"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "security_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      sunday_school_attendance: {
        Row: {
          arrival_time: string | null
          created_at: string
          id: string
          lesson_id: string
          member_id: string | null
          notes: string | null
          present: boolean
          tenant_id: string
          visitor_name: string | null
        }
        Insert: {
          arrival_time?: string | null
          created_at?: string
          id?: string
          lesson_id: string
          member_id?: string | null
          notes?: string | null
          present?: boolean
          tenant_id: string
          visitor_name?: string | null
        }
        Update: {
          arrival_time?: string | null
          created_at?: string
          id?: string
          lesson_id?: string
          member_id?: string | null
          notes?: string | null
          present?: boolean
          tenant_id?: string
          visitor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sunday_school_attendance_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "sunday_school_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sunday_school_attendance_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sunday_school_attendance_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant_branding"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sunday_school_attendance_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      sunday_school_class_teachers: {
        Row: {
          assigned_at: string
          class_id: string
          created_at: string
          id: string
          is_primary: boolean
          teacher_id: string
          tenant_id: string
        }
        Insert: {
          assigned_at?: string
          class_id: string
          created_at?: string
          id?: string
          is_primary?: boolean
          teacher_id: string
          tenant_id: string
        }
        Update: {
          assigned_at?: string
          class_id?: string
          created_at?: string
          id?: string
          is_primary?: boolean
          teacher_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sunday_school_class_teachers_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "sunday_school_classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sunday_school_class_teachers_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "sunday_school_teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sunday_school_class_teachers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant_branding"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sunday_school_class_teachers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      sunday_school_classes: {
        Row: {
          age_group: string
          created_at: string
          description: string | null
          id: string
          name: string
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          age_group: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          age_group?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sunday_school_classes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant_branding"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sunday_school_classes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      sunday_school_enrollments: {
        Row: {
          class_id: string
          created_at: string
          enrollment_date: string
          id: string
          member_id: string
          notes: string | null
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          class_id: string
          created_at?: string
          enrollment_date?: string
          id?: string
          member_id: string
          notes?: string | null
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          class_id?: string
          created_at?: string
          enrollment_date?: string
          id?: string
          member_id?: string
          notes?: string | null
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sunday_school_enrollments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "sunday_school_classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sunday_school_enrollments_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sunday_school_enrollments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant_branding"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sunday_school_enrollments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      sunday_school_lessons: {
        Row: {
          class_id: string
          created_at: string
          id: string
          lesson_date: string
          notes: string | null
          offering_amount: number | null
          teacher_id: string
          tenant_id: string
          topic: string | null
          updated_at: string
        }
        Insert: {
          class_id: string
          created_at?: string
          id?: string
          lesson_date: string
          notes?: string | null
          offering_amount?: number | null
          teacher_id: string
          tenant_id: string
          topic?: string | null
          updated_at?: string
        }
        Update: {
          class_id?: string
          created_at?: string
          id?: string
          lesson_date?: string
          notes?: string | null
          offering_amount?: number | null
          teacher_id?: string
          tenant_id?: string
          topic?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sunday_school_lessons_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "sunday_school_classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sunday_school_lessons_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "sunday_school_teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sunday_school_lessons_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant_branding"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sunday_school_lessons_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      sunday_school_teachers: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          specialization: string | null
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          specialization?: string | null
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          specialization?: string | null
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sunday_school_teachers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant_branding"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sunday_school_teachers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_users: {
        Row: {
          created_at: string
          id: string
          role: string
          status: string
          tenant_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string
          status?: string
          tenant_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          status?: string
          tenant_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_users_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant_branding"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_users_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          plan_type: string
          settings: Json | null
          status: string
          subdomain: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          plan_type?: string
          settings?: Json | null
          status?: string
          subdomain: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          plan_type?: string
          settings?: Json | null
          status?: string
          subdomain?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          tenant_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          tenant_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          tenant_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenant_branding"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      tenant_branding: {
        Row: {
          id: string | null
          logo_url: string | null
          name: string | null
          subdomain: string | null
        }
        Insert: {
          id?: string | null
          logo_url?: string | null
          name?: string | null
          subdomain?: string | null
        }
        Update: {
          id?: string | null
          logo_url?: string | null
          name?: string | null
          subdomain?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      belongs_to_tenant: { Args: { check_tenant_id: string }; Returns: boolean }
      can_access_pastoral_appointment: {
        Args: { appointment_user_id: string }
        Returns: boolean
      }
      create_tenant_with_admin: {
        Args: {
          admin_email: string
          admin_name: string
          admin_password: string
          tenant_name: string
          tenant_subdomain: string
        }
        Returns: Json
      }
      expire_reservations: { Args: never; Returns: undefined }
      get_current_tenant_id: { Args: never; Returns: string }
      get_current_user_role: { Args: never; Returns: string }
      has_role:
        | {
            Args: {
              _role: Database["public"]["Enums"]["app_role"]
              _user_id: string
            }
            Returns: boolean
          }
        | { Args: { required_role: string; user_id: string }; Returns: boolean }
      has_role_in_tenant: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _tenant_id: string
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { user_id: string }; Returns: boolean }
      is_owner: { Args: { user_id: string }; Returns: boolean }
      is_tenant_admin: {
        Args: { tenant_id: string; user_id: string }
        Returns: boolean
      }
      is_valid_email: { Args: { email: string }; Returns: boolean }
      is_valid_phone: { Args: { phone: string }; Returns: boolean }
    }
    Enums: {
      app_role: "owner" | "admin" | "member"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["owner", "admin", "member"],
    },
  },
} as const
