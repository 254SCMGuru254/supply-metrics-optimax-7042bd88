
/// <reference types="vite/client" />
/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="react-router-dom" />
/// <reference types="@tanstack/react-query" />
/// <reference types="jspdf" />
/// <reference types="html2canvas" />
/// <reference types="leaflet" />

// Ensure React is properly declared
import * as React from 'react';
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

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
  
  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    color?: string;
    size?: number | string;
    strokeWidth?: number | string;
    absoluteStrokeWidth?: boolean;
    className?: string;
  }
  
  export type LucideIcon = React.FC<LucideProps>;
  export type LucideIconType = React.ForwardRefExoticComponent<
    React.SVGProps<SVGSVGElement> & {
      size?: number | string;
      color?: string;
      strokeWidth?: number | string;
    } & React.RefAttributes<SVGSVGElement>
  >;
  
  // All the icons from the previous declaration
  export const Home: LucideIcon;
  export const LayoutDashboard: LucideIcon;
  export const Settings: LucideIcon;
  export const Package: LucideIcon;
  export const Package2: LucideIcon;
  export const Truck: LucideIcon;
  export const LineChart: LucideIcon;
  export const BarChart3: LucideIcon;
  export const FileText: LucideIcon;
  export const HelpCircle: LucideIcon;
  export const CircleDollarSign: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const Calculator: LucideIcon;
  export const FileEdit: LucideIcon;
  export const Check: LucideIcon;
  export const Plus: LucideIcon;
  export const Link: LucideIcon;
  export const Network: LucideIcon;
  export const MapPin: LucideIcon;
  export const Building: LucideIcon;
  export const Hexagon: LucideIcon;
  export const DollarSign: LucideIcon;
  export const FileQuestion: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const Route: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const Download: LucideIcon;
  export const Loader2: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const Bot: LucideIcon;
  export const Upload: LucideIcon;
  export const Save: LucideIcon;
  export const FileDown: LucideIcon;
  export const Lightbulb: LucideIcon;
  export const Send: LucideIcon;
  export const Globe: LucideIcon;
  export const Store: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronUp: LucideIcon;
  export const Factory: LucideIcon;
  export const PlusCircle: LucideIcon;
  export const Trash2: LucideIcon;
  export const Database: LucideIcon;
  export const Boxes: LucideIcon;
  export const Target: LucideIcon;
  export const Train: LucideIcon;
  export const Ship: LucideIcon;
  export const Plane: LucideIcon;
  export const Clock: LucideIcon;
  export const Shield: LucideIcon;
  export const ArrowDown: LucideIcon;
  export const Users: LucideIcon;
  export const Percent: LucideIcon;
  export const CalendarDays: LucideIcon;
  export const TrendingDown: LucideIcon;
  export const ShoppingCart: LucideIcon;
  export const Compass: LucideIcon;
  export const LayoutGrid: LucideIcon;
  export const Map: LucideIcon;
  export const MessageSquare: LucideIcon;
  export const FileInput: LucideIcon;
  export const Info: LucideIcon;
  export const X: LucideIcon;
  export const CheckCircle: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const ListChecks: LucideIcon;
  export const Gauge: LucideIcon;
  export const Scale: LucideIcon;
  export const Coins: LucideIcon;
  export const Warehouse: LucideIcon;
  export const User: LucideIcon;
  export const BarChart: LucideIcon;
  
  // Map of all icons
  export const icons: Record<string, LucideIcon>;
}

// Fix unknown type errors in CostBreakdown.tsx by adding type definitions
declare namespace NetworkDesign {
  interface CostBreakdown {
    trunkingCost: number;
    deliveryCost: number;
    depotCost: number;
    stockHoldingCost: number;
    totalCost: number;
  }
}

declare module 'lovable-tagger' {
  export function componentTagger(): any;
}
