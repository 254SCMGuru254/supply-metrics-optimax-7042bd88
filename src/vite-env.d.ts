
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
  
  // Enhanced TextareaProps interface
  export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    className?: string;
    placeholder?: string;
    value?: string;
    defaultValue?: string;
    disabled?: boolean;
    readOnly?: boolean;
    rows?: number;
    cols?: number;
    id?: string;
    name?: string;
    onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
    onFocus?: React.FocusEventHandler<HTMLTextAreaElement>;
    onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    ref?: React.Ref<HTMLTextAreaElement>;
  }
}

// Enhanced Lucide React type definitions
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
  
  // All available icons from lucide-react
  export const Calculator: LucideIcon;
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
  export const MessageSquare: LucideIcon;
  export const BookOpen: LucideIcon;
  export const Calendar: LucideIcon;
  export const ArrowDownToLine: LucideIcon;
  export const Play: LucideIcon;
  export const RefreshCcw: LucideIcon;
  export const Building: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const GripVertical: LucideIcon;
  
  // Icon aliases for common names
  export const WarehouseIcon: LucideIcon;
  export const LayersIcon: LucideIcon;
  export const ThermometerIcon: LucideIcon;
  export const MapPinIcon: LucideIcon;
  export const CalculatorIcon: LucideIcon;
  export const Building2: LucideIcon;
  export const MessageSquareQuote: LucideIcon;
}

// Recharts type definitions
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

// Radix UI type definitions with proper component interfaces
declare module '@radix-ui/react-primitive' {
  export interface PrimitiveProps {
    asChild?: boolean;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }
}

declare module '@radix-ui/react-hover-card' {
  import { ComponentType } from 'react';
  interface ContentProps {
    children?: React.ReactNode;
    className?: string;
    sideOffset?: number;
    align?: 'start' | 'center' | 'end';
  }
  export const Root: ComponentType<any>;
  export const Trigger: ComponentType<any>;
  export const Content: ComponentType<ContentProps>;
  export const Portal: ComponentType<any>;
}

declare module '@radix-ui/react-label' {
  import { ComponentType } from 'react';
  interface RootProps {
    children?: React.ReactNode;
    className?: string;
    htmlFor?: string;
  }
  export const Root: ComponentType<RootProps>;
}

declare module '@radix-ui/react-menubar' {
  import { ComponentType } from 'react';
  interface RootProps {
    children?: React.ReactNode;
    className?: string;
  }
  export const Root: ComponentType<RootProps>;
  export const Menu: ComponentType<any>;
  export const MenuTrigger: ComponentType<any>;
  export const MenuContent: ComponentType<any>;
  export const MenuItem: ComponentType<any>;
}

declare module 'cmdk' {
  import { ComponentType } from 'react';
  
  interface CommandProps {
    children?: React.ReactNode;
    className?: string;
    shouldFilter?: boolean;
    filter?: (value: string, search: string) => number;
    value?: string;
    onValueChange?: (value: string) => void;
  }
  
  interface CommandSubComponent {
    Input: ComponentType<any>;
    List: ComponentType<any>;
    Empty: ComponentType<any>;
    Group: ComponentType<any>;
    Item: ComponentType<any>;
    Separator: ComponentType<any>;
  }
  
  export const Command: ComponentType<CommandProps> & CommandSubComponent;
}

declare module 'vaul' {
  import { ComponentType } from 'react';
  
  interface DrawerSubComponent {
    Root: ComponentType<any>;
    Trigger: ComponentType<any>;
    Portal: ComponentType<any>;
    Overlay: ComponentType<any>;
    Content: ComponentType<any>;
    Title: ComponentType<any>;
    Description: ComponentType<any>;
    Close: ComponentType<any>;
  }
  
  export const Drawer: DrawerSubComponent;
}

declare module 'react-resizable-panels' {
  import { ComponentType } from 'react';
  
  interface PanelGroupProps {
    children?: React.ReactNode;
    className?: string;
    direction?: 'horizontal' | 'vertical';
  }
  
  interface PanelProps {
    children?: React.ReactNode;
    className?: string;
    defaultSize?: number;
    minSize?: number;
    maxSize?: number;
  }
  
  interface PanelResizeHandleProps {
    children?: React.ReactNode;
    className?: string;
    disabled?: boolean;
  }
  
  export const PanelGroup: ComponentType<PanelGroupProps>;
  export const Panel: ComponentType<PanelProps>;
  export const PanelResizeHandle: ComponentType<PanelResizeHandleProps>;
}

// Enhanced HTML element interfaces with proper event handlers
declare global {
  namespace JSX {
    interface IntrinsicElements {
      textarea: React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> & {
        className?: string;
        placeholder?: string;
        value?: string;
        onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
        onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
        disabled?: boolean;
        rows?: number;
        id?: string;
        ref?: React.Ref<HTMLTextAreaElement>;
      };
      
      caption: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableCaptionElement>, HTMLTableCaptionElement> & {
        className?: string;
        children?: React.ReactNode;
        ref?: React.Ref<HTMLTableCaptionElement>;
      };
    }
  }
}
