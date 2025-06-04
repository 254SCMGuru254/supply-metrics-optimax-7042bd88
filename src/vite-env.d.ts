
/// <reference types="vite/client" />

// Complete React type override for maximum compatibility
declare global {
  namespace React {
    type ElementType<P = any> = any;
    type ComponentType<P = {}> = any;
    type ForwardRefExoticComponent<P> = any;
    type ReactNode = any;
    type ReactElement<P = any, T = any> = any;
    type FunctionComponent<P = {}> = any;
    type FC<P = {}> = any;
    type Component<P = {}, S = {}, SS = any> = any;
    type RefAttributes<T> = any;
    type PropsWithChildren<P = {}> = P & { children?: ReactNode };
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
      [key: string]: any;
    }
    interface SVGProps<T> extends SVGAttributes<T>, ClassAttributes<T> {
      [key: string]: any;
    }
    interface AriaAttributes {
      [key: string]: any;
    }
    interface DOMAttributes<T> {
      [key: string]: any;
    }
    interface ClassAttributes<T> {
      [key: string]: any;
    }
    interface SVGAttributes<T> {
      [key: string]: any;
    }
  }
}

// Override all Radix UI module declarations
declare module '@radix-ui/react-*' {
  const component: any;
  export = component;
  export default component;
}

// Declare modules for packages
declare module 'react' {
  export * from 'react';
  export = React;
  export as namespace React;
}

declare module 'recharts' {
  import React from 'react';
  export const LineChart: React.FC<any>;
  export const BarChart: React.FC<any>;
  export const XAxis: React.FC<any>;
  export const YAxis: React.FC<any>;
  export const CartesianGrid: React.FC<any>;
  export const Tooltip: React.FC<any>;
  export const Legend: React.FC<any>;
  export const Line: React.FC<any>;
  export const Bar: React.FC<any>;
  export const ResponsiveContainer: React.FC<any>;
  export interface LegendProps {
    [key: string]: any;
  }
}

declare module 'lucide-react' {
  import React from 'react';
  export interface LucideProps {
    color?: string;
    size?: number | string;
    strokeWidth?: number | string;
    className?: string;
    [key: string]: any;
  }
  export type LucideIcon = React.FC<LucideProps>;
  
  // Export all icons individually
  export const Home: LucideIcon;
  export const LayoutDashboard: LucideIcon;
  export const Settings: LucideIcon;
  export const Package: LucideIcon;
  export const Truck: LucideIcon;
  export const LineChart: LucideIcon;
  export const BarChart3: LucideIcon;
  export const FileText: LucideIcon;
  export const HelpCircle: LucideIcon;
  export const CircleDollarSign: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const Calculator: LucideIcon;
  export const Check: LucideIcon;
  export const Plus: LucideIcon;
  export const Network: LucideIcon;
  export const MapPin: LucideIcon;
  export const Building: LucideIcon;
  export const DollarSign: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const Route: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const Download: LucideIcon;
  export const Loader2: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const Bot: LucideIcon;
  export const Upload: LucideIcon;
  export const Save: LucideIcon;
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
  export const AlertTriangle: LucideIcon;
  export const MoreHorizontal: LucideIcon;
  export const Search: LucideIcon;
  export const FileInput: LucideIcon;
  export const FileEdit: LucideIcon;
  export const FileDown: LucideIcon;
  export const FileQuestion: LucideIcon;
  export const Package2: LucideIcon;
  export const Hexagon: LucideIcon;
  export const Link: LucideIcon;
  export const Boxes: LucideIcon;
  export const CreditCard: LucideIcon;
  export const Wallet: LucideIcon;
  export const Receipt: LucideIcon;
  
  // Export the icons object for dynamic access
  export const icons: Record<string, LucideIcon>;
}

declare module 'react-leaflet' {
  import React from 'react';
  import { LatLngExpression, Map as LeafletMap } from 'leaflet';
  
  export interface MapContainerProps {
    center?: LatLngExpression;
    zoom?: number;
    children?: React.ReactNode;
    style?: React.CSSProperties;
    [key: string]: any;
  }
  
  export interface TileLayerProps {
    url: string;
    attribution?: string;
    [key: string]: any;
  }
  
  export interface MarkerProps {
    position: LatLngExpression;
    icon?: any;
    eventHandlers?: any;
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  export interface PopupProps {
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  export interface PolylineProps {
    positions: LatLngExpression[];
    pathOptions?: any;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export const MapContainer: React.FC<MapContainerProps>;
  export const TileLayer: React.FC<TileLayerProps>;
  export const Marker: React.FC<MarkerProps>;
  export const Popup: React.FC<PopupProps>;
  export const Polyline: React.FC<PolylineProps>;
  export const useMap: () => LeafletMap;
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
