
import { CostAnalysis } from "./types/NetworkDesign";

interface CostBreakdownProps {
  costAnalysis: CostAnalysis;
}

export function CostBreakdown({ costAnalysis }: CostBreakdownProps) {
  return (
    <div>
      <h3>Cost Breakdown</h3>
      <p>Fixed Costs: ${costAnalysis.depotCost}</p>
      <p>Variable Costs: ${costAnalysis.deliveryCost}</p>
      <p>Total Costs: ${costAnalysis.totalCost}</p>
    </div>
  );
}
