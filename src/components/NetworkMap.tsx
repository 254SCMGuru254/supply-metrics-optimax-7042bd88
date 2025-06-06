
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Factory, Store, Warehouse, Truck, Edit, Plus } from "lucide-react";

export type NodeType = "warehouse" | "distribution" | "supplier" | "customer" | "factory";
export type OwnershipType = "owned" | "hired" | "outsourced";

export interface Node {
  id: string;
  type: NodeType;
  name: string;
  latitude: number;
  longitude: number;
  capacity?: number;
  demand?: number;
  cost?: number;
  weight?: number;
  ownership: OwnershipType;
  // Ownership-specific data
  monthlyRent?: number; // For hired assets
  contractDuration?: number; // For hired/outsourced assets
  serviceProvider?: string; // For outsourced services
  leaseTerms?: string; // For hired assets
  maintenanceIncluded?: boolean; // For hired assets
  // Asset details
  floorArea?: number;
  storageType?: string;
  temperature?: number; // For cold storage
  securityLevel?: string;
  accessibility?: string;
}

export interface Route {
  id: string;
  from: string;
  to: string;
  volume?: number;
  cost?: number;
  distance?: number;
  isOptimized?: boolean;
  vehicleId?: string;
  vehicleName?: string;
  ownership: OwnershipType;
  // Transportation-specific ownership data
  fuelCostPerKm?: number;
  driverCost?: number;
  maintenanceCost?: number;
  insuranceCost?: number;
  rentalCostPerDay?: number; // For hired vehicles
  logisticsProvider?: string; // For outsourced logistics
}

interface NetworkMapProps {
  nodes?: Node[];
  routes?: Route[];
  onNodeClick?: (node: Node) => void;
  onMapClick?: (lat: number, lng: number) => void;
  onNodeUpdate?: (node: Node) => void;
  onNodeAdd?: (node: Node) => void;
  isOptimized?: boolean;
  showLegend?: boolean;
}

