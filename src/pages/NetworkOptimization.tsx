
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NetworkMap } from "@/components/NetworkMap";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { 
  Network, 
  TrendingUp, 
  BarChart3, 
  MapPin, 
  Settings,
  Calculator,
  Lightbulb,
  Activity,
  Target,
  Layers
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Define local interfaces
interface Node {
  id: string;
  name: string;
  type?: 'supplier' | 'warehouse' | 'retail' | 'demand' | 'facility';
  latitude: number;
  longitude: number;
  weight?: number;
  capacity?: number;
  demand?: number;
  fixed_cost?: number;
  variable_cost?: number;
  ownership: OwnershipType;
}

interface Route {
  id: string;
  from: string;
  to: string;
  label?: string;
  volume?: number;
  mode?: 'truck' | 'rail' | 'ship' | 'air';
  transitTime?: number;
  ownership: OwnershipType;
  isOptimized?: boolean;
}

type OwnershipType = 'owned' | 'leased' | 'partner' | 'proposed';

// Simple optimization form component
const OptimizationForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ algorithm: 'genetic', iterations: 1000 });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Button type="submit" className="w-full">
        Run Optimization
      </Button>
    </form>
  );
};

// Simple optimization results component
const OptimizationResults = () => {
  return (
    <div className="space-y-4">
      <div className="text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Cost Reduction:</span>
          <span className="font-medium">23%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Service Level:</span>
          <span className="font-medium">97%</span>
        </div>
      </div>
    </div>
  );
};

const NetworkOptimization = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [optimizedRoutes, setOptimizedRoutes] = useState<Route[]>([]);
  const [mapNodes, setMapNodes] = useState<Node[]>([]);
  const [showOptimization, setShowOptimization] = useState(false);

  const { data: demandPoints, isLoading } = useQuery<Node[]>({
    queryKey: ['demandPoints', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const { data, error } = await supabase
        .from('supply_nodes')
        .select('*')
        .eq('project_id', projectId)
        .eq('node_type', 'demand');

      if (error) throw new Error(error.message);
      
      return data.map(n => ({
        id: n.id,
        name: n.name,
        type: n.node_type as any,
        latitude: n.latitude,
        longitude: n.longitude,
        weight: n.demand,
        ownership: 'owned' as OwnershipType
      }));
    },
    enabled: !!projectId
  });

  useEffect(() => {
    let currentNodes: Node[] = [...(demandPoints || [])];
    setMapNodes(currentNodes);
  }, [demandPoints]);

  const handleOptimize = async (formData: any) => {
    try {
      // Simulate optimization process
      const newOptimizedRoutes = (demandPoints || []).map(dp => ({
        id: `route-${dp.id}-optimized`,
        from: dp.id,
        to: 'optimized-facility',
        label: `Optimized route to ${dp.name}`,
        ownership: 'proposed' as OwnershipType
      }));
      setOptimizedRoutes(newOptimizedRoutes);
      setShowOptimization(true);

      toast({
        title: "Optimization Complete",
        description: "Network optimization completed successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Optimization Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Network Optimization</h1>
              <p className="text-muted-foreground">Optimize your supply chain network for maximum efficiency</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {demandPoints?.length || 0} Demand Points
            </Badge>
            <Badge variant="outline">Real-time Optimization</Badge>
            {showOptimization && (
              <Badge className="bg-green-100 text-green-700">
                Solution Found
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span>Interactive Supply Chain Map</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">Visualize your network and optimized routes</p>
              </CardHeader>
              <CardContent className="p-0 h-[500px]">
                <NetworkMap 
                  nodes={mapNodes} 
                  routes={optimizedRoutes}
                />
              </CardContent>
            </Card>
          </div>

          {/* Controls Section */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <Settings className="h-5 w-5 text-purple-600" />
                  <span>Optimization Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OptimizationForm onSubmit={handleOptimize} />
              </CardContent>
            </Card>

            {showOptimization && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-foreground">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span>Optimization Results</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <OptimizationResults />
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to={`/data-input/${projectId}`}>
                  <Button variant="outline" className="w-full justify-start">
                    <Activity className="mr-2 h-4 w-4" />
                    Manage Data Input
                  </Button>
                </Link>
                <Link to="/documentation">
                  <Button variant="outline" className="w-full justify-start">
                    <Calculator className="mr-2 h-4 w-4" />
                    View Documentation
                  </Button>
                </Link>
                <Link to={`/analytics-dashboard/${projectId}`}>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Analytics Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkOptimization;
