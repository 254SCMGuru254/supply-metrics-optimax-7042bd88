
export type Node = {
  id: string;
  type: "warehouse" | "distribution" | "retail" | "airport";
  name: string;
  latitude: number;
  longitude: number;
  capacity?: number;
  weight?: number; // Added weight property for CoG calculations
  isOptimal?: boolean; // To mark a node as optimal from CoG calculation
};

export type Route = {
  id: string;
  from: string;
  to: string;
  volume: number;
  cost?: number; // Added cost property for optimization
  transitTime?: number; // Added transit time for simulation
  isOptimized?: boolean;
};

export type NetworkMapProps = {
  nodes: Node[];
  routes: Route[];
  onNodeClick?: (node: Node) => void;
  onMapClick?: (lat: number, lng: number) => void;
  isOptimized?: boolean;
};
