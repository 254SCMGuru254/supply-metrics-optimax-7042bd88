import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { InventoryHeader } from "@/components/inventory-optimization/InventoryHeader";
import { InventoryMetricsGrid } from "@/components/inventory-optimization/InventoryMetricsGrid";
import { InventoryTabsContent } from "@/components/inventory-optimization/InventoryTabsContent";
import { AdvancedEOQCalculators } from "@/components/inventory-optimization/AdvancedEOQCalculators";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

const InventoryManagement = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const contentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleOptimizationComplete = () => {
    toast({
      title: "Optimization Complete",
      description: "Your inventory optimization has been completed successfully.",
    });
  };

  if (!projectId) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>No project selected. Please go back to the dashboard and select a project.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8" ref={contentRef}>
      <InventoryHeader />
      <InventoryMetricsGrid projectId={projectId} />
      <InventoryTabsContent projectId={projectId} />
      <TabsContent value="advanced-calculators">
        <Card>
          <CardHeader>
            <CardTitle>Advanced Inventory Calculators</CardTitle>
            <CardDescription>
              Dive deeper into inventory analysis with a suite of specialized calculators.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdvancedEOQCalculators projectId={projectId} />
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
};

export default InventoryManagement;
