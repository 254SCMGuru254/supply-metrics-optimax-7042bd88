
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
  metadata?: {
    [key: string]: any;
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
  volume?: number;
  transitTime?: number;
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

// Inventory types for inventory optimization
export interface InventoryItem {
  id: string;
  name: string;
  unitCost: number;
  annualDemand: number;
  orderingCost: number;
  holdingCost: number;
  leadTime: number; // in days
  safetyStock?: number;
  category?: 'A' | 'B' | 'C';
  nodeId?: string;
}

export interface EOQResult {
  economicOrderQuantity: number;
  ordersPerYear: number;
  cycleTime: number; // in days
  totalAnnualCost: number;
  totalOrderingCost: number;
  totalHoldingCost: number;
  reorderPoint: number;
}

export interface ABCAnalysisResult {
  aItems: InventoryItem[];
  bItems: InventoryItem[];
  cItems: InventoryItem[];
  aPercentage: number;
  bPercentage: number;
  cPercentage: number;
  aValuePercentage: number;
  bValuePercentage: number;
  cValuePercentage: number;
}

// Additional type for airport integration
export interface AirportNode extends Node {
  type: 'airport';
  iataCode?: string;
  runwayLength?: number;
  capacity?: number;
}

// Types for port integration
export interface PortNode extends Node {
  type: 'port';
  portCode?: string;
  maxShipSize?: number;
  terminals?: number;
}
