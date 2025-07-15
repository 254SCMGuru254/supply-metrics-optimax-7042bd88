
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Node } from '@/integrations/supabase/types';

export interface WarehouseConfigProps {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  projectId: string;
}

export const WarehouseConfigContent: React.FC<WarehouseConfigProps> = ({ 
  nodes, 
  setNodes, 
  projectId 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Warehouse Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Warehouse configuration for project: {projectId} with {nodes.length} nodes
        </p>
      </CardContent>
    </Card>
  );
};
