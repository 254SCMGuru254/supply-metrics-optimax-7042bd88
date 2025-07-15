
export interface Node {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  weight?: number;
  ownership?: 'owned' | 'leased' | 'proposed';
}

export interface Route {
  id: string;
  from: string;
  to: string;
  volume?: number;
  cost?: number;
  ownership?: string;
  label?: string;
  isOptimized?: boolean;
}

export type OwnershipType = 'owned' | 'leased' | 'proposed';
