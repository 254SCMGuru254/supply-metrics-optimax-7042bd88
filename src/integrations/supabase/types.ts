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
      data_imports: {
        Row: {
          created_at: string | null
          error_details: Json | null
          file_name: string
          file_size_bytes: number | null
          file_type: string | null
          id: string
          project_id: string
          records_imported: number | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          error_details?: Json | null
          file_name: string
          file_size_bytes?: number | null
          file_type?: string | null
          id?: string
          project_id: string
          records_imported?: number | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          error_details?: Json | null
          file_name?: string
          file_size_bytes?: number | null
          file_type?: string | null
          id?: string
          project_id?: string
          records_imported?: number | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_imports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      demand_event_logs: {
        Row: {
          event_data: Json | null
          event_type: string | null
          handled: boolean | null
          id: string
          node_id: string | null
          severity: string | null
          timestamp: string | null
        }
        Insert: {
          event_data?: Json | null
          event_type?: string | null
          handled?: boolean | null
          id?: string
          node_id?: string | null
          severity?: string | null
          timestamp?: string | null
        }
        Update: {
          event_data?: Json | null
          event_type?: string | null
          handled?: boolean | null
          id?: string
          node_id?: string | null
          severity?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demand_event_logs_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "supply_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
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
      inventory_items: {
        Row: {
          abc_classification: string | null
          created_at: string | null
          demand_rate: number | null
          description: string | null
          economic_order_quantity: number | null
          holding_cost_rate: number | null
          id: string
          lead_time_days: number | null
          node_id: string | null
          ordering_cost: number | null
          project_id: string
          reorder_point: number | null
          safety_stock: number | null
          sku: string
          unit_cost: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          abc_classification?: string | null
          created_at?: string | null
          demand_rate?: number | null
          description?: string | null
          economic_order_quantity?: number | null
          holding_cost_rate?: number | null
          id?: string
          lead_time_days?: number | null
          node_id?: string | null
          ordering_cost?: number | null
          project_id: string
          reorder_point?: number | null
          safety_stock?: number | null
          sku: string
          unit_cost: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          abc_classification?: string | null
          created_at?: string | null
          demand_rate?: number | null
          description?: string | null
          economic_order_quantity?: number | null
          holding_cost_rate?: number | null
          id?: string
          lead_time_days?: number | null
          node_id?: string | null
          ordering_cost?: number | null
          project_id?: string
          reorder_point?: number | null
          safety_stock?: number | null
          sku?: string
          unit_cost?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "supply_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_policies: {
        Row: {
          created_at: string | null
          echelon_level: number
          id: string
          parameters: Json
          performance_metrics: Json | null
          policy_type: string | null
          project_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          echelon_level: number
          id?: string
          parameters: Json
          performance_metrics?: Json | null
          policy_type?: string | null
          project_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          echelon_level?: number
          id?: string
          parameters?: Json
          performance_metrics?: Json | null
          policy_type?: string | null
          project_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_policies_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_scenarios: {
        Row: {
          created_at: string | null
          id: string
          parameters: Json | null
          project_id: string | null
          results: Json | null
          scenario_name: string
          scenario_type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          parameters?: Json | null
          project_id?: string | null
          results?: Json | null
          scenario_name: string
          scenario_type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          parameters?: Json | null
          project_id?: string | null
          results?: Json | null
          scenario_name?: string
          scenario_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_scenarios_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      model_constraints: {
        Row: {
          constraint_name: string
          constraint_type: string
          created_at: string | null
          id: string
          is_active: boolean | null
          parameters: Json
          project_id: string
          user_id: string
        }
        Insert: {
          constraint_name: string
          constraint_type: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          parameters: Json
          project_id: string
          user_id: string
        }
        Update: {
          constraint_name?: string
          constraint_type?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          parameters?: Json
          project_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "model_constraints_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
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
      optimization_results: {
        Row: {
          cost_savings_percentage: number | null
          created_at: string | null
          execution_time_ms: number | null
          id: string
          input_parameters: Json
          optimization_type: string
          performance_metrics: Json | null
          project_id: string
          results: Json
          user_id: string
        }
        Insert: {
          cost_savings_percentage?: number | null
          created_at?: string | null
          execution_time_ms?: number | null
          id?: string
          input_parameters: Json
          optimization_type: string
          performance_metrics?: Json | null
          project_id: string
          results: Json
          user_id: string
        }
        Update: {
          cost_savings_percentage?: number | null
          created_at?: string | null
          execution_time_ms?: number | null
          id?: string
          input_parameters?: Json
          optimization_type?: string
          performance_metrics?: Json | null
          project_id?: string
          results?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "optimization_results_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      perishable_inventory: {
        Row: {
          alert: boolean | null
          batch_code: string | null
          expiry_date: string | null
          id: string
          item_id: string | null
          quantity: number
          received_date: string | null
          status: string | null
        }
        Insert: {
          alert?: boolean | null
          batch_code?: string | null
          expiry_date?: string | null
          id?: string
          item_id?: string | null
          quantity: number
          received_date?: string | null
          status?: string | null
        }
        Update: {
          alert?: boolean | null
          batch_code?: string | null
          expiry_date?: string | null
          id?: string
          item_id?: string | null
          quantity?: number
          received_date?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "perishable_inventory_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          project_type: string | null
          settings: Json | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          project_type?: string | null
          settings?: Json | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          project_type?: string | null
          settings?: Json | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      route_event_logs: {
        Row: {
          event_data: Json | null
          event_type: string | null
          handled: boolean | null
          id: string
          route_id: string | null
          severity: string | null
          timestamp: string | null
          vehicle_id: string | null
        }
        Insert: {
          event_data?: Json | null
          event_type?: string | null
          handled?: boolean | null
          id?: string
          route_id?: string | null
          severity?: string | null
          timestamp?: string | null
          vehicle_id?: string | null
        }
        Update: {
          event_data?: Json | null
          event_type?: string | null
          handled?: boolean | null
          id?: string
          route_id?: string | null
          severity?: string | null
          timestamp?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "route_event_logs_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "supply_routes"
            referencedColumns: ["id"]
          },
        ]
      }
      route_exceptions: {
        Row: {
          end_time: string | null
          exception_type: string | null
          id: string
          notes: string | null
          route_id: string | null
          severity: string | null
          start_time: string | null
        }
        Insert: {
          end_time?: string | null
          exception_type?: string | null
          id?: string
          notes?: string | null
          route_id?: string | null
          severity?: string | null
          start_time?: string | null
        }
        Update: {
          end_time?: string | null
          exception_type?: string | null
          id?: string
          notes?: string | null
          route_id?: string | null
          severity?: string | null
          start_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "route_exceptions_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "supply_routes"
            referencedColumns: ["id"]
          },
        ]
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
      simulation_scenarios: {
        Row: {
          created_at: string | null
          id: string
          parameters: Json
          project_id: string
          results: Json | null
          scenario_name: string
          scenario_type: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          parameters: Json
          project_id: string
          results?: Json | null
          scenario_name: string
          scenario_type?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          parameters?: Json
          project_id?: string
          results?: Json | null
          scenario_name?: string
          scenario_type?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "simulation_scenarios_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      supply_nodes: {
        Row: {
          capacity: number | null
          created_at: string | null
          demand: number | null
          fixed_cost: number | null
          id: string
          is_editable: boolean | null
          latitude: number
          longitude: number
          name: string
          node_type: string | null
          project_id: string
          properties: Json | null
          service_level: number | null
          updated_at: string | null
          user_id: string
          variable_cost: number | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          demand?: number | null
          fixed_cost?: number | null
          id?: string
          is_editable?: boolean | null
          latitude: number
          longitude: number
          name: string
          node_type?: string | null
          project_id: string
          properties?: Json | null
          service_level?: number | null
          updated_at?: string | null
          user_id: string
          variable_cost?: number | null
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          demand?: number | null
          fixed_cost?: number | null
          id?: string
          is_editable?: boolean | null
          latitude?: number
          longitude?: number
          name?: string
          node_type?: string | null
          project_id?: string
          properties?: Json | null
          service_level?: number | null
          updated_at?: string | null
          user_id?: string
          variable_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "supply_nodes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      supply_routes: {
        Row: {
          capacity: number | null
          co2_emissions: number | null
          cost_per_unit: number | null
          created_at: string | null
          destination_id: string | null
          distance: number | null
          estimated_arrival: string | null
          id: string
          is_active: boolean | null
          live_status: string | null
          origin_id: string | null
          project_id: string
          properties: Json | null
          risk_score: number | null
          route_type: string | null
          transit_time: number | null
          transport_mode: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          capacity?: number | null
          co2_emissions?: number | null
          cost_per_unit?: number | null
          created_at?: string | null
          destination_id?: string | null
          distance?: number | null
          estimated_arrival?: string | null
          id?: string
          is_active?: boolean | null
          live_status?: string | null
          origin_id?: string | null
          project_id: string
          properties?: Json | null
          risk_score?: number | null
          route_type?: string | null
          transit_time?: number | null
          transport_mode?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          capacity?: number | null
          co2_emissions?: number | null
          cost_per_unit?: number | null
          created_at?: string | null
          destination_id?: string | null
          distance?: number | null
          estimated_arrival?: string | null
          id?: string
          is_active?: boolean | null
          live_status?: string | null
          origin_id?: string | null
          project_id?: string
          properties?: Json | null
          risk_score?: number | null
          route_type?: string | null
          transit_time?: number | null
          transport_mode?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supply_routes_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "supply_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supply_routes_origin_id_fkey"
            columns: ["origin_id"]
            isOneToOne: false
            referencedRelation: "supply_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supply_routes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      transport_modes: {
        Row: {
          co2_factor: number | null
          description: string | null
          id: number
          mode_name: string
          speed_avg: number | null
        }
        Insert: {
          co2_factor?: number | null
          description?: string | null
          id?: number
          mode_name: string
          speed_avg?: number | null
        }
        Update: {
          co2_factor?: number | null
          description?: string | null
          id?: number
          mode_name?: string
          speed_avg?: number | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          company: string | null
          created_at: string | null
          full_name: string | null
          id: string
          plan_tier: string | null
          updated_at: string | null
          usage_quota: Json | null
          user_id: string
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          plan_tier?: string | null
          updated_at?: string | null
          usage_quota?: Json | null
          user_id: string
        }
        Update: {
          company?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          plan_tier?: string | null
          updated_at?: string | null
          usage_quota?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      vehicle_locations: {
        Row: {
          event: Json | null
          id: string
          latitude: number
          longitude: number
          status: string | null
          timestamp: string | null
          vehicle_id: string
        }
        Insert: {
          event?: Json | null
          id?: string
          latitude: number
          longitude: number
          status?: string | null
          timestamp?: string | null
          vehicle_id: string
        }
        Update: {
          event?: Json | null
          id?: string
          latitude?: number
          longitude?: number
          status?: string | null
          timestamp?: string | null
          vehicle_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_center_of_gravity: {
        Args: { project_uuid: string }
        Returns: {
          latitude: number
          longitude: number
          total_weight: number
        }[]
      }
      calculate_distance: {
        Args: { lat1: number; lon1: number; lat2: number; lon2: number }
        Returns: number
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
