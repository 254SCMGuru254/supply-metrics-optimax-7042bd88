
/// <reference types="vite/client" />
/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="react-router-dom" />
/// <reference types="@tanstack/react-query" />
/// <reference types="jspdf" />
/// <reference types="html2canvas" />
/// <reference types="leaflet" />

// Declare module for any packages that don't have type declarations
declare module '@huggingface/transformers' {
  export function pipeline(task: string, model: string, options?: any): Promise<any>;
}

declare module 'react-leaflet' {
  import { FC, ReactNode } from 'react';
  import { 
    LatLngExpression, 
    LatLngTuple, 
    LatLngBoundsExpression, 
    Map as LeafletMap, 
    MapOptions, 
    Layer, 
    LayerGroup, 
    Control,
    DomEvent, 
    DomUtil, 
    Popup, 
    PopupOptions, 
    Tooltip, 
    TooltipOptions, 
    PathOptions, 
    PolylineOptions, 
    CircleMarkerOptions 
  } from 'leaflet';
  
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
    children?: ReactNode;
  }
  
  export interface PopupProps extends PopupOptions {
    position?: LatLngExpression;
    children?: ReactNode;
  }
  
  export interface PolylineProps {
    positions: LatLngExpression[] | LatLngExpression[][];
    pathOptions?: PolylineOptions;
    children?: ReactNode;
  }

  export const MapContainer: FC<MapContainerProps>;
  export const TileLayer: FC<TileLayerProps>;
  export const Marker: FC<MarkerProps>;
  export const Popup: FC<PopupProps>;
  export const Polyline: FC<PolylineProps>;
  export const CircleMarker: FC<any>;
  export const useMap: () => LeafletMap;
  export const useMapEvent: (type: string, handler: (...args: any[]) => void) => LeafletMap;
  export const useMapEvents: (handlers: { [key: string]: (...args: any[]) => void }) => LeafletMap;
}

// Add additional module declarations
declare module 'leaflet-defaulticon-compatibility' {
  const content: any;
  export default content;
}

declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Add explicit declarations for packages with type issues
declare module 'lucide-react' {
  import React from 'react';
  
  interface IconProps extends React.SVGProps<SVGSVGElement> {
    color?: string;
    size?: number | string;
    strokeWidth?: number | string;
    absoluteStrokeWidth?: boolean;
    className?: string;
  }
  
  // Common icons
  export const Home: React.FC<IconProps>;
  export const LayoutDashboard: React.FC<IconProps>;
  export const Settings: React.FC<IconProps>;
  export const Package: React.FC<IconProps>;
  export const Package2: React.FC<IconProps>;
  export const Truck: React.FC<IconProps>;
  export const LineChart: React.FC<IconProps>;
  export const BarChart3: React.FC<IconProps>;
  export const FileText: React.FC<IconProps>;
  export const HelpCircle: React.FC<IconProps>;
  export const CircleDollarSign: React.FC<IconProps>;
  export const TrendingUp: React.FC<IconProps>;
  export const Calculator: React.FC<IconProps>;
  export const FileEdit: React.FC<IconProps>;
  export const Check: React.FC<IconProps>;
  export const Plus: React.FC<IconProps>;
  export const Link: React.FC<IconProps>;
  export const Network: React.FC<IconProps>;
  export const MapPin: React.FC<IconProps>;
  export const Building: React.FC<IconProps>;
  export const Hexagon: React.FC<IconProps>;
  export const DollarSign: React.FC<IconProps>;
  export const FileQuestion: React.FC<IconProps>;
  export const ChevronRight: React.FC<IconProps>;
  export const Route: React.FC<IconProps>;
  
  // Added missing icons that were causing errors
  export const Download: React.FC<IconProps>;
  export const Loader2: React.FC<IconProps>;
  export const ChevronLeft: React.FC<IconProps>;
  export const Bot: React.FC<IconProps>;
  export const Upload: React.FC<IconProps>;
  export const AlertCircle: React.FC<IconProps>;
  export const Save: React.FC<IconProps>;
  export const FileDown: React.FC<IconProps>;
  export const Lightbulb: React.FC<IconProps>;
  export const Send: React.FC<IconProps>;
  export const Globe: React.FC<IconProps>;
  export const Store: React.FC<IconProps>;
  export const ChevronDown: React.FC<IconProps>;
  export const ChevronUp: React.FC<IconProps>;
  export const Factory: React.FC<IconProps>;
  export const PlusCircle: React.FC<IconProps>;
  export const Trash2: React.FC<IconProps>;
  export const Database: React.FC<IconProps>;
  export const Boxes: React.FC<IconProps>;
  export const Target: React.FC<IconProps>;
  
  // Map of all icons
  export const icons: Record<string, React.FC<IconProps>>;
}

declare namespace React {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // Add any custom attributes used in your project
    // For example:
    css?: any;
  }
}

declare module 'lovable-tagger' {
  export function componentTagger(): any;
}
