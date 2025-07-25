
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
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          project_type: string | null
          status: string | null
          settings: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          project_type?: string | null
          status?: string | null
          settings?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          project_type?: string | null
          status?: string | null
          settings?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      supply_nodes: {
        Row: {
          id: string
          project_id: string
          user_id: string
          name: string
          latitude: number
          longitude: number
          node_type: string | null
          capacity: number | null
          demand: number | null
          fixed_cost: number | null
          variable_cost: number | null
          service_level: number | null
          properties: Json | null
          is_editable: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          name: string
          latitude: number
          longitude: number
          node_type?: string | null
          capacity?: number | null
          demand?: number | null
          fixed_cost?: number | null
          variable_cost?: number | null
          service_level?: number | null
          properties?: Json | null
          is_editable?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          name?: string
          latitude?: number
          longitude?: number
          node_type?: string | null
          capacity?: number | null
          demand?: number | null
          fixed_cost?: number | null
          variable_cost?: number | null
          service_level?: number | null
          properties?: Json | null
          is_editable?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
