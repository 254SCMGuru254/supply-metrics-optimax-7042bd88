import { CostAnalysis } from "./types/NetworkDesign";

interface CostBreakdownProps {
  costAnalysis: CostAnalysis;
}

export function CostBreakdown({ costAnalysis }: CostBreakdownProps) {
  return (
    <div>
      <h3>Cost Breakdown</h3>
      <p>Fixed Costs: ${costAnalysis.fixedCosts}</p>
      <p>Variable Costs: ${costAnalysis.variableCosts}</p>
      <p>Total Costs: ${costAnalysis.totalCosts}</p>
    </div>
  );
}
