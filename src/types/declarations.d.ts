

// Type declarations for modules without @types packages

declare module '@huggingface/transformers' {
  export function pipeline(task: string, model: string, options?: any): Promise<any>;
}

// Add explicit declarations for react-leaflet
declare module 'react-leaflet' {
  import { FC, ReactNode } from 'react';
  import { LatLngExpression, LatLngTuple, LatLngBoundsExpression, Map as LeafletMap, MapOptions, Layer, LayerGroup, Control, DomEvent, DomUtil, Popup, PopupOptions, Tooltip, TooltipOptions, PathOptions, PolylineOptions, CircleMarkerOptions } from 'leaflet';
  
  export interface MapContainerProps extends MapOptions {
    center?: LatLngExpression;
    zoom?: number;
    children?: ReactNode;
    className?: string;
    id?: string;
    style?: React.CSSProperties;
    whenCreated?: (map: LeafletMap) => void;
    whenReady?: () => void;
  }
  
  export interface TileLayerProps {
    attribution?: string;
    url: string;
    zIndex?: number;
    opacity?: number;
    tileSize?: number;
  }
  
  export interface MarkerProps {
    position: LatLngExpression;
    icon?: any;
    draggable?: boolean;
    eventHandlers?: any;
    zIndexOffset?: number;
    opacity?: number;
  }
  
  export interface PopupProps extends PopupOptions {
    position?: LatLngExpression;
  }
  
  export interface PolylineProps {
    positions: LatLngExpression[] | LatLngExpression[][];
    pathOptions?: PolylineOptions;
  }

  export const MapContainer: FC<MapContainerProps>;
  export const TileLayer: FC<TileLayerProps>;
  export const Marker: FC<MarkerProps>;
  export const Popup: FC<PopupProps>;
  export const Polyline: FC<PolylineProps>;
  
  export function useMap(): LeafletMap;
  export function useMapEvent(type: string, handler: (...args: any[]) => void): LeafletMap;
  export function useMapEvents(handlers: { [key: string]: (...args: any[]) => void }): LeafletMap;
}

// Fix NodeMarkerProps and RoutePolylineProps types
declare module '@/components/map/MapTypes' {
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
    key?: any;
  }

  export interface RoutePolylineProps {
    route: Route;
    fromNode: Node;
    toNode: Node;
    isOptimized: boolean;
    key?: any;
  }

  export interface InventoryItem {
    id: string;
    name: string;
    category: string;
    unitCost: number;
    annualDemand: number;
    orderingCost: number;
    holdingCost: number;
    leadTime: number;
    serviceLevel: number;
    abcClass?: "A" | "B" | "C";
    annualValue?: number;
  }

  export interface EOQResult {
    economicOrderQuantity: number;
    ordersPerYear: number;
    cycleTime: number;
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
}
