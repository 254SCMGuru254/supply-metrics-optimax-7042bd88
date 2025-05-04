
import { LatLngExpression } from "leaflet";

export type Node = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type?: string;
  capacity?: number;
  cost?: number;
  weight?: number;
  isOptimized?: boolean;
  isDisrupted?: boolean;
};

export type Route = {
  id: string;
  from: string;
  to: string;
  distance?: number;
  time?: number;
  cost?: number;
  flow?: number;
  capacity?: number;
  isOptimized?: boolean;
  isDisrupted?: boolean;
};

export type NodeMarkerProps = {
  node: Node;
  onNodeClick?: (node: Node) => void;
};

export type RoutePolylineProps = {
  route: Route;
  fromNode: Node;
  toNode: Node;
  isOptimized?: boolean;
};

export type MapControllerProps = {
  onMapReady: (map: L.Map) => void;
};

export type MapEventHandlerProps = {
  onMapClick: (lat: number, lng: number) => void;
};
