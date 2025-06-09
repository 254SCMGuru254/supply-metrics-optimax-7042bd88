import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ExportPdfButton } from "@/components/ui/ExportPdfButton";
import { Play, RefreshCcw, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface SimulationParams {
  demandVariability: number;
  supplyDisruption: number;
  leadTimeVariation: number;
  seasonalityFactor: number;
  marketVolatility: number;
}

interface SimulationResult {
  period: number;
  demand: number;
  supply: number;
  inventory: number;
  cost: number;
  serviceLevel: number;
  stockouts: number;
}

export const SimulationContent = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPeriod, setCurrentPeriod] = useState(0);
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [params, setParams] = useState<SimulationParams>({
    demandVariability: 20,
    supplyDisruption: 10,
    leadTimeVariation: 15,
    seasonalityFactor: 30,
    marketVolatility: 25
  });

  const runSimulation = async () => {
    setIsRunning(true);
    setProgress(0);
    setCurrentPeriod(0);
    setResults([]);

    const simulationData: SimulationResult[] = [];
    const totalPeriods = 52; // 52 weeks simulation

    for (let period = 1; period <= totalPeriods; period++) {
      // Simulate demand with variability and seasonality
      const baseDemand = 1000;
      const seasonalMultiplier = 1 + (params.seasonalityFactor / 100) * Math.sin(period * 2 * Math.PI / 52);
      const demandVariation = 1 + (Math.random() - 0.5) * (params.demandVariability / 100);
      const demand = Math.round(baseDemand * seasonalMultiplier * demandVariation);

      // Simulate supply with disruption probability
      const baseSupply = 1200;
      const disruptionOccurs = Math.random() < (params.supplyDisruption / 100);
      const supply = disruptionOccurs ? Math.round(baseSupply * 0.3) : baseSupply;

      // Calculate inventory and metrics
      const previousInventory = period === 1 ? 2000 : simulationData[period - 2].inventory;
      const inventory = Math.max(0, previousInventory + supply - demand);
      
      // Calculate costs (holding + stockout)
      const holdingCost = inventory * 2; // $2 per unit holding cost
      const stockoutCost = Math.max(0, demand - (previousInventory + supply)) * 50; // $50 per unit stockout
      const cost = holdingCost + stockoutCost;

      // Service level calculation
      const serviceLevel = Math.min(100, ((previousInventory + supply) / demand) * 100);
      const stockouts = Math.max(0, demand - (previousInventory + supply));

      simulationData.push({
        period,
        demand,
        supply,
        inventory,
        cost,
        serviceLevel,
        stockouts
      });

      setCurrentPeriod(period);
      setProgress((period / totalPeriods) * 100);
      setResults([...simulationData]);

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setIsRunning(false);
  };

  const resetSimulation = () => {
    setProgress(0);
    setCurrentPeriod(0);
    setResults([]);
    setIsRunning(false);
  };

  const totalCost = results.reduce((sum, r) => sum + r.cost, 0);
  const avgServiceLevel = results.length > 0 ? results.reduce((sum, r) => sum + r.serviceLevel, 0) / results.length : 0;
  const totalStockouts = results.reduce((sum, r) => sum + r.stockouts, 0);

  return (
    <div className="space-y-6" id="simulation-content">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Supply Chain Simulation</h2>
          <p className="text-gray-600 mt-1">Monte Carlo simulation for demand and supply variability analysis</p>
        </div>
        <ExportPdfButton 
          title="Supply Chain Simulation Report"
          exportId="simulation-content"
          fileName="simulation_analysis_report"
        />
      </div>

      <Tabs defaultValue="setup">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Simulation Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Demand Variability (%)</Label>
                  <Input
                    type="number"
                    value={params.demandVariability}
                    onChange={(e) => setParams({...params, demandVariability: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Supply Disruption Risk (%)</Label>
                  <Input
                    type="number"
                    value={params.supplyDisruption}
                    onChange={(e) => setParams({...params, supplyDisruption: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Lead Time Variation (%)</Label>
                  <Input
                    type="number"
                    value={params.leadTimeVariation}
                    onChange={(e) => setParams({...params, leadTimeVariation: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Seasonality Factor (%)</Label>
                  <Input
                    type="number"
                    value={params.seasonalityFactor}
                    onChange={(e) => setParams({...params, seasonalityFactor: Number(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={runSimulation} disabled={isRunning}>
                  <Play className="h-4 w-4 mr-2" />
                  {isRunning ? "Running..." : "Start Simulation"}
                </Button>
                <Button variant="outline" onClick={resetSimulation}>
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Simulation Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Period: {currentPeriod}/52</span>
                    <span>{progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={progress} />
                </div>

                {results.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-500">Current Demand</p>
                        <p className="font-semibold">{results[results.length - 1]?.demand || 0}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-500">Current Supply</p>
                        <p className="font-semibold">{results[results.length - 1]?.supply || 0}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <div>
                        <p className="text-sm text-gray-500">Current Inventory</p>
                        <p className="font-semibold">{results[results.length - 1]?.inventory || 0}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {results.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Real-time Charts</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={results.slice(-20)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="demand" stroke="#8884d8" name="Demand" />
                    <Line type="monotone" dataKey="supply" stroke="#82ca9d" name="Supply" />
                    <Line type="monotone" dataKey="inventory" stroke="#ffc658" name="Inventory" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {results.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <div className="text-2xl font-bold text-red-500">${totalCost.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Total Cost</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <div className="text-2xl font-bold text-green-500">{avgServiceLevel.toFixed(1)}%</div>
                    <div className="text-sm text-gray-500">Avg Service Level</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <div className="text-2xl font-bold text-orange-500">{totalStockouts}</div>
                    <div className="text-sm text-gray-500">Total Stockouts</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Demand vs Supply Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={results}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="demand" stroke="#8884d8" name="Demand" />
                      <Line type="monotone" dataKey="supply" stroke="#82ca9d" name="Supply" />
                      <Line type="monotone" dataKey="inventory" stroke="#ffc658" name="Inventory" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          {results.length > 0 && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Cost Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={results.slice(-12)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="cost" fill="#8884d8" name="Total Cost" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Average Weekly Demand</p>
                        <p className="text-lg font-semibold">{Math.round(results.reduce((sum, r) => sum + r.demand, 0) / results.length)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Average Weekly Supply</p>
                        <p className="text-lg font-semibold">{Math.round(results.reduce((sum, r) => sum + r.supply, 0) / results.length)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Stockout Frequency</p>
                        <p className="text-lg font-semibold">{((results.filter(r => r.stockouts > 0).length / results.length) * 100).toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Average Inventory</p>
                        <p className="text-lg font-semibold">{Math.round(results.reduce((sum, r) => sum + r.inventory, 0) / results.length)}</p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Recommendations</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Increase safety stock by 15% to reduce stockout risk</li>
                        <li>• Implement demand forecasting to improve supply planning</li>
                        <li>• Consider supplier diversification to reduce disruption impact</li>
                        <li>• Monitor seasonal patterns for better inventory management</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
