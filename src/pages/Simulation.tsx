
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComprehensiveSimulationEngine } from '@/components/simulation/ComprehensiveSimulationEngine';
import { NodeConfigurationSystem } from '@/components/simulation/NodeConfigurationSystem';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ModelFormulas } from '@/components/shared/ModelFormulas';
import { BarChart3, Play, Settings, Factory } from 'lucide-react';

const Simulation = () => {
  const [simulationHistory, setSimulationHistory] = useState([
    {
      id: '1',
      name: 'Monte Carlo Inventory Analysis',
      type: 'Monte Carlo',
      date: '2024-01-15',
      status: 'Completed',
      serviceLevel: 95.2,
      totalCost: 125000,
      iterations: 10000
    },
    {
      id: '2', 
      name: 'Discrete Event Queue Analysis',
      type: 'Discrete Event',
      date: '2024-01-12',
      status: 'Completed',
      serviceLevel: 92.8,
      totalCost: 138000,
      iterations: 365
    },
    {
      id: '3',
      name: 'System Dynamics Inventory Flow',
      type: 'System Dynamics',
      date: '2024-01-10',
      status: 'Completed',
      serviceLevel: 88.5,
      totalCost: 156000,
      iterations: 52
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
          Run Monte Carlo, Discrete Event, and System Dynamics simulations to test scenarios, 
          optimize inventory policies, and predict supply chain performance under uncertainty.
        </p>
      </div>

      <ModelFormulas modelId="simulation" />

      <Tabs defaultValue="comprehensive-engine" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="comprehensive-engine">Comprehensive Engine</TabsTrigger>
          <TabsTrigger value="nodes">Node Configuration</TabsTrigger>
          <TabsTrigger value="scenarios">Scenario Manager</TabsTrigger>
          <TabsTrigger value="results">Results History</TabsTrigger>
        </TabsList>

        <TabsContent value="comprehensive-engine">
          <ComprehensiveSimulationEngine />
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
                      <h3 className="font-semibold mb-2">Monte Carlo Analysis</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Test inventory policies with demand and lead time uncertainty
                      </p>
                      <Button variant="outline">Create Monte Carlo Scenario</Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-dashed border-2">
                    <CardContent className="p-6 text-center">
                      <h3 className="font-semibold mb-2">Discrete Event Modeling</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Model complex operational processes and queue dynamics
                      </p>
                      <Button variant="outline">Create Event Scenario</Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-dashed border-2">
                    <CardContent className="p-6 text-center">
                      <h3 className="font-semibold mb-2">System Dynamics</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Analyze system-wide behavior with stocks and flows
                      </p>
                      <Button variant="outline">Create System Model</Button>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Enterprise Simulation Features</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium">Monte Carlo Capabilities</h5>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• 10,000+ trial simulations</li>
                        <li>• Multiple probability distributions</li>
                        <li>• Risk metrics and percentiles</li>
                        <li>• Sensitivity analysis</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium">Advanced Analytics</h5>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• Real-time simulation tracking</li>
                        <li>• Statistical result validation</li>
                        <li>• Confidence interval analysis</li>
                        <li>• Scenario comparison tools</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Factory className="h-5 w-5" />
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
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Date:</span> {simulation.date}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Iterations:</span> {simulation.iterations?.toLocaleString()}
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
                        <Button variant="outline" size="sm">Compare Results</Button>
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
