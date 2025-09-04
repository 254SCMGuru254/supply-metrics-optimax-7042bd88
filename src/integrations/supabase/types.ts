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
      analytics_data: {
        Row: {
          created_at: string | null
          id: string
          metric_data: Json | null
          metric_name: string
          metric_value: number | null
          project_id: string
          recorded_at: string | null
          time_period: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          metric_data?: Json | null
          metric_name: string
          metric_value?: number | null
          project_id: string
          recorded_at?: string | null
          time_period?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          metric_data?: Json | null
          metric_name?: string
          metric_value?: number | null
          project_id?: string
          recorded_at?: string | null
          time_period?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_data_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          context_data: Json | null
          created_at: string | null
          id: string
          messages: Json | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          context_data?: Json | null
          created_at?: string | null
          id?: string
          messages?: Json | null
          title?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          context_data?: Json | null
          created_at?: string | null
          id?: string
          messages?: Json | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      cost_model_inputs: {
        Row: {
          created_at: string
          id: string
          inputs: Json
          model_type: string
          project_id: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          inputs?: Json
          model_type: string
          project_id: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          inputs?: Json
          model_type?: string
          project_id?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cost_model_inputs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      cost_model_results: {
        Row: {
          cost_savings_percentage: number | null
          created_at: string
          execution_time_ms: number | null
          formula: string | null
          id: string
          inputs: Json
          model_type: string
          performance_metrics: Json | null
          project_id: string
          recommendations: string[] | null
          results: Json
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cost_savings_percentage?: number | null
          created_at?: string
          execution_time_ms?: number | null
          formula?: string | null
          id?: string
          inputs?: Json
          model_type: string
          performance_metrics?: Json | null
          project_id: string
          recommendations?: string[] | null
          results?: Json
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cost_savings_percentage?: number | null
          created_at?: string
          execution_time_ms?: number | null
          formula?: string | null
          id?: string
          inputs?: Json
          model_type?: string
          performance_metrics?: Json | null
          project_id?: string
          recommendations?: string[] | null
          results?: Json
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cost_model_results_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
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
      facility_location_results: {
        Row: {
          capacitated_results: Json | null
          cost_analysis: Json | null
          created_at: string | null
          demand_points: Json
          facilities: Json
          hub_location_results: Json | null
          id: string
          model_type: string
          optimization_parameters: Json
          optimization_results: Json
          p_median_results: Json | null
          project_id: string
          selected_facilities: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          capacitated_results?: Json | null
          cost_analysis?: Json | null
          created_at?: string | null
          demand_points?: Json
          facilities?: Json
          hub_location_results?: Json | null
          id?: string
          model_type: string
          optimization_parameters?: Json
          optimization_results?: Json
          p_median_results?: Json | null
          project_id: string
          selected_facilities?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          capacitated_results?: Json | null
          cost_analysis?: Json | null
          created_at?: string | null
          demand_points?: Json
          facilities?: Json
          hub_location_results?: Json | null
          id?: string
          model_type?: string
          optimization_parameters?: Json
          optimization_results?: Json
          p_median_results?: Json | null
          project_id?: string
          selected_facilities?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      facility_locations: {
        Row: {
          created_at: string | null
          demand_points: Json | null
          dynamic_plan: Json | null
          facilities: Json | null
          id: string
          optimization_params: Json | null
          optimization_results: Json | null
          project_id: string
          risk_factors: Json | null
          scenario_name: string
          scenario_type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          demand_points?: Json | null
          dynamic_plan?: Json | null
          facilities?: Json | null
          id?: string
          optimization_params?: Json | null
          optimization_results?: Json | null
          project_id: string
          risk_factors?: Json | null
          scenario_name: string
          scenario_type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          demand_points?: Json | null
          dynamic_plan?: Json | null
          facilities?: Json | null
          id?: string
          optimization_params?: Json | null
          optimization_results?: Json | null
          project_id?: string
          risk_factors?: Json | null
          scenario_name?: string
          scenario_type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      fleet_management: {
        Row: {
          created_at: string | null
          fleet_config: Json
          fuel_metrics: Json | null
          id: string
          maintenance_schedule: Json | null
          optimization_params: Json | null
          optimization_results: Json | null
          project_id: string
          routing_solution: Json | null
          telematics: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          fleet_config: Json
          fuel_metrics?: Json | null
          id?: string
          maintenance_schedule?: Json | null
          optimization_params?: Json | null
          optimization_results?: Json | null
          project_id: string
          routing_solution?: Json | null
          telematics?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          fleet_config?: Json
          fuel_metrics?: Json | null
          id?: string
          maintenance_schedule?: Json | null
          optimization_params?: Json | null
          optimization_results?: Json | null
          project_id?: string
          routing_solution?: Json | null
          telematics?: Json | null
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
      kpi_definitions: {
        Row: {
          bad_threshold: number | null
          description: string | null
          good_threshold: number | null
          higher_is_better: boolean
          id: number
          name: string
        }
        Insert: {
          bad_threshold?: number | null
          description?: string | null
          good_threshold?: number | null
          higher_is_better: boolean
          id?: never
          name: string
        }
        Update: {
          bad_threshold?: number | null
          description?: string | null
          good_threshold?: number | null
          higher_is_better?: boolean
          id?: never
          name?: string
        }
        Relationships: []
      }
      kpis: {
        Row: {
          id: number
          kpi_id: number | null
          model_id: string | null
          project_id: string | null
          recorded_at: string | null
          value: number | null
        }
        Insert: {
          id?: never
          kpi_id?: number | null
          model_id?: string | null
          project_id?: string | null
          recorded_at?: string | null
          value?: number | null
        }
        Update: {
          id?: never
          kpi_id?: number | null
          model_id?: string | null
          project_id?: string | null
          recorded_at?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "kpis_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "kpi_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kpis_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      model_backups: {
        Row: {
          backup_path: string | null
          backup_type: string
          checksum: string | null
          created_at: string | null
          file_size: number | null
          id: string
          model_data: Json
          model_type: string
          user_id: string
        }
        Insert: {
          backup_path?: string | null
          backup_type?: string
          checksum?: string | null
          created_at?: string | null
          file_size?: number | null
          id?: string
          model_data: Json
          model_type: string
          user_id: string
        }
        Update: {
          backup_path?: string | null
          backup_type?: string
          checksum?: string | null
          created_at?: string | null
          file_size?: number | null
          id?: string
          model_data?: Json
          model_type?: string
          user_id?: string
        }
        Relationships: []
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
      network_optimizations: {
        Row: {
          as_is_snapshot: Json | null
          created_at: string | null
          id: string
          metrics: Json | null
          multi_echelon_settings: Json | null
          network_graph: Json
          optimization_params: Json | null
          optimized_snapshot: Json | null
          project_id: string
          resilience_metrics: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          as_is_snapshot?: Json | null
          created_at?: string | null
          id?: string
          metrics?: Json | null
          multi_echelon_settings?: Json | null
          network_graph: Json
          optimization_params?: Json | null
          optimized_snapshot?: Json | null
          project_id: string
          resilience_metrics?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          as_is_snapshot?: Json | null
          created_at?: string | null
          id?: string
          metrics?: Json | null
          multi_echelon_settings?: Json | null
          network_graph?: Json
          optimization_params?: Json | null
          optimized_snapshot?: Json | null
          project_id?: string
          resilience_metrics?: Json | null
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
      risk_assessments: {
        Row: {
          assessment_results: Json
          confidence_level: number | null
          created_at: string | null
          id: string
          input_parameters: Json
          monte_carlo_results: Json | null
          project_id: string
          risk_type: string
          scenario_analysis: Json | null
          supplier_risks: Json | null
          updated_at: string | null
          user_id: string
          var_calculations: Json | null
        }
        Insert: {
          assessment_results?: Json
          confidence_level?: number | null
          created_at?: string | null
          id?: string
          input_parameters?: Json
          monte_carlo_results?: Json | null
          project_id: string
          risk_type: string
          scenario_analysis?: Json | null
          supplier_risks?: Json | null
          updated_at?: string | null
          user_id: string
          var_calculations?: Json | null
        }
        Update: {
          assessment_results?: Json
          confidence_level?: number | null
          created_at?: string | null
          id?: string
          input_parameters?: Json
          monte_carlo_results?: Json | null
          project_id?: string
          risk_type?: string
          scenario_analysis?: Json | null
          supplier_risks?: Json | null
          updated_at?: string | null
          user_id?: string
          var_calculations?: Json | null
        }
        Relationships: []
      }
      route_constraints: {
        Row: {
          cost: number | null
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          notes: string | null
          project_id: string
          restrictions: string[] | null
          time_delay: number | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cost?: number | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          notes?: string | null
          project_id: string
          restrictions?: string[] | null
          time_delay?: number | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cost?: number | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          notes?: string | null
          project_id?: string
          restrictions?: string[] | null
          time_delay?: number | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "route_constraints_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
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
      route_optimization_results: {
        Row: {
          algorithm_used: string
          cost_savings_percentage: number | null
          created_at: string | null
          execution_time_ms: number | null
          id: string
          input_parameters: Json
          optimization_results: Json
          performance_metrics: Json | null
          project_id: string
          route_data: Json | null
          user_id: string
        }
        Insert: {
          algorithm_used: string
          cost_savings_percentage?: number | null
          created_at?: string | null
          execution_time_ms?: number | null
          id?: string
          input_parameters: Json
          optimization_results: Json
          performance_metrics?: Json | null
          project_id: string
          route_data?: Json | null
          user_id: string
        }
        Update: {
          algorithm_used?: string
          cost_savings_percentage?: number | null
          created_at?: string | null
          execution_time_ms?: number | null
          id?: string
          input_parameters?: Json
          optimization_results?: Json
          performance_metrics?: Json | null
          project_id?: string
          route_data?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "route_optimization_results_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
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
      subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          monthly_price: number
          next_billing_date: string | null
          paypal_subscription_id: string | null
          plan_tier: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          monthly_price: number
          next_billing_date?: string | null
          paypal_subscription_id?: string | null
          plan_tier: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          monthly_price?: number
          next_billing_date?: string | null
          paypal_subscription_id?: string | null
          plan_tier?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
      usage_tracking: {
        Row: {
          created_at: string | null
          feature_type: string
          id: string
          reset_date: string | null
          updated_at: string | null
          usage_count: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          feature_type: string
          id?: string
          reset_date?: string | null
          updated_at?: string | null
          usage_count?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          feature_type?: string
          id?: string
          reset_date?: string | null
          updated_at?: string | null
          usage_count?: number | null
          user_id?: string
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
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
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
      vehicles: {
        Row: {
          capacity: number
          capacity_unit: string
          created_at: string
          driver_cost_per_day: number | null
          fuel_consumption: number | null
          height_limit: number | null
          id: string
          maintenance_cost: number | null
          max_speed: number | null
          misc_expenses: number | null
          name: string
          ownership: string
          project_id: string
          type: string
          updated_at: string
          user_id: string
          weight_limit: number | null
          width_limit: number | null
        }
        Insert: {
          capacity?: number
          capacity_unit?: string
          created_at?: string
          driver_cost_per_day?: number | null
          fuel_consumption?: number | null
          height_limit?: number | null
          id?: string
          maintenance_cost?: number | null
          max_speed?: number | null
          misc_expenses?: number | null
          name: string
          ownership?: string
          project_id: string
          type?: string
          updated_at?: string
          user_id: string
          weight_limit?: number | null
          width_limit?: number | null
        }
        Update: {
          capacity?: number
          capacity_unit?: string
          created_at?: string
          driver_cost_per_day?: number | null
          fuel_consumption?: number | null
          height_limit?: number | null
          id?: string
          maintenance_cost?: number | null
          max_speed?: number | null
          misc_expenses?: number | null
          name?: string
          ownership?: string
          project_id?: string
          type?: string
          updated_at?: string
          user_id?: string
          weight_limit?: number | null
          width_limit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      warehouses: {
        Row: {
          address: string | null
          automation_level: string | null
          cold_chain: boolean | null
          cold_chain_temperature: number | null
          created_at: string
          functions: string[] | null
          handling_cost_per_unit: number | null
          id: string
          labor_cost: number | null
          latitude: number
          longitude: number
          monthly_cost: number | null
          name: string
          ownership: string
          project_id: string
          size: number | null
          size_unit: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          automation_level?: string | null
          cold_chain?: boolean | null
          cold_chain_temperature?: number | null
          created_at?: string
          functions?: string[] | null
          handling_cost_per_unit?: number | null
          id?: string
          labor_cost?: number | null
          latitude: number
          longitude: number
          monthly_cost?: number | null
          name: string
          ownership?: string
          project_id: string
          size?: number | null
          size_unit?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          automation_level?: string | null
          cold_chain?: boolean | null
          cold_chain_temperature?: number | null
          created_at?: string
          functions?: string[] | null
          handling_cost_per_unit?: number | null
          id?: string
          labor_cost?: number | null
          latitude?: number
          longitude?: number
          monthly_cost?: number | null
          name?: string
          ownership?: string
          project_id?: string
          size?: number | null
          size_unit?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "warehouses_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
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
        Args: { lat1: number; lat2: number; lon1: number; lon2: number }
        Returns: number
      }
      calculate_eoq: {
        Args: {
          annual_demand: number
          holding_cost_rate: number
          ordering_cost: number
          unit_cost: number
        }
        Returns: Json
      }
      calculate_safety_stock: {
        Args: {
          demand_std_dev: number
          lead_time_days: number
          service_level: number
        }
        Returns: number
      }
      check_feature_access: {
        Args: { current_usage?: number; feature_name: string }
        Returns: {
          current_plan: string
          current_usage_count: number
          has_access: boolean
          usage_limit: number
        }[]
      }
      create_daily_backup: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
      optimize_inventory_multi_echelon: {
        Args: { inventory_data: Json }
        Returns: Json
      }
      restore_model_backup: {
        Args: { backup_id: string }
        Returns: Json
      }
    }
    Enums: {
      user_role: "admin" | "moderator" | "user"
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
      user_role: ["admin", "moderator", "user"],
    },
  },
} as const
