// src/types/database.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'student' | 'teacher' | 'admin'
          avatar_url: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'student' | 'teacher' | 'admin'
          avatar_url?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'student' | 'teacher' | 'admin'
          avatar_url?: string | null
        }
      }
      periods: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          banner_url: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description: string
          banner_url: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          banner_url?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          slug: string
          period_id: string
          subject: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          period_id: string
          subject: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          period_id?: string
          subject?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          course_id: string
          added_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          added_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          added_at?: string
        }
      }
      purchases: {
        Row: {
          id: string
          user_id: string
          course_id: string
          amount_paid: number
          payment_method: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          amount_paid: number
          payment_method: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          amount_paid?: number
          payment_method?: string
        }
      }
    }
  }
}