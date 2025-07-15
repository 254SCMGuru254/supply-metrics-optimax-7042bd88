
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WarehouseConfigContent } from '@/components/warehouse/WarehouseConfigContent';

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

const Warehouse = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [nodes, setNodes] = useState<Node[]>([]);

  if (!projectId) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>No project selected. Please go back to the dashboard and select a project.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Warehouse Management</CardTitle>
        </CardHeader>
        <CardContent>
          <WarehouseConfigContent 
            projectId={projectId}
            nodes={nodes}
            setNodes={setNodes}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Warehouse;
