
import React from "react";
import { Button } from "@/components/ui/button";
import { bolt as Bolt } from "lucide-react";
import { ExportPdfButton } from "@/components/ui/ExportPdfButton";
interface InventoryHeaderProps {
  onRunOptimization: () => void;
}
export const InventoryHeader: React.FC<InventoryHeaderProps> = ({ onRunOptimization }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold mb-2">Inventory Optimization</h1>
        <p className="text-muted-foreground">
          Optimize inventory levels, reduce costs, and improve service levels using advanced algorithms.
        </p>
      </div>
      <div className="flex gap-2">
        <ExportPdfButton
          exportId="inventory-optimization-content"
          fileName="inventory-optimization-analysis"
        />
        <Button onClick={onRunOptimization}>
          <Bolt className="h-4 w-4 mr-2" />
          Run Optimization
        </Button>
      </div>
    </div>
  );
};
