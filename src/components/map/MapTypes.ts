
export type NodeType = 'factory' | 'distribution' | 'supplier' | 'customer' | 'retail' | 'facility' | 'demand' | 'airport' | 'port' | 'warehouse';
export type OwnershipType = 'owned' | 'leased' | 'outsourced' | 'proposed' | 'hired';

export interface Node {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: NodeType;
  capacity?: number;
  demand?: number;
  cost?: number;
  weight?: number;
  ownership?: OwnershipType;
  notes?: string;
  properties?: Record<string, any>;
  color?: string;
  isOptimized?: boolean;
  isSelected?: boolean;
  metadata?: Record<string, any>;
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
  transitTime?: number;
  type?: string;
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
  name?: string;
  nodeId?: string;
  unitCost: number;
  demandRate: number;
  annualDemand?: number;
  leadTime: number;
  holdingCostRate: number;
  holdingCost?: number;
  orderingCost: number;
  safetyStock: number;
  reorderPoint: number;
  economicOrderQuantity: number;
  serviceLevel?: number;
  abcClassification?: 'A' | 'B' | 'C';
  abcClass?: 'A' | 'B' | 'C';
  annualValue?: number;
}

export interface EOQResult {
  eoq: number;
  economicOrderQuantity?: number;
  totalCost: number;
  orderingCost: number;
  holdingCost: number;
  reorderPoint: number;
  safetyStock: number;
  ordersPerYear?: number;
}

export interface ABCAnalysisResult {
  item: InventoryItem;
  annualValue: number;
  percentage: number;
  cumulativePercentage: number;
  classification: 'A' | 'B' | 'C';
  classA?: InventoryItem[];
  classB?: InventoryItem[];
  classC?: InventoryItem[];
}
