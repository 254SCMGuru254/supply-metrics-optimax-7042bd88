import { Node, Route } from "@/components/map/MapTypes";

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
      nodes: {
        Row: {
          id: string;
          user_id: string;
          latitude: number;
          longitude: number;
          capacity: number | null;
          fixed_cost: number | null;
          variable_cost: number | null;
          created_at: string | null;
          updated_at: string | null;
          name: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          latitude: number;
          longitude: number;
          capacity?: number | null;
          fixed_cost?: number | null;
          variable_cost?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
          name: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          latitude?: number;
          longitude?: number;
          capacity?: number | null;
          fixed_cost?: number | null;
          variable_cost?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
          name?: string;
        };
      };
      routes: {
        Row: {
          id: string;
          user_id: string;
          origin_id: string | null;
          destination_id: string | null;
          distance: number | null;
          cost_per_unit: number | null;
          transit_time: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          origin_id?: string | null;
          destination_id?: string | null;
          distance?: number | null;
          cost_per_unit?: number | null;
          transit_time?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          origin_id?: string | null;
          destination_id?: string | null;
          distance?: number | null;
          cost_per_unit?: number | null;
          transit_time?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      demand_points: {
        Row: {
          id: string;
          user_id: string;
          latitude: number;
          longitude: number;
          demand: number;
          service_level: number | null;
          created_at: string | null;
          updated_at: string | null;
          name: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          latitude: number;
          longitude: number;
          demand: number;
          service_level?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
          name: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          latitude?: number;
          longitude?: number;
          demand?: number;
          service_level?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
          name?: string;
        };
      };
      supply_chain_networks: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          nodes: Node[];
          routes: Route[];
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          nodes: Node[];
          routes: Route[];
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          nodes?: Node[];
          routes?: Route[];
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      disruption_scenarios: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: string;
          impact_nodes: string[];
          impact_severity: number;
          duration: number;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: string;
          impact_nodes: string[];
          impact_severity: number;
          duration: number;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: string;
          impact_nodes?: string[];
          impact_severity?: number;
          duration?: number;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string | null;
          company: string | null;
          plan_tier: string;
          usage_quota: Json;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name?: string | null;
          company?: string | null;
          plan_tier?: string;
          usage_quota?: Json;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string | null;
          company?: string | null;
          plan_tier?: string;
          usage_quota?: Json;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      demand_event_logs: {
        Row: {
          id: string;
          node_id: string | null;
          timestamp: string | null;
          event_type: string | null;
          event_data: Json | null;
          severity: string | null;
          handled: boolean | null;
        };
        Insert: {
          id?: string;
          node_id?: string | null;
          timestamp?: string | null;
          event_type?: string | null;
          event_data?: Json | null;
          severity?: string | null;
          handled?: boolean | null;
        };
        Update: {
          id?: string;
          node_id?: string | null;
          timestamp?: string | null;
          event_type?: string | null;
          event_data?: Json | null;
          severity?: string | null;
          handled?: boolean | null;
        };
      };
      perishable_inventory: {
        Row: {
          id: string;
          item_id: string | null;
          batch_code: string | null;
          received_date: string | null;
          expiry_date: string | null;
          quantity: number;
          status: string | null;
          alert: boolean | null;
        };
        Insert: {
          id?: string;
          item_id?: string | null;
          batch_code?: string | null;
          received_date?: string | null;
          expiry_date?: string | null;
          quantity: number;
          status?: string | null;
          alert?: boolean | null;
        };
        Update: {
          id?: string;
          item_id?: string | null;
          batch_code?: string | null;
          received_date?: string | null;
          expiry_date?: string | null;
          quantity?: number;
          status?: string | null;
          alert?: boolean | null;
        };
      };
      inventory_scenarios: {
        Row: {
          id: string;
          project_id: string | null;
          user_id: string | null;
          scenario_name: string;
          scenario_type: string | null;
          parameters: Json | null;
          results: Json | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          project_id?: string | null;
          user_id?: string | null;
          scenario_name: string;
          scenario_type?: string | null;
          parameters?: Json | null;
          results?: Json | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          project_id?: string | null;
          user_id?: string | null;
          scenario_name?: string;
          scenario_type?: string | null;
          parameters?: Json | null;
          results?: Json | null;
          created_at?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
