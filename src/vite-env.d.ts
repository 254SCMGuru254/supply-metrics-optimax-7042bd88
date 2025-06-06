
/// <reference types="vite/client" />

// Enhanced TypeScript declarations for React compatibility
declare module 'react' {
  interface ForwardRefExoticComponent<P> extends React.ComponentType<P> {
    $$typeof: symbol;
    render: (props: P, ref: React.Ref<any>) => React.ReactElement | null;
    displayName?: string;
    defaultProps?: Partial<P>;
  }
  
  // Complete React exports with proper typing
  export function useState<T>(initialState: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void];
  export function useState<T = undefined>(): [T | undefined, (value: T | undefined | ((prev: T | undefined) => T | undefined)) => void];
  export const useEffect: (effect: () => void | (() => void), deps?: any[]) => void;
  export const useContext: <T>(context: React.Context<T>) => T;
  export const createContext: <T>(defaultValue: T) => React.Context<T>;
  export const useRef: <T>(initialValue: T) => React.RefObject<T>;
  export const useMemo: <T>(factory: () => T, deps: any[]) => T;
  export const useCallback: <T extends (...args: any[]) => any>(callback: T, deps: any[]) => T;
  export const forwardRef: <T, P = {}>(render: (props: P, ref: React.Ref<T>) => React.ReactElement | null) => React.ForwardRefExoticComponent<P & React.RefAttributes<T>>;
  export const Fragment: React.ComponentType<{ children?: React.ReactNode }>;
  export const useId: () => string;
  
  // React types
  export type ComponentType<P = {}> = React.ComponentType<P>;
  export type ChangeEvent<T = Element> = {
    target: T & { value: string; checked?: boolean; name?: string };
    currentTarget: T;
  };
  export type KeyboardEvent<T = Element> = {
    key: string;
    preventDefault: () => void;
    stopPropagation: () => void;
    currentTarget: T;
    altKey: boolean;
    charCode: number;
    ctrlKey: boolean;
    code: string;
    keyCode: number;
    location: number;
    metaKey: boolean;
    repeat: boolean;
    shiftKey: boolean;
    which: number;
    detail: number;
    view: Window;
    bubbles: boolean;
    cancelable: boolean;
    defaultPrevented: boolean;
    eventPhase: number;
    isTrusted: boolean;
    target: EventTarget;
    timeStamp: number;
    type: string;
  };
  export type MouseEvent<T = Element> = {
    preventDefault: () => void;
    stopPropagation: () => void;
    currentTarget: T;
  };
  export type FormEvent<T = Element> = {
    preventDefault: () => void;
    currentTarget: T;
  };
  
  // Component types
  export type ComponentProps<T> = any;
  export type ComponentPropsWithoutRef<T> = any;
  export type ElementRef<T> = any;
  export type HTMLAttributes<T> = {
    className?: string;
    children?: React.ReactNode;
    onClick?: (event: MouseEvent<T>) => void;
    style?: React.CSSProperties;
    id?: string;
  };
  export type ButtonHTMLAttributes<T> = HTMLAttributes<T> & {
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
  };
  export type InputHTMLAttributes<T> = HTMLAttributes<T> & {
    type?: string;
    value?: string | number;
    placeholder?: string;
    onChange?: (event: ChangeEvent<T>) => void;
    onKeyDown?: (event: KeyboardEvent<T>) => void;
    disabled?: boolean;
    min?: string | number;
    max?: string | number;
    step?: string | number;
    rows?: number;
  };
  export type TextareaHTMLAttributes<T> = HTMLAttributes<T> & {
    placeholder?: string;
    value?: string;
    onChange?: (event: ChangeEvent<T>) => void;
    onKeyDown?: (event: KeyboardEvent<T>) => void;
    disabled?: boolean;
    rows?: number;
    cols?: number;
    wrap?: string;
    maxLength?: number;
    minLength?: number;
    readOnly?: boolean;
    required?: boolean;
    autoComplete?: string;
    autoFocus?: boolean;
    form?: string;
    name?: string;
    spellCheck?: boolean;
  };
  
