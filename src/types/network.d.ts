
import { Node, Route } from "@/components/map/MapTypes";

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
