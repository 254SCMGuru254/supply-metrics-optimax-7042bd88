
export namespace NetworkDesign {
  export interface CostBreakdown {
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
}
