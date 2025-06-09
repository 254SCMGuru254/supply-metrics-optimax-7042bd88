
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
  export type ButtonHTMLAttributes<T> = React.ButtonHTMLAttributes<T>;
  export type InputHTMLAttributes<T> = React.InputHTMLAttributes<T>;
  export type TextareaHTMLAttributes<T> = React.TextareaHTMLAttributes<T>;
  export type DetailedHTMLProps<E, T> = React.DetailedHTMLProps<E, T>;
  export type KeyboardEventHandler<T = Element> = React.KeyboardEventHandler<T>;
  export type MouseEventHandler<T = Element> = React.MouseEventHandler<T>;
  export type ElementRef<T> = React.ElementRef<T>;
  export type ComponentPropsWithoutRef<T> = React.ComponentPropsWithoutRef<T>;
  export type ComponentProps<T> = React.ComponentProps<T>;
  export type ComponentPropsWithRef<T> = React.ComponentPropsWithRef<T>;
  export type ThHTMLAttributes<T> = React.ThHTMLAttributes<T>;
  export type TdHTMLAttributes<T> = React.TdHTMLAttributes<T>;
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
  export type LucideIconType = LucideIcon;
  export interface LucideIconProps extends LucideProps {}
  
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
  export const TrendingDown: LucideIcon;
  export const Activity: LucideIcon;
  export const Hexagon: LucideIcon;
  export const Loader2: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronUp: LucideIcon;
  export const Check: LucideIcon;
  export const CheckCircle: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const BookOpen: LucideIcon;
  export const Calendar: LucideIcon;
  export const CalendarDays: LucideIcon;
  export const ArrowDownToLine: LucideIcon;
  export const ArrowDown: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const Play: LucideIcon;
  export const RefreshCcw: LucideIcon;
  export const Calculator: LucideIcon;
  export const CalculatorIcon: LucideIcon;
  export const Building: LucideIcon;
  export const Building2: LucideIcon;
  export const MessageSquare: LucideIcon;
  export const MessageSquareQuote: LucideIcon;
  export const Brain: LucideIcon;
  export const Train: LucideIcon;
  export const Network: LucideIcon;
  export const Target: LucideIcon;
  export const Warehouse: LucideIcon;
  export const WarehouseIcon: LucideIcon;
  export const Factory: LucideIcon;
  export const Truck: LucideIcon;
  export const Ship: LucideIcon;
  export const Plane: LucideIcon;
  export const Shield: LucideIcon;
  export const Store: LucideIcon;
  export const MapPin: LucideIcon;
  export const MapPinIcon: LucideIcon;
  export const Upload: LucideIcon;
  export const Download: LucideIcon;
  export const Plus: LucideIcon;
  export const PlusCircle: LucideIcon;
  export const Trash2: LucideIcon;
  export const Layers: LucideIcon;
  export const LayersIcon: LucideIcon;
  export const Thermometer: LucideIcon;
  export const ThermometerIcon: LucideIcon;
  export const Box: LucideIcon;
  export const Boxes: LucideIcon;
  export const FileEdit: LucideIcon;
  export const FileInput: LucideIcon;
  export const FileQuestion: LucideIcon;
  export const GripVertical: LucideIcon;
  export const Route: LucideIcon;
  export const DollarSign: LucideIcon;
  export const Package2: LucideIcon;
  export const Save: LucideIcon;
  export const Send: LucideIcon;
  export const Users: LucideIcon;
  export const User: LucideIcon;
  export const Clock: LucideIcon;
  export const Info: LucideIcon;
  export const X: LucideIcon;
  export const Database: LucideIcon;
  export const Percent: LucideIcon;
  export const ShoppingCart: LucideIcon;
  export const Link: LucideIcon;
  export const CreditCard: LucideIcon;
  export const Coins: LucideIcon;
  export const Gauge: LucideIcon;
  export const Scale: LucideIcon;
  export const Compass: LucideIcon;
  export const LayoutGrid: LucideIcon;
  export const Map: LucideIcon;
  export const Globe: LucideIcon;
  export const FileDown: LucideIcon;
  export const Lightbulb: LucideIcon;
  export const Edit: LucideIcon;
  export const MoreHorizontal: LucideIcon;
  export const Menu: LucideIcon;
  export const PanelLeft: LucideIcon;
  export const Circle: LucideIcon;
  export const Search: LucideIcon;
  
  // Icon aliases
  export { Warehouse as WarehouseIcon };
  export { Layers as LayersIcon };
  export { Thermometer as ThermometerIcon };
  export { MapPin as MapPinIcon };
  export { Calculator as CalculatorIcon };
}

// Enhanced Button component props with button variants
declare module '@/components/ui/button' {
  import { ComponentType, ReactNode } from 'react';
  import { VariantProps } from 'class-variance-authority';
  
  export interface ButtonProps {
    children?: ReactNode;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
    asChild?: boolean;
    ref?: React.Ref<HTMLButtonElement>;
  }
  
  export const Button: ComponentType<ButtonProps>;
  export const buttonVariants: any;
}

// Complete Recharts type definitions
declare module 'recharts' {
  import { ComponentType, ReactNode } from 'react';
  
  export interface ResponsiveContainerProps {
    width?: string | number;
    height?: string | number;
    children?: ReactNode;
  }
  
  export interface LineChartProps {
    data?: any[];
    margin?: {
      top?: number;
      right?: number;
      left?: number;
      bottom?: number;
    };
    children?: ReactNode;
  }
  
  export interface BarChartProps {
    data?: any[];
    margin?: {
      top?: number;
      right?: number;
      left?: number;
      bottom?: number;
    };
    children?: ReactNode;
  }
  
  export interface PieChartProps {
    data?: any[];
    margin?: {
      top?: number;
      right?: number;
      left?: number;
      bottom?: number;
    };
    children?: ReactNode;
  }
  
  export interface XAxisProps {
    dataKey?: string;
    tickFormatter?: (value: any) => string;
  }
  
  export interface YAxisProps {
    tickFormatter?: (value: any) => string;
  }
  
  export interface TooltipProps {
    labelFormatter?: (value: any) => string;
    formatter?: (value: any, name?: string) => [string, string];
  }
  
  export interface LineProps {
    type?: "monotone" | "basis" | "cardinal" | "linear" | "step";
    dataKey?: string;
    stroke?: string;
    strokeWidth?: number;
    name?: string;
    activeDot?: { r: number } | boolean;
  }
  
  export interface BarProps {
    dataKey?: string;
    fill?: string;
    name?: string;
  }
  
  export interface PieProps {
    dataKey?: string;
    cx?: number | string;
    cy?: number | string;
    outerRadius?: number;
    fill?: string;
    children?: ReactNode;
  }
  
  export interface CellProps {
    fill?: string;
  }
  
  export interface CartesianGridProps {
    strokeDasharray?: string;
  }
  
  export interface LegendProps {}
  
  export const ResponsiveContainer: ComponentType<ResponsiveContainerProps>;
  export const LineChart: ComponentType<LineChartProps>;
  export const BarChart: ComponentType<BarChartProps>;
  export const PieChart: ComponentType<PieChartProps>;
  export const XAxis: ComponentType<XAxisProps>;
  export const YAxis: ComponentType<YAxisProps>;
  export const CartesianGrid: ComponentType<CartesianGridProps>;
  export const Tooltip: ComponentType<TooltipProps>;
  export const Legend: ComponentType<LegendProps>;
  export const Line: ComponentType<LineProps>;
  export const Bar: ComponentType<BarProps>;
  export const Pie: ComponentType<PieProps>;
  export const Cell: ComponentType<CellProps>;
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
