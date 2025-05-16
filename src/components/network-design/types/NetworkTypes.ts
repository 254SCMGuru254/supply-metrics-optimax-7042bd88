
export interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: 'factory' | 'depot' | 'customer';
}

export interface Factory extends Location {
  type: 'factory';
  productionCost: number; // Cost per unit produced
}

export interface Depot extends Location {
  type: 'depot';
  fixedCost: number; // Weekly fixed cost
  throughput: number; // Calculated from customers it serves
  servesCustomerIds: string[]; // IDs of customers served by this depot
  factoryId?: string; // ID of the factory that supplies this depot
}

export interface Customer extends Location {
  type: 'customer';
  demand: number; // Weekly demand/throughput
  depotId?: string; // ID of the depot that serves this customer
}

export interface NetworkModel {
  factories: Factory[];
  depots: Depot[];
  customers: Customer[];
  settings: NetworkSettings;
}

export interface NetworkSettings {
  stockLevelDays: number; // Average stock holding days
  transitTimeDays: number; // Transit time in days
  monthlyHoldingRate: number; // Monthly holding cost rate (e.g., 0.02 for 2%)
}

export interface CostAnalysis {
  totalCost: number;
  trunkingCost: number;
  deliveryCost: number;
  depotCost: number;
  stockHoldingCost: number;
  breakdown: {
    byDepot: Record<string, {
      trunkingCost: number;
      deliveryCost: number;
      depotCost: number;
      stockHoldingCost: number;
      totalCost: number;
    }>;
  };
}
