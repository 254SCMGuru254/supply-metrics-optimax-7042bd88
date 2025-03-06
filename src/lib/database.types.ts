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
      disruption_scenarios: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string
          disruption_type: string
          impact_level: number
          duration: number
          affected_nodes: Json
          probability: number
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description: string
          disruption_type: string
          impact_level: number
          duration: number
          affected_nodes: Json
          probability: number
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string
          disruption_type?: string
          impact_level?: number
          duration?: number
          affected_nodes?: Json
          probability?: number
          user_id?: string
        }
      }
      supply_chain_networks: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string
          nodes: Json
          edges: Json
          user_id: string
          is_public: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description: string
          nodes: Json
          edges: Json
          user_id: string
          is_public?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string
          nodes?: Json
          edges?: Json
          user_id?: string
          is_public?: boolean
        }
      }
      supplier_profiles: {
        Row: {
          id: string
          created_at: string
          name: string
          location: Json
          risk_score: number
          capacity: number
          lead_time: number
          cost: number
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          location: Json
          risk_score: number
          capacity: number
          lead_time: number
          cost: number
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          location?: Json
          risk_score?: number
          capacity?: number
          lead_time?: number
          cost?: number
          user_id?: string
        }
      }
      resilience_metrics: {
        Row: {
          id: string
          created_at: string
          network_id: string
          connectivity_score: number
          recovery_time: number
          redundancy_score: number
          adaptability_score: number
          vulnerability_index: number
          metrics_data: Json
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          network_id: string
          connectivity_score: number
          recovery_time: number
          redundancy_score: number
          adaptability_score: number
          vulnerability_index: number
          metrics_data: Json
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          network_id?: string
          connectivity_score?: number
          recovery_time?: number
          redundancy_score?: number
          adaptability_score?: number
          vulnerability_index?: number
          metrics_data?: Json
          user_id?: string
        }
      }
      optimization_results: {
        Row: {
          id: string
          created_at: string
          network_id: string
          optimization_type: string
          parameters: Json
          results: Json
          execution_time: number
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          network_id: string
          optimization_type: string
          parameters: Json
          results: Json
          execution_time: number
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          network_id?: string
          optimization_type?: string
          parameters?: Json
          results?: Json
          execution_time?: number
          user_id?: string
        }
      }
      airport_nodes: {
        Row: {
          id: string
          created_at: string
          name: string
          iata_code: string
          location: Json
          capacity: number
          operation_hours: Json
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          iata_code: string
          location: Json
          capacity: number
          operation_hours: Json
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          iata_code?: string
          location?: Json
          capacity?: number
          operation_hours?: Json
          user_id?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          created_at: string
          user_id: string
          full_name: string
          company: string
          plan_tier: string
          usage_quota: Json
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          full_name: string
          company: string
          plan_tier?: string
          usage_quota?: Json
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          full_name?: string
          company?: string
          plan_tier?: string
          usage_quota?: Json
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_network_resilience: {
        Args: { network_id: string }
        Returns: Json
      }
      generate_disruption_impact: {
        Args: { network_id: string; disruption_id: string }
        Returns: Json
      }
      optimize_facility_location: {
        Args: { network_data: Json; parameters: Json }
        Returns: Json
      }
      optimize_routing: {
        Args: { network_data: Json; parameters: Json }
        Returns: Json
      }
    }
    Enums: {
      disruption_type: "pandemic" | "natural_disaster" | "political_instability" | "infrastructure_failure"
      optimization_type: "facility_location" | "routing" | "inventory" | "supplier_diversity"
      plan_tier: "basic" | "standard" | "premium"
    }
  }
}
