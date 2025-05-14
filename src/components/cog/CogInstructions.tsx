
import { Card } from "@/components/ui/card";

export const CogInstructions = () => {
  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">How to Use</h2>
      <div className="space-y-2">
        <p>1. Click on the map to add demand points (customer locations)</p>
        <p>2. Add an existing warehouse location (optional) to compare with optimal location</p>
        <p>3. Adjust the demand weights to reflect actual volumes or importance</p>
        <p>4. Toggle calculation method if needed (Euclidean vs. Haversine)</p>
        <p>5. Click "Run Optimization" to calculate the center of gravity</p>
        <p>6. Review the results and practical recommendations</p>
        <p>7. Export your data for further analysis or implementation</p>
      </div>
    </Card>
  );
};
