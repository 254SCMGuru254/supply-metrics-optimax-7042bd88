
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const SimulationContent = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Simulation Data</h2>
      <Tabs defaultValue="demand-patterns">
        <TabsList className="mb-6">
          <TabsTrigger value="demand-patterns">Demand Patterns</TabsTrigger>
          <TabsTrigger value="lead-times">Lead Times</TabsTrigger>
          <TabsTrigger value="service-levels">Service Levels</TabsTrigger>
        </TabsList>
        <TabsContent value="demand-patterns">
          <p className="text-muted-foreground mb-4">
            Define demand patterns and variability for stochastic simulation.
          </p>
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Coming soon - Using normal distribution with coefficient of variation 0.3 for now.</p>
          </div>
        </TabsContent>
        <TabsContent value="lead-times">
          <p className="text-muted-foreground mb-4">
            Set up lead time distributions for more realistic supply chain simulation.
          </p>
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Coming soon - Using General Data transit times for now.</p>
          </div>
        </TabsContent>
        <TabsContent value="service-levels">
          <p className="text-muted-foreground mb-4">
            Configure target service levels for inventory optimization.
          </p>
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Coming soon - Using default 95% service level for now.</p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
