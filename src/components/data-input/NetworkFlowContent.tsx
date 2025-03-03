
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const NetworkFlowContent = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Network Flow Data</h2>
      <Tabs defaultValue="capacities">
        <TabsList className="mb-6">
          <TabsTrigger value="capacities">Node Capacities</TabsTrigger>
          <TabsTrigger value="flow-constraints">Flow Constraints</TabsTrigger>
          <TabsTrigger value="cost-matrix">Cost Matrix</TabsTrigger>
        </TabsList>
        <TabsContent value="capacities">
          <p className="text-muted-foreground mb-4">
            Define capacity constraints for each node in the network.
          </p>
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Coming soon - Use General Data node capacities for now.</p>
          </div>
        </TabsContent>
        <TabsContent value="flow-constraints">
          <p className="text-muted-foreground mb-4">
            Set minimum and maximum flow constraints for each route in the network.
          </p>
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Coming soon - Only using capacity constraints for now.</p>
          </div>
        </TabsContent>
        <TabsContent value="cost-matrix">
          <p className="text-muted-foreground mb-4">
            Upload or define a cost matrix for transportation between nodes.
          </p>
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Coming soon - Using General Data route costs for now.</p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
