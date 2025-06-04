
/// <reference types="vite/client" />

// Comprehensive React type override for maximum compatibility
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
    type ElementRef<T> = any;
    type ComponentPropsWithoutRef<T> = any;
    type ComponentPropsWithRef<T> = any;
    type HTMLAttributes<T> = any;
    type SVGProps<T> = any;
    type AriaAttributes = any;
    type DOMAttributes<T> = any;
    type ClassAttributes<T> = any;
    type SVGAttributes<T> = any;
    type CSSProperties = any;
    type SyntheticEvent<T = Element, E = Event> = any;
    type MouseEvent<T = Element> = any;
    type KeyboardEvent<T = Element> = any;
    type FormEvent<T = Element> = any;
    type ChangeEvent<T = Element> = any;
    type FocusEvent<T = Element> = any;
    type HTMLInputTypeAttribute = any;
    type Ref<T> = any;
    type MutableRefObject<T> = any;
    type RefCallback<T> = any;
    type RefObject<T> = any;
    type Context<T> = any;
    type Provider<T> = any;
    type Consumer<T> = any;
    type ComponentProps<T> = any;
    type JSXElementConstructor<P> = any;
    type Key = any;
    type Dispatch<A> = any;
    type SetStateAction<S> = any;
    type Reducer<S, A> = any;
    type ReducerState<R> = any;
    type ReducerAction<R> = any;
    type DependencyList = any;
    type EffectCallback = any;
    type MemoExoticComponent<T> = any;
    type LazyExoticComponent<T> = any;
    type SuspenseProps = any;
    type ReactPortal = any;
    type ReactText = any;
    type ReactChild = any;
    type ReactFragment = any;
    type ComponentClass<P = {}, S = any> = any;
    type StatelessComponent<P = {}> = any;
    type SFC<P = {}> = any;
    type ComponentState = any;
    
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

// Override all Radix UI module declarations with any types
declare module '@radix-ui/react-*' {
  const component: any;
  export = component;
  export default component;
  export const Root: any;
  export const Trigger: any;
  export const Content: any;
  export const Item: any;
  export const Header: any;
  export const Portal: any;
  export const Overlay: any;
  export const Title: any;
  export const Description: any;
  export const Action: any;
  export const Cancel: any;
  export const Image: any;
  export const Fallback: any;
  export const Indicator: any;
  export const List: any;
  export const Empty: any;
  export const Group: any;
  export const Separator: any;
  export const Input: any;
}

// Specific overrides for known Radix modules
declare module '@radix-ui/react-accordion' {
  export const Root: any;
  export const Item: any;
  export const Header: any;
  export const Trigger: any;
  export const Content: any;
}

declare module '@radix-ui/react-alert-dialog' {
  export const Root: any;
  export const Trigger: any;
  export const Portal: any;
  export const Overlay: any;
  export const Content: any;
  export const Header: any;
  export const Title: any;
  export const Description: any;
  export const Footer: any;
  export const Action: any;
  export const Cancel: any;
}

declare module '@radix-ui/react-avatar' {
  export const Root: any;
  export const Image: any;
  export const Fallback: any;
}

declare module '@radix-ui/react-checkbox' {
  export const Root: any;
  export const Indicator: any;
}

declare module 'cmdk' {
  export const Command: any;
  export interface CommandProps {
    [key: string]: any;
  }
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
