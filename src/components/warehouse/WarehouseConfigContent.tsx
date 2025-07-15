
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Node } from '@/integrations/supabase/types';

interface WarehouseConfigProps {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  projectId: string;
}

export const WarehouseConfigContent: React.FC<WarehouseConfigProps> = ({ nodes, setNodes, projectId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Warehouse Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Warehouse configuration for project {projectId}</p>
        <p>Current nodes: {nodes.length}</p>
      </CardContent>
    </Card>
  );
};
