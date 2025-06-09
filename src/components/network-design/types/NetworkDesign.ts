
export interface CostAnalysis {
  trunkingCost: number;
  deliveryCost: number;
  depotCost: number;
  stockHoldingCost: number;
  totalCost: number;
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

export namespace NetworkDesign {
  export type CostBreakdown = CostAnalysis;
}
