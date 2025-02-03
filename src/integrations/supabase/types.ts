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
      demand_points: {
        Row: {
          created_at: string | null
          demand: number
          id: string
          latitude: number
          longitude: number
          name: string
          service_level: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          demand: number
          id?: string
          latitude: number
          longitude: number
          name: string
          service_level?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          demand?: number
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          service_level?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      nodes: {
        Row: {
          capacity: number | null
          created_at: string | null
          fixed_cost: number | null
          id: string
          latitude: number
          longitude: number
          name: string
          updated_at: string | null
          user_id: string
          variable_cost: number | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          fixed_cost?: number | null
          id?: string
          latitude: number
          longitude: number
          name: string
          updated_at?: string | null
          user_id: string
          variable_cost?: number | null
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          fixed_cost?: number | null
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          updated_at?: string | null
          user_id?: string
          variable_cost?: number | null
        }
        Relationships: []
      }
      routes: {
        Row: {
          cost_per_unit: number | null
          created_at: string | null
          destination_id: string | null
          distance: number | null
          id: string
          origin_id: string | null
          transit_time: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cost_per_unit?: number | null
          created_at?: string | null
          destination_id?: string | null
          distance?: number | null
          id?: string
          origin_id?: string | null
          transit_time?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cost_per_unit?: number | null
          created_at?: string | null
          destination_id?: string | null
          distance?: number | null
          id?: string
          origin_id?: string | null
          transit_time?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "routes_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "demand_points"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routes_origin_id_fkey"
            columns: ["origin_id"]
            isOneToOne: false
            referencedRelation: "nodes"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
