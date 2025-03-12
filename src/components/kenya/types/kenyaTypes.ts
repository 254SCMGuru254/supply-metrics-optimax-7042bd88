
export type KenyaLocation = {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  region: string;
  capacity?: number;
  description?: string;
};

export type SupplyChainRoute = {
  id: string;
  from: string;
  to: string;
  type: "road" | "rail" | "air" | "sea";
  volume: number;
  description?: string;
};

export type AirportNode = {
  id: string;
  name: string;
  type: "warehouse" | "distribution" | "retail" | "airport";
  latitude: number;
  longitude: number;
  hub_type: string;
  capacity: number;
  utilization: number;
  delay_probability: number;
  region?: string;
};

export type AirportRoute = {
  id: string;
  from: string;
  to: string;
  type: "road" | "rail" | "air" | "sea";
  volume: number;
  distance: number;
  transit_time: number;
  mode: string;
  cost: number;
  description?: string;
};
