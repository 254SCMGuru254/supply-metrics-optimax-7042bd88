
/// <reference types="vite/client" />

// Enhanced TypeScript declarations for React compatibility
declare module 'react' {
  interface ForwardRefExoticComponent<P> extends React.ComponentType<P> {
    $$typeof: symbol;
    render: (props: P, ref: React.Ref<any>) => React.ReactElement | null;
    displayName?: string;
    defaultProps?: Partial<P>;
  }
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

// Lucide React icons compatibility - ONLY ALLOWED ICONS
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
  
  // Use allowed icons instead of missing ones:
  // Bot -> HelpCircle (for AI assistance)
  export const Bot: typeof HelpCircle;
  // Building -> Package (for facilities)
  export const Building: typeof Package;
  // Upload -> FileText (for file operations)
  export const Upload: typeof FileText;
  // AlertCircle -> HelpCircle (for alerts)
  export const AlertCircle: typeof HelpCircle;
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

// Textarea Props interface for UI components
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

// Make TextareaProps globally available
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
}
