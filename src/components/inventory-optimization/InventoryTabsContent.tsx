
import React from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ABCAnalysis } from "@/components/inventory-optimization/ABCAnalysis";
import { WarehouseConfigContent } from "@/components/warehouse/WarehouseConfigContent";
import { Activity, Package, BarChart3, MapPin, Settings, Calculator, Lightbulb, Target, Layers } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Define Node interface locally
interface Node {
  id: string;
  name: string;
  type: 'supplier' | 'warehouse' | 'retail' | 'demand' | 'facility';
  latitude: number;
  longitude: number;
  capacity?: number;
  demand?: number;
  fixed_cost?: number;
  variable_cost?: number;
}

export const InventoryTabsContent: React.FC = () => {
  const projectId = 'default-project';

  const { data: supplyNodes, isLoading } = useQuery<Node[]>({
    queryKey: ['supplyNodes', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const { data, error } = await supabase
        .from('supply_nodes')
        .select('*')
        .eq('project_id', projectId);

      if (error) throw new Error(error.message);
      return data.map(n => ({
        id: n.id,
        name: n.name,
        type: n.node_type as 'supplier' | 'warehouse' | 'retail' | 'demand' | 'facility',
        latitude: n.latitude,
        longitude: n.longitude,
        capacity: n.capacity,
        demand: n.demand,
        fixed_cost: n.fixed_cost,
        variable_cost: n.variable_cost
      }));
    },
    enabled: !!projectId
  });

  return (
    <Tabs defaultValue="abc-analysis" className="space-y-4">
      <TabsList className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <TabsTrigger value="abc-analysis" className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          ABC Analysis
        </TabsTrigger>
        <TabsTrigger value="warehouse-config" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Warehouse Config
        </TabsTrigger>
      </TabsList>

      <TabsContent value="abc-analysis" className="space-y-2">
        <Card>
          <CardHeader>
            <CardTitle>ABC Analysis</CardTitle>
            <CardDescription>
              Analyze inventory items based on their value and usage.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ABCAnalysis />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="warehouse-config" className="space-y-2">
        <Card>
          <CardHeader>
            <CardTitle>Warehouse Configuration</CardTitle>
            <CardDescription>
              Configure warehouse settings and parameters.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {supplyNodes ? (
              <WarehouseConfigContent 
                projectId={projectId}
                nodes={supplyNodes}
                setNodes={() => {}}
              />
            ) : (
              <p>Loading warehouse data...</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default InventoryTabsContent;
