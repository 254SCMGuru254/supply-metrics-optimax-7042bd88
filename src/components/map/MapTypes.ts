
import { LatLngExpression } from "leaflet";

export type Node = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type?: string;
  capacity?: number;
  cost?: number;
  weight?: number;
  isOptimized?: boolean;
  isDisrupted?: boolean;
  metadata?: {
    restrictions?: {
      heightLimit?: number;
      weightLimit?: number;
      widthLimit?: number;
      environmentalZone?: boolean;
      permitRequired?: boolean;
    };
    trafficFactor?: number;
    tollCost?: number;
    checkpointWaitTime?: number;
  };
};

export type Route = {
  id: string;
  from: string;
  to: string;
  distance?: number;
  time?: number;
  cost?: number;
  flow?: number;
  capacity?: number;
  isOptimized?: boolean;
  isDisrupted?: boolean;
  volume?: number;
  transitTime?: number;
  type?: "road" | "rail" | "air" | "sea";
};

export type NodeMarkerProps = {
  node: Node;
  onNodeClick?: (node: Node) => void;
};

export type RoutePolylineProps = {
  route: Route;
  fromNode: Node;
  toNode: Node;
  isOptimized?: boolean;
};

export type MapControllerProps = {
  onMapReady: (map: L.Map) => void;
};

export type MapEventHandlerProps = {
  onMapClick: (lat: number, lng: number) => void;
};

// Add inventory optimization types
export type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  demandRate: number;
  orderCost: number;
  holdingCost: number;
  leadTime: number;
  unitCost: number;
  reorderPoint?: number;
  safetyStock?: number;
  currentStock?: number;
  category?: 'A' | 'B' | 'C';
};

export type EOQResult = {
  economicOrderQuantity: number;
  annualOrderingCost: number;
  annualHoldingCost: number;
  totalAnnualCost: number;
  ordersPerYear: number;
  cycleDays: number;
};

export type ABCAnalysisResult = {
  categoryA: InventoryItem[];
  categoryB: InventoryItem[];
  categoryC: InventoryItem[];
  categoryAValue: number;
  categoryBValue: number;
  categoryCValue: number;
  categoryAPercentItems: number;
  categoryAPercentValue: number;
};
