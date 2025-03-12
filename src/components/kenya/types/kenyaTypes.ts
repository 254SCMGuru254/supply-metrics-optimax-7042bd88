
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
