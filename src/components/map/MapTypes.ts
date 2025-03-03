
export type Node = {
  id: string;
  type: "warehouse" | "distribution" | "retail";
  name: string;
  latitude: number;
  longitude: number;
  capacity?: number;
};

export type Route = {
  id: string;
  from: string;
  to: string;
  volume: number;
  isOptimized?: boolean;
};

export type NetworkMapProps = {
  nodes: Node[];
  routes: Route[];
  onNodeClick?: (node: Node) => void;
  onMapClick?: (lat: number, lng: number) => void;
  isOptimized?: boolean;
};
