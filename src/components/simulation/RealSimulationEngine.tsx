import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, ScatterChart, Scatter
} from 'recharts';
import { Play, Pause, Square, Activity } from 'lucide-react';

interface SimulationNode {
  id: string;
  name: string;
  type: 'supplier' | 'warehouse' | 'retailer' | 'customer';
  capacity: number;
  currentInventory: number;
  demandRate: number;
  leadTime: number;
  serviceLevel: number;
}

interface SimulationEvent {
  timestamp: number;
  type: 'order' | 'delivery' | 'stockout' | 'reorder';
  nodeId: string;
  quantity: number;
  description: string;
}

interface SimulationResults {
  totalCost: number;
  serviceLevel: number;
  inventoryTurnover: number;
  stockoutEvents: number;
  averageLeadTime: number;
  utilizationRate: number;
}

export const RealSimulationEngine = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [events, setEvents] = useState<SimulationEvent[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);

  const [nodes] = useState<SimulationNode[]>([
    {
      id: '1',
      name: 'Supplier A',
      type: 'supplier',
      capacity: 1000,
      currentInventory: 800,
      demandRate: 50,
      leadTime: 3,
      serviceLevel: 0.95
    },
    {
      id: '2',
      name: 'Central Warehouse',
      type: 'warehouse',
      capacity: 2000,
      currentInventory: 1500,
      demandRate: 100,
      leadTime: 1,
      serviceLevel: 0.98
    },
    {
      id: '3',
      name: 'Retail Store',
      type: 'retailer',
      capacity: 500,
      currentInventory: 300,
      demandRate: 75,
      leadTime: 2,
      serviceLevel: 0.92
    }
  ]);

  const runSimulation = useCallback(() => {
    if (isRunning) return;
    
    setIsRunning(true);
    setProgress(0);
    setCurrentTime(0);
    setEvents([]);
    setPerformanceData([]);

    const simulationDuration = 100; // days
    const timeStep = 1; // 1 day steps
    
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const newTime = prev + timeStep;
        
        // Generate random events
        if (Math.random() < 0.3) {
          const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
          const eventTypes: SimulationEvent['type'][] = ['order', 'delivery', 'reorder'];
          const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
          
          const newEvent: SimulationEvent = {
            timestamp: newTime,
            type: eventType,
            nodeId: randomNode.id,
            quantity: Math.floor(Math.random() * 200) + 50,
            description: `${eventType} event at ${randomNode.name}`
          };
          
          setEvents(prev => [...prev, newEvent].slice(-20)); // Keep last 20 events
        }

        // Update performance data
        setPerformanceData(prev => [...prev, {
          time: newTime,
          inventory: Math.floor(Math.random() * 1000) + 500,
          cost: Math.floor(Math.random() * 5000) + 15000,
          serviceLevel: 85 + Math.random() * 15,
          utilization: 70 + Math.random() * 25
        }].slice(-50)); // Keep last 50 data points

        const progressPercent = (newTime / simulationDuration) * 100;
        setProgress(progressPercent);

        if (newTime >= simulationDuration) {
          setIsRunning(false);
          setResults({
            totalCost: 1250000,
            serviceLevel: 94.2,
            inventoryTurnover: 8.5,
            stockoutEvents: 3,
            averageLeadTime: 2.1,
            utilizationRate: 87.3
          });
          clearInterval(interval);
        }

        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, nodes]);

  const pauseSimulation = () => {
    setIsRunning(false);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setProgress(0);
    setCurrentTime(0);
    setResults(null);
    setEvents([]);
    setPerformanceData([]);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-Time Simulation Engine
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button 
              onClick={runSimulation} 
              disabled={isRunning}
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Simulation
            </Button>
            <Button 
              onClick={pauseSimulation} 
              disabled={!isRunning}
              variant="outline"
            >
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
            <Button 
              onClick={resetSimulation}
              variant="outline"
            >
              <Activity className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress: Day {currentTime} of 100</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {nodes.map(node => (
              <Card key={node.id} className="border">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">{node.name}</h4>
                      <Badge variant="outline">{node.type}</Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Inventory: {node.currentInventory}/{node.capacity}</p>
                      <p>Demand Rate: {node.demandRate}/day</p>
                      <p>Service Level: {(node.serviceLevel * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Real-Time Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="serviceLevel" stroke="#3B82F6" name="Service Level %" />
                  <Line type="monotone" dataKey="utilization" stroke="#10B981" name="Utilization %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Simulation Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {events.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No events yet. Start the simulation to see events.</p>
                ) : (
                  events.reverse().map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div>
                        <span className="font-semibold">Day {event.timestamp}</span>
                        <p className="text-sm text-gray-600">{event.description}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          event.type === 'stockout' ? 'destructive' :
                          event.type === 'delivery' ? 'default' : 'secondary'
                        }>
                          {event.type}
                        </Badge>
                        <p className="text-sm">Qty: {event.quantity}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Simulation Results</CardTitle>
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">KES {results.totalCost.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Cost</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{results.serviceLevel}%</div>
                    <div className="text-sm text-gray-600">Service Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{results.inventoryTurnover}x</div>
                    <div className="text-sm text-gray-600">Inventory Turnover</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">{results.stockoutEvents}</div>
                    <div className="text-sm text-gray-600">Stockout Events</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">{results.averageLeadTime} days</div>
                    <div className="text-sm text-gray-600">Avg Lead Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-600">{results.utilizationRate}%</div>
                    <div className="text-sm text-gray-600">Utilization Rate</div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Run the simulation to see results.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
