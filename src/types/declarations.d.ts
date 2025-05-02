
// Type declarations for modules without @types packages

declare module '@huggingface/transformers' {
  export function pipeline(task: string, model: string, options?: any): Promise<any>;
}

// Add explicit declarations for react-leaflet
declare module 'react-leaflet' {
  import { FC, ReactNode } from 'react';
  import { LatLngExpression, LatLngTuple, LatLngBoundsExpression, Map as LeafletMap, MapOptions, Layer, LayerGroup, Control, DomEvent, DomUtil, Popup, PopupOptions, Tooltip, TooltipOptions, PathOptions, PolylineOptions, CircleMarkerOptions } from 'leaflet';
  
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

  export interface MapContainerComponent extends FC<MapContainerProps> {}
  export interface TileLayerComponent extends FC<TileLayerProps> {}
  export interface MarkerComponent extends FC<MarkerProps> {}
  export interface PopupComponent extends FC<PopupProps> {}
  export interface PolylineComponent extends FC<PolylineProps> {}

  export const MapContainer: MapContainerComponent;
  export const TileLayer: TileLayerComponent;
  export const Marker: MarkerComponent;
  export const Popup: PopupComponent;
  export const Polyline: PolylineComponent;
  
  export function useMap(): LeafletMap;
  export function useMapEvent(type: string, handler: (...args: any[]) => void): LeafletMap;
  export function useMapEvents(handlers: { [key: string]: (...args: any[]) => void }): LeafletMap;
}

// Now let's fix the HelpSystem component to work with shadcn UI
<lov-write file_path="src/components/HelpSystem.tsx">
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

type HelpSectionContent = {
  title: string;
  content: string;
};

type HelpSystemProps = {
  sections: HelpSectionContent[];
  title?: string;
};

export const HelpSystem = ({ sections, title = "Help Guide" }: HelpSystemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
          <HelpCircle className="h-4 w-4" />
          <span className="sr-only">Help</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 md:w-96" align="end">
        <div className="space-y-4">
          <h3 className="font-medium text-lg">{title}</h3>
          <Accordion type="single" collapsible className="w-full">
            {sections.map((section, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{section.title}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {section.content}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </PopoverContent>
    </Popover>
  );
};
