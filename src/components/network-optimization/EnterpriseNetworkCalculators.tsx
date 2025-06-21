import React, { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Network } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Papa from "papaparse";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { modelFormulaRegistry } from "@/data/modelFormulaRegistry";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TableDiff } from "@/components/shared/TableDiff";

const formulas = [
  {
    id: "min-cost-flow",
    name: "Minimum Cost Flow",
    inputs: [
      { label: "Arc Cost Matrix", name: "arcCosts", type: "textarea" },
      { label: "Arc Capacities", name: "capacities", type: "textarea" }
    ],
    desc: "Finds the flow with minimum total cost."
  },
  {
    id: "max-flow",
    name: "Maximum Flow",
    inputs: [
      { label: "Capacity Matrix", name: "capacityMatrix", type: "textarea" }
    ],
    desc: "Finds the maximum feasible flow from source to sink."
  },
  {
    id: "network-simplex",
    name: "Network Simplex",
    inputs: [
      { label: "Supply/Demand Array", name: "supplyDemandData", type: "textarea" }
    ],
    desc: "Solves for minimum cost flow with simplex."
  },
  {
    id: "shortest-path",
    name: "Shortest Path",
    inputs: [
      { label: "Adjacency Matrix", name: "adjacencyMatrix", type: "textarea" }
    ],
    desc: "Compute the shortest path through the network."
  },
  {
    id: "capacitated-flow",
    name: "Capacitated Flow",
    inputs: [
      { label: "Node Capacities", name: "nodeCaps", type: "textarea" },
      { label: "Edge Capacities", name: "edgeCaps", type: "textarea" }
    ],
    desc: "Flow calculation subject to node or edge capacity restrictions."
  },
  {
    id: "multi-commodity-flow",
    name: "Multi-Commodity Flow",
    inputs: [
      { label: "Commodity List", name: "commodityData", type: "textarea" }
    ],
    desc: "Support for multi-product flows by commodity."
  }
];

// Example data for nodes, edges, commodities
const exampleNodes = [
  { id: "N1", name: "Factory", type: "source", capacity: 1000, demand: 0, latitude: -1.3, longitude: 36.8 },
  { id: "N2", name: "Warehouse", type: "intermediate", capacity: 500, demand: 0, latitude: -1.2, longitude: 36.9 },
  { id: "N3", name: "Retailer", type: "sink", capacity: 0, demand: 800, latitude: -1.1, longitude: 37.0 }
];
const exampleEdges = [
  { id: "E1", from: "N1", to: "N2", capacity: 500, cost: 10, distance: 50 },
  { id: "E2", from: "N2", to: "N3", capacity: 400, cost: 8, distance: 30 }
];
const exampleCommodities = [
  { id: "C1", name: "Product A", source: "N1", sink: "N3", demand: 800 }
];

