
// Business model types for the application

export type ModelValueMetricsType = 
  | 'route-optimization' 
  | 'inventory-management' 
  | 'network-optimization' 
  | 'center-of-gravity' 
  | 'heuristic';

export interface BusinessValueMetric {
  name: string;
  value: string | number;
  icon: string;
}

export interface BusinessValueReport {
  companyName: string;
  industry: string;
  fleetSize?: number;
  annualShipments?: number;
  annualTransportationCosts?: number;
  warehouseCount?: number;
  inventoryValue?: number;
  serviceLevel?: number;
  metrics?: BusinessValueMetric[];
  notes?: string;
  calculatedOn?: string;
}

export interface ROIParameters {
  implementationCost: number;
  monthlySubscription: number;
  expectedSavingsPercent: number;
  annualCosts: number;
  timeframe: number; // In months
}

export interface ROICalculation {
  totalCost: number;
  totalSavings: number;
  netBenefit: number;
  roi: number;
  paybackPeriod: number; // In months
  monthlyBreakdown: {
    month: number;
    costs: number;
    savings: number;
    cumulativeNetBenefit: number;
  }[];
}
