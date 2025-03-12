
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
