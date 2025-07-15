import React, { useState, Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Define Node interface locally
interface Node {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  capacity?: number;
  demand?: number;
  fixed_cost?: number;
  variable_cost?: number;
}

interface WarehouseConfigProps {
  projectId: string;
  nodes: Node[];
  setNodes: Dispatch<SetStateAction<Node[]>>;
}

export const WarehouseConfigContent: React.FC<WarehouseConfigProps> = ({
  projectId,
  nodes,
  setNodes
}) => {
  const [selectedWarehouse, setSelectedWarehouse] = useState<Node | null>(null);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Warehouse Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Available Warehouses</h3>
              <div className="space-y-2">
                {nodes.filter(n => n.capacity && n.capacity > 0).map(warehouse => (
                  <Card 
                    key={warehouse.id} 
                    className={`p-3 cursor-pointer transition-colors ${
                      selectedWarehouse?.id === warehouse.id ? 'bg-primary/10 border-primary' : ''
                    }`}
                    onClick={() => setSelectedWarehouse(warehouse)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{warehouse.name}</span>
                      <span className="text-sm text-muted-foreground">
                        Capacity: {warehouse.capacity}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Configuration Details</h3>
              {selectedWarehouse ? (
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Name</label>
                        <p className="text-lg">{selectedWarehouse.name}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Latitude</label>
                          <p>{selectedWarehouse.latitude}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Longitude</label>
                          <p>{selectedWarehouse.longitude}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Capacity</label>
                          <p>{selectedWarehouse.capacity}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Fixed Cost</label>
                          <p>KES {selectedWarehouse.fixed_cost?.toLocaleString() || 0}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">Select a warehouse to view configuration details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WarehouseConfigContent;
