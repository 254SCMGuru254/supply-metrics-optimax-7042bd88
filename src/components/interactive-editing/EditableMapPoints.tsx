import React, { useState, Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, MapPin, Edit } from 'lucide-react';

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

interface EditableMapPointsProps {
  nodes: Node[];
  setNodes: Dispatch<SetStateAction<Node[]>>;
  onNodeEdit?: (node: Node) => void;
}

export const EditableMapPoints: React.FC<EditableMapPointsProps> = ({
  nodes,
  setNodes,
  onNodeEdit
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    latitude: 0,
    longitude: 0,
    capacity: 0,
    demand: 0,
    fixed_cost: 0,
    variable_cost: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const nodeData: Node = {
      id: editingNode?.id || Date.now().toString(),
      ...formData
    };

    if (editingNode) {
      setNodes(prev => prev.map(n => n.id === editingNode.id ? nodeData : n));
    } else {
      setNodes(prev => [...prev, nodeData]);
    }

    setIsDialogOpen(false);
    setEditingNode(null);
    setFormData({
      name: '',
      latitude: 0,
      longitude: 0,
      capacity: 0,
      demand: 0,
      fixed_cost: 0,
      variable_cost: 0
    });

    if (onNodeEdit) {
      onNodeEdit(nodeData);
    }
  };

  const handleEdit = (node: Node) => {
    setEditingNode(node);
    setFormData({
      name: node.name,
      latitude: node.latitude,
      longitude: node.longitude,
      capacity: node.capacity || 0,
      demand: node.demand || 0,
      fixed_cost: node.fixed_cost || 0,
      variable_cost: node.variable_cost || 0
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add New Location
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md bg-background border border-border draggable">
          <DialogHeader>
            <DialogTitle>
              {editingNode ? 'Edit Location' : 'Add New Location'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseFloat(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="demand">Demand</Label>
                <Input
                  id="demand"
                  type="number"
                  value={formData.demand}
                  onChange={(e) => setFormData(prev => ({ ...prev, demand: parseFloat(e.target.value) }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fixed_cost">Fixed Cost</Label>
                <Input
                  id="fixed_cost"
                  type="number"
                  value={formData.fixed_cost}
                  onChange={(e) => setFormData(prev => ({ ...prev, fixed_cost: parseFloat(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="variable_cost">Variable Cost</Label>
                <Input
                  id="variable_cost"
                  type="number"
                  value={formData.variable_cost}
                  onChange={(e) => setFormData(prev => ({ ...prev, variable_cost: parseFloat(e.target.value) }))}
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              {editingNode ? 'Update Location' : 'Add Location'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {nodes.map((node) => (
          <Card key={node.id} className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-medium">{node.name}</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEdit(node)}
              >
                <Edit className="h-3 w-3" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EditableMapPoints;