  // HTML Element Attribute Types
  export type ThHTMLAttributes<T> = HTMLAttributes<T> & {
    abbr?: string;
    align?: "left" | "center" | "right" | "justify" | "char";
    axis?: string;
    bgcolor?: string;
    char?: string;
    charoff?: string;
    colspan?: number;
    headers?: string;
    height?: number | string;
    nowrap?: boolean;
    rowspan?: number;
    scope?: string;
    sorted?: string;
    valign?: "top" | "middle" | "bottom" | "baseline";
    width?: number | string;
  };
  
  export type TdHTMLAttributes<T> = HTMLAttributes<T> & {
    abbr?: string;
    align?: "left" | "center" | "right" | "justify" | "char";
    axis?: string;
    bgcolor?: string;
    char?: string;
    charoff?: string;
    colspan?: number;
    headers?: string;
    height?: number | string;
    nowrap?: boolean;
    rowspan?: number;
    scope?: string;
    sorted?: string;
    valign?: "top" | "middle" | "bottom" | "baseline";
    width?: number | string;
  };
  
  export type ReactNode = string | number | boolean | React.ReactElement | React.ReactFragment | React.ReactPortal | null | undefined;
  export type CSSProperties = any;
}

// React Router DOM compatibility
declare module 'react-router-dom' {
  export const Link: React.ForwardRefExoticComponent<any>;
  export const NavLink: React.ForwardRefExoticComponent<any>;
  export const useNavigate: () => any;
  export const useLocation: () => any;
  export const useParams: () => any;
  export const Routes: React.ForwardRefExoticComponent<any>;
  export const Route: React.ForwardRefExoticComponent<any>;
  export const BrowserRouter: React.ForwardRefExoticComponent<any>;
}

// Complete Lucide React icons compatibility - FIXED TYPE DEFINITIONS
declare module 'lucide-react' {
  export interface LucideIconProps {
    size?: number;
    color?: string;
    strokeWidth?: number;
    absoluteStrokeWidth?: boolean;
    className?: string;
    style?: React.CSSProperties;
  }
  
  export type LucideIconType = React.ForwardRefExoticComponent<LucideIconProps>;
  
  export const Home: LucideIconType;
  export const LayoutDashboard: LucideIconType;
  export const Settings: LucideIconType;
  export const Package: LucideIconType;
  export const Truck: LucideIconType;
  export const LineChart: LucideIconType;
  export const BarChart3: LucideIconType;
  export const FileText: LucideIconType;
  export const HelpCircle: LucideIconType;
  export const CircleDollarSign: LucideIconType;
  export const TrendingUp: LucideIconType;
  export const Activity: LucideIconType;
  export const Hexagon: LucideIconType;
  export const ChevronLeft: LucideIconType;
  export const ChevronRight: LucideIconType;
  export const Download: LucideIconType;
  export const Loader2: LucideIconType;
  export const Check: LucideIconType;
  export const CheckCircle: LucideIconType;
  export const Search: LucideIconType;
  export const X: LucideIconType;
  
