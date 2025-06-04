
import 'react';

declare module 'react' {
  export interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // Add custom attributes used in the project
    css?: any;
  }

  // Add missing React types and ensure useState is properly exported
  export type FC<P = {}> = FunctionComponent<P>;
  export interface FunctionComponent<P = {}> {
    (props: P, context?: any): ReactElement<any, any> | null;
    displayName?: string;
    defaultProps?: Partial<P>;
  }
  export type ReactNode = React.ReactNode;
  export type ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> = React.ReactElement<P, T>;
  export type JSXElementConstructor<P> = React.JSXElementConstructor<P>;
  export type FormEvent<T = Element> = React.FormEvent<T>;
  export type KeyboardEvent<T = Element> = React.KeyboardEvent<T>;
  export type RefObject<T> = React.RefObject<T>;
  
  // Ensure useState and other hooks are properly exported
  export const useState: typeof React.useState;
  export const useEffect: typeof React.useEffect;
  export const useRef: typeof React.useRef;
  export const useCallback: typeof React.useCallback;
  export const useMemo: typeof React.useMemo;
  export const useContext: typeof React.useContext;
  export const forwardRef: typeof React.forwardRef;
}
