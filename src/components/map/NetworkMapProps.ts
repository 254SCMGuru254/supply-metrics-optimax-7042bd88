
// Define local interfaces for Network Map
export interface Node {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  capacity?: number;
  demand?: number;
  fixed_cost?: number;
  variable_cost?: number;
}

export interface Route {
  id: string;
  from: string;
  to: string;
  label?: string;
  ownership?: string;
}

export interface NetworkMapProps {
  nodes: Node[];
  routes?: Route[];
  center?: [number, number];
  zoom?: number;
}