  // COMPLETE ICON MAPPING FOR ALL MISSING ICONS
  export const Bot: LucideIconType;
  export const Building: LucideIconType;
  export const Upload: LucideIconType;
  export const AlertCircle: LucideIconType;
  export const Save: LucideIconType;
  export const FileDown: LucideIconType;
  export const Lightbulb: LucideIconType;
  export const Send: LucideIconType;
  export const Globe: LucideIconType;
  export const MapPin: LucideIconType;
  export const Users: LucideIconType;
  export const Shield: LucideIconType;
  export const Store: LucideIconType;
  export const Calculator: LucideIconType;
  export const Network: LucideIconType;
  export const Route: LucideIconType;
  export const DollarSign: LucideIconType;
  export const Package2: LucideIconType;
  export const FileQuestion: LucideIconType;
  export const ArrowRight: LucideIconType;
  export const AlertTriangle: LucideIconType;
  export const Coins: LucideIconType;
  export const Gauge: LucideIconType;
  export const Scale: LucideIconType;
  export const Compass: LucideIconType;
  export const LayoutGrid: LucideIconType;
  export const Map: LucideIconType;
  export const MessageSquare: LucideIconType;
  export const Target: LucideIconType;
  export const Factory: LucideIconType;
  export const Warehouse: LucideIconType;
  export const PlusCircle: LucideIconType;
  export const Trash2: LucideIconType;
  export const Info: LucideIconType;
  export const Plus: LucideIconType;
  export const FileInput: LucideIconType;
  export const Clock: LucideIconType;
  
  // Additional missing icons
  export const Database: LucideIconType;
  export const Boxes: LucideIconType;
  export const ArrowDown: LucideIconType;
  export const Percent: LucideIconType;
  export const CalendarDays: LucideIconType;
  export const TrendingDown: LucideIconType;
  export const ShoppingCart: LucideIconType;
  export const User: LucideIconType;
  export const Link: LucideIconType;
  export const CreditCard: LucideIconType;
  export const Train: LucideIconType;
  export const Ship: LucideIconType;
  export const Plane: LucideIconType;
  export const ListChecks: LucideIconType;
  export const ChevronDown: LucideIconType;
  export const MoreHorizontal: LucideIconType;
  
  // MISSING ARROW ICONS - CRITICAL FIX
  export const ArrowLeft: LucideIconType;
  export const ArrowUp: LucideIconType;
  
  // MISSING UI ICONS
  export const Circle: LucideIconType;
  export const GripVertical: LucideIconType;
  export const ChevronUp: LucideIconType;
  export const PanelLeft: LucideIconType;
  
  // Legacy compatibility
  export const LucideIcon: LucideIconType;
  export type LucideProps = LucideIconProps;
}

// Enhanced TextareaProps interface with ALL required properties
declare global {
  interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    placeholder?: string;
    value?: string;
    onChange?: (e: any) => void;
    onKeyDown?: (e: any) => void;
    className?: string;
    id?: string;
    rows?: number;
    disabled?: boolean;
    children?: React.ReactNode;
  }
  
  // HTML Element interfaces with children support
  interface HTMLDivElement {
    children?: React.ReactNode;
  }
  
  interface HTMLTableElement {
    children?: React.ReactNode;
  }
  
  interface HTMLTableSectionElement {
    children?: React.ReactNode;
  }
  
  interface HTMLTableRowElement {
    children?: React.ReactNode;
  }
  
  interface HTMLTableCellElement {
    children?: React.ReactNode;
    align?: "left" | "center" | "right" | "justify" | "char";
  }
  
  interface HTMLTableCaptionElement {
    children?: React.ReactNode;
    align?: "left" | "center" | "right" | "justify" | "char";
  }
  
  interface HTMLHeadingElement {
    children?: React.ReactNode;
  }
  
  interface HTMLParagraphElement {
    children?: React.ReactNode;
  }
}

// Recharts compatibility with complete type definitions
declare module 'recharts' {
  export const ResponsiveContainer: React.ForwardRefExoticComponent<any>;
  export const LineChart: React.ForwardRefExoticComponent<any>;
  export const Line: React.ForwardRefExoticComponent<any>;
  export const XAxis: React.ForwardRefExoticComponent<any>;
  export const YAxis: React.ForwardRefExoticComponent<any>;
  export const Tooltip: React.ForwardRefExoticComponent<any>;
  export const Legend: React.ForwardRefExoticComponent<any>;
  export const CartesianGrid: React.ForwardRefExoticComponent<any>;
  export const BarChart: React.ForwardRefExoticComponent<any>;
  export const Bar: React.ForwardRefExoticComponent<any>;
  export const PieChart: React.ForwardRefExoticComponent<any>;
  export const Pie: React.ForwardRefExoticComponent<any>;
  export const Cell: React.ForwardRefExoticComponent<any>;
  export const ReferenceLine: React.ForwardRefExoticComponent<any>;
  export const Area: React.ForwardRefExoticComponent<any>;
  export const AreaChart: React.ForwardRefExoticComponent<any>;
  
