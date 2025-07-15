
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Node } from '@/integrations/supabase/types';
import { Building, Plus, Edit, Trash2 } from 'lucide-react';

export interface WarehouseConfigProps {
  projectId: string;
  nodes?: Node[];
  setNodes?: Dispatch<SetStateAction<Node[]>>;
}

export const WarehouseConfigContent: React.FC<WarehouseConfigProps> = ({ 
  projectId, 
  nodes = [], 
  setNodes = () => {} 
}) => {
  const [warehouses, setWarehouses] = useState<Node[]>(nodes);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Warehouse Configuration</h2>
          <p className="text-muted-foreground">Manage your warehouse nodes for project {projectId}</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Warehouse
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {warehouses.map((warehouse) => (
          <Card key={warehouse.id} className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                {warehouse.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Capacity:</strong> {warehouse.capacity || 'N/A'}</p>
                <p><strong>Location:</strong> {warehouse.latitude}, {warehouse.longitude}</p>
                <p><strong>Fixed Cost:</strong> ${warehouse.fixed_cost || 0}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
