
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Node } from '@/integrations/supabase/types';

interface EditableMapPointsProps {
  projectId: string;
  onNodesChange: (nodes: Node[]) => void;
}

// Create custom icon
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: ${color};
      border: 2px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

// Map click handler component
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export const EditableMapPoints: React.FC<EditableMapPointsProps> = ({ 
  projectId, 
  onNodesChange 
}) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [isAddingNode, setIsAddingNode] = useState(false);
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [newNodeData, setNewNodeData] = useState({
    name: '',
    type: 'warehouse' as Node['type'],
    latitude: 0,
    longitude: 0,
    capacity: 0,
    demand: 0
  });

  // Draggable edit form component
  const EditForm = ({ node, onSave, onCancel }: { 
    node: Node; 
    onSave: (updatedNode: Node) => void; 
    onCancel: () => void; 
  }) => {
    const [formData, setFormData] = useState(node);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 20, y: 20 });

    const handleMouseDown = (e: React.MouseEvent) => {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    useEffect(() => {
      if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }, [isDragging, dragStart]);

    return (
      <div 
        className="fixed bg-card border border-border rounded-lg shadow-xl p-4 z-[1000] min-w-[300px]"
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Edit Node</h3>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="nodeName" className="text-foreground">Name</Label>
            <Input
              id="nodeName"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-background text-foreground"
            />
          </div>
          
          <div>
            <Label htmlFor="nodeType" className="text-foreground">Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value: Node['type']) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger className="bg-background text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="warehouse">Warehouse</SelectItem>
                <SelectItem value="factory">Factory</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="distribution">Distribution</SelectItem>
                <SelectItem value="supplier">Supplier</SelectItem>
                <SelectItem value="demand">Demand Point</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="capacity" className="text-foreground">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity || ''}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                className="bg-background text-foreground"
              />
            </div>
            <div>
              <Label htmlFor="demand" className="text-foreground">Demand</Label>
              <Input
                id="demand"
                type="number"
                value={formData.demand || ''}
                onChange={(e) => setFormData({ ...formData, demand: Number(e.target.value) })}
                className="bg-background text-foreground"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={() => onSave(formData)}
              className="flex-1"
              size="sm"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button 
              variant="outline" 
              onClick={onCancel}
              className="flex-1"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const handleMapClick = (lat: number, lng: number) => {
    if (isAddingNode) {
      setNewNodeData(prev => ({ ...prev, latitude: lat, longitude: lng }));
    }
  };

  const handleAddNode = () => {
    if (newNodeData.name && newNodeData.latitude && newNodeData.longitude) {
      const newNode: Node = {
        id: `node-${Date.now()}`,
        ...newNodeData
      };
      const updatedNodes = [...nodes, newNode];
      setNodes(updatedNodes);
      onNodesChange(updatedNodes);
      setIsAddingNode(false);
      setNewNodeData({
        name: '',
        type: 'warehouse',
        latitude: 0,
        longitude: 0,
        capacity: 0,
        demand: 0
      });
    }
  };

  const handleEditNode = (node: Node) => {
    setEditingNode(node);
  };

  const handleSaveEdit = (updatedNode: Node) => {
    const updatedNodes = nodes.map(n => n.id === updatedNode.id ? updatedNode : n);
    setNodes(updatedNodes);
    onNodesChange(updatedNodes);
    setEditingNode(null);
  };

  const handleDeleteNode = (nodeId: string) => {
    const updatedNodes = nodes.filter(n => n.id !== nodeId);
    setNodes(updatedNodes);
    onNodesChange(updatedNodes);
  };

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'warehouse': return '#ef4444';
      case 'factory': return '#f59e0b';
      case 'retail': return '#3b82f6';
      case 'distribution': return '#8b5cf6';
      case 'supplier': return '#10b981';
      case 'demand': return '#f97316';
      default: return '#6b7280';
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <MapPin className="h-5 w-5" />
            Interactive Map Editor
            <Badge variant="outline" className="ml-auto">
              {nodes.length} nodes
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative">
            <div className="absolute top-4 left-4 z-[1000] space-x-2">
              <Button
                onClick={() => setIsAddingNode(!isAddingNode)}
                variant={isAddingNode ? "default" : "outline"}
                size="sm"
                className="bg-background/90 backdrop-blur-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                {isAddingNode ? 'Click Map to Add' : 'Add Node'}
              </Button>
            </div>

            <div className="h-[500px] w-full rounded-b-lg overflow-hidden">
              <MapContainer
                center={[-1.2921, 36.8219]}
                zoom={6}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                <MapClickHandler onMapClick={handleMapClick} />
                
                {nodes.map((node) => (
                  <Marker
                    key={node.id}
                    position={[node.latitude, node.longitude]}
                    icon={createCustomIcon(getMarkerColor(node.type))}
                  >
                    <Popup>
                      <div className="p-2 min-w-[200px]">
                        <h3 className="font-bold text-foreground">{node.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">{node.type}</p>
                        {node.capacity && <p className="text-sm">Capacity: {node.capacity}</p>}
                        {node.demand && <p className="text-sm">Demand: {node.demand}</p>}
                        <div className="flex gap-1 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditNode(node)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteNode(node.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Node Form */}
      {isAddingNode && (
        <Card className="border-blue-500">
          <CardHeader>
            <CardTitle className="text-foreground">Add New Node</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="newNodeName" className="text-foreground">Node Name</Label>
              <Input
                id="newNodeName"
                value={newNodeData.name}
                onChange={(e) => setNewNodeData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter node name"
                className="bg-background text-foreground"
              />
            </div>
            
            <div>
              <Label htmlFor="newNodeType" className="text-foreground">Node Type</Label>
              <Select 
                value={newNodeData.type} 
                onValueChange={(value: Node['type']) => setNewNodeData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="bg-background text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                  <SelectItem value="factory">Factory</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="distribution">Distribution</SelectItem>
                  <SelectItem value="supplier">Supplier</SelectItem>
                  <SelectItem value="demand">Demand Point</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newCapacity" className="text-foreground">Capacity</Label>
                <Input
                  id="newCapacity"
                  type="number"
                  value={newNodeData.capacity}
                  onChange={(e) => setNewNodeData(prev => ({ ...prev, capacity: Number(e.target.value) }))}
                  className="bg-background text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="newDemand" className="text-foreground">Demand</Label>
                <Input
                  id="newDemand"
                  type="number"
                  value={newNodeData.demand}
                  onChange={(e) => setNewNodeData(prev => ({ ...prev, demand: Number(e.target.value) }))}
                  className="bg-background text-foreground"
                />
              </div>
            </div>

            {newNodeData.latitude !== 0 && (
              <div className="text-sm text-muted-foreground">
                Location: {newNodeData.latitude.toFixed(4)}, {newNodeData.longitude.toFixed(4)}
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={handleAddNode}
                disabled={!newNodeData.name || !newNodeData.latitude}
                className="flex-1"
              >
                Add Node
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsAddingNode(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Draggable Edit Form */}
      {editingNode && (
        <EditForm
          node={editingNode}
          onSave={handleSaveEdit}
          onCancel={() => setEditingNode(null)}
        />
      )}
    </div>
  );
};