  // Complete Recharts types
  export interface LegendProps {
    content?: React.ComponentType<any>;
    payload?: any[];
    verticalAlign?: 'top' | 'middle' | 'bottom';
    align?: 'left' | 'center' | 'right';
    iconType?: string;
    wrapperStyle?: React.CSSProperties;
  }
}

// Complete Radix UI module declarations with proper typing - ALL FIXED
declare module '@radix-ui/react-accordion' {
  export const Root: React.ComponentType<any>;
  export const Item: React.ComponentType<any>;
  export const Header: React.ComponentType<any>;
  export const Trigger: React.ComponentType<any>;
  export const Content: React.ComponentType<any>;
}

declare module '@radix-ui/react-alert-dialog' {
  export const Root: React.ComponentType<any>;
  export const Trigger: React.ComponentType<any>;
  export const Portal: React.ComponentType<any>;
  export const Overlay: React.ComponentType<any>;
  export const Content: React.ComponentType<any>;
  export const Title: React.ComponentType<any>;
  export const Description: React.ComponentType<any>;
  export const Action: React.ComponentType<any>;
  export const Cancel: React.ComponentType<any>;
}

declare module '@radix-ui/react-avatar' {
  export const Root: React.ComponentType<any>;
  export const Image: React.ComponentType<any>;
  export const Fallback: React.ComponentType<any>;
}

declare module '@radix-ui/react-checkbox' {
  export const Root: React.ComponentType<any>;
  export const Indicator: React.ComponentType<any>;
}

declare module '@radix-ui/react-context-menu' {
  export const Root: React.ComponentType<any>;
  export const Trigger: React.ComponentType<any>;
  export const Portal: React.ComponentType<any>;
  export const Content: React.ComponentType<any>;
  export const Group: React.ComponentType<any>;
  export const Item: React.ComponentType<any>;
  export const CheckboxItem: React.ComponentType<any>;
  export const RadioGroup: React.ComponentType<any>;
  export const RadioItem: React.ComponentType<any>;
  export const ItemIndicator: React.ComponentType<any>;
  export const Separator: React.ComponentType<any>;
  export const Label: React.ComponentType<any>;
  export const Sub: React.ComponentType<any>;
  export const SubTrigger: React.ComponentType<any>;
  export const SubContent: React.ComponentType<any>;
}

declare module '@radix-ui/react-dialog' {
  export const Root: React.ComponentType<any>;
  export const Trigger: React.ComponentType<any>;
  export const Portal: React.ComponentType<any>;
  export const Overlay: React.ComponentType<any>;
  export const Content: React.ComponentType<any>;
  export const Title: React.ComponentType<any>;
  export const Description: React.ComponentType<any>;
  export const Close: React.ComponentType<any>;
}

declare module '@radix-ui/react-dropdown-menu' {
  export const Root: React.ComponentType<any>;
  export const Trigger: React.ComponentType<any>;
  export const Portal: React.ComponentType<any>;
  export const Content: React.ComponentType<any>;
  export const Group: React.ComponentType<any>;
  export const Item: React.ComponentType<any>;
  export const CheckboxItem: React.ComponentType<any>;
  export const RadioGroup: React.ComponentType<any>;
  export const RadioItem: React.ComponentType<any>;
  export const ItemIndicator: React.ComponentType<any>;
  export const Separator: React.ComponentType<any>;
  export const Label: React.ComponentType<any>;
  export const Sub: React.ComponentType<any>;
  export const SubTrigger: React.ComponentType<any>;
  export const SubContent: React.ComponentType<any>;
}

