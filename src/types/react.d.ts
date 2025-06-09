
// Minimal React type extensions - avoid conflicts with built-in React types
import 'react';

declare module 'react' {
  // Only add specific extensions we need, not override existing types
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    'data-*'?: string;
    'aria-*'?: string;
  }
}
