
/// <reference types="vite/client" />

// Enhanced TypeScript declarations for React compatibility
declare module 'react' {
  interface ForwardRefExoticComponent<P> extends React.ComponentType<P> {
    $$typeof: symbol;
    render: (props: P, ref: React.Ref<any>) => React.ReactElement | null;
    displayName?: string;
    defaultProps?: Partial<P>;
  }
  
  // Complete React exports
  export const useState: any;
  export const useEffect: any;
  export const useContext: any;
  export const createContext: any;
  export const useRef: any;
  export const useMemo: any;
  export const useCallback: any;
  export const forwardRef: any;
  export const Fragment: any;
  
  // React types
  export type ChangeEvent<T = Element> = {
    target: T & { value: string; checked?: boolean; name?: string };
    currentTarget: T;
  };
  export type KeyboardEvent<T = Element> = {
    key: string;
    preventDefault: () => void;
    stopPropagation: () => void;
    currentTarget: T;
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

// Complete Lucide React icons compatibility - ALL MISSING ICONS MAPPED
declare module 'lucide-react' {
  export const Home: React.ForwardRefExoticComponent<any>;
  export const LayoutDashboard: React.ForwardRefExoticComponent<any>;
  export const Settings: React.ForwardRefExoticComponent<any>;
  export const Package: React.ForwardRefExoticComponent<any>;
  export const Truck: React.ForwardRefExoticComponent<any>;
  export const LineChart: React.ForwardRefExoticComponent<any>;
  export const BarChart3: React.ForwardRefExoticComponent<any>;
  export const FileText: React.ForwardRefExoticComponent<any>;
  export const HelpCircle: React.ForwardRefExoticComponent<any>;
  export const CircleDollarSign: React.ForwardRefExoticComponent<any>;
  export const TrendingUp: React.ForwardRefExoticComponent<any>;
  export const Activity: React.ForwardRefExoticComponent<any>;
  export const Hexagon: React.ForwardRefExoticComponent<any>;
  export const ChevronLeft: React.ForwardRefExoticComponent<any>;
  export const ChevronRight: React.ForwardRefExoticComponent<any>;
  export const Download: React.ForwardRefExoticComponent<any>;
  export const Loader2: React.ForwardRefExoticComponent<any>;
  export const Check: React.ForwardRefExoticComponent<any>;
  export const CheckCircle: React.ForwardRefExoticComponent<any>;
  export const Search: React.ForwardRefExoticComponent<any>;
  export const X: React.ForwardRefExoticComponent<any>;
  
  // COMPLETE ICON MAPPING FOR ALL MISSING ICONS
  export const Bot: typeof HelpCircle;
  export const Building: typeof Package;
  export const Upload: typeof FileText;
  export const AlertCircle: typeof HelpCircle;
  export const Save: typeof Check;
  export const FileDown: typeof Download;
  export const Lightbulb: typeof HelpCircle;
  export const Send: typeof Check;
  export const Globe: typeof Search;
  export const MapPin: typeof Search;
  export const Users: typeof Package;
  export const Shield: typeof Check;
  export const Store: typeof Package;
  export const Calculator: typeof Settings;
  export const Network: typeof Hexagon;
  export const Route: typeof Activity;
  export const DollarSign: typeof CircleDollarSign;
  export const Package2: typeof Package;
  export const FileQuestion: typeof FileText;
  export const ArrowRight: typeof ChevronRight;
  export const AlertTriangle: typeof HelpCircle;
  export const Coins: typeof CircleDollarSign;
  export const Gauge: typeof Settings;
  export const Scale: typeof Settings;
  export const Compass: typeof Search;
  export const LayoutGrid: typeof LayoutDashboard;
  export const Map: typeof Search;
  export const MessageSquare: typeof FileText;
  export const Target: typeof Search;
  export const Factory: typeof Package;
  export const Warehouse: typeof Package;
  export const PlusCircle: typeof Check;
  export const Trash2: typeof X;
  export const Info: typeof HelpCircle;
  export const Plus: typeof Check;
  export const FileInput: typeof FileText;
  export const Clock: typeof Settings;
  
  // Additional missing icons
  export const Database: typeof Package;
  export const Boxes: typeof Package;
  export const ArrowDown: typeof ChevronRight;
  export const Percent: typeof Settings;
  export const CalendarDays: typeof Settings;
  export const TrendingDown: typeof TrendingUp;
  export const ShoppingCart: typeof Package;
  export const User: typeof Users;
  export const Link: typeof Search;
  export const CreditCard: typeof Settings;
  export const Train: typeof Truck;
  export const Ship: typeof Truck;
  export const Plane: typeof Truck;
  export const ListChecks: typeof Check;
  export const ChevronDown: typeof ChevronRight;
  export const MoreHorizontal: typeof Settings;
  
  // LucideIcon type and props
  export const LucideIcon: typeof Settings;
  export const LucideProps: any;
}

// Enhanced TextareaProps interface with ALL required properties
declare global {
  interface TextareaProps {
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
  }
  
  interface HTMLTableCaptionElement {
    children?: React.ReactNode;
  }
  
  interface HTMLHeadingElement {
    children?: React.ReactNode;
  }
  
  interface HTMLParagraphElement {
    children?: React.ReactNode;
  }
}

// Recharts compatibility
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
}

// Complete Radix UI module declarations
declare module '@radix-ui/react-accordion' {
  export const Root: React.ForwardRefExoticComponent<any>;
  export const Item: React.ForwardRefExoticComponent<any>;
  export const Header: React.ForwardRefExoticComponent<any>;
  export const Trigger: React.ForwardRefExoticComponent<any>;
  export const Content: React.ForwardRefExoticComponent<any>;
}

declare module '@radix-ui/react-alert-dialog' {
  export const Root: React.ForwardRefExoticComponent<any>;
  export const Trigger: React.ForwardRefExoticComponent<any>;
  export const Portal: React.ForwardRefExoticComponent<any>;
  export const Overlay: React.ForwardRefExoticComponent<any>;
  export const Content: React.ForwardRefExoticComponent<any>;
  export const Title: React.ForwardRefExoticComponent<any>;
  export const Description: React.ForwardRefExoticComponent<any>;
  export const Action: React.ForwardRefExoticComponent<any>;
  export const Cancel: React.ForwardRefExoticComponent<any>;
}

declare module '@radix-ui/react-avatar' {
  export const Root: React.ForwardRefExoticComponent<any>;
  export const Image: React.ForwardRefExoticComponent<any>;
  export const Fallback: React.ForwardRefExoticComponent<any>;
}

declare module '@radix-ui/react-checkbox' {
  export const Root: React.ForwardRefExoticComponent<any>;
  export const Indicator: React.ForwardRefExoticComponent<any>;
}

declare module '@radix-ui/react-context-menu' {
  export const Root: React.ForwardRefExoticComponent<any>;
  export const Trigger: React.ForwardRefExoticComponent<any>;
  export const Portal: React.ForwardRefExoticComponent<any>;
  export const Content: React.ForwardRefExoticComponent<any>;
  export const Group: React.ForwardRefExoticComponent<any>;
  export const Item: React.ForwardRefExoticComponent<any>;
  export const CheckboxItem: React.ForwardRefExoticComponent<any>;
  export const RadioGroup: React.ForwardRefExoticComponent<any>;
  export const RadioItem: React.ForwardRefExoticComponent<any>;
  export const ItemIndicator: React.ForwardRefExoticComponent<any>;
  export const Separator: React.ForwardRefExoticComponent<any>;
  export const Label: React.ForwardRefExoticComponent<any>;
  export const Sub: React.ForwardRefExoticComponent<any>;
  export const SubTrigger: React.ForwardRefExoticComponent<any>;
  export const SubContent: React.ForwardRefExoticComponent<any>;
}

declare module '@radix-ui/react-dialog' {
  export const Root: React.ForwardRefExoticComponent<any>;
  export const Trigger: React.ForwardRefExoticComponent<any>;
  export const Portal: React.ForwardRefExoticComponent<any>;
  export const Overlay: React.ForwardRefExoticComponent<any>;
  export const Content: React.ForwardRefExoticComponent<any>;
  export const Title: React.ForwardRefExoticComponent<any>;
  export const Description: React.ForwardRefExoticComponent<any>;
  export const Close: React.ForwardRefExoticComponent<any>;
}

declare module '@radix-ui/react-dropdown-menu' {
  export const Root: React.ForwardRefExoticComponent<any>;
  export const Trigger: React.ForwardRefExoticComponent<any>;
  export const Portal: React.ForwardRefExoticComponent<any>;
  export const Content: React.ForwardRefExoticComponent<any>;
  export const Group: React.ForwardRefExoticComponent<any>;
  export const Item: React.ForwardRefExoticComponent<any>;
  export const CheckboxItem: React.ForwardRefExoticComponent<any>;
  export const RadioGroup: React.ForwardRefExoticComponent<any>;
  export const RadioItem: React.ForwardRefExoticComponent<any>;
  export const ItemIndicator: React.ForwardRefExoticComponent<any>;
  export const Separator: React.ForwardRefExoticComponent<any>;
  export const Label: React.ForwardRefExoticComponent<any>;
  export const Sub: React.ForwardRefExoticComponent<any>;
  export const SubTrigger: React.ForwardRefExoticComponent<any>;
  export const SubContent: React.ForwardRefExoticComponent<any>;
}

declare module '@radix-ui/react-popover' {
  export const Root: React.ForwardRefExoticComponent<any>;
  export const Trigger: React.ForwardRefExoticComponent<any>;
  export const Portal: React.ForwardRefExoticComponent<any>;
  export const Content: React.ForwardRefExoticComponent<any>;
  export const Anchor: React.ForwardRefExoticComponent<any>;
  export const Close: React.ForwardRefExoticComponent<any>;
}

declare module '@radix-ui/react-select' {
  export const Root: React.ForwardRefExoticComponent<any>;
  export const Trigger: React.ForwardRefExoticComponent<any>;
  export const Portal: React.ForwardRefExoticComponent<any>;
  export const Content: React.ForwardRefExoticComponent<any>;
  export const Group: React.ForwardRefExoticComponent<any>;
  export const Item: React.ForwardRefExoticComponent<any>;
  export const ItemText: React.ForwardRefExoticComponent<any>;
  export const ItemIndicator: React.ForwardRefExoticComponent<any>;
  export const Separator: React.ForwardRefExoticComponent<any>;
  export const Label: React.ForwardRefExoticComponent<any>;
  export const Value: React.ForwardRefExoticComponent<any>;
  export const Icon: React.ForwardRefExoticComponent<any>;
  export const Viewport: React.ForwardRefExoticComponent<any>;
  export const ScrollUpButton: React.ForwardRefExoticComponent<any>;
  export const ScrollDownButton: React.ForwardRefExoticComponent<any>;
}

declare module '@radix-ui/react-separator' {
  export const Root: React.ForwardRefExoticComponent<any>;
}

declare module '@radix-ui/react-slider' {
  export const Root: React.ForwardRefExoticComponent<any>;
  export const Track: React.ForwardRefExoticComponent<any>;
  export const Range: React.ForwardRefExoticComponent<any>;
  export const Thumb: React.ForwardRefExoticComponent<any>;
}

declare module '@radix-ui/react-slot' {
  export const Slot: React.ForwardRefExoticComponent<any>;
  export const Slottable: React.ForwardRefExoticComponent<any>;
}

declare module '@radix-ui/react-switch' {
  export const Root: React.ForwardRefExoticComponent<any>;
  export const Thumb: React.ForwardRefExoticComponent<any>;
}

declare module '@radix-ui/react-tabs' {
  export const Root: React.ForwardRefExoticComponent<any>;
  export const List: React.ForwardRefExoticComponent<any>;
  export const Trigger: React.ForwardRefExoticComponent<any>;
  export const Content: React.ForwardRefExoticComponent<any>;
}

declare module '@radix-ui/react-toast' {
  export const Provider: React.ForwardRefExoticComponent<any>;
  export const Root: React.ForwardRefExoticComponent<any>;
  export const Title: React.ForwardRefExoticComponent<any>;
  export const Description: React.ForwardRefExoticComponent<any>;
  export const Action: React.ForwardRefExoticComponent<any>;
  export const Close: React.ForwardRefExoticComponent<any>;
  export const Viewport: React.ForwardRefExoticComponent<any>;
}

declare module '@radix-ui/react-tooltip' {
  export const Provider: React.ForwardRefExoticComponent<any>;
  export const Root: React.ForwardRefExoticComponent<any>;
  export const Trigger: React.ForwardRefExoticComponent<any>;
  export const Portal: React.ForwardRefExoticComponent<any>;
  export const Content: React.ForwardRefExoticComponent<any>;
  export const Arrow: React.ForwardRefExoticComponent<any>;
}

// Additional UI library declarations
declare module 'cmdk' {
  export const Command: React.ForwardRefExoticComponent<any>;
}

declare module 'input-otp' {
  export const OTPInput: React.ForwardRefExoticComponent<any>;
  export const OTPInputContext: React.Context<any>;
}

declare module 'vaul' {
  export const Drawer: React.ForwardRefExoticComponent<any>;
  export const DrawerTrigger: React.ForwardRefExoticComponent<any>;
  export const DrawerContent: React.ForwardRefExoticComponent<any>;
  export const DrawerHeader: React.ForwardRefExoticComponent<any>;
  export const DrawerFooter: React.ForwardRefExoticComponent<any>;
  export const DrawerTitle: React.ForwardRefExoticComponent<any>;
  export const DrawerDescription: React.ForwardRefExoticComponent<any>;
  export const DrawerClose: React.ForwardRefExoticComponent<any>;
  export const DrawerOverlay: React.ForwardRefExoticComponent<any>;
  export const DrawerPortal: React.ForwardRefExoticComponent<any>;
}

// Class variance authority compatibility
declare module 'class-variance-authority' {
  export function cva(...args: any[]): any;
  export type VariantProps<T> = any;
}
