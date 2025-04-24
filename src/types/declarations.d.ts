
// Type declarations for modules without @types packages

declare module '@huggingface/transformers' {
  export function pipeline(task: string, model: string, options?: any): Promise<any>;
}

// Extend existing types for react-leaflet
declare module 'react-leaflet' {
  import { LatLngExpression } from 'leaflet';
  
  export interface MapContainerProps {
    zoom?: number;
    center?: LatLngExpression;
    className?: string;
    style?: React.CSSProperties;
  }
  
  export interface TileLayerProps {
    attribution?: string;
    url: string;
  }
}

// Fix NodeMarkerProps and RoutePolylineProps types
declare module '@/components/map/MapTypes' {
  export interface NodeMarkerProps {
    node: any;
    onNodeClick?: (node: any) => void;
    key?: any;
  }
  
  export interface RoutePolylineProps {
    route: any;
    fromNode: any;
    toNode: any;
    isOptimized: boolean;
    key?: any;
  }
}
