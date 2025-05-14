
// Type declarations for modules without @types packages

declare module '@huggingface/transformers' {
  export function pipeline(task: string, model: string, options?: any): Promise<any>;
}

// Add explicit declarations for react-leaflet
declare module 'react-leaflet' {
  import { FC, ReactNode } from 'react';
  import { 
    LatLngExpression, 
    LatLngTuple, 
    LatLngBoundsExpression, 
    Map as LeafletMap, 
    MapOptions, 
    Layer, 
    LayerGroup, 
    Control,
    DomEvent, 
    DomUtil, 
    Popup, 
    PopupOptions, 
    Tooltip, 
    TooltipOptions, 
    PathOptions, 
    PolylineOptions, 
    CircleMarkerOptions 
  } from 'leaflet';
  
  export interface MapContainerProps extends MapOptions {
    center?: LatLngExpression;
    zoom?: number;
    children?: ReactNode;
    className?: string;
    id?: string;
    style?: React.CSSProperties;
    whenCreated?: (map: LeafletMap) => void;
    whenReady?: () => void;
  }
  
  export interface TileLayerProps {
    attribution?: string;
    url: string;
    zIndex?: number;
    opacity?: number;
    tileSize?: number;
  }
  
  export interface MarkerProps {
    position: LatLngExpression;
    icon?: any;
    draggable?: boolean;
    eventHandlers?: any;
    zIndexOffset?: number;
    opacity?: number;
    children?: ReactNode;
  }
  
  export interface PopupProps extends PopupOptions {
    position?: LatLngExpression;
    children?: ReactNode;
  }
  
  export interface PolylineProps {
    positions: LatLngExpression[] | LatLngExpression[][];
    pathOptions?: PolylineOptions;
    children?: ReactNode;
  }

  export const MapContainer: FC<MapContainerProps>;
  export const TileLayer: FC<TileLayerProps>;
  export const Marker: FC<MarkerProps>;
  export const Popup: FC<PopupProps>;
  export const Polyline: FC<PolylineProps>;
  export const CircleMarker: FC<any>;
  export const useMap: () => LeafletMap;
  export const useMapEvent: (type: string, handler: (...args: any[]) => void) => LeafletMap;
  export const useMapEvents: (handlers: { [key: string]: (...args: any[]) => void }) => LeafletMap;
}