export const NetworkMap = ({
  nodes = [],
  routes = [],
  onNodeClick,
  onMapClick,
  onNodeUpdate,
  onNodeAdd,
  isOptimized = false,
  showLegend = true,
}: NetworkMapProps) => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newNodePosition, setNewNodePosition] = useState<{lat: number, lng: number} | null>(null);

  // Kenya coordinates for default view
  const defaultCenter = { lat: -1.2921, lng: 36.8219 }; // Nairobi
  const bounds = {
    north: 5.0,
    south: -5.0,
    east: 42.0,
    west: 33.0
  };

  const getNodeIcon = (type: NodeType) => {
    switch (type) {
      case "warehouse": return <Warehouse className="h-4 w-4" />;
      case "distribution": return <Store className="h-4 w-4" />;
      case "supplier": return <Factory className="h-4 w-4" />;
      case "customer": return <MapPin className="h-4 w-4" />;
      case "factory": return <Factory className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getNodeColor = (type: NodeType, ownership: OwnershipType) => {
    const baseColors = {
      warehouse: "bg-blue-500",
      distribution: "bg-green-500",
      supplier: "bg-purple-500",
      customer: "bg-orange-500",
      factory: "bg-red-500",
    };
    
    const ownershipModifier = ownership === "owned" ? "" : 
                             ownership === "hired" ? " ring-2 ring-yellow-400" : 
                             " ring-2 ring-gray-400";
    
    return baseColors[type] + ownershipModifier;
  };

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!onMapClick && !onNodeAdd) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert pixel coordinates to lat/lng (simplified)
    const lat = bounds.north - (y / rect.height) * (bounds.north - bounds.south);
    const lng = bounds.west + (x / rect.width) * (bounds.east - bounds.west);
    
    setNewNodePosition({ lat, lng });
    setIsAddDialogOpen(true);
    
    if (onMapClick) {
      onMapClick(lat, lng);
    }
  };

  const normalizePosition = (lat: number, lng: number) => {
    const x = ((lng - bounds.west) / (bounds.east - bounds.west)) * 100;
    const y = ((bounds.north - lat) / (bounds.north - bounds.south)) * 100;
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  const handleNodeEdit = (node: Node) => {
    setEditingNode({ ...node });
    setIsEditDialogOpen(true);
  };

  const handleNodeSave = () => {
    if (editingNode && onNodeUpdate) {
      onNodeUpdate(editingNode);
      setIsEditDialogOpen(false);
      setEditingNode(null);
    }
  };

  const handleAddNode = () => {
    if (newNodePosition && onNodeAdd) {
      const newNode: Node = {
        id: crypto.randomUUID(),
        type: "warehouse",
        name: `Node ${nodes.length + 1}`,
        latitude: newNodePosition.lat,
        longitude: newNodePosition.lng,
        capacity: 1000,
        ownership: "owned",
        cost: 50000,
        floorArea: 5000,
        storageType: "dry",
        securityLevel: "high",
        accessibility: "truck"
      };
      onNodeAdd(newNode);
      setIsAddDialogOpen(false);
      setNewNodePosition(null);
    }
  };

  const NodeEditForm = ({ node, onChange }: { node: Node; onChange: (node: Node) => void }) => (
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
              value={node.name}
              onChange={(e) => onChange({ ...node, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={node.type} onValueChange={(value: NodeType) => onChange({ ...node, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="warehouse">Warehouse</SelectItem>
                <SelectItem value="distribution">Distribution Center</SelectItem>
                <SelectItem value="supplier">Supplier</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="factory">Factory</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              value={node.capacity || 0}
              onChange={(e) => onChange({ ...node, capacity: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="cost">Monthly Cost ($)</Label>
            <Input
              id="cost"
              type="number"
              value={node.cost || 0}
              onChange={(e) => onChange({ ...node, cost: Number(e.target.value) })}
            />
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="ownership" className="space-y-4">
        <div>
          <Label htmlFor="ownership">Ownership Type</Label>
          <Select value={node.ownership} onValueChange={(value: OwnershipType) => onChange({ ...node, ownership: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="owned">Owned</SelectItem>
              <SelectItem value="hired">Hired/Leased</SelectItem>
              <SelectItem value="outsourced">Outsourced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {node.ownership === "hired" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="monthlyRent">Monthly Rent ($)</Label>
              <Input
                id="monthlyRent"
                type="number"
                value={node.monthlyRent || 0}
                onChange={(e) => onChange({ ...node, monthlyRent: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="contractDuration">Contract Duration (months)</Label>
              <Input
                id="contractDuration"
                type="number"
                value={node.contractDuration || 12}
                onChange={(e) => onChange({ ...node, contractDuration: Number(e.target.value) })}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="leaseTerms">Lease Terms</Label>
              <Input
                id="leaseTerms"
                value={node.leaseTerms || ""}
                onChange={(e) => onChange({ ...node, leaseTerms: e.target.value })}
              />
            </div>
          </div>
        )}
        
        {node.ownership === "outsourced" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="serviceProvider">Service Provider</Label>
              <Input
                id="serviceProvider"
                value={node.serviceProvider || ""}
                onChange={(e) => onChange({ ...node, serviceProvider: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="contractDuration">Contract Duration (months)</Label>
              <Input
                id="contractDuration"
                type="number"
                value={node.contractDuration || 12}
                onChange={(e) => onChange({ ...node, contractDuration: Number(e.target.value) })}
              />
            </div>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="details" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="floorArea">Floor Area (sqm)</Label>
            <Input
              id="floorArea"
              type="number"
              value={node.floorArea || 0}
              onChange={(e) => onChange({ ...node, floorArea: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="storageType">Storage Type</Label>
            <Select value={node.storageType || "dry"} onValueChange={(value) => onChange({ ...node, storageType: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dry">Dry Storage</SelectItem>
                <SelectItem value="cold">Cold Storage</SelectItem>
                <SelectItem value="frozen">Frozen Storage</SelectItem>
                <SelectItem value="hazmat">Hazmat Storage</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {node.storageType === "cold" && (
            <div>
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <Input
                id="temperature"
                type="number"
                value={node.temperature || 4}
                onChange={(e) => onChange({ ...node, temperature: Number(e.target.value) })}
              />
            </div>
          )}
          <div>
            <Label htmlFor="securityLevel">Security Level</Label>
            <Select value={node.securityLevel || "medium"} onValueChange={(value) => onChange({ ...node, securityLevel: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="maximum">Maximum</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );

  return (
    <div className="space-y-4">
      <Card className="h-[500px]">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Network Map - Kenya Supply Chain</span>
            {isOptimized && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Optimized
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] relative">
          <div 
            className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-dashed border-gray-300 relative overflow-hidden cursor-crosshair"
            onClick={handleMapClick}
          >
            {/* Kenya outline background */}
            <div className="absolute inset-0 opacity-20">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path
                  d="M30,20 L70,20 L80,40 L75,60 L65,80 L35,80 L25,60 L20,40 Z"
                  fill="#10b981"
                  stroke="#065f46"
                  strokeWidth="0.5"
                />
                <text x="50" y="50" textAnchor="middle" fontSize="3" fill="#065f46">KENYA</text>
              </svg>
            </div>

            {/* Routes */}
            {routes.map((route) => {
              const fromNode = nodes.find(n => n.id === route.from);
              const toNode = nodes.find(n => n.id === route.to);
              
              if (!fromNode || !toNode) return null;
              
              const fromPos = normalizePosition(fromNode.latitude, fromNode.longitude);
              const toPos = normalizePosition(toNode.latitude, toNode.longitude);
              
              return (
                <svg key={route.id} className="absolute inset-0 w-full h-full pointer-events-none">
                  <line
                    x1={`${fromPos.x}%`}
                    y1={`${fromPos.y}%`}
                    x2={`${toPos.x}%`}
                    y2={`${toPos.y}%`}
                    stroke={route.isOptimized ? "#10b981" : route.ownership === "owned" ? "#3b82f6" : route.ownership === "hired" ? "#f59e0b" : "#6b7280"}
                    strokeWidth={route.volume ? Math.max(2, (route.volume / 100)) : 3}
                    strokeDasharray={route.ownership === "outsourced" ? "5,5" : "none"}
                    opacity={0.8}
                  />
                  {route.volume && (
                    <text
                      x={`${(fromPos.x + toPos.x) / 2}%`}
                      y={`${(fromPos.y + toPos.y) / 2}%`}
                      fontSize="10"
                      fill="#374151"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="pointer-events-none"
                    >
                      {route.volume}
                    </text>
                  )}
                </svg>
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const pos = normalizePosition(node.latitude, node.longitude);
              const isSelected = selectedNode?.id === node.id;
              const isHovered = hoveredNode === node.id;
              
              return (
                <div
                  key={node.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
                    isSelected ? 'scale-125 z-20' : isHovered ? 'scale-110 z-10' : 'z-0'
                  }`}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode(node);
                    onNodeClick?.(node);
                  }}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <div className={`w-10 h-10 rounded-full ${getNodeColor(node.type, node.ownership)} flex items-center justify-center text-white shadow-lg relative ${
                    isSelected ? 'ring-4 ring-blue-300' : ''
                  }`}>
                    {getNodeIcon(node.type)}
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNodeEdit(node);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  {/* Node label */}
                  <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-white px-3 py-2 rounded shadow-md text-xs whitespace-nowrap border max-w-48">
                    <div className="font-medium">{node.name}</div>
                    <div className="text-gray-500 capitalize">{node.type}</div>
                    <div className="text-gray-500 capitalize">{node.ownership}</div>
                    {node.capacity && (
                      <div className="text-gray-500">Cap: {node.capacity}</div>
                    )}
                    {node.demand && (
                      <div className="text-gray-500">Demand: {node.demand}</div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Instructions overlay */}
            {nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-lg font-medium">Click anywhere to add network nodes</p>
                  <p className="text-sm">Build your Kenyan supply chain network</p>
                  <p className="text-xs mt-2">Includes ownership types: Owned, Hired, or Outsourced</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      {showLegend && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Network Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    <Warehouse className="h-2 w-2" />
                  </div>
                  <span>Warehouse</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white">
                    <Store className="h-2 w-2" />
                  </div>
                  <span>Distribution</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center text-white">
                    <Factory className="h-2 w-2" />
                  </div>
                  <span>Supplier</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center text-white">
                    <MapPin className="h-2 w-2" />
                  </div>
                  <span>Customer</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white">
                    <Factory className="h-2 w-2" />
                  </div>
                  <span>Factory</span>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium text-sm mb-2">Ownership Types:</h4>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <span>Owned Assets</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500 ring-2 ring-yellow-400"></div>
                    <span>Hired/Leased</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500 ring-2 ring-gray-400"></div>
                    <span>Outsourced</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Node Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Node: {editingNode?.name}</DialogTitle>
          </DialogHeader>
          {editingNode && (
            <div className="space-y-4">
              <NodeEditForm node={editingNode} onChange={setEditingNode} />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleNodeSave}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Node Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Node</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Position: {newNodePosition?.lat.toFixed(4)}, {newNodePosition?.lng.toFixed(4)}
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddNode}>
                <Plus className="h-4 w-4 mr-2" />
                Add Node
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Selected Node Details */}
      {selectedNode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              {getNodeIcon(selectedNode.type)}
              {selectedNode.name}
              <Badge variant="outline" className="capitalize">
                {selectedNode.ownership}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Type:</span> {selectedNode.type}
              </div>
              <div>
                <span className="font-medium">Ownership:</span> {selectedNode.ownership}
              </div>
              <div>
                <span className="font-medium">Location:</span> 
                {selectedNode.latitude.toFixed(4)}, {selectedNode.longitude.toFixed(4)}
              </div>
              {selectedNode.capacity && (
                <div>
                  <span className="font-medium">Capacity:</span> {selectedNode.capacity}
                </div>
              )}
              {selectedNode.cost && (
                <div>
                  <span className="font-medium">Monthly Cost:</span> ${selectedNode.cost}
                </div>
              )}
              {selectedNode.monthlyRent && (
                <div>
                  <span className="font-medium">Monthly Rent:</span> ${selectedNode.monthlyRent}
                </div>
              )}
              {selectedNode.serviceProvider && (
                <div>
                  <span className="font-medium">Service Provider:</span> {selectedNode.serviceProvider}
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleNodeEdit(selectedNode)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedNode(null)}
              >
                Close Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
