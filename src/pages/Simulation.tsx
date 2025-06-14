
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RealSimulationEngine } from '@/components/simulation/RealSimulationEngine';
import { NodeConfigurationSystem } from '@/components/simulation/NodeConfigurationSystem';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Play, Folder, Settings } from 'lucide-react';

const Simulation = () => {
  const [simulationHistory, setSimulationHistory] = useState([
    {
      id: '1',
      name: 'Inventory Policy Test',
      type: 'Monte Carlo',
      date: '2024-01-15',
      status: 'Completed',
      serviceLevel: 95.2,
      totalCost: 125000
    },
    {
      id: '2', 
      name: 'Demand Variability Analysis',
      type: 'Stochastic',
      date: '2024-01-12',
      status: 'Completed',
      serviceLevel: 92.8,
      totalCost: 138000
    }
  ]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          Advanced Supply Chain Simulation
        </h1>
        <p className="text-muted-foreground">
          Run Monte Carlo simulations to test scenarios, optimize inventory policies, and predict supply chain performance under uncertainty.
        </p>
      </div>

      <Tabs defaultValue="engine" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="engine">Monte Carlo Engine</TabsTrigger>
          <TabsTrigger value="nodes">Node Configuration</TabsTrigger>
          <TabsTrigger value="scenarios">Scenario Manager</TabsTrigger>
          <TabsTrigger value="results">Results History</TabsTrigger>
        </TabsList>

        <TabsContent value="engine">
          <RealSimulationEngine />
        </TabsContent>

        <TabsContent value="nodes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Supply Chain Node Specification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Define every node in your supply chain network with detailed parameters for comprehensive simulation analysis.
              </p>
              <NodeConfigurationSystem />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Simulation Scenarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-dashed border-2">
                    <CardContent className="p-6 text-center">
                      <h3 className="font-semibold mb-2">Inventory Optimization</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Test different reorder policies and safety stock levels
                      </p>
                      <Button variant="outline">Create Scenario</Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-dashed border-2">
                    <CardContent className="p-6 text-center">
                      <h3 className="font-semibold mb-2">Demand Uncertainty</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Analyze impact of demand variability on service levels
                      </p>
                      <Button variant="outline">Create Scenario</Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-dashed border-2">
                    <CardContent className="p-6 text-center">
                      <h3 className="font-semibold mb-2">Supply Disruption</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Model supply chain disruptions and recovery strategies
                      </p>
                      <Button variant="outline">Create Scenario</Button>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Quick Start Templates</h4>
                  <p className="text-sm text-muted-foreground">
                    Use pre-configured simulation templates for common supply chain scenarios. 
                    Each template includes validated parameters based on industry benchmarks.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Folder className="h-5 w-5" />
                Simulation Results History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {simulationHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No simulation results yet. Run your first simulation to see results here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {simulationHistory.map((simulation) => (
                    <div key={simulation.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{simulation.name}</h3>
                        <div className="flex gap-2">
                          <Badge variant="outline">{simulation.type}</Badge>
                          <Badge variant={simulation.status === 'Completed' ? 'default' : 'secondary'}>
                            {simulation.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Date:</span> {simulation.date}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Service Level:</span> {simulation.serviceLevel}%
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Cost:</span> KES {simulation.totalCost.toLocaleString()}
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button variant="outline" size="sm">Export Report</Button>
                        <Button variant="outline" size="sm">Clone Scenario</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Simulation;
