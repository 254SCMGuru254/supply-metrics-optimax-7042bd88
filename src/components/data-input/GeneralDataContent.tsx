import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NodeForm } from "@/components/forms/NodeForm";
import { DemandPointForm } from "@/components/forms/DemandPointForm";
import { RouteForm } from "@/components/forms/RouteForm";

export const GeneralDataContent = ({ projectId }: { projectId: string }) => {
  return (
    <Card className="p-6">
      <Tabs defaultValue="nodes">
        <TabsList className="mb-6">
          <TabsTrigger value="nodes">Supply Nodes</TabsTrigger>
          <TabsTrigger value="demand">Demand Points</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
        </TabsList>
        <TabsContent value="nodes">
          <NodeForm projectId={projectId} />
        </TabsContent>
        <TabsContent value="demand">
          <DemandPointForm projectId={projectId} />
        </TabsContent>
        <TabsContent value="routes">
          <RouteForm projectId={projectId} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
