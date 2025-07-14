
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { NetworkMap } from '@/components/NetworkMap';
import { 
  Network, 
  MapPin, 
  TrendingUp, 
  Zap, 
  Calculator,
  Settings,
  Play,
  Download,
  Upload
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'react-router-dom';

const NetworkOptimization = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [nodes, setNodes] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [optimizationResults, setOptimizationResults] = useState<any>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();

  const [parameters, setParameters] = useState({
    maxFacilities: 5,
    demandCoverage: 0.95,
    transportationCost: 0.5,
    fixedCost: 10000,
    capacityConstraint: true
  });

  const optimizeNetwork = () => {
    setIsOptimizing(true);
    toast({
      title: "Optimization Started",
      description: "Running network optimization algorithms..."
    });

    // Simulate optimization process
    setTimeout(() => {
      const results = {
        totalCost: 1250000,
        costSavings: 280000,
        savingsPercentage: 18.3,
        facilitiesRecommended: 3,
        averageDeliveryTime: 2.4,
        serviceLevel: 0.96,
        recommendations: [
          "Consolidate facilities in the North region to reduce fixed costs",
          "Implement cross-docking at the Central hub for faster distribution",
          "Consider strategic partnership with regional carriers"
        ]
      };

      setOptimizationResults(results);
      setIsOptimizing(false);
      toast({
        title: "Optimization Complete",
        description: `Network optimized with ${results.savingsPercentage}% cost savings`
      });
    }, 4000);
  };

  const addNode = () => {
    const newNode = {
      id: `node-${Date.now()}`,
      name: `Location ${nodes.length + 1}`,
      type: 'facility',
      latitude: -1.2921 + (Math.random() - 0.5) * 2,
      longitude: 36.8219 + (Math.random() - 0.5) * 2,
      capacity: Math.floor(Math.random() * 5000) + 1000,
      demand: Math.floor(Math.random() * 2000) + 500,
      ownership: 'owned'
    };
    setNodes([...nodes, newNode]);
  };

  const addRoute = () => {
    if (nodes.length < 2) {
      toast({
        title: "Insufficient Nodes",
        description: "You need at least 2 nodes to create a route",
        variant: "destructive"
      });
      return;
    }

    const fromNode = nodes[Math.floor(Math.random() * nodes.length)];
    const toNode = nodes[Math.floor(Math.random() * nodes.length)];
    
    if (fromNode.id === toNode.id) return;

    const newRoute = {
      id: `route-${Date.now()}`,
      from: fromNode.id,
      to: toNode.id,
      distance: Math.floor(Math.random() * 500) + 50,
      cost: Math.floor(Math.random() * 1000) + 100,
      ownership: 'owned'
    };
    setRoutes([...routes, newRoute]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Network Optimization
          </h1>
          <p className="text-xl text-gray-600">
            Optimize your supply chain network using advanced mathematical models
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Network Map */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-blue-600" />
                  Network Visualization
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[500px] p-0">
                <NetworkMap 
                  nodes={nodes} 
                  routes={routes}
                  showOptimization={!!optimizationResults}
                />
              </CardContent>
            </Card>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-purple-600" />
                  Network Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={addNode} className="w-full">
                  <MapPin className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
                <Button onClick={addRoute} className="w-full" variant="outline">
                  <Network className="h-4 w-4 mr-2" />
                  Add Route
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-green-600" />
                  Optimization Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="maxFacilities">Max Facilities</Label>
                  <Input
                    id="maxFacilities"
                    type="number"
                    value={parameters.maxFacilities}
                    onChange={(e) => setParameters({...parameters, maxFacilities: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="demandCoverage">Demand Coverage</Label>
                  <Input
                    id="demandCoverage"
                    type="number"
                    step="0.01"
                    value={parameters.demandCoverage}
                    onChange={(e) => setParameters({...parameters, demandCoverage: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="transportationCost">Transportation Cost ($/km)</Label>
                  <Input
                    id="transportationCost"
                    type="number"
                    step="0.1"
                    value={parameters.transportationCost}
                    onChange={(e) => setParameters({...parameters, transportationCost: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="fixedCost">Fixed Cost per Facility ($)</Label>
                  <Input
                    id="fixedCost"
                    type="number"
                    value={parameters.fixedCost}
                    onChange={(e) => setParameters({...parameters, fixedCost: parseInt(e.target.value)})}
                  />
                </div>
                
                <Button 
                  onClick={optimizeNetwork}
                  disabled={isOptimizing || nodes.length < 2}
                  className="w-full"
                >
                  {isOptimizing ? (
                    <>
                      <Zap className="h-4 w-4 mr-2 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Optimize Network
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            {optimizationResults && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Optimization Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        ${optimizationResults.costSavings.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Cost Savings</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {optimizationResults.savingsPercentage}%
                      </div>
                      <div className="text-sm text-gray-600">Improvement</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Cost:</span>
                      <span className="font-semibold">${optimizationResults.totalCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Facilities:</span>
                      <span className="font-semibold">{optimizationResults.facilitiesRecommended}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg Delivery Time:</span>
                      <span className="font-semibold">{optimizationResults.averageDeliveryTime} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Service Level:</span>
                      <span className="font-semibold">{(optimizationResults.serviceLevel * 100).toFixed(1)}%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Recommendations:</h4>
                    {optimizationResults.recommendations.map((rec: string, index: number) => (
                      <div key={index} className="text-xs p-2 bg-gray-50 rounded">
                        {rec}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkOptimization;
