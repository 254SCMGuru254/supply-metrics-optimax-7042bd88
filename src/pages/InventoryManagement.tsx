
import React, { useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { InventoryHeader } from "@/components/inventory-optimization/InventoryHeader";
import { InventoryMetricsGrid } from "@/components/inventory-optimization/InventoryMetricsGrid";
import { InventoryTabsContent } from "@/components/inventory-optimization/InventoryTabsContent";

const InventoryManagement = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleOptimizationComplete = () => {
    toast({
      title: "Optimization Complete",
      description: "Your inventory optimization has been completed successfully.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8" ref={contentRef}>
      <InventoryHeader onRunOptimization={handleOptimizationComplete} />
      <InventoryMetricsGrid />
      <InventoryTabsContent />
    </div>
  );
};

export default InventoryManagement;
