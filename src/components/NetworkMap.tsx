
import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Warehouse, Factory, Store, Truck, MapPin, Edit, Save, X } from "lucide-react";
import type { Node, Route, NodeType, OwnershipType } from "@/components/map/MapTypes";

export type { Node, Route, NodeType, OwnershipType };

export interface NetworkMapProps {
  nodes: Node[];
  routes: Route[];
  onNodeClick?: (node: Node) => void;
  onMapClick?: (lat: number, lng: number) => void;
  isOptimized?: boolean;
  highlightNodes?: string[];
  selectable?: boolean;
  onNodeSelect?: (nodes: string[]) => void;  onNodesChange?: (nodes: Node[]) => void;
  onRoutesChange?: (routes: Route[]) => void;
  disruptionData?: any;
  resilienceMetrics?: any;
  airportNodes?: any[];
  showLegend?: boolean;
}

// Custom hook to get map instance
const MapClickHandler = ({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!onMapClick) return;
    
    const handleClick = (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    };
    
    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [map, onMapClick]);
  
  return null;
};

// Node editing dialog component
const NodeEditDialog = ({ 
  node, 
  isOpen, 
  onClose, 
  onSave 
}: { 
  node: Node | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedNode: Node) => void;
}) => {
  const [editedNode, setEditedNode] = useState<Node | null>(null);

  useEffect(() => {
    if (node) {
      setEditedNode({ ...node });
    }
  }, [node]);

  if (!editedNode) return null;

  const handleSave = () => {
    onSave(editedNode);
    onClose();
  };

  const nodeTypeOptions: { value: NodeType; label: string; icon: React.ReactNode }[] = [
    { value: 'warehouse', label: 'Warehouse', icon: <Warehouse className="h-4 w-4" /> },
    { value: 'distribution', label: 'Distribution Center', icon: <Store className="h-4 w-4" /> },
    { value: 'supplier', label: 'Supplier', icon: <Factory className="h-4 w-4" /> },
    { value: 'customer', label: 'Customer', icon: <MapPin className="h-4 w-4" /> },
    { value: 'factory', label: 'Factory', icon: <Factory className="h-4 w-4" /> },
    { value: 'retail', label: 'Retail Store', icon: <Store className="h-4 w-4" /> },
  ];

  const ownershipOptions: { value: OwnershipType; label: string; description: string }[] = [
    { value: 'owned', label: 'Owned', description: 'Company-owned asset' },
    { value: 'hired', label: 'Hired/Leased', description: 'Leased or rented asset' },
    { value: 'outsourced', label: 'Outsourced', description: 'Third-party managed' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Node: {editedNode.name}
          </DialogTitle>
          <DialogDescription>
            Modify node properties, type, and ownership details
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="ownership">Ownership</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editedNode.name}
                  onChange={(e) => setEditedNode({ ...editedNode, name: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="type">Node Type</Label>
                <Select
                  value={editedNode.type}
                  onValueChange={(value: NodeType) => setEditedNode({ ...editedNode, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {nodeTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          {option.icon}
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={editedNode.capacity || ''}
                  onChange={(e) => setEditedNode({ ...editedNode, capacity: parseFloat(e.target.value) || 0 })}
                />
              </div>
              
              <div>
                <Label htmlFor="cost">Monthly Cost</Label>
                <Input
                  id="cost"
                  type="number"
                  value={editedNode.cost || ''}
                  onChange={(e) => setEditedNode({ ...editedNode, cost: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={editedNode.notes || ''}
                onChange={(e) => setEditedNode({ ...editedNode, notes: e.target.value })}
                placeholder="Additional notes about this node..."
              />
            </div>
          </TabsContent>
          
          <TabsContent value="ownership" className="space-y-4">
            <div>
              <Label htmlFor="ownership">Ownership Type</Label>
              <Select
                value={editedNode.ownership}
                onValueChange={(value: OwnershipType) => setEditedNode({ ...editedNode, ownership: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ownershipOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs text-muted-foreground">{option.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {editedNode.ownership === 'hired' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monthlyRent">Monthly Rent</Label>
                  <Input
                    id="monthlyRent"
                    type="number"
                    value={editedNode.monthlyRent || ''}
                    onChange={(e) => setEditedNode({ ...editedNode, monthlyRent: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="contractDuration">Contract Duration (months)</Label>
                  <Input
                    id="contractDuration"
                    type="number"
                    value={editedNode.contractDuration || ''}
                    onChange={(e) => setEditedNode({ ...editedNode, contractDuration: parseInt(e.target.value) || 0 })}
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="leaseTerms">Lease Terms</Label>
                  <Textarea
                    id="leaseTerms"
                    value={editedNode.leaseTerms || ''}
                    onChange={(e) => setEditedNode({ ...editedNode, leaseTerms: e.target.value })}
                    placeholder="Lease terms and conditions..."
                  />
                </div>
              </div>
            )}
            
            {editedNode.ownership === 'outsourced' && (
              <div>
                <Label htmlFor="serviceProvider">Service Provider</Label>
                <Input
                  id="serviceProvider"
                  value={editedNode.serviceProvider || ''}
                  onChange={(e) => setEditedNode({ ...editedNode, serviceProvider: e.target.value })}
                  placeholder="Name of service provider..."
                />
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="floorArea">Floor Area (sq m)</Label>
                <Input
                  id="floorArea"
                  type="number"
                  value={editedNode.floorArea || ''}
                  onChange={(e) => setEditedNode({ ...editedNode, floorArea: parseFloat(e.target.value) || 0 })}
                />
              </div>
              
              <div>
                <Label htmlFor="storageType">Storage Type</Label>
                <Input
                  id="storageType"
                  value={editedNode.storageType || ''}
                  onChange={(e) => setEditedNode({ ...editedNode, storageType: e.target.value })}
                  placeholder="e.g., Cold storage, Dry storage..."
                />
              </div>
              
              <div>
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  value={editedNode.temperature || ''}
                  onChange={(e) => setEditedNode({ ...editedNode, temperature: parseFloat(e.target.value) || 0 })}
                />
              </div>
              
              <div>
                <Label htmlFor="securityLevel">Security Level</Label>
                <Select
                  value={editedNode.securityLevel || ''}
                  onValueChange={(value) => setEditedNode({ ...editedNode, securityLevel: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select security level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="high">High Security</SelectItem>
                    <SelectItem value="maximum">Maximum Security</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const NetworkMap: React.FC<NetworkMapProps> = ({
  nodes,
  routes,
  onNodeClick,
  onMapClick,
  isOptimized = false,
  highlightNodes = [],
  selectable = false,
  onNodeSelect,
  disruptionData,
  resilienceMetrics,
  airportNodes,
  showLegend = true,
}) => {
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [localNodes, setLocalNodes] = useState<Node[]>(nodes);

  useEffect(() => {
    setLocalNodes(nodes);
  }, [nodes]);

  // Kenya bounds for map centering
  const kenyaBounds: [number, number] = [-0.0236, 37.9062];

  // Get node color based on ownership
  const getNodeColor = (node: Node) => {
    if (highlightNodes.includes(node.id)) {
      return '#ff6b6b'; // Highlighted red
    }
    
    switch (node.ownership) {
      case 'owned':
        return '#22c55e'; // Green for owned
      case 'hired':
        return '#3b82f6'; // Blue for hired
      case 'outsourced':
        return '#f59e0b'; // Orange for outsourced
      default:
        return '#6b7280'; // Gray default
    }
  };

  // Get node icon based on type
  const getNodeIcon = (node: Node) => {
    const color = getNodeColor(node);
    const iconMap = {
      warehouse: '🏪',
      distribution: '📦',
      supplier: '🏭',
      customer: '🏪',
      factory: '🏭',
      retail: '🛒',
      airport: '✈️',
      port: '🚢',
      railhub: '🚂'
    };
    
    const iconHtml = `
      <div style="
        background-color: ${color};
        color: white;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        font-size: 16px;
      ">
        ${iconMap[node.type] || '📍'}
      </div>
    `;
    
    return L.divIcon({
      html: iconHtml,
      className: 'custom-node-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  const handleNodeClick = (node: Node) => {
    if (selectable) {
      const newSelected = selectedNodes.includes(node.id)
        ? selectedNodes.filter(id => id !== node.id)
        : [...selectedNodes, node.id];
      setSelectedNodes(newSelected);
      onNodeSelect?.(newSelected);
    } else {
      // Double click to edit
      setEditingNode(node);
      setIsEditDialogOpen(true);
    }
    onNodeClick?.(node);
  };

  const handleNodeSave = (updatedNode: Node) => {
    const updatedNodes = localNodes.map(node => 
      node.id === updatedNode.id ? updatedNode : node
    );
    setLocalNodes(updatedNodes);
  };

  const routeLines = useMemo(() => {
    return routes.map(route => {
      const fromNode = localNodes.find(n => n.id === route.from);
      const toNode = localNodes.find(n => n.id === route.to);
      
      if (!fromNode || !toNode) return null;
      
      const positions: [number, number][] = [
        [fromNode.latitude, fromNode.longitude],
        [toNode.latitude, toNode.longitude]
      ];
      
      const routeColor = route.color || (route.ownership === 'owned' ? '#22c55e' : route.ownership === 'hired' ? '#3b82f6' : '#f59e0b');
      
      return (
        <Polyline
          key={route.id}
          positions={positions}
          pathOptions={{
            color: routeColor,
            weight: route.isOptimized ? 4 : 2,
            opacity: route.isOptimized ? 0.8 : 0.6,
            dashArray: route.ownership === 'outsourced' ? '10, 5' : undefined
          }}
        >
          <Popup>
            <div className="space-y-2">
              <h3 className="font-semibold">{route.from} → {route.to}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span>Distance:</span>
                <span>{route.distance?.toFixed(1)} km</span>
                <span>Cost:</span>
                <span>${route.cost?.toLocaleString()}</span>
                <span>Ownership:</span>
                <Badge variant={route.ownership === 'owned' ? 'default' : 'secondary'}>
                  {route.ownership}
                </Badge>
              </div>
              {route.vehicleName && (
                <div className="text-sm">
                  <span className="font-medium">Vehicle:</span> {route.vehicleName}
                </div>
              )}
            </div>
          </Popup>
        </Polyline>
      );
    }).filter(Boolean);
  }, [routes, localNodes]);

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={kenyaBounds}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
        className="rounded-lg"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapClickHandler onMapClick={onMapClick} />
        
        {localNodes.map((node) => (
          <Marker
            key={node.id}
            position={[node.latitude, node.longitude]}
            icon={getNodeIcon(node)}
            eventHandlers={{
              click: () => handleNodeClick(node),
            }}
          >
            <Popup>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{node.name}</h3>
                  <Badge variant={node.ownership === 'owned' ? 'default' : 'secondary'}>
                    {node.ownership}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span>Type:</span>
                  <span className="capitalize">{node.type}</span>
                  <span>Capacity:</span>
                  <span>{node.capacity?.toLocaleString() || 'N/A'}</span>
                  {node.cost && (
                    <>
                      <span>Cost:</span>
                      <span>${node.cost.toLocaleString()}/mo</span>
                    </>
                  )}
                </div>
                {node.notes && (
                  <div className="text-sm text-muted-foreground">
                    {node.notes}
                  </div>
                )}
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingNode(node);
                    setIsEditDialogOpen(true);
                  }}
                  className="w-full"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit Node
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {routeLines}
      </MapContainer>
      
      {showLegend && (
        <Card className="absolute top-4 right-4 w-64 bg-white/95 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Network Legend</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <h4 className="text-xs font-medium">Ownership Types:</h4>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Owned Assets</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Hired/Leased</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span>Outsourced</span>
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-medium">Node Types:</h4>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <span>🏪 Warehouse</span>
                <span>📦 Distribution</span>
                <span>🏭 Supplier</span>
                <span>🛒 Customer</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <NodeEditDialog
        node={editingNode}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditingNode(null);
        }}
        onSave={handleNodeSave}
      />
    </div>
  );
};
