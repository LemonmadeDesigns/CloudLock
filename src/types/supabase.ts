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
      passwords: {
        Row: {
          id: string
          user_id: string
          title: string
          username: string
          password: string
          url: string | null
          notes: string | null
          created_at: string
          updated_at: string
          category_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          username: string
          password: string
          url?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
          category_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          username?: string
          password?: string
          url?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
          category_id?: string | null
        }
      }
      self_destruct_settings: {
        Row: {
          user_id: string
          cooldown_period: string
          require_2fa: boolean
          notify_email: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          cooldown_period?: string
          require_2fa?: boolean
          notify_email?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          cooldown_period?: string
          require_2fa?: boolean
          notify_email?: boolean
          updated_at?: string
        }
      }
      self_destruct_logs: {
        Row: {
          id: string
          user_id: string
          status: 'initiated' | 'completed' | 'cancelled' | 'failed'
          initiated_at: string
          completed_at: string | null
          ip_address: string | null
          user_agent: string | null
          error_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status: 'initiated' | 'completed' | 'cancelled' | 'failed'
          initiated_at?: string
          completed_at?: string | null
          ip_address?: string | null
          user_agent?: string | null
          error_message?: string | null
          created_at?: string
        }
        Update: {
          status?: 'initiated' | 'completed' | 'cancelled' | 'failed'
          completed_at?: string | null
          error_message?: string | null
        }
      }
    }
    Functions: {
      ping: {
        Args: Record<string, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}