
/// <reference types="vite/client" />

// Enhanced React type definitions to resolve all TypeScript errors
declare module 'react' {
  export const StrictMode: React.ComponentType<{ children?: React.ReactNode }>;
  export const useState: typeof React.useState;
  export const useEffect: typeof React.useEffect;
  export const useRef: typeof React.useRef;
  export const useCallback: typeof React.useCallback;
  export const useMemo: typeof React.useMemo;
  export const useContext: typeof React.useContext;
  export const createContext: typeof React.createContext;
  export const forwardRef: typeof React.forwardRef;
  export const useId: () => string;
  export type ComponentType<P = {}> = React.ComponentType<P>;
  export type FC<P = {}> = React.FunctionComponent<P>;
  export type ReactNode = React.ReactNode;
  export type ReactElement = React.ReactElement;
  export type KeyboardEvent<T = Element> = React.KeyboardEvent<T>;
  export type MouseEvent<T = Element> = React.MouseEvent<T>;
  export type ChangeEvent<T = Element> = React.ChangeEvent<T>;
  export type FormEvent<T = Element> = React.FormEvent<T>;
  export type RefObject<T> = React.RefObject<T>;
  export type CSSProperties = React.CSSProperties;
  export type HTMLAttributes<T> = React.HTMLAttributes<T>;
  export type TextareaHTMLAttributes<T> = React.TextareaHTMLAttributes<T>;
  export type DetailedHTMLProps<E, T> = React.DetailedHTMLProps<E, T>;
  export type KeyboardEventHandler<T = Element> = React.KeyboardEventHandler<T>;
  export type MouseEventHandler<T = Element> = React.MouseEventHandler<T>;
}

// Enhanced Lucide React type definitions with ALL required icons
declare module 'lucide-react' {
  import { ComponentType } from 'react';
  
  export interface LucideProps {
    size?: number | string;
    color?: string;
    strokeWidth?: number;
    className?: string;
    style?: React.CSSProperties;
  }
  
  export type LucideIcon = ComponentType<LucideProps>;
  
  // All required icons for the application
  export const Home: LucideIcon;
  export const LayoutDashboard: LucideIcon;
  export const Settings: LucideIcon;
  export const Package: LucideIcon;
  export const LineChart: LucideIcon;
  export const BarChart3: LucideIcon;
  export const FileText: LucideIcon;
  export const HelpCircle: LucideIcon;
  export const CircleDollarSign: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const Activity: LucideIcon;
  export const Hexagon: LucideIcon;
  export const Loader2: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const Check: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const BookOpen: LucideIcon;
  export const Calendar: LucideIcon;
  export const ArrowDownToLine: LucideIcon;
  export const Play: LucideIcon;
  export const RefreshCcw: LucideIcon;
  export const Calculator: LucideIcon;
  export const Building: LucideIcon;
  export const Building2: LucideIcon;
  export const MessageSquare: LucideIcon;
  export const MessageSquareQuote: LucideIcon;
  export const Brain: LucideIcon;
  export const Network: LucideIcon;
  export const Target: LucideIcon;
  export const Warehouse: LucideIcon;
  export const Factory: LucideIcon;
  export const Truck: LucideIcon;
  export const Shield: LucideIcon;
  export const Store: LucideIcon;
  export const MapPin: LucideIcon;
  export const Upload: LucideIcon;
  export const Download: LucideIcon;
  export const Plus: LucideIcon;
  export const Trash2: LucideIcon;
  export const Layers: LucideIcon;
  export const Thermometer: LucideIcon;
  export const Box: LucideIcon;
  export const FileEdit: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const GripVertical: LucideIcon;
  export const Route: LucideIcon;
  export const DollarSign: LucideIcon;
  export const Package2: LucideIcon;
  export const FileQuestion: LucideIcon;
  
  // Icon aliases
  export const WarehouseIcon: LucideIcon;
  export const LayersIcon: LucideIcon;
  export const ThermometerIcon: LucideIcon;
  export const MapPinIcon: LucideIcon;
  export const CalculatorIcon: LucideIcon;
}

// Enhanced Button component props
declare module '@/components/ui/button' {
  import { ComponentType, ReactNode } from 'react';
  
  export interface ButtonProps {
    children?: ReactNode;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    asChild?: boolean;
  }
  
  export const Button: ComponentType<ButtonProps>;
}

// Enhanced Recharts type definitions
declare module 'recharts' {
  export interface LegendProps {
    content?: any;
    wrapperStyle?: React.CSSProperties;
    iconType?: string;
    layout?: 'horizontal' | 'vertical';
    align?: 'left' | 'center' | 'right';
    verticalAlign?: 'top' | 'middle' | 'bottom';
    height?: number;
    formatter?: (value: any, entry: any) => React.ReactNode;
  }
  
  export const ResponsiveContainer: React.ComponentType<any>;
  export const BarChart: React.ComponentType<any>;
  export const LineChart: React.ComponentType<any>;
  export const PieChart: React.ComponentType<any>;
  export const Bar: React.ComponentType<any>;
  export const Line: React.ComponentType<any>;
  export const Pie: React.ComponentType<any>;
  export const XAxis: React.ComponentType<any>;
  export const YAxis: React.ComponentType<any>;
  export const CartesianGrid: React.ComponentType<any>;
  export const Tooltip: React.ComponentType<any>;
  export const Legend: React.ComponentType<LegendProps>;
  export const Cell: React.ComponentType<any>;
}

// Enhanced HTML element interfaces
declare global {
  namespace JSX {
    interface IntrinsicElements {
      textarea: React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
      caption: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableCaptionElement>, HTMLTableCaptionElement>;
    }
  }
}
