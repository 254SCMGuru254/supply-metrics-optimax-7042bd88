
export type NodeType = 'factory' | 'distribution' | 'supplier' | 'customer' | 'retail' | 'facility' | 'demand' | 'airport' | 'port';
export type OwnershipType = 'owned' | 'leased' | 'outsourced' | 'proposed';

export interface Node {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: NodeType;
  capacity?: number;
  demand?: number;
  cost?: number;
  properties?: Record<string, any>;
  color?: string;
  isOptimized?: boolean;
  isSelected?: boolean;
}

export interface Route {
  id: string;
  from: string;
  to: string;
  distance?: number;
  cost?: number;
  ownership: OwnershipType;
  label?: string;
  volume?: number;
  isOptimized?: boolean;
  isSelected?: boolean;
  mode?: string;
}

export interface MapPathOptions {
  color?: string;
  weight?: number;
  opacity?: number;
  dashArray?: string;
}

export interface NetworkData {
  nodes: Node[];
  routes: Route[];
}

// Inventory types
export interface InventoryItem {
  id: string;
  sku: string;
  description: string;
  unitCost: number;
  demandRate: number;
  leadTime: number;
  holdingCostRate: number;
  orderingCost: number;
  safetyStock: number;
  reorderPoint: number;
  economicOrderQuantity: number;
  abcClassification?: 'A' | 'B' | 'C';
}

export interface EOQResult {
  eoq: number;
  totalCost: number;
  orderingCost: number;
  holdingCost: number;
  reorderPoint: number;
  safetyStock: number;
}

export interface ABCAnalysisResult {
  item: InventoryItem;
  annualValue: number;
  percentage: number;
  cumulativePercentage: number;
  classification: 'A' | 'B' | 'C';
}
