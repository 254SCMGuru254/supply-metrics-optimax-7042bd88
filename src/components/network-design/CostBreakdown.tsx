
import { Card } from "@/components/ui/card";
import { CostAnalysis } from "./types/NetworkTypes";

interface CostBreakdownProps {
  costAnalysis: CostAnalysis | null;
}

export const CostBreakdown: React.FC<CostBreakdownProps> = ({ costAnalysis }) => {
  if (!costAnalysis) {
    return (
      <Card className="p-4">
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Run a cost analysis to see the results here
          </p>
        </div>
      </Card>
    );
  }

  const formatCost = (cost: number) => {
    return `$${cost.toLocaleString(undefined, { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    })}`;
  };

  const calculatePercentage = (cost: number) => {
    return ((cost / costAnalysis.totalCost) * 100).toFixed(1) + '%';
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Cost Analysis Results</h3>
      
      <div className="space-y-8">
        {/* Total Cost Summary */}
        <div>
          <h4 className="text-sm font-medium mb-2">Network Cost Summary</h4>
          <div className="bg-primary/5 p-4 rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Network Cost</span>
              <span className="text-lg font-semibold">{formatCost(costAnalysis.totalCost)}</span>
            </div>
          </div>
        </div>
        
        {/* Cost Breakdown by Category */}
        <div>
          <h4 className="text-sm font-medium mb-2">Cost Breakdown by Category</h4>
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
              <div>Category</div>
              <div className="text-right">Amount</div>
              <div className="text-right">Percentage</div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 py-2 border-b">
              <div>Trunking Cost</div>
              <div className="text-right">{formatCost(costAnalysis.trunkingCost)}</div>
              <div className="text-right">{calculatePercentage(costAnalysis.trunkingCost)}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 py-2 border-b">
              <div>Local Delivery Cost</div>
              <div className="text-right">{formatCost(costAnalysis.deliveryCost)}</div>
              <div className="text-right">{calculatePercentage(costAnalysis.deliveryCost)}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 py-2 border-b">
              <div>Depot Cost</div>
              <div className="text-right">{formatCost(costAnalysis.depotCost)}</div>
              <div className="text-right">{calculatePercentage(costAnalysis.depotCost)}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 py-2 border-b">
              <div>Stock Holding Cost</div>
              <div className="text-right">{formatCost(costAnalysis.stockHoldingCost)}</div>
              <div className="text-right">{calculatePercentage(costAnalysis.stockHoldingCost)}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 py-2 bg-primary/5 font-medium">
              <div>Total</div>
              <div className="text-right">{formatCost(costAnalysis.totalCost)}</div>
              <div className="text-right">100.0%</div>
            </div>
          </div>
        </div>
        
        {/* Cost Breakdown by Depot */}
        {Object.keys(costAnalysis.breakdown.byDepot).length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Cost Breakdown by Depot</h4>
            <div className="space-y-4">
              {Object.entries(costAnalysis.breakdown.byDepot).map(([depotId, costs]) => (
                <div key={depotId} className="bg-secondary/10 p-4 rounded-md space-y-2">
                  <div className="font-medium">Depot ID: {depotId}</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Trunking Cost:</div>
                    <div className="text-right">{formatCost(costs.trunkingCost)}</div>
                    
                    <div>Local Delivery Cost:</div>
                    <div className="text-right">{formatCost(costs.deliveryCost)}</div>
                    
                    <div>Depot Operating Cost:</div>
                    <div className="text-right">{formatCost(costs.depotCost)}</div>
                    
                    <div>Stock Holding Cost:</div>
                    <div className="text-right">{formatCost(costs.stockHoldingCost)}</div>
                    
                    <div className="font-medium">Total Cost:</div>
                    <div className="font-medium text-right">{formatCost(costs.totalCost)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
