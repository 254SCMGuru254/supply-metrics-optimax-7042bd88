
/// <reference types="vite/client" />

// Enhanced TypeScript overrides for React and Radix UI compatibility
declare module 'react' {
  interface ForwardRefExoticComponent<P> extends React.ComponentType<P> {
    $$typeof: symbol;
    render: (props: P, ref: React.Ref<any>) => React.ReactElement | null;
    displayName?: string;
  }
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

declare module '@radix-ui/react-hover-card' {
  export const Root: React.ForwardRefExoticComponent<any>;
  export const Trigger: React.ForwardRefExoticComponent<any>;
  export const Portal: React.ForwardRefExoticComponent<any>;
  export const Content: React.ForwardRefExoticComponent<any>;
}

declare module '@radix-ui/react-label' {
  export const Root: React.ForwardRefExoticComponent<any>;
}

declare module '@radix-ui/react-menubar' {
  export const Root: React.ForwardRefExoticComponent<any>;
  export const Menu: React.ForwardRefExoticComponent<any>;
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

declare module '@radix-ui/react-navigation-menu' {
  export const Root: React.ForwardRefExoticComponent<any>;
  export const List: React.ForwardRefExoticComponent<any>;
  export const Item: React.ForwardRefExoticComponent<any>;
  export const Trigger: React.ForwardRefExoticComponent<any>;
  export const Content: React.ForwardRefExoticComponent<any>;
  export const Link: React.ForwardRefExoticComponent<any>;
  export const Indicator: React.ForwardRefExoticComponent<any>;
  export const Viewport: React.ForwardRefExoticComponent<any>;
}

declare module '@radix-ui/react-popover' {
  export const Root: React.ForwardRefExoticComponent<any>;
  export const Trigger: React.ForwardRefExoticComponent<any>;
  export const Portal: React.ForwardRefExoticComponent<any>;
  export const Content: React.ForwardRefExoticComponent<any>;
  export const Anchor: React.ForwardRefExoticComponent<any>;
  export const Close: React.ForwardRefExoticComponent<any>;
}

declare module '@radix-ui/react-progress' {
  export const Root: React.ForwardRefExoticComponent<any>;
  export const Indicator: React.ForwardRefExoticComponent<any>;
}

declare module '@radix-ui/react-radio-group' {
  export const Root: React.ForwardRefExoticComponent<any>;
  export const Item: React.ForwardRefExoticComponent<any>;
  export const Indicator: React.ForwardRefExoticComponent<any>;
}

declare module '@radix-ui/react-scroll-area' {
  export const Root: React.ForwardRefExoticComponent<any>;
  export const Viewport: React.ForwardRefExoticComponent<any>;
  export const Scrollbar: React.ForwardRefExoticComponent<any>;
  export const Thumb: React.ForwardRefExoticComponent<any>;
  export const Corner: React.ForwardRefExoticComponent<any>;
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

declare module '@radix-ui/react-toggle' {
  export const Root: React.ForwardRefExoticComponent<any>;
}

declare module '@radix-ui/react-toggle-group' {
  export const Root: React.ForwardRefExoticComponent<any>;
  export const Item: React.ForwardRefExoticComponent<any>;
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

// Global type enhancements
declare global {
  namespace React {
    interface ForwardRefExoticComponent<P> extends ComponentType<P> {
      $$typeof: symbol;
      render: (props: P, ref: Ref<any>) => ReactElement | null;
      displayName?: string;
    }
    
    interface ExoticComponent<P = {}> extends ComponentType<P> {
      $$typeof: symbol;
    }
  }
}

// Class variance authority compatibility
declare module 'class-variance-authority' {
  export function cva(...args: any[]): any;
  export type VariantProps<T> = any;
}
