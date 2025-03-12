
import { Node, Route } from "@/components/map/MapTypes";
import { User, Session } from "@supabase/supabase-js";

export interface NetworkData {
  nodes: Node[];
  routes: Route[];
}

// This is to help with the database-related errors
export interface Database {
  id: string;
  name: string;
  nodes: Node[];
  routes: Route[];
  [key: string]: any; // Allow for additional properties
}

// Add specific exports for components using the Database type
export interface AirportIntegrationProps {
  database?: Database;
  airportNodes?: Node[];
}

export interface DisruptionSimulatorProps {
  database?: Database;
  disruptionPoints?: Database[];
}

export interface ResilienceMetricsProps {
  network?: Database;
  metrics?: any;
}

// Add missing type for auth context
export interface AuthError extends Error {
  message: string;
  status?: number;
}

// Update AuthContextType to match Supabase's return types
export interface AuthContextType {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<{
    error: AuthError | null;
    data: {
      user: User | null;
      session: Session | null;
    };
  }>;
  signUp: (email: string, password: string, metadata?: { full_name: string; company: string }) => Promise<{
    error: AuthError | null;
    data: {
      user: User | null;
    };
  }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  loading: boolean;
}
