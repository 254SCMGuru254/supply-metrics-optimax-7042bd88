
import { Card } from "@/components/ui/card";

export const CogInstructions = () => {
  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">How to Use</h2>
      <div className="space-y-2">
        <p>1. Click on the map to add demand points</p>
        <p>2. Adjust the weights to represent demand volumes</p>
        <p>3. Toggle calculation method if needed (Euclidean vs. Haversine)</p>
        <p>4. Click "Run Optimization" to calculate the center of gravity</p>
        <p>5. View the results and metrics in the panel</p>
      </div>
    </Card>
  );
};
