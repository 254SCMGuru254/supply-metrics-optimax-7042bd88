
import { LatLngExpression, PathOptions, MarkerOptions } from 'leaflet';

export type NodeType = 'warehouse' | 'factory' | 'distribution' | 'supplier' | 'customer' | 'airport' | 'port' | 'railhub';
export type OwnershipType = 'owned' | 'hired' | 'outsourced';

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
  isOptimal?: boolean;
  icon?: string;
  color?: string;
  notes?: string;
  ownership?: OwnershipType;
  // Ownership-specific data
  monthlyRent?: number;
  contractDuration?: number;
  serviceProvider?: string;
  leaseTerms?: string;
  maintenanceIncluded?: boolean;
  // Asset details
  floorArea?: number;
  storageType?: string;
  temperature?: number;
  securityLevel?: string;
  accessibility?: string;
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
  type?: 'road' | 'rail' | 'air' | 'sea' | 'multimodal';
  ownership?: OwnershipType;
  vehicleId?: string;
  vehicleName?: string;
  // Transportation-specific ownership data
  fuelCostPerKm?: number;
  driverCost?: number;
  maintenanceCost?: number;
  insuranceCost?: number;
  rentalCostPerDay?: number;
  logisticsProvider?: string;
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
  category?: string;
  nodeId?: string;
  serviceLevel?: number;
  annualValue?: number;
  abcClass?: 'A' | 'B' | 'C';
}

export interface EOQResult {
  economicOrderQuantity: number;
  ordersPerYear: number;
  cycleTime: number; // in days
  totalAnnualCost: number;
  totalOrderingCost: number;
  totalHoldingCost: number;
  reorderPoint: number;
  safetyStock?: number;
}

export interface ABCAnalysisResult {
  classA: InventoryItem[];
  classB: InventoryItem[];
  classC: InventoryItem[];
  metrics: {
    classAValuePercentage: number;
    classBValuePercentage: number;
    classCValuePercentage: number;
    classAItemPercentage: number;
    classBItemPercentage: number;
    classCItemPercentage: number;
  };
}

// Additional type for airport integration
export interface AirportNode {
  id: string;
  name: string;
  type: 'airport';
  latitude: number;
  longitude: number;
  iataCode?: string;
  runwayLength?: number;
  capacity?: number;
  hub_type?: string;
  utilization?: number;
  delay_probability?: number;
  region?: string;
}

// Types for port integration
export interface PortNode {
  id: string;
  name: string;
  type: 'port';
  latitude: number;
  longitude: number;
  portCode?: string;
  maxShipSize?: number;
  terminals?: number;
}

// SuitabilityQuestionnaire types
export interface SuitabilityQuestion {
  id: string;
  text: string;
  category: string;
  options: {
    text: string;
    score: any;
    explanation?: string;
  }[];
}

export interface SuitabilityResults {
  routeOptimizationScore: number;
  inventoryOptimizationScore: number;
  networkFlowScore: number;
  cogScore: number;
  simulationScore: number;
  recommendedModel: string;
  explanation: string;
}
