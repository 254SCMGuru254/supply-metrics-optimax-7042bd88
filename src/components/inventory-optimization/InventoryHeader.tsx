
import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

export const InventoryHeader: React.FC = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-2xl font-semibold tracking-tight">
        <Package className="mr-2 h-5 w-5 inline-block" />
        Inventory Optimization
      </CardTitle>
    </CardHeader>
  </Card>
);

export default InventoryHeader;
