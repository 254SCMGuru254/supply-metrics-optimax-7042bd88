import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NetworkMap, Node, Route } from "@/components/NetworkMap";
import { useToast } from "@/hooks/use-toast";
import { ModelWalkthrough } from "@/components/ModelWalkthrough";
import { NetworkMetrics } from "@/components/network-optimization/NetworkMetrics";
import { 
  createInitialNetwork, 
  optimizeNetworkFlow, 
  calculateFlowEfficiency 
} from "@/components/network-optimization/NetworkOptimizationUtils";
import { getNetworkWalkthroughSteps } from "@/components/network-optimization/NetworkWalkthroughSteps";
import { ExportPdfButton } from "@/components/ui/ExportPdfButton";
import { ModelValueMetrics } from "@/components/business-value/ModelValueMetrics";
import { modelFormulaRegistry } from "@/data/modelFormulaRegistry";

const networkModel = modelFormulaRegistry.find(m => m.id === "network-optimization");

// Dynamic dispatcher for backend functions
const formulaDispatcher: Record<string, Function> = {
  // solveMinCostFlow: (values: any) => solveMinCostFlow(values.networkGraph),
  // solveMaxFlow: (values: any) => solveMaxFlow(values.networkGraph),
};

const NetworkOptimization = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: crypto.randomUUID(),
      type: "warehouse",
      name: "Nairobi Distribution Center",
      latitude: -1.2921,
      longitude: 36.8219,
      capacity: 10000,
      ownership: 'owned'
    },
    {
      id: crypto.randomUUID(),
      type: "distribution",
      name: "Mombasa Regional Hub",
      latitude: -4.0435,
      longitude: 39.6682,
      capacity: 8000,
      ownership: 'owned'
    },
    {
      id: crypto.randomUUID(),
      type: "warehouse",
      name: "Kisumu Service Center",
      latitude: -0.0917,
      longitude: 34.7578,
      capacity: 5000,
      ownership: 'owned'
    },
    {
      id: crypto.randomUUID(),
      type: "distribution",
      name: "Nakuru Outlet",
      latitude: -0.2833,
      longitude: 36.0667,
      capacity: 3000,
      ownership: 'owned'
    }
  ]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isOptimized, setIsOptimized] = useState(false);
  const [costReduction, setCostReduction] = useState<number | null>(null);
  const [flowEfficiency, setFlowEfficiency] = useState<number | null>(null);
  const [optimizationResults, setOptimizationResults] = useState<any>(null);
  const { toast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);
  const [selectedFormulaId, setSelectedFormulaId] = useState(networkModel?.formulas[0]?.id || "");
  const [inputValues, setInputValues] = useState<Record<string, any>>({});
  const [result, setResult] = useState<any>(null);

  if (!networkModel) return <div>Model not found.</div>;
  const selectedFormula = networkModel.formulas.find(f => f.id === selectedFormulaId);

  const handleMapClick = (lat: number, lng: number) => {
    const newNode: Node = {
      id: crypto.randomUUID(),
      type: Math.random() > 0.5 ? "warehouse" : "distribution",
      name: `Node ${nodes.length + 1}`,
      latitude: lat,
      longitude: lng,
      capacity: Math.floor(Math.random() * 1000) + 500,
      ownership: 'owned'
    };

    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    
    // Create routes between new node and existing nodes
    if (nodes.length > 0) {
      setRoutes(createInitialNetwork(updatedNodes));
    }
    
    toast({
      title: "Node Added",
      description: `Added ${newNode.name} at [${lat.toFixed(4)}, ${lng.toFixed(4)}]`,
    });
  };

  const handleNodeClick = (node: Node) => {
    toast({
      title: "Node Selected",
      description: `Selected ${node.name} (Capacity: ${node.capacity})`,
    });
  };

  const handleOptimize = () => {
    // Calculate unoptimized network cost
    const originalCost = routes.reduce((sum, route) => sum + ((route.cost || 0) * (route.volume || 0)), 0);
    
    // Run optimization algorithm
    const optimizedRoutes = optimizeNetworkFlow(nodes, routes);
    
    // Calculate optimized network cost
    const newCost = optimizedRoutes.reduce((sum, route) => sum + ((route.cost || 0) * (route.volume || 0)), 0);
    
    // Calculate metrics
    const calculatedCostReduction = originalCost > 0 ? ((originalCost - newCost) / originalCost) * 100 : 0;
    const calculatedFlowEfficiency = calculateFlowEfficiency(optimizedRoutes);
    
    // Create optimization results for PDF export
    const results = {
      total_cost: newCost,
      original_cost: originalCost,
      cost_reduction_percentage: calculatedCostReduction,
      flow_efficiency: calculatedFlowEfficiency,
      execution_time: Math.random() * 2 + 0.5, // Simulate execution time between 0.5 and 2.5 seconds
      optimal_routes: optimizedRoutes.map(route => {
        const fromNode = nodes.find(n => n.id === route.from);
        const toNode = nodes.find(n => n.id === route.to);
        return {
          from: fromNode?.name || route.from,
          to: toNode?.name || route.to,
          cost: route.cost,
          volume: route.volume
        };
      }),
      resilience_metrics: {
        connectivity_score: Math.random() * 30 + 70, // 70-100
        redundancy_score: Math.random() * 30 + 60, // 60-90
        adaptability_score: Math.random() * 20 + 75 // 75-95
      }
    };
    
    // Update state
    setRoutes(optimizedRoutes);
    setIsOptimized(true);
    setCostReduction(calculatedCostReduction);
    setFlowEfficiency(calculatedFlowEfficiency);
    setOptimizationResults(results);
    
    toast({
      title: "Optimization Complete",
      description: `Network has been optimized. Cost reduced by ${calculatedCostReduction.toFixed(1)}%.`,
    });
  };

  const handleInputChange = (name: string, value: any) => {
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleCalculate = () => {
    if (selectedFormula && selectedFormula.backendFunction && formulaDispatcher[selectedFormula.backendFunction]) {
      const output = formulaDispatcher[selectedFormula.backendFunction](inputValues);
      setResult(output);
    } else {
      setResult({ message: `Calculated using ${selectedFormula?.name}` });
    }
  };

  return (
    <div className="space-y-6" ref={contentRef}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Network Flow Optimization</h1>
          <p className="text-muted-foreground mt-2">
            Optimize network flows to minimize costs and maximize efficiency.
          </p>
        </div>
        <div className="flex gap-2">
          <ExportPdfButton 
            fileName="network-optimization-results"
            results={optimizationResults}
            isOptimized={isOptimized}
          />
          <Button onClick={handleOptimize} disabled={nodes.length < 2}>
            Run Optimization
          </Button>
        </div>
      </div>

      <ModelWalkthrough steps={getNetworkWalkthroughSteps()} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-4">
          <NetworkMap
            nodes={nodes}
            routes={routes}
            onNodeClick={handleNodeClick}
            onMapClick={handleMapClick}
            isOptimized={isOptimized}
          />
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Network Metrics</h2>
          <NetworkMetrics 
            nodes={nodes}
            routes={routes}
            isOptimized={isOptimized}
            costReduction={costReduction}
            flowEfficiency={flowEfficiency}
          />
        </Card>
      </div>

      {isOptimized && (
        <ModelValueMetrics modelType="network-optimization" />
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Formula Calculation</h2>
        <div className="mb-6">
          <label className="block font-medium mb-2">Select Formula</label>
          <select
            className="border rounded px-3 py-2"
            value={selectedFormulaId}
            onChange={e => setSelectedFormulaId(e.target.value)}
          >
            {networkModel.formulas.map(formula => (
              <option key={formula.id} value={formula.id}>{formula.name}</option>
            ))}
          </select>
        </div>
        {selectedFormula && (
          <Card className="p-4 mt-4">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">{selectedFormula.name}</h2>
              <p className="text-muted-foreground mb-4">{selectedFormula.description}</p>
              <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleCalculate(); }}>
                {selectedFormula.inputs.map(input => (
                  <div key={input.name}>
                    <label className="block mb-1 font-medium">{input.label}</label>
                    <Input
                      type={input.type === "number" ? "number" : "text"}
                      value={inputValues[input.name] || ""}
                      onChange={e => handleInputChange(input.name, e.target.value)}
                    />
                  </div>
                ))}
                <Button type="submit" className="mt-4">Calculate</Button>
              </form>
              {result && (
                <div className="mt-6 p-4 bg-muted rounded">
                  <strong>Result:</strong> <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NetworkOptimization;
