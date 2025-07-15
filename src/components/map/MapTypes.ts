
export interface Node {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  weight?: number;
  ownership?: 'owned' | 'leased' | 'proposed';
  capacity?: number;
  demand?: number;
  cost?: number;
  notes?: string;
  color?: string;
  isOptimized?: boolean;
  isSelected?: boolean;
  metadata?: any;
}

export interface Route {
  id: string;
  from: string;
  to: string;
  volume?: number;
  cost?: number;
  ownership?: string;
  label?: string;
  isOptimized?: boolean;
  isSelected?: boolean;
  mode?: 'truck' | 'rail' | 'air' | 'ship' | 'multimodal';
  type?: string;
  transitTime?: number;
}

export type OwnershipType = 'owned' | 'leased' | 'proposed';

export interface MapPathOptions {
  color?: string;
  weight?: number;
  opacity?: number;
  dashArray?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  nodeId?: string;
  unitCost: number;
  annualDemand?: number;
  demandRate: number;
  holdingCostRate: number;
  orderingCost: number;
  leadTime: number;
  serviceLevel?: number;
  safetyStock?: number;
  reorderPoint?: number;
  economicOrderQuantity?: number;
}

export interface EOQResult {
  eoq: number;
  economicOrderQuantity: number;
  totalCost: number;
  totalAnnualCost: number;
  orderingCost: number;
  holdingCost: number;
  reorderPoint?: number;
  safetyStock?: number;
  ordersPerYear: number;
  cycleTime: number;
}

export interface ABCAnalysisResult {
  item: InventoryItem;
  annualValue: number;
  percentage: number;
  cumulativePercentage: number;
  classification: 'A' | 'B' | 'C';
  classA: InventoryItem[];
  classB: InventoryItem[];
  classC: InventoryItem[];
  metrics: {
    totalItems: number;
    totalValue: number;
    aItems: number;
    bItems: number;
    cItems: number;
    classAValuePercentage: number;
  };
}
