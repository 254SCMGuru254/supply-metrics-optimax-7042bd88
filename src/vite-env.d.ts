
/// <reference types="vite/client" />
/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="react-router-dom" />

// Declare module for any packages that don't have type declarations
declare module 'leaflet-defaulticon-compatibility';
declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
