
import 'react';

declare module 'react' {
  export interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // Add custom attributes used in the project
    css?: any;
    children?: ReactNode;
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
  
  // Ensure all React hooks and functions are properly exported
  export const useState: typeof React.useState;
  export const useEffect: typeof React.useEffect;
  export const useRef: typeof React.useRef;
  export const useCallback: typeof React.useCallback;
  export const useMemo: typeof React.useMemo;
  export const useContext: typeof React.useContext;
  export const createContext: typeof React.createContext;
  export const forwardRef: typeof React.forwardRef;

  // HTML element interfaces with children support
  export interface HTMLDivElement extends React.HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
  }

  export interface HTMLTableElement extends React.HTMLAttributes<HTMLTableElement> {
    children?: ReactNode;
  }

  export interface HTMLTableRowElement extends React.HTMLAttributes<HTMLTableRowElement> {
    children?: ReactNode;
  }

  export interface HTMLTableCellElement extends React.HTMLAttributes<HTMLTableCellElement> {
    children?: ReactNode;
  }

  export interface HTMLTableSectionElement extends React.HTMLAttributes<HTMLTableSectionElement> {
    children?: ReactNode;
  }

  export interface HTMLTableCaptionElement extends React.HTMLAttributes<HTMLTableCaptionElement> {
    children?: ReactNode;
  }

  export interface HTMLHeadingElement extends React.HTMLAttributes<HTMLHeadingElement> {
    children?: ReactNode;
  }

  export interface HTMLParagraphElement extends React.HTMLAttributes<HTMLParagraphElement> {
    children?: ReactNode;
  }

  export interface HTMLFormElement extends React.HTMLAttributes<HTMLFormElement> {
    children?: ReactNode;
  }

  export interface HTMLInputElement extends React.HTMLAttributes<HTMLInputElement> {
    children?: ReactNode;
  }

  export interface HTMLTextAreaElement extends React.HTMLAttributes<HTMLTextAreaElement> {
    children?: ReactNode;
    placeholder?: string;
    rows?: number;
    id?: string;
    disabled?: boolean;
    value?: string;
    onChange?: (e: any) => void;
  }

  export interface HTMLButtonElement extends React.HTMLAttributes<HTMLButtonElement> {
    children?: ReactNode;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
  }
}

// Declare global HTML element interfaces
declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }, HTMLDivElement>;
      table: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableElement> & { children?: React.ReactNode }, HTMLTableElement>;
      thead: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement> & { children?: React.ReactNode }, HTMLTableSectionElement>;
      tbody: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement> & { children?: React.ReactNode }, HTMLTableSectionElement>;
      tr: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement> & { children?: React.ReactNode }, HTMLTableRowElement>;
      th: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableHeaderCellElement> & { children?: React.ReactNode }, HTMLTableHeaderCellElement>;
      td: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableDataCellElement> & { children?: React.ReactNode }, HTMLTableDataCellElement>;
      caption: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableCaptionElement> & { children?: React.ReactNode }, HTMLTableCaptionElement>;
      h1: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement> & { children?: React.ReactNode }, HTMLHeadingElement>;
      h2: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement> & { children?: React.ReactNode }, HTMLHeadingElement>;
      h3: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement> & { children?: React.ReactNode }, HTMLHeadingElement>;
      h4: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement> & { children?: React.ReactNode }, HTMLHeadingElement>;
      p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement> & { children?: React.ReactNode }, HTMLParagraphElement>;
      form: React.DetailedHTMLProps<React.HTMLAttributes<HTMLFormElement> & { children?: React.ReactNode }, HTMLFormElement>;
      input: React.DetailedHTMLProps<React.HTMLAttributes<HTMLInputElement> & { children?: React.ReactNode }, HTMLInputElement>;
      textarea: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTextAreaElement> & { 
        children?: React.ReactNode;
        placeholder?: string;
        rows?: number;
        id?: string;
        disabled?: boolean;
        value?: string;
        onChange?: (e: any) => void;
      }, HTMLTextAreaElement>;
      button: React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement> & { 
        children?: React.ReactNode;
        disabled?: boolean;
        type?: "button" | "submit" | "reset";
      }, HTMLButtonElement>;
      span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement> & { children?: React.ReactNode }, HTMLSpanElement>;
      label: React.DetailedHTMLProps<React.HTMLAttributes<HTMLLabelElement> & { children?: React.ReactNode }, HTMLLabelElement>;
    }
  }
}
