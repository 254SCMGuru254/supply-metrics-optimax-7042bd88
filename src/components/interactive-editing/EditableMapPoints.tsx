
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Edit, Trash2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import L from 'leaflet';

interface MapNode {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  node_type: string;
  capacity?: number;
  demand?: number;
  fixed_cost?: number;
  variable_cost?: number;
  service_level?: number;
  is_editable: boolean;
}

interface EditableMapPointsProps {
  projectId: string;
  onNodesChange?: (nodes: MapNode[]) => void;
}

export const EditableMapPoints = ({ projectId, onNodesChange }: EditableMapPointsProps) => {
  const [nodes, setNodes] = useState<MapNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [newNodePosition, setNewNodePosition] = useState<[number, number] | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadNodes();
  }, [projectId]);

  const loadNodes = async () => {
    try {
      const { data, error } = await supabase
        .from('supply_nodes')
        .select('*')
        .eq('project_id', projectId);

      if (error) throw error;
      setNodes(data || []);
      onNodesChange?.(data || []);
    } catch (error) {
      console.error('Error loading nodes:', error);
      toast({
        title: "Error",
        description: "Failed to load map nodes",
        variant: "destructive"
      });
    }
  };

  const saveNode = async (nodeData: Partial<MapNode>) => {
    try {
      if (selectedNode?.id) {
        // Update existing node
        const { error } = await supabase
          .from('supply_nodes')
          .update(nodeData)
          .eq('id', selectedNode.id);

        if (error) throw error;

        setNodes(nodes.map(n => n.id === selectedNode.id ? { ...n, ...nodeData } : n));
        toast({
          title: "Success",
          description: "Node updated successfully"
        });
      } else {
        // Create new node
        const { data, error } = await supabase
          .from('supply_nodes')
          .insert({
            project_id: projectId,
            ...nodeData
          })
          .select()
          .single();

        if (error) throw error;

        setNodes([...nodes, data]);
        toast({
          title: "Success",
          description: "Node created successfully"
        });
      }

      setIsEditDialogOpen(false);
      setSelectedNode(null);
      setNewNodePosition(null);
      loadNodes();
    } catch (error) {
      console.error('Error saving node:', error);
      toast({
        title: "Error",
        description: "Failed to save node",
        variant: "destructive"
      });
    }
  };

  const deleteNode = async (nodeId: string) => {
    if (!confirm('Are you sure you want to delete this node?')) return;

    try {
      const { error } = await supabase
        .from('supply_nodes')
        .delete()
        .eq('id', nodeId);

      if (error) throw error;

      setNodes(nodes.filter(n => n.id !== nodeId));
      toast({
        title: "Success",
        description: "Node deleted successfully"
      });
      loadNodes();
    } catch (error) {
      console.error('Error deleting node:', error);
      toast({
        title: "Error",
        description: "Failed to delete node",
        variant: "destructive"
      });
    }
  };

  const getNodeIcon = (nodeType: string) => {
    const iconConfig = {
      supplier: { color: 'blue', icon: '🏭' },
      warehouse: { color: 'green', icon: '🏬' },
      distribution_center: { color: 'orange', icon: '📦' },
      customer: { color: 'red', icon: '🏪' },
      facility: { color: 'purple', icon: '🏢' },
      demand_point: { color: 'pink', icon: '📍' }
    };

    const config = iconConfig[nodeType as keyof typeof iconConfig] || iconConfig.customer;
    
    return L.divIcon({
      html: `<div style="background-color: ${config.color}; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${config.icon}</div>`,
      className: 'custom-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        if (isAddMode) {
          setNewNodePosition([e.latlng.lat, e.latlng.lng]);
          setSelectedNode(null);
          setIsEditDialogOpen(true);
        }
      }
    });
    return null;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Interactive Map Editor
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={isAddMode ? "default" : "outline"}
                onClick={() => setIsAddMode(!isAddMode)}
              >
                <Plus className="h-4 w-4 mr-2" />
                {isAddMode ? 'Exit Add Mode' : 'Add Node'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isAddMode && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                Click anywhere on the map to add a new node at that location.
              </p>
            </div>
          )}
          
          <div className="h-96 rounded-lg overflow-hidden border">
            <MapContainer
              center={[-1.286389, 36.817223]} // Nairobi coordinates
              zoom={7}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapClickHandler />
              
              {nodes.map((node) => (
                <Marker
                  key={node.id}
                  position={[node.latitude, node.longitude]}
                  icon={getNodeIcon(node.node_type)}
                >
                  <Popup>
                    <div className="space-y-2 min-w-48">
                      <div>
                        <h3 className="font-semibold">{node.name}</h3>
                        <Badge variant="outline">{node.node_type}</Badge>
                      </div>
                      
                      <div className="text-sm space-y-1">
                        {node.demand && <p>Demand: {node.demand}</p>}
                        {node.capacity && <p>Capacity: {node.capacity}</p>}
                        {node.fixed_cost && <p>Fixed Cost: KSh {node.fixed_cost}</p>}
                      </div>
                      
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedNode(node);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        {node.is_editable && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteNode(node.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedNode ? 'Edit Node' : 'Add New Node'}
            </DialogTitle>
          </DialogHeader>
          <NodeEditForm
            node={selectedNode}
            position={newNodePosition}
            onSave={saveNode}
            onCancel={() => {
              setIsEditDialogOpen(false);
              setSelectedNode(null);
              setNewNodePosition(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface NodeEditFormProps {
  node?: MapNode | null;
  position?: [number, number] | null;
  onSave: (nodeData: Partial<MapNode>) => void;
  onCancel: () => void;
}

const NodeEditForm = ({ node, position, onSave, onCancel }: NodeEditFormProps) => {
  const [formData, setFormData] = useState({
    name: node?.name || '',
    node_type: node?.node_type || 'customer',
    latitude: node?.latitude || position?.[0] || 0,
    longitude: node?.longitude || position?.[1] || 0,
    capacity: node?.capacity || 0,
    demand: node?.demand || 0,
    fixed_cost: node?.fixed_cost || 0,
    variable_cost: node?.variable_cost || 0,
    service_level: node?.service_level || 95
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      return;
    }
    onSave({
      ...formData,
      is_editable: true
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Node Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter node name"
          required
        />
      </div>

      <div>
        <Label htmlFor="node_type">Node Type</Label>
        <Select value={formData.node_type} onValueChange={(value) => setFormData({ ...formData, node_type: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="supplier">Supplier</SelectItem>
            <SelectItem value="warehouse">Warehouse</SelectItem>
            <SelectItem value="distribution_center">Distribution Center</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="facility">Facility</SelectItem>
            <SelectItem value="demand_point">Demand Point</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            value={formData.latitude}
            onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
          />
        </div>
        <div>
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            value={formData.longitude}
            onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <Label htmlFor="demand">Demand</Label>
          <Input
            id="demand"
            type="number"
            value={formData.demand}
            onChange={(e) => setFormData({ ...formData, demand: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="fixed_cost">Fixed Cost (KSh)</Label>
          <Input
            id="fixed_cost"
            type="number"
            value={formData.fixed_cost}
            onChange={(e) => setFormData({ ...formData, fixed_cost: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <Label htmlFor="variable_cost">Variable Cost (KSh)</Label>
          <Input
            id="variable_cost"
            type="number"
            value={formData.variable_cost}
            onChange={(e) => setFormData({ ...formData, variable_cost: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
