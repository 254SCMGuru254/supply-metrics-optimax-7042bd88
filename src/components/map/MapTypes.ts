
import { LatLngExpression, PathOptions, MarkerOptions } from 'leaflet';

export type NodeType = 'warehouse' | 'factory' | 'retail' | 'distribution' | 'supplier' | 'custom';

export interface Node {
  id: string;
  name: string;
  type: NodeType;
  latitude: number;
  longitude: number;
  capacity?: number;
  demand?: number;
  cost?: number;
  weight?: number;
  isOptimized?: boolean;
  isSelected?: boolean;
  icon?: string;
  color?: string;
  notes?: string;
  inventory?: {
    [productId: string]: number;
  };
}

export interface Route {
  id: string;
  from: string;
  to: string;
  distance?: number;
  cost?: number;
  capacity?: number;
  flow?: number;
  isOptimized?: boolean;
  isSelected?: boolean;
  color?: string;
  notes?: string;
  mode?: 'truck' | 'air' | 'rail' | 'ship' | 'multimodal';
}

export interface MapPathOptions extends PathOptions {
  dashArray?: string;
  weight?: number;
}

export interface MapMarkerOptions extends MarkerOptions {
  radius?: number;
  fillColor?: string;
  color?: string;
  weight?: number;
  opacity?: number;
  fillOpacity?: number;
}

export interface NetworkData {
  nodes: Node[];
  routes: Route[];
}
