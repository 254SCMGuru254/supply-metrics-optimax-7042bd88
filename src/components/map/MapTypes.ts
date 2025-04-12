
export interface Node {
  id: string;
  name: string;
  type: "warehouse" | "distribution" | "retail" | "airport" | "railhub" | "port" | "border";
  latitude: number;
  longitude: number;
  weight?: number;
  capacity?: number;
  isOptimal?: boolean;
  metadata?: {
    restrictions?: {
      weightLimit?: number;
      heightLimit?: number;
      widthLimit?: number;
      environmentalZone?: boolean;
      permitRequired?: boolean;
      weightLimitDescription?: string;
    };
    trafficFactor?: number;
    tollCost?: number;
    checkpointWaitTime?: number;
    capacity?: number;
    demand?: number;
    leadTime?: number;
    holdingCost?: number;
    orderingCost?: number;
  };
}

export interface Route {
  id: string;
  from: string;
  to: string;
  volume?: number;
  transitTime?: number;
  cost?: number;
  isOptimized?: boolean;
  type?: "road" | "rail" | "sea" | "air";
}

export interface NodeMarkerProps {
  node: Node;
  onNodeClick?: (node: Node) => void;
}

export interface RoutePolylineProps {
  route: Route;
  fromNode: Node;
  toNode: Node;
  isOptimized?: boolean;
}

export interface NetworkMapProps {
  nodes: Node[];
  routes: Route[];
  isOptimized?: boolean;
  onMapClick?: (latitude: number, longitude: number) => void;
  onNodeClick?: (node: Node) => void;
}

export interface OptimizationResult {
  nodes: Node[];
  routes: Route[];
  cost: number;
  travelTime: number;
  metrics: {
    totalDistance: number;
    totalCost: number;
    totalTime: number;
    serviceLevel: number;
  };
}

// Inventory Optimization Types
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  unitCost: number;
  annualDemand: number;
  orderingCost: number; // Cost per order
  holdingCost: number; // Annual holding cost as percentage of unit cost
  leadTime: number; // In days
  serviceLevel: number; // As percentage (e.g., 95%)
  abcClass?: "A" | "B" | "C";
  annualValue?: number; // Added this property to fix errors
}

export interface EOQResult {
  economicOrderQuantity: number;
  ordersPerYear: number;
  cycleTime: number; // Time between orders in days
  totalAnnualCost: number;
  reorderPoint: number;
  safetyStock: number;
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

// Route Optimization Types
export interface Vehicle {
  id: string;
  type: string;
  capacity: number;
  costPerKm: number;
  maxDistance?: number;
  speed: number; // km/h
  availableTimes?: {
    start: string;
    end: string;
  };
}

export interface DeliveryLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  demand: number;
  timeWindow?: {
    start: string;
    end: string;
  };
  serviceTime?: number; // minutes
}

export interface VRPResult {
  routes: {
    vehicleId: string;
    stops: DeliveryLocation[];
    totalDistance: number;
    totalTime: number;
    totalCost: number;
    load: number;
  }[];
  metrics: {
    totalDistance: number;
    totalTime: number;
    totalCost: number;
    vehiclesUsed: number;
    serviceLevel: number;
  };
}

// Suitability Questionnaire Types
export interface SuitabilityQuestion {
  id: string;
  text: string;
  category: "route" | "inventory" | "network" | "general" | "technical" | "cog" | "simulation";
  options: {
    text: string;
    score: number | { 
      route: number;
      inventory: number;
      network: number;
      cog: number;
      simulation: number;
    };
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
