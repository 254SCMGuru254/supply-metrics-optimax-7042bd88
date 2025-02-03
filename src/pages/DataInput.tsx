import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NodeForm } from "@/components/forms/NodeForm";
import { DemandPointForm } from "@/components/forms/DemandPointForm";
import { RouteForm } from "@/components/forms/RouteForm";

const DataInput = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Data Management</h1>
      <Card className="p-6">
        <Tabs defaultValue="nodes">
          <TabsList className="mb-6">
            <TabsTrigger value="nodes">Supply Nodes</TabsTrigger>
            <TabsTrigger value="demand">Demand Points</TabsTrigger>
            <TabsTrigger value="routes">Routes</TabsTrigger>
          </TabsList>
          <TabsContent value="nodes">
            <NodeForm />
          </TabsContent>
          <TabsContent value="demand">
            <DemandPointForm />
          </TabsContent>
          <TabsContent value="routes">
            <RouteForm />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default DataInput;