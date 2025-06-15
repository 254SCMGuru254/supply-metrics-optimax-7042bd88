import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Map, Play, RefreshCcw } from "lucide-react";
import { optimizationService, OptimizationResponse } from "@/services/OptimizationService";
import { LeafletMapbox } from "@/components/maps/LeafletMapbox";
import { ExportPdfButton } from "@/components/ui/ExportPdfButton";
import Papa from "papaparse";
import type { Node, Route } from "@/components/map/MapTypes";
import { ErrorsTab } from "@/components/route-optimization/ErrorsTab";
import { ErrorHandlingService } from "@/services/ErrorHandlingService";

const ROUTE_ALGORITHMS = [
  {
    id: "nearest-neighbor",
    name: "Nearest Neighbor",
    params: [
      { name: "startNode", label: "Start Node Index", type: "number", defaultValue: 0 },
    ],
  },
  {
    id: "clarke-wright",
    name: "Clarke-Wright Savings",
    params: [
      { name: "depot", label: "Depot Index", type: "number", defaultValue: 0 },
      { name: "vehicleCapacity", label: "Vehicle Capacity", type: "number", defaultValue: 1000 },
    ],
  },
  {
    id: "genetic-algorithm-vrp",
    name: "Genetic Algorithm (VRP)",
    params: [
      { name: "populationSize", label: "Population Size", type: "number", defaultValue: 50 },
      { name: "generations", label: "Generations", type: "number", defaultValue: 100 },
      { name: "mutationRate", label: "Mutation Rate", type: "number", defaultValue: 0.1 },
    ],
  },
];

interface Scenario {
  id: string;
  label: string;
  algorithm: string;
  parameters: Record<string, any>;
  result?: OptimizationResponse;
}