export function EnterpriseNetworkCalculators() {
  const [activeTab, setActiveTab] = useState("network");
  const [nodes, setNodes] = useState(exampleNodes);
  const [edges, setEdges] = useState(exampleEdges);
  const [commodities, setCommodities] = useState(exampleCommodities);
  const [scenarioName, setScenarioName] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();
  const nodeFileRef = useRef();
  const edgeFileRef = useRef();
  const commodityFileRef = useRef();
  const [loading, setLoading] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState("");
  const [comparisonScenario, setComparisonScenario] = useState(null);
  const [comparisonScenarioId, setComparisonScenarioId] = useState("");
  const [showComparison, setShowComparison] = useState(false);
  const [activeModel, setActiveModel] = useState("network-optimization");

  // Add/edit/remove logic for nodes
  const addNode = () => setNodes([...nodes, { id: `N${nodes.length+1}`, name: "", type: "source", capacity: 0, demand: 0, latitude: 0, longitude: 0 }]);
  const updateNode = (idx, field, value) => setNodes(nodes.map((n, i) => i === idx ? { ...n, [field]: value } : n));
  const removeNode = idx => setNodes(nodes.filter((_, i) => i !== idx));
  // Add/edit/remove logic for edges
  const addEdge = () => setEdges([...edges, { id: `E${edges.length+1}`, from: "", to: "", capacity: 0, cost: 0, distance: 0 }]);
  const updateEdge = (idx, field, value) => setEdges(edges.map((e, i) => i === idx ? { ...e, [field]: value } : e));
  const removeEdge = idx => setEdges(edges.filter((_, i) => i !== idx));
  // Add/edit/remove logic for commodities
  const addCommodity = () => setCommodities([...commodities, { id: `C${commodities.length+1}`, name: "", source: "", sink: "", demand: 0 }]);
  const updateCommodity = (idx, field, value) => setCommodities(commodities.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  const removeCommodity = idx => setCommodities(commodities.filter((_, i) => i !== idx));

  // Import/export handlers
  const importCSV = (type, file) => {
    Papa.parse(file, {
      header: true,
      complete: results => {
        if (type === "nodes") setNodes(results.data);
        if (type === "edges") setEdges(results.data);
        if (type === "commodities") setCommodities(results.data);
      }
    });
  };
  const exportCSV = (type) => {
    let data = type === "nodes" ? nodes : type === "edges" ? edges : commodities;
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Validation
  const validate = () => {
    if (!scenarioName) return "Scenario name is required.";
    if (nodes.length < 2) return "At least two nodes are required.";
    if (edges.length < 1) return "At least one edge is required.";
    const nodeIds = new Set();
    for (const n of nodes) {
      if (!n.id) return "All nodes must have an ID.";
      if (nodeIds.has(n.id)) return "Node IDs must be unique.";
      nodeIds.add(n.id);
    }
    const edgeIds = new Set();
    for (const e of edges) {
      if (!e.id) return "All edges must have an ID.";
      if (edgeIds.has(e.id)) return "Edge IDs must be unique.";
      edgeIds.add(e.id);
    }
    return "";
  };

  // Supabase save/load
  const saveScenario = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    const user = supabase.auth.getUser();
    const project_id = "default-project"; // Replace with real project selection
    const user_id = user?.id || "demo-user";
    const { error: dbError } = await supabase.from("network_optimizations").insert({
      project_id,
      user_id,
      network_graph: { nodes, edges, commodities },
      optimization_params: {},
      metrics: null,
      resilience_metrics: null,
      multi_echelon_settings: null,
      as_is_snapshot: null,
      optimized_snapshot: null,
      scenario_name: scenarioName
    });
    if (dbError) setError("Failed to save scenario.");
    else toast({ title: "Scenario saved!" });
  };

  // Contextual help and example data
  const loadExample = () => {
    setNodes(exampleNodes);
    setEdges(exampleEdges);
    setCommodities(exampleCommodities);
    setScenarioName("Example Scenario");
    setError("");
    toast({ title: "Example data loaded" });
  };

  const runOptimization = async () => {
    setLoading(true);
    setError("");
    setOptimizationResult(null);
    try {
      const { data, error } = await supabase.functions.invoke('optimization-engine', {
        body: { nodes, edges, commodities }
      });
      if (error) {
        setError("Optimization failed: " + error.message);
      } else {
        setOptimizationResult(data);
      }
    } catch (err) {
      setError("Optimization failed: " + (err.message || err.toString()));
    } finally {
      setLoading(false);
    }
  };

  const loadScenarios = async () => {
    const { data, error } = await supabase.from("network_optimizations").select("id, scenario_name");
    if (data) setScenarios(data);
  };
  const loadScenarioDetails = async (id) => {
    const { data, error } = await supabase.from("network_optimizations").select("*").eq("id", id).single();
    if (data) {
      setNodes(data.network_graph.nodes);
      setEdges(data.network_graph.edges);
      setCommodities(data.network_graph.commodities);
      setScenarioName(data.scenario_name);
    }
  };

  const loadComparisonScenario = async (id) => {
    const { data, error } = await supabase.from("network_optimizations").select("*").eq("id", id).single();
    if (data) {
      setComparisonScenario(data);
      setShowComparison(true);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Enterprise Network Optimization Suite</h2>
      <div className="mb-4 flex gap-2 items-center">
        <Label htmlFor="scenarioName">Scenario Name:</Label>
        <Input id="scenarioName" value={scenarioName} onChange={e => setScenarioName(e.target.value)} placeholder="Enter scenario name" className="w-64" />
        <Button onClick={loadExample} variant="outline">Load Example</Button>
        <Button onClick={saveScenario} variant="default">Save Scenario</Button>
      </div>
      <div className="mb-4 text-sm text-muted-foreground">
        <span>Define your network nodes, edges, and (optionally) commodities. Use the tables below to add/edit/remove items. Import/export data as needed. Advanced options and constraints are available below.</span>
      </div>
      {error && <div className="mb-2 text-red-600">{error}</div>}
      {/* Nodes Table */}
      <Card className="mb-6">
        <CardHeader><CardTitle>Nodes</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-2">
            <Button variant="outline" onClick={addNode}>Add Node</Button>
            <Button variant="outline" onClick={() => exportCSV("nodes")}>Export CSV</Button>
            <input type="file" accept=".csv" ref={nodeFileRef} style={{ display: "none" }} onChange={e => e.target.files && importCSV("nodes", e.target.files[0])} />
            <Button variant="outline" onClick={() => nodeFileRef.current && nodeFileRef.current.click()}>Import CSV</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Demand</TableHead>
                <TableHead>Latitude</TableHead>
                <TableHead>Longitude</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nodes.map((node, idx) => (
                <TableRow key={node.id}>
                  <TableCell><Input value={node.id} onChange={e => updateNode(idx, "id", e.target.value)} /></TableCell>
                  <TableCell><Input value={node.name} onChange={e => updateNode(idx, "name", e.target.value)} /></TableCell>
                  <TableCell>
                    <select value={node.type} onChange={e => updateNode(idx, "type", e.target.value)} className="border rounded p-1">
                      <option value="source">Source</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="sink">Sink</option>
                    </select>
                  </TableCell>
                  <TableCell><Input type="number" value={node.capacity} onChange={e => updateNode(idx, "capacity", Number(e.target.value))} /></TableCell>
                  <TableCell><Input type="number" value={node.demand} onChange={e => updateNode(idx, "demand", Number(e.target.value))} /></TableCell>
                  <TableCell><Input type="number" value={node.latitude} onChange={e => updateNode(idx, "latitude", Number(e.target.value))} /></TableCell>
                  <TableCell><Input type="number" value={node.longitude} onChange={e => updateNode(idx, "longitude", Number(e.target.value))} /></TableCell>
                  <TableCell><Button variant="destructive" onClick={() => removeNode(idx)}>Remove</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Edges Table */}
      <Card className="mb-6">
        <CardHeader><CardTitle>Edges</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-2">
            <Button variant="outline" onClick={addEdge}>Add Edge</Button>
            <Button variant="outline" onClick={() => exportCSV("edges")}>Export CSV</Button>
            <input type="file" accept=".csv" ref={edgeFileRef} style={{ display: "none" }} onChange={e => e.target.files && importCSV("edges", e.target.files[0])} />
            <Button variant="outline" onClick={() => edgeFileRef.current && edgeFileRef.current.click()}>Import CSV</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {edges.map((edge, idx) => (
                <TableRow key={edge.id}>
                  <TableCell><Input value={edge.id} onChange={e => updateEdge(idx, "id", e.target.value)} /></TableCell>
                  <TableCell><Input value={edge.from} onChange={e => updateEdge(idx, "from", e.target.value)} /></TableCell>
                  <TableCell><Input value={edge.to} onChange={e => updateEdge(idx, "to", e.target.value)} /></TableCell>
                  <TableCell><Input type="number" value={edge.capacity} onChange={e => updateEdge(idx, "capacity", Number(e.target.value))} /></TableCell>
                  <TableCell><Input type="number" value={edge.cost} onChange={e => updateEdge(idx, "cost", Number(e.target.value))} /></TableCell>
                  <TableCell><Input type="number" value={edge.distance} onChange={e => updateEdge(idx, "distance", Number(e.target.value))} /></TableCell>
                  <TableCell><Button variant="destructive" onClick={() => removeEdge(idx)}>Remove</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Commodities Table */}
      <Card className="mb-6">
        <CardHeader><CardTitle>Commodities</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-2">
            <Button variant="outline" onClick={addCommodity}>Add Commodity</Button>
            <Button variant="outline" onClick={() => exportCSV("commodities")}>Export CSV</Button>
            <input type="file" accept=".csv" ref={commodityFileRef} style={{ display: "none" }} onChange={e => e.target.files && importCSV("commodities", e.target.files[0])} />
            <Button variant="outline" onClick={() => commodityFileRef.current && commodityFileRef.current.click()}>Import CSV</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Sink</TableHead>
                <TableHead>Demand</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commodities.map((commodity, idx) => (
                <TableRow key={commodity.id}>
                  <TableCell><Input value={commodity.id} onChange={e => updateCommodity(idx, "id", e.target.value)} /></TableCell>
                  <TableCell><Input value={commodity.name} onChange={e => updateCommodity(idx, "name", e.target.value)} /></TableCell>
                  <TableCell><Input value={commodity.source} onChange={e => updateCommodity(idx, "source", e.target.value)} /></TableCell>
                  <TableCell><Input value={commodity.sink} onChange={e => updateCommodity(idx, "sink", e.target.value)} /></TableCell>
                  <TableCell><Input type="number" value={commodity.demand} onChange={e => updateCommodity(idx, "demand", Number(e.target.value))} /></TableCell>
                  <TableCell><Button variant="destructive" onClick={() => removeCommodity(idx)}>Remove</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Advanced Options */}
      <Card className="mb-6">
        <CardHeader><CardTitle>Advanced Options, Constraints & Model Selection</CardTitle></CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="model-selection">
              <AccordionTrigger>Select Optimization Model ({activeModel})</AccordionTrigger>
              <AccordionContent>
                <Select onValueChange={setActiveModel} defaultValue={activeModel}>
                  <SelectTrigger><SelectValue placeholder="Select a model" /></SelectTrigger>
                  <SelectContent>
                    {modelFormulaRegistry.map(model => (
                      <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="constraints">
              <AccordionTrigger>Constraints</AccordionTrigger>
              <AccordionContent>
                {/* Dynamically render constraints based on selected model */}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="risk-sustainability">
              <AccordionTrigger>Risk & Sustainability</AccordionTrigger>
              <AccordionContent>
                {/* Add fields for risk factors, sustainability weights, etc. */}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      <div className="flex gap-2 mb-4">
        <Select onValueChange={loadScenarioDetails} onOpenChange={loadScenarios}>
          <SelectTrigger><SelectValue placeholder="Load Scenario" /></SelectTrigger>
          <SelectContent>{scenarios.map(s => <SelectItem key={s.id} value={s.id}>{s.scenario_name}</SelectItem>)}</SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Compare</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="space-y-2">
              <Label>Select scenario to compare:</Label>
              <Select onValueChange={loadComparisonScenario} onOpenChange={loadScenarios}>
                <SelectTrigger><SelectValue placeholder="Select Scenario" /></SelectTrigger>
                <SelectContent>{scenarios.map(s => <SelectItem key={s.id} value={s.id}>{s.scenario_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Button className="mt-4" variant="default" onClick={runOptimization} disabled={loading}>
        {loading ? "Running..." : "Run Optimization"}
      </Button>
      {optimizationResult && (
        <Card className="mt-4">
          <CardHeader><CardTitle>Optimization Results</CardTitle></CardHeader>
          <CardContent>
            <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(optimizationResult, null, 2)}</pre>
          </CardContent>
        </Card>
      )}
      {showComparison && comparisonScenario && (
        <TableDiff base={optimizationResult} compare={comparisonScenario.optimization_results} />
      )}
    </div>
  );
}

export default EnterpriseNetworkCalculators;
