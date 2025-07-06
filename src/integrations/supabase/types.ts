export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          title?: string
          updated_at?: string
        }
        Relationships: []
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
          title?: string
          updated_at?: string
        }
        Relationships: []
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
          time?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
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
          updated_at?: string
        }
        Relationships: []
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
          updated_at: string
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
          updated_at?: string
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
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pastoral_appointments_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
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
          time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          is_available?: boolean
          notes?: string | null
          time: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          is_available?: boolean
          notes?: string | null
          time?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
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
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      expire_reservations: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      has_role: {
        Args: { user_id: string; required_role: string }
        Returns: boolean
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_valid_email: {
        Args: { email: string }
        Returns: boolean
      }
      is_valid_phone: {
        Args: { phone: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
