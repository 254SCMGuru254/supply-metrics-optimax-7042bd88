
export type NodeType = 
  | 'warehouse' 
  | 'factory' 
  | 'distribution' 
  | 'supplier' 
  | 'customer' 
  | 'retail'
  | 'facility'
  | 'demand';

export type OwnershipType = 'owned' | 'hired' | 'outsourced' | 'proposed';

export interface Node {
  id: string;
  name: string;
  type: NodeType;
  latitude: number;
  longitude: number;
  capacity?: number;
  cost?: number;
  weight?: number;
  ownership: OwnershipType;
  notes?: string;
}

export interface Route {
  id: string;
  from: string;
  to: string;
  distance?: number;
  cost?: number;
  ownership: OwnershipType;
  label?: string;
}
