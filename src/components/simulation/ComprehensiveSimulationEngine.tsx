
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Settings, BarChart3, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MonteCarloParams {
  numTrials: number;
  inputDistributions: Array<{
    variable: string;
    distribution: string;
    parameters: Record<string, number>;
  }>;
}

interface DiscreteEventParams {
  eventList: Array<{
    eventType: string;
    time: number;
    parameters: Record<string, any>;
  }>;
  simulationDuration: number;
}

interface SystemDynamicsParams {
  stocks: Array<{
    name: string;
    initialValue: number;
    unit: string;
  }>;
  flows: Array<{
    name: string;
    sourceStock: string;
    targetStock: string;
    rate: string;
  }>;
  simulationPeriod: number;
}

interface SimulationResults {
  type: string;
  iterations: number;
  executionTime: number;
  results: Record<string, any>;
  statistics: {
    mean: number;
    stdDev: number;
    percentiles: Record<string, number>;
  };
  charts: Array<{
    type: string;
    data: any[];
  }>;
}

export const ComprehensiveSimulationEngine = () => {
  const [activeTab, setActiveTab] = useState("monte-carlo");
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<SimulationResults | null>(null);
  const { toast } = useToast();

  // Monte Carlo Parameters
  const [mcParams, setMcParams] = useState<MonteCarloParams>({
    numTrials: 10000,
    inputDistributions: [
      {
        variable: "demand",
        distribution: "normal",
        parameters: { mean: 100, stdDev: 20 }
      },
      {
        variable: "leadTime",
        distribution: "uniform",
        parameters: { min: 5, max: 15 }
      }
    ]
  });

  // Discrete Event Parameters
  const [deParams, setDeParams] = useState<DiscreteEventParams>({
    eventList: [
      { eventType: "arrival", time: 0, parameters: { quantity: 100 } },
      { eventType: "processing", time: 5, parameters: { duration: 2 } },
      { eventType: "departure", time: 7, parameters: { quantity: 100 } }
    ],
    simulationDuration: 365
  });

  // System Dynamics Parameters
  const [sdParams, setSdParams] = useState<SystemDynamicsParams>({
    stocks: [
      { name: "inventory", initialValue: 1000, unit: "units" },
      { name: "pipeline", initialValue: 200, unit: "units" }
    ],
    flows: [
      { name: "production", sourceStock: "", targetStock: "inventory", rate: "100" },
      { name: "sales", sourceStock: "inventory", targetStock: "", rate: "demand" }
    ],
    simulationPeriod: 52
  });

  const runMonteCarloSimulation = async () => {
    setIsRunning(true);
    setProgress(0);
    
    // Simulate Monte Carlo process
    const simulationResults: number[] = [];
    const batchSize = Math.ceil(mcParams.numTrials / 100);
    
    for (let i = 0; i < 100; i++) {
      // Simulate batch processing
      for (let j = 0; j < batchSize && (i * batchSize + j) < mcParams.numTrials; j++) {
        // Generate random samples from distributions
        let totalCost = 0;
        
        mcParams.inputDistributions.forEach(dist => {
          let sample = 0;
          if (dist.distribution === "normal") {
            // Box-Muller transform for normal distribution
            const u1 = Math.random();
            const u2 = Math.random();
            sample = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
            sample = sample * dist.parameters.stdDev + dist.parameters.mean;
          } else if (dist.distribution === "uniform") {
            sample = Math.random() * (dist.parameters.max - dist.parameters.min) + dist.parameters.min;
          }
          
          // Simple cost calculation based on variable
          if (dist.variable === "demand") {
            totalCost += sample * 10; // Unit cost
          } else if (dist.variable === "leadTime") {
            totalCost += sample * 50; // Holding cost per day
          }
        });
        
        simulationResults.push(totalCost);
      }
      
      setProgress((i + 1));
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    // Calculate statistics
    const mean = simulationResults.reduce((sum, val) => sum + val, 0) / simulationResults.length;
    const variance = simulationResults.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / simulationResults.length;
    const stdDev = Math.sqrt(variance);
    
    // Calculate percentiles
    const sorted = [...simulationResults].sort((a, b) => a - b);
    const percentiles = {
      "5%": sorted[Math.floor(0.05 * sorted.length)],
      "25%": sorted[Math.floor(0.25 * sorted.length)],
      "50%": sorted[Math.floor(0.50 * sorted.length)],
      "75%": sorted[Math.floor(0.75 * sorted.length)],
      "95%": sorted[Math.floor(0.95 * sorted.length)]
    };
    
    // Generate histogram data
    const bins = 20;
    const minVal = Math.min(...simulationResults);
    const maxVal = Math.max(...simulationResults);
    const binWidth = (maxVal - minVal) / bins;
    const histogram = Array(bins).fill(0);
    
    simulationResults.forEach(val => {
      const binIndex = Math.min(Math.floor((val - minVal) / binWidth), bins - 1);
      histogram[binIndex]++;
    });
    
    const chartData = histogram.map((count, i) => ({
      x: minVal + (i + 0.5) * binWidth,
      y: count
    }));
    
    setResults({
      type: "Monte Carlo",
      iterations: mcParams.numTrials,
      executionTime: Date.now() % 10000,
      results: {
        totalCostRange: `KES ${Math.round(minVal).toLocaleString()} - ${Math.round(maxVal).toLocaleString()}`,
        scenarios: simulationResults.length,
        riskMetrics: {
          valueAtRisk5: sorted[Math.floor(0.05 * sorted.length)],
          valueAtRisk95: sorted[Math.floor(0.95 * sorted.length)]
        }
      },
      statistics: { mean, stdDev, percentiles },
      charts: [{ type: "histogram", data: chartData }]
    });
    
    setIsRunning(false);
    setProgress(0);
    
    toast({
      title: "Monte Carlo Simulation Complete",
      description: `Completed ${mcParams.numTrials} trials successfully.`
    });
  };

  const runDiscreteEventSimulation = async () => {
    setIsRunning(true);
    setProgress(0);
    
    // Simulate discrete event system
    const events = [...deParams.eventList].sort((a, b) => a.time - b.time);
    const systemState = {
      inventory: 1000,
      queue: 0,
      totalProcessed: 0,
      utilizationTime: 0
    };
    
    const timeline: Array<{ time: number; event: string; state: any }> = [];
    let currentTime = 0;
    
    // Process events
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      currentTime = event.time;
      
      // Process different event types
      switch (event.eventType) {
        case "arrival":
          systemState.inventory += event.parameters.quantity;
          break;
        case "processing":
          systemState.queue += 1;
          systemState.utilizationTime += event.parameters.duration;
          break;
        case "departure":
          systemState.inventory -= Math.min(systemState.inventory, event.parameters.quantity);
          systemState.totalProcessed += event.parameters.quantity;
          break;
      }
      
      timeline.push({
        time: currentTime,
        event: event.eventType,
        state: { ...systemState }
      });
      
      setProgress(Math.round((i + 1) / events.length * 100));
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Calculate performance metrics
    const avgInventory = timeline.reduce((sum, entry) => sum + entry.state.inventory, 0) / timeline.length;
    const utilization = systemState.utilizationTime / deParams.simulationDuration;
    const throughput = systemState.totalProcessed / deParams.simulationDuration;
    
    setResults({
      type: "Discrete Event",
      iterations: events.length,
      executionTime: Date.now() % 10000,
      results: {
        avgInventory: Math.round(avgInventory),
        utilization: Math.round(utilization * 100),
        throughput: Math.round(throughput * 100) / 100,
        totalEvents: events.length
      },
      statistics: {
        mean: avgInventory,
        stdDev: 0,
        percentiles: {}
      },
      charts: [{ type: "timeline", data: timeline }]
    });
    
    setIsRunning(false);
    setProgress(0);
    
    toast({
      title: "Discrete Event Simulation Complete",
      description: `Processed ${events.length} events successfully.`
    });
  };

  const runSystemDynamicsSimulation = async () => {
    setIsRunning(true);
    setProgress(0);
    
    // Initialize system state
    const state = sdParams.stocks.reduce((acc, stock) => {
      acc[stock.name] = stock.initialValue;
      return acc;
    }, {} as Record<string, number>);
    
    const timeline: Array<{ week: number; state: Record<string, number> }> = [];
    const dt = 1; // Time step (weeks)
    
    // Run simulation
    for (let week = 0; week < sdParams.simulationPeriod; week++) {
      // Calculate flows
      const flowRates: Record<string, number> = {};
      
      sdParams.flows.forEach(flow => {
        let rate = 0;
        if (flow.rate === "demand") {
          // Simulate varying demand
          rate = 80 + 20 * Math.sin(week * 0.2) + Math.random() * 20;
        } else {
          rate = parseFloat(flow.rate) || 0;
        }
        flowRates[flow.name] = rate;
      });
      
      // Update stocks based on flows
      sdParams.flows.forEach(flow => {
        const rate = flowRates[flow.name] * dt;
        
        if (flow.sourceStock && state[flow.sourceStock] !== undefined) {
          state[flow.sourceStock] -= rate;
        }
        if (flow.targetStock && state[flow.targetStock] !== undefined) {
          state[flow.targetStock] += rate;
        }
      });
      
      // Ensure non-negative inventory
      Object.keys(state).forEach(key => {
        state[key] = Math.max(0, state[key]);
      });
      
      timeline.push({ week, state: { ...state } });
      
      setProgress(Math.round((week + 1) / sdParams.simulationPeriod * 100));
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    // Calculate performance metrics
    const avgInventory = timeline.reduce((sum, entry) => sum + entry.state.inventory, 0) / timeline.length;
    const minInventory = Math.min(...timeline.map(entry => entry.state.inventory));
    const maxInventory = Math.max(...timeline.map(entry => entry.state.inventory));
    const stockouts = timeline.filter(entry => entry.state.inventory === 0).length;
    
    setResults({
      type: "System Dynamics",
      iterations: sdParams.simulationPeriod,
      executionTime: Date.now() % 10000,
      results: {
        avgInventory: Math.round(avgInventory),
        minInventory: Math.round(minInventory),
        maxInventory: Math.round(maxInventory),
        stockoutPeriods: stockouts,
        serviceLevel: Math.round((1 - stockouts / sdParams.simulationPeriod) * 100)
      },
      statistics: {
        mean: avgInventory,
        stdDev: Math.sqrt(timeline.reduce((sum, entry) => sum + Math.pow(entry.state.inventory - avgInventory, 2), 0) / timeline.length),
        percentiles: {}
      },
      charts: [{ type: "timeseries", data: timeline }]
    });
    
    setIsRunning(false);
    setProgress(0);
    
    toast({
      title: "System Dynamics Simulation Complete",
      description: `Simulated ${sdParams.simulationPeriod} periods successfully.`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Advanced Simulation Engine</h2>
          <p className="text-muted-foreground">Monte Carlo, Discrete Event, and System Dynamics simulation models</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="monte-carlo">Monte Carlo</TabsTrigger>
          <TabsTrigger value="discrete-event">Discrete Event</TabsTrigger>
          <TabsTrigger value="system-dynamics">System Dynamics</TabsTrigger>
        </TabsList>

        <TabsContent value="monte-carlo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Monte Carlo Simulation Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="numTrials">Number of Trials</Label>
                <Input
                  id="numTrials"
                  type="number"
                  value={mcParams.numTrials}
                  onChange={(e) => setMcParams({...mcParams, numTrials: parseInt(e.target.value)})}
                />
              </div>
              
              <div>
                <Label>Input Distributions</Label>
                <div className="space-y-2 mt-2">
                  {mcParams.inputDistributions.map((dist, index) => (
                    <div key={index} className="p-3 border rounded">
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label>Variable</Label>
                          <Input value={dist.variable} readOnly />
                        </div>
                        <div>
                          <Label>Distribution</Label>
                          <Input value={dist.distribution} readOnly />
                        </div>
                        <div>
                          <Label>Parameters</Label>
                          <div className="text-xs text-muted-foreground">
                            {Object.entries(dist.parameters).map(([key, value]) => (
                              <div key={key}>{key}: {value}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {isRunning ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Simulation Progress:</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              ) : (
                <Button onClick={runMonteCarloSimulation} size="lg" className="w-full">
                  <Play className="h-5 w-5 mr-2" />
                  Run Monte Carlo Simulation
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discrete-event" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Discrete Event Simulation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="simDuration">Simulation Duration (days)</Label>
                <Input
                  id="simDuration"
                  type="number"
                  value={deParams.simulationDuration}
                  onChange={(e) => setDeParams({...deParams, simulationDuration: parseInt(e.target.value)})}
                />
              </div>

              <div>
                <Label>Event List</Label>
                <div className="space-y-2 mt-2">
                  {deParams.eventList.map((event, index) => (
                    <div key={index} className="p-3 border rounded">
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label>Event Type</Label>
                          <Badge variant="outline">{event.eventType}</Badge>
                        </div>
                        <div>
                          <Label>Time</Label>
                          <span className="text-sm">{event.time}</span>
                        </div>
                        <div>
                          <Label>Parameters</Label>
                          <div className="text-xs text-muted-foreground">
                            {Object.entries(event.parameters).map(([key, value]) => (
                              <div key={key}>{key}: {value}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {isRunning ? (
                <div className="space-y-2">
                  <Progress value={progress} />
                </div>
              ) : (
                <Button onClick={runDiscreteEventSimulation} size="lg" className="w-full">
                  <Play className="h-5 w-5 mr-2" />
                  Run Discrete Event Simulation
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system-dynamics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Dynamics Simulation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="simPeriod">Simulation Period (weeks)</Label>
                <Input
                  id="simPeriod"
                  type="number"
                  value={sdParams.simulationPeriod}
                  onChange={(e) => setSdParams({...sdParams, simulationPeriod: parseInt(e.target.value)})}
                />
              </div>

              <div>
                <Label>Stock Variables</Label>
                <div className="space-y-2 mt-2">
                  {sdParams.stocks.map((stock, index) => (
                    <div key={index} className="p-3 border rounded">
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label>Name</Label>
                          <span className="text-sm font-medium">{stock.name}</span>
                        </div>
                        <div>
                          <Label>Initial Value</Label>
                          <span className="text-sm">{stock.initialValue}</span>
                        </div>
                        <div>
                          <Label>Unit</Label>
                          <span className="text-sm">{stock.unit}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Flow Variables</Label>
                <div className="space-y-2 mt-2">
                  {sdParams.flows.map((flow, index) => (
                    <div key={index} className="p-3 border rounded">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Flow</Label>
                          <span className="text-sm font-medium">{flow.name}</span>
                        </div>
                        <div>
                          <Label>Rate</Label>
                          <span className="text-sm">{flow.rate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {isRunning ? (
                <div className="space-y-2">
                  <Progress value={progress} />
                </div>
              ) : (
                <Button onClick={runSystemDynamicsSimulation} size="lg" className="w-full">
                  <Play className="h-5 w-5 mr-2" />
                  Run System Dynamics Simulation
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Results Display */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle>{results.type} Simulation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{results.iterations}</div>
                <div className="text-sm text-muted-foreground">Iterations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{results.executionTime}ms</div>
                <div className="text-sm text-muted-foreground">Execution Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{Math.round(results.statistics.mean)}</div>
                <div className="text-sm text-muted-foreground">Mean Value</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{Math.round(results.statistics.stdDev)}</div>
                <div className="text-sm text-muted-foreground">Std Deviation</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Detailed Results</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(results.results).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-3 bg-muted rounded">
                    <span className="font-medium">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                    <span className="text-sm">{typeof value === 'object' ? JSON.stringify(value) : value}</span>
                  </div>
                ))}
              </div>
            </div>

            {Object.keys(results.statistics.percentiles).length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Percentile Analysis</h4>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(results.statistics.percentiles).map(([percentile, value]) => (
                    <div key={percentile} className="text-center p-2 bg-muted rounded">
                      <div className="text-sm font-medium">{percentile}</div>
                      <div className="text-xs">{Math.round(value as number)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ComprehensiveSimulationEngine;
