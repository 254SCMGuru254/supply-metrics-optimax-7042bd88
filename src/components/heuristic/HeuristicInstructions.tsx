
import { Card } from "@/components/ui/card";

export const HeuristicInstructions = () => {
  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">How to Use</h2>
      <div className="space-y-2">
        <p>1. Click on the map to add facility locations</p>
        <p>2. Adjust algorithm parameters if needed</p>
        <p>3. Click "Run Optimization" to apply the simulated annealing algorithm</p>
        <p>4. View the optimized routes and cost reduction in the metrics panel</p>
      </div>
    </Card>
  );
};
