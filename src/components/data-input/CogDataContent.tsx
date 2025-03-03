
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const CogDataContent = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Center of Gravity Data</h2>
      <Tabs defaultValue="demand-weights">
        <TabsList className="mb-6">
          <TabsTrigger value="demand-weights">Demand Weights</TabsTrigger>
          <TabsTrigger value="distance-metrics">Distance Metrics</TabsTrigger>
          <TabsTrigger value="cost-factors">Cost Factors</TabsTrigger>
        </TabsList>
        <TabsContent value="demand-weights">
          <p className="text-muted-foreground mb-4">
            Configure demand weights for Center of Gravity calculation. Weights determine the "pull" of each demand point.
          </p>
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Coming soon - Use General Data demand points for now.</p>
          </div>
        </TabsContent>
        <TabsContent value="distance-metrics">
          <p className="text-muted-foreground mb-4">
            Set up distance calculation methods (Euclidean, Manhattan, etc.) for the analysis.
          </p>
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Coming soon - Use default Euclidean distance for now.</p>
          </div>
        </TabsContent>
        <TabsContent value="cost-factors">
          <p className="text-muted-foreground mb-4">
            Define cost factors that vary with distance for a more accurate facility location.
          </p>
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Coming soon - Using linear cost factors for now.</p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