export const RouteOptimizationEnterprise: React.FC = () => {
  const [activeAlgo, setActiveAlgo] = useState(ROUTE_ALGORITHMS[0].id);
  const [params, setParams] = useState<{ [key: string]: any }>({});
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [results, setResults] = useState<OptimizationResponse | null>(null);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [projectId, setProjectId] = useState<string>("route-optimization-project");
  const [mapTab, setMapTab] = useState<"original" | "optimized">("optimized");

  const errorHandler = ErrorHandlingService.getInstance();

  // Fetch route and node data (add ownership for Node)
  useEffect(() => {
    setNodes([
      { id: "nairobi-hub", name: "Nairobi Hub", type: "warehouse", latitude: -1.2921, longitude: 36.8219, ownership: "owned" },
      { id: "mombasa-port", name: "Mombasa Port", type: "port", latitude: -4.0435, longitude: 39.6682, ownership: "owned" },
      { id: "kisumu-customer", name: "Kisumu Customer", type: "customer", latitude: -0.0917, longitude: 34.7578, ownership: "owned" },
      { id: "nakuru-retail", name: "Nakuru Retail", type: "retail", latitude: -0.2833, longitude: 36.0667, ownership: "owned" },
      { id: "eldoret-customer", name: "Eldoret Customer", type: "customer", latitude: 0.5167, longitude: 35.2667, ownership: "owned" },
    ]);
    setRoutes([
      { id: "route-1", from: "nairobi-hub", to: "mombasa-port", type: "road", volume: 120, cost: 15000, transitTime: 8, isOptimized: false, ownership: "owned" },
      { id: "route-2", from: "nairobi-hub", to: "kisumu-customer", type: "road", volume: 80, cost: 12000, transitTime: 6, isOptimized: false, ownership: "owned" },
      { id: "route-3", from: "nairobi-hub", to: "nakuru-retail", type: "road", volume: 50, cost: 8000, transitTime: 3, isOptimized: false, ownership: "owned" },
      { id: "route-4", from: "nairobi-hub", to: "eldoret-customer", type: "road", volume: 60, cost: 10000, transitTime: 4, isOptimized: false, ownership: "owned" },
    ]);
  }, []);

  // Update algorithm-specific params
  useEffect(() => {
    const algo = ROUTE_ALGORITHMS.find(a => a.id === activeAlgo);
    if (algo) {
      const newParams: any = {};
      algo.params.forEach(p => newParams[p.name] = p.defaultValue);
      setParams(newParams);
    }
  }, [activeAlgo]);

  const handleParamChange = (key: string, value: any) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setResults(null);
    try {
      // Map to service call per algorithm
      let optimizationParams = { ...params, nodes, routes };
      let response: OptimizationResponse;
      switch (activeAlgo) {
        case "nearest-neighbor":
          response = await optimizationService.optimizeRoute(projectId, {
            algorithm: "nearest_neighbor",
            ...optimizationParams
          });
          break;
        case "clarke-wright":
          response = await optimizationService.optimizeRoute(projectId, {
            algorithm: "clarke_wright",
            ...optimizationParams
          });
          break;
        case "genetic-algorithm-vrp":
          response = await optimizationService.optimizeRoute(projectId, {
            algorithm: "genetic_algorithm_vrp",
            ...optimizationParams
          });
          break;
        default:
          throw new Error("Unknown algorithm selected.");
      }
      setResults(response);
      // Save this scenario run for recall/compare/export
      setScenarios(prev => [
        {
          id: `scenario-${Date.now()}`,
          label: `${ROUTE_ALGORITHMS.find(a => a.id === activeAlgo)?.name}`,
          algorithm: activeAlgo,
          parameters: { ...params },
          result: response,
        },
        ...prev
      ]);
    } catch (e: any) {
      alert(`Optimization error: ${e?.message || e}`);
    } finally {
      setIsOptimizing(false);
    }
  };

  const exportCsv = () => {
    if (!results?.results) return;
    const dataRows = Array.isArray(results.results.optimizedRoute)
      ? results.results.optimizedRoute.map((nodeId: string, idx: number) => ({
          sequence: idx + 1,
          nodeId,
          nodeName: nodes.find(n => n.id === nodeId)?.name || nodeId,
        }))
      : [];

    const csvContent = Papa.unparse(dataRows);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `optimized_route_${activeAlgo}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportResultJson = () => {
    if (!results?.results) return;
    const blob = new Blob([JSON.stringify(results.results, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `optimized_route_${activeAlgo}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-2 md:py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-3 items-center">
            <Play className="w-5 h-5" />
            Enterprise Route Optimization Suite
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="optimize" className="space-y-4">
            <TabsList>
              <TabsTrigger value="optimize">Optimization</TabsTrigger>
              <TabsTrigger value="errors">Errors</TabsTrigger>
            </TabsList>
            <TabsContent value="optimize">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <Tabs defaultValue={activeAlgo} onValueChange={setActiveAlgo}>
                    <TabsList>
                      {ROUTE_ALGORITHMS.map(algo => (
                        <TabsTrigger key={algo.id} value={algo.id}>{algo.name}</TabsTrigger>
                      ))}
                    </TabsList>
                    {ROUTE_ALGORITHMS.map(algo => (
                      <TabsContent key={algo.id} value={algo.id}>
                        <form
                          className="space-y-4"
                          onSubmit={e => {
                            e.preventDefault();
                            handleOptimize();
                          }}
                        >
                          {algo.params.map(param => (
                            <div key={param.name}>
                              <Label>{param.label}</Label>
                              <Input
                                type={param.type}
                                value={params[param.name]}
                                onChange={e => handleParamChange(param.name, param.type === "number" ? Number(e.target.value) : e.target.value)}
                              />
                            </div>
                          ))}
                          <Button type="submit" className="mt-2" disabled={isOptimizing}>
                            <Play className="inline w-4 h-4 mr-1" />
                            {isOptimizing ? "Optimizing..." : "Run Optimization"}
                          </Button>
                        </form>
                      </TabsContent>
                    ))}
                  </Tabs>
                  <div className="mt-4 flex gap-3">
                    <Button variant="outline" onClick={exportCsv} disabled={!results}>
                      <Download className="w-4 h-4 mr-1" /> Export CSV
                    </Button>
                    <Button variant="outline" onClick={exportResultJson} disabled={!results}>
                      <Download className="w-4 h-4 mr-1" /> Export JSON
                    </Button>
                    <ExportPdfButton exportId="routeopt-report" fileName={`route_optimization_${activeAlgo}`} />
                  </div>
                </div>
                <div className="flex-1" id="routeopt-report">
                  <Card className="border border-blue-300 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="flex gap-3 items-center">
                        <Download className="w-4 h-4" />
                        Optimization Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {results?.success && results.results?.optimizedRoute
                        ? (
                          <div>
                            <h4 className="font-semibold mt-2 mb-1">Optimized Route Sequence</h4>
                            <ol className="list-decimal ml-5">
                              {results.results.optimizedRoute.map((nodeId: string, idx: number) =>
                                <li key={nodeId + idx}>{nodes.find(n => n.id === nodeId)?.name || nodeId}</li>
                              )}
                            </ol>
                            <div className="mt-2">
                              <span className="block">Total Distance: <b>{results.results.totalDistance ?? "--"}</b> km</span>
                              <span className="block">Total Cost: <b>{results.results.totalCost ?? "--"}</b></span>
                              <span className="block">Service Level: <b>{results.results.metrics?.serviceLevel ?? "--"}</b></span>
                            </div>
                          </div>
                        ) : <div className="text-gray-500">{results ? "No valid results. Try running an optimization." : "Results will appear here..."}</div>
                      }
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="errors">
              <ErrorsTab errorSummary={errorHandler.getErrorSummary()} errorHandler={errorHandler} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center"><Map className="w-5 h-5" /> Route Map Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={mapTab} onValueChange={(v) => setMapTab(v as any)}>
            <TabsList>
              <TabsTrigger value="original">Original Routes</TabsTrigger>
              <TabsTrigger value="optimized">Optimized Route</TabsTrigger>
            </TabsList>
            <TabsContent value="original">
              <LeafletMapbox />
            </TabsContent>
            <TabsContent value="optimized">
              {results?.success && results.results?.optimizedRoute ? (
                <LeafletMapbox />
              ) : (
                <div className="text-gray-400">
                  No optimized route to display.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scenario Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {scenarios.length === 0 && <div className="text-gray-500">No saved scenario runs yet.</div>}
            {scenarios.map(scenario => (
              <div key={scenario.id} className="border rounded px-4 py-2 mb-2 flex items-center justify-between bg-white">
                <div>
                  <b>{scenario.label}</b> (run at {new Date(Number(scenario.id.split("-")[1])).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit'})})
                  <div className="text-xs text-gray-500">
                    Params: {Object.entries(scenario.parameters).map(([k, v]) => `${k}: ${v}`).join(', ')}
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setResults(scenario.result!)}><RefreshCcw className="inline w-4 h-4 mr-1" />View Results</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RouteOptimizationEnterprise;
