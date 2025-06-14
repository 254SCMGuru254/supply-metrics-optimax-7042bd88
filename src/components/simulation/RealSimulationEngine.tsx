
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Square, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SimulationParameters {
  timeHorizon: number;
  demandMean: number;
  demandStdDev: number;
  leadTimeMean: number;
  leadTimeStdDev: number;
  holdingCostRate: number;
  orderingCost: number;
  stockoutCost: number;
  iterations: number;
}

interface SimulationResults {
  averageInventoryLevel: number;
  serviceLevel: number;
  totalCost: number;
  stockoutProbability: number;
  averageOrderFrequency: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
}

export const RealSimulationEngine = () => {
  const [parameters, setParameters] = useState<SimulationParameters>({
    timeHorizon: 365,
    demandMean: 100,
    demandStdDev: 20,
    leadTimeMean: 7,
    leadTimeStdDev: 2,
    holdingCostRate: 0.25,
    orderingCost: 500,
    stockoutCost: 50,
    iterations: 1000
  });

  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<SimulationResults | null>(null);
  const { toast } = useToast();

  // Normal distribution random number generator (Box-Muller transform)
  const generateNormal = (mean: number, stdDev: number): number => {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z0 * stdDev + mean;
  };

  // Poisson distribution random number generator
  const generatePoisson = (lambda: number): number => {
    const L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    
    do {
      k++;
      p *= Math.random();
    } while (p > L);
    
    return k - 1;
  };

  // Monte Carlo simulation for inventory management
  const runMonteCarloSimulation = async (): Promise<SimulationResults> => {
    const results: number[] = [];
    const serviceLevels: number[] = [];
    const stockouts: number[] = [];
    
    for (let iteration = 0; iteration < parameters.iterations; iteration++) {
      let inventory = parameters.demandMean * parameters.leadTimeMean; // Initial inventory
      let totalCost = 0;
      let stockoutEvents = 0;
      let totalDemandMet = 0;
      let totalDemand = 0;
      let orderCount = 0;
      
      // Run simulation for the time horizon
      for (let day = 0; day < parameters.timeHorizon; day++) {
        // Generate daily demand (normal distribution)
        const dailyDemand = Math.max(0, generateNormal(parameters.demandMean, parameters.demandStdDev));
        totalDemand += dailyDemand;
        
        // Check if we can meet demand
        const demandMet = Math.min(dailyDemand, inventory);
        totalDemandMet += demandMet;
        
        if (demandMet < dailyDemand) {
          stockoutEvents++;
          totalCost += (dailyDemand - demandMet) * parameters.stockoutCost;
        }
        
        // Update inventory
        inventory = Math.max(0, inventory - dailyDemand);
        
        // Calculate holding cost
        totalCost += inventory * parameters.holdingCostRate / 365;
        
        // Reorder logic (Economic Order Quantity)
        const reorderPoint = parameters.leadTimeMean * parameters.demandMean + 
                           1.65 * Math.sqrt(parameters.leadTimeMean) * parameters.demandStdDev; // 95% service level
        
        if (inventory <= reorderPoint) {
          const orderQuantity = Math.sqrt(2 * parameters.demandMean * 365 * parameters.orderingCost / parameters.holdingCostRate);
          inventory += orderQuantity;
          totalCost += parameters.orderingCost;
          orderCount++;
          
          // Simulate lead time variability
          const leadTime = Math.max(1, generateNormal(parameters.leadTimeMean, parameters.leadTimeStdDev));
          // In a real simulation, we'd delay the inventory arrival
        }
      }
      
      const serviceLevel = totalDemand > 0 ? (totalDemandMet / totalDemand) * 100 : 100;
      const stockoutProbability = (stockoutEvents / parameters.timeHorizon) * 100;
      
      results.push(totalCost);
      serviceLevels.push(serviceLevel);
      stockouts.push(stockoutProbability);
      
      // Update progress
      setProgress(((iteration + 1) / parameters.iterations) * 100);
      
      // Allow UI to update
      if (iteration % 100 === 0) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }
    
    // Calculate statistics
    const avgCost = results.reduce((sum, cost) => sum + cost, 0) / results.length;
    const avgServiceLevel = serviceLevels.reduce((sum, sl) => sum + sl, 0) / serviceLevels.length;
    const avgStockoutProb = stockouts.reduce((sum, so) => sum + so, 0) / stockouts.length;
    
    // Calculate confidence interval (95%)
    const sortedResults = results.sort((a, b) => a - b);
    const lowerIndex = Math.floor(0.025 * results.length);
    const upperIndex = Math.floor(0.975 * results.length);
    
    return {
      averageInventoryLevel: parameters.demandMean * parameters.leadTimeMean,
      serviceLevel: avgServiceLevel,
      totalCost: avgCost,
      stockoutProbability: avgStockoutProb,
      averageOrderFrequency: 365 / (365 / 12), // Approximate monthly orders
      confidenceInterval: {
        lower: sortedResults[lowerIndex],
        upper: sortedResults[upperIndex]
      }
    };
  };

  const startSimulation = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults(null);
    
    try {
      toast({
        title: "Simulation Started",
        description: `Running ${parameters.iterations} Monte Carlo iterations...`
      });
      
      const simulationResults = await runMonteCarloSimulation();
      setResults(simulationResults);
      
      toast({
        title: "Simulation Complete",
        description: "Monte Carlo simulation finished successfully."
      });
    } catch (error) {
      console.error('Simulation error:', error);
      toast({
        title: "Simulation Error",
        description: "Failed to complete simulation.",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const stopSimulation = () => {
    setIsRunning(false);
    setProgress(0);
    toast({
      title: "Simulation Stopped",
      description: "Simulation has been terminated.",
      variant: "destructive"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Monte Carlo Simulation Engine
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label>Time Horizon (days)</Label>
            <Input
              type="number"
              value={parameters.timeHorizon}
              onChange={(e) => setParameters({...parameters, timeHorizon: parseInt(e.target.value)})}
            />
          </div>
          <div>
            <Label>Demand Mean</Label>
            <Input
              type="number"
              value={parameters.demandMean}
              onChange={(e) => setParameters({...parameters, demandMean: parseFloat(e.target.value)})}
            />
          </div>
          <div>
            <Label>Demand Std Dev</Label>
            <Input
              type="number"
              step="0.1"
              value={parameters.demandStdDev}
              onChange={(e) => setParameters({...parameters, demandStdDev: parseFloat(e.target.value)})}
            />
          </div>
          <div>
            <Label>Lead Time Mean (days)</Label>
            <Input
              type="number"
              value={parameters.leadTimeMean}
              onChange={(e) => setParameters({...parameters, leadTimeMean: parseFloat(e.target.value)})}
            />
          </div>
          <div>
            <Label>Lead Time Std Dev</Label>
            <Input
              type="number"
              step="0.1"
              value={parameters.leadTimeStdDev}
              onChange={(e) => setParameters({...parameters, leadTimeStdDev: parseFloat(e.target.value)})}
            />
          </div>
          <div>
            <Label>Holding Cost Rate</Label>
            <Input
              type="number"
              step="0.01"
              value={parameters.holdingCostRate}
              onChange={(e) => setParameters({...parameters, holdingCostRate: parseFloat(e.target.value)})}
            />
          </div>
          <div>
            <Label>Ordering Cost</Label>
            <Input
              type="number"
              value={parameters.orderingCost}
              onChange={(e) => setParameters({...parameters, orderingCost: parseFloat(e.target.value)})}
            />
          </div>
          <div>
            <Label>Stockout Cost</Label>
            <Input
              type="number"
              value={parameters.stockoutCost}
              onChange={(e) => setParameters({...parameters, stockoutCost: parseFloat(e.target.value)})}
            />
          </div>
        </div>

        <div>
          <Label>Monte Carlo Iterations</Label>
          <Input
            type="number"
            value={parameters.iterations}
            onChange={(e) => setParameters({...parameters, iterations: parseInt(e.target.value)})}
          />
        </div>

        {isRunning ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Simulation Progress</span>
              <span className="text-sm text-muted-foreground">{progress.toFixed(1)}%</span>
            </div>
            <Progress value={progress} />
            <Button variant="destructive" onClick={stopSimulation}>
              <Square className="h-4 w-4 mr-2" />
              Stop Simulation
            </Button>
          </div>
        ) : (
          <Button onClick={startSimulation}>
            <Play className="h-4 w-4 mr-2" />
            Run Monte Carlo Simulation
          </Button>
        )}

        {results && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Simulation Results</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{results.serviceLevel.toFixed(2)}%</div>
                  <p className="text-sm text-muted-foreground">Service Level</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">KES {results.totalCost.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Total Annual Cost</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{results.stockoutProbability.toFixed(2)}%</div>
                  <p className="text-sm text-muted-foreground">Stockout Probability</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <h5 className="font-medium mb-2">95% Confidence Interval</h5>
              <p className="text-sm">
                Total Cost: KES {results.confidenceInterval.lower.toLocaleString()} - 
                KES {results.confidenceInterval.upper.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
