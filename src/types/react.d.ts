
import 'react';

declare module 'react' {
  export interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // Add all standard HTML attributes
    className?: string;
    style?: React.CSSProperties;
    id?: string;
    children?: ReactNode;
    key?: React.Key;
    ref?: React.Ref<T>;
    role?: string;
    tabIndex?: number;
    title?: string;
    'data-*'?: string;
    'aria-*'?: string;
  }

  // Add missing React types and ensure all hooks are properly exported
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
  export type ChangeEvent<T = Element> = React.ChangeEvent<T>;
  export type RefObject<T> = React.RefObject<T>;
  export type Context<T> = React.Context<T>;
  export type CSSProperties = React.CSSProperties;
  
  // Ensure all React hooks and functions are properly exported
  export const useState: typeof React.useState;
  export const useEffect: typeof React.useEffect;
  export const useRef: typeof React.useRef;
  export const useCallback: typeof React.useCallback;
  export const useMemo: typeof React.useMemo;
  export const useContext: typeof React.useContext;
  export const createContext: typeof React.createContext;
  export const forwardRef: typeof React.forwardRef;

  // Enhanced HTML element interfaces with full attribute support
  export interface HTMLDivElement extends React.HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    id?: string;
    role?: string;
    tabIndex?: number;
    onClick?: (e: any) => void;
  }

  export interface HTMLTableElement extends React.HTMLAttributes<HTMLTableElement> {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    id?: string;
  }

  export interface HTMLTableRowElement extends React.HTMLAttributes<HTMLTableRowElement> {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    key?: React.Key;
  }

  export interface HTMLTableCellElement extends React.HTMLAttributes<HTMLTableCellElement> {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    colSpan?: number;
    rowSpan?: number;
  }

  export interface HTMLTableSectionElement extends React.HTMLAttributes<HTMLTableSectionElement> {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
  }

  export interface HTMLTableCaptionElement extends React.HTMLAttributes<HTMLTableCaptionElement> {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
  }

  export interface HTMLHeadingElement extends React.HTMLAttributes<HTMLHeadingElement> {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
  }

  export interface HTMLParagraphElement extends React.HTMLAttributes<HTMLParagraphElement> {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
  }

  export interface HTMLFormElement extends React.HTMLAttributes<HTMLFormElement> {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    onSubmit?: (e: any) => void;
  }

  export interface HTMLInputElement extends React.HTMLAttributes<HTMLInputElement> {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    placeholder?: string;
    value?: string;
    onChange?: (e: any) => void;
    type?: string;
    disabled?: boolean;
    id?: string;
  }

  export interface HTMLTextAreaElement extends React.HTMLAttributes<HTMLTextAreaElement> {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    placeholder?: string;
    rows?: number;
    id?: string;
    disabled?: boolean;
    value?: string;
    onChange?: (e: any) => void;
    onKeyDown?: (e: any) => void;
  }

  export interface HTMLButtonElement extends React.HTMLAttributes<HTMLButtonElement> {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    onClick?: (e: any) => void;
  }

  export interface HTMLSpanElement extends React.HTMLAttributes<HTMLSpanElement> {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
  }

  export interface HTMLLabelElement extends React.HTMLAttributes<HTMLLabelElement> {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    htmlFor?: string;
  }
}

// Declare global HTML element interfaces with full attribute support
declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement> & { 
        children?: React.ReactNode;
        className?: string;
        style?: React.CSSProperties;
        id?: string;
        role?: string;
        tabIndex?: number;
        onClick?: (e: any) => void;
      }, HTMLDivElement>;
      
      table: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableElement> & { 
        children?: React.ReactNode;
        className?: string;
        style?: React.CSSProperties;
      }, HTMLTableElement>;
      
      thead: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement> & { 
        children?: React.ReactNode;
        className?: string;
        style?: React.CSSProperties;
      }, HTMLTableSectionElement>;
      
      tbody: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement> & { 
        children?: React.ReactNode;
        className?: string;
        style?: React.CSSProperties;
      }, HTMLTableSectionElement>;
      
      tr: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement> & { 
        children?: React.ReactNode;
        className?: string;
        style?: React.CSSProperties;
        key?: React.Key;
      }, HTMLTableRowElement>;
      
      th: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableHeaderCellElement> & { 
        children?: React.ReactNode;
        className?: string;
        style?: React.CSSProperties;
        colSpan?: number;
        rowSpan?: number;
      }, HTMLTableHeaderCellElement>;
      
      td: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableDataCellElement> & { 
        children?: React.ReactNode;
        className?: string;
        style?: React.CSSProperties;
        colSpan?: number;
        rowSpan?: number;
      }, HTMLTableDataCellElement>;
      
      caption: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableCaptionElement> & { 
        children?: React.ReactNode;
        className?: string;
        style?: React.CSSProperties;
      }, HTMLTableCaptionElement>;
      
      h1: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement> & { 
        children?: React.ReactNode;
        className?: string;
        style?: React.CSSProperties;
      }, HTMLHeadingElement>;
      
      h2: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement> & { 
        children?: React.ReactNode;
        className?: string;
        style?: React.CSSProperties;
      }, HTMLHeadingElement>;
      
      h3: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement> & { 
        children?: React.ReactNode;
        className?: string;
        style?: React.CSSProperties;
      }, HTMLHeadingElement>;
      
      h4: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement> & { 
        children?: React.ReactNode;
        className?: string;
        style?: React.CSSProperties;
      }, HTMLHeadingElement>;
      
      p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement> & { 
        children?: React.ReactNode;
        className?: string;
        style?: React.CSSProperties;
      }, HTMLParagraphElement>;
      
      form: React.DetailedHTMLProps<React.HTMLAttributes<HTMLFormElement> & { 
        children?: React.ReactNode;
        className?: string;
        style?: React.CSSProperties;
        onSubmit?: (e: any) => void;
      }, HTMLFormElement>;
      
      input: React.DetailedHTMLProps<React.HTMLAttributes<HTMLInputElement> & { 
        children?: React.ReactNode;
        className?: string;
        style?: React.CSSProperties;
        placeholder?: string;
        value?: string;
        onChange?: (e: any) => void;
        type?: string;
        disabled?: boolean;
        id?: string;
      }, HTMLInputElement>;
      
      textarea: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTextAreaElement> & { 
        children?: React.ReactNode;
        className?: string;
        style?: React.CSSProperties;
        placeholder?: string;
        rows?: number;
        id?: string;
        disabled?: boolean;
        value?: string;
        onChange?: (e: any) => void;
        onKeyDown?: (e: any) => void;
      }, HTMLTextAreaElement>;
      
      button: React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement> & { 
        children?: React.ReactNode;
        className?: string;
        style?: React.CSSProperties;
        disabled?: boolean;
        type?: "button" | "submit" | "reset";
        onClick?: (e: any) => void;
      }, HTMLButtonElement>;
      
      span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement> & { 
        children?: React.ReactNode;
        className?: string;
        style?: React.CSSProperties;
      }, HTMLSpanElement>;
      
      label: React.DetailedHTMLProps<React.HTMLAttributes<HTMLLabelElement> & { 
        children?: React.ReactNode;
        className?: string;
        style?: React.CSSProperties;
        htmlFor?: string;
      }, HTMLLabelElement>;
    }
  }
}