declare module '@radix-ui/react-hover-card' {
  export const Root: React.ComponentType<any>;
  export const Trigger: React.ComponentType<any>;
  export const Portal: React.ComponentType<any>;
  export const Content: React.ComponentType<any>;
  export const Arrow: React.ComponentType<any>;
}

declare module '@radix-ui/react-label' {
  export const Root: React.ComponentType<any>;
}

declare module '@radix-ui/react-menubar' {
  export const Root: React.ComponentType<any>;
  export const Menu: React.ComponentType<any>;
  export const Trigger: React.ComponentType<any>;
  export const Portal: React.ComponentType<any>;
  export const Content: React.ComponentType<any>;
  export const Group: React.ComponentType<any>;
  export const Item: React.ComponentType<any>;
  export const CheckboxItem: React.ComponentType<any>;
  export const RadioGroup: React.ComponentType<any>;
  export const RadioItem: React.ComponentType<any>;
  export const ItemIndicator: React.ComponentType<any>;
  export const Separator: React.ComponentType<any>;
  export const Label: React.ComponentType<any>;
  export const Sub: React.ComponentType<any>;
  export const SubTrigger: React.ComponentType<any>;
  export const SubContent: React.ComponentType<any>;
}

declare module '@radix-ui/react-navigation-menu' {
  export const Root: React.ComponentType<any>;
  export const List: React.ComponentType<any>;
  export const Item: React.ComponentType<any>;
  export const Trigger: React.ComponentType<any>;
  export const Content: React.ComponentType<any>;
  export const Link: React.ComponentType<any>;
  export const Indicator: React.ComponentType<any>;
  export const Viewport: React.ComponentType<any>;
  export const Sub: React.ComponentType<any>;
}

declare module '@radix-ui/react-popover' {
  export const Root: React.ComponentType<any>;
  export const Trigger: React.ComponentType<any>;
  export const Portal: React.ComponentType<any>;
  export const Content: React.ComponentType<any>;
  export const Anchor: React.ComponentType<any>;
  export const Close: React.ComponentType<any>;
}

declare module '@radix-ui/react-progress' {
  export const Root: React.ComponentType<any>;
  export const Indicator: React.ComponentType<any>;
}

declare module '@radix-ui/react-radio-group' {
  export const Root: React.ComponentType<any>;
  export const Item: React.ComponentType<any>;
  export const Indicator: React.ComponentType<any>;
}

declare module '@radix-ui/react-scroll-area' {
  export const Root: React.ComponentType<any>;
  export const Viewport: React.ComponentType<any>;
  export const Scrollbar: React.ComponentType<any>;
  export const Thumb: React.ComponentType<any>;
  export const Corner: React.ComponentType<any>;
  export const ScrollAreaScrollbar: React.ComponentType<any>;
  export const ScrollAreaThumb: React.ComponentType<any>;
}

declare module '@radix-ui/react-select' {
  export const Root: React.ComponentType<any>;
  export const Trigger: React.ComponentType<any>;
  export const Portal: React.ComponentType<any>;
  export const Content: React.ComponentType<any>;
  export const Group: React.ComponentType<any>;
  export const Item: React.ComponentType<any>;
  export const ItemText: React.ComponentType<any>;
  export const ItemIndicator: React.ComponentType<any>;
  export const Separator: React.ComponentType<any>;
  export const Label: React.ComponentType<any>;
  export const Value: React.ComponentType<any>;
  export const Icon: React.ComponentType<any>;
  export const Viewport: React.ComponentType<any>;
  export const ScrollUpButton: React.ComponentType<any>;
  export const ScrollDownButton: React.ComponentType<any>;
}

declare module '@radix-ui/react-separator' {
  export const Root: React.ComponentType<any>;
}

declare module '@radix-ui/react-slider' {
  export const Root: React.ComponentType<any>;
  export const Track: React.ComponentType<any>;
  export const Range: React.ComponentType<any>;
  export const Thumb: React.ComponentType<any>;
}

declare module '@radix-ui/react-slot' {
  export const Slot: React.ComponentType<any>;
  export const Slottable: React.ComponentType<any>;
}

declare module '@radix-ui/react-switch' {
  export const Root: React.ComponentType<any>;
  export const Thumb: React.ComponentType<any>;
}

declare module '@radix-ui/react-tabs' {
  export const Root: React.ComponentType<any>;
  export const List: React.ComponentType<any>;
  export const Trigger: React.ComponentType<any>;
  export const Content: React.ComponentType<any>;
}

declare module '@radix-ui/react-toast' {
  export const Provider: React.ComponentType<any>;
  export const Root: React.ComponentType<any>;
  export const Title: React.ComponentType<any>;
  export const Description: React.ComponentType<any>;
  export const Action: React.ComponentType<any>;
  export const Close: React.ComponentType<any>;
  export const Viewport: React.ComponentType<any>;
}

declare module '@radix-ui/react-toggle' {
  export const Root: React.ComponentType<any>;
}

declare module '@radix-ui/react-toggle-group' {
  export const Root: React.ComponentType<any>;
  export const Item: React.ComponentType<any>;
}

declare module '@radix-ui/react-tooltip' {
  export const Provider: React.ComponentType<any>;
  export const Root: React.ComponentType<any>;
  export const Trigger: React.ComponentType<any>;
  export const Portal: React.ComponentType<any>;
  export const Content: React.ComponentType<any>;
  export const Arrow: React.ComponentType<any>;
}

declare module '@radix-ui/react-resizable-panels' {
  export const PanelGroup: React.ComponentType<any>;
  export const Panel: React.ComponentType<any>;
  export const PanelResizeHandle: React.ComponentType<any>;
}

// Additional UI library declarations
declare module 'cmdk' {
  export const Command: {
    Input: React.ComponentType<any>;
    List: React.ComponentType<any>;
    Empty: React.ComponentType<any>;
    Group: React.ComponentType<any>;
    Item: React.ComponentType<any>;
    Separator: React.ComponentType<any>;
    displayName?: string;
  } & React.ComponentType<any>;
}

declare module 'input-otp' {
  export const OTPInput: React.ComponentType<any>;
  export const OTPInputContext: React.Context<any>;
}

declare module 'vaul' {
  export const Drawer: {
    Root: React.ComponentType<any>;
    Trigger: React.ComponentType<any>;
    Portal: React.ComponentType<any>;
    Overlay: React.ComponentType<any>;
    Content: React.ComponentType<any>;
    Header: React.ComponentType<any>;
    Footer: React.ComponentType<any>;
    Title: React.ComponentType<any>;
    Description: React.ComponentType<any>;
    Close: React.ComponentType<any>;
  } & React.ComponentType<any>;
  export const DrawerTrigger: React.ComponentType<any>;
  export const DrawerContent: React.ComponentType<any>;
  export const DrawerHeader: React.ComponentType<any>;
  export const DrawerFooter: React.ComponentType<any>;
  export const DrawerTitle: React.ComponentType<any>;
  export const DrawerDescription: React.ComponentType<any>;
  export const DrawerClose: React.ComponentType<any>;
  export const DrawerOverlay: React.ComponentType<any>;
  export const DrawerPortal: React.ComponentType<any>;
}

declare module 'sonner' {
  export const Toaster: React.ComponentType<any>;
  export const toast: any;
}

// Class variance authority compatibility
declare module 'class-variance-authority' {
  export function cva(...args: any[]): any;
  export type VariantProps<T> = any;
}

declare module 'next-themes' {
  export const useTheme: () => { theme: string; setTheme: (theme: string) => void };
  export const ThemeProvider: React.ComponentType<any>;
}
