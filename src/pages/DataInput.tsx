
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NodeForm } from "@/components/forms/NodeForm";
import { DemandPointForm } from "@/components/forms/DemandPointForm";
import { RouteForm } from "@/components/forms/RouteForm";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  LayoutGrid, 
  Network, 
  Activity, 
  Box, 
  Truck, 
  Target, 
  Building2
} from "lucide-react";

const DataInput = () => {
  const navigate = useNavigate();
  const [activeModel, setActiveModel] = useState<string>("general");

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Data Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Select Optimization Model</h2>
          <p className="mb-4 text-muted-foreground">
            Choose the optimization model to configure specific data inputs required for each analysis method.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Button 
              variant={activeModel === "general" ? "default" : "outline"} 
              className="flex items-center justify-start gap-2 p-4 h-auto"
              onClick={() => setActiveModel("general")}
            >
              <LayoutGrid className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">General Data</div>
                <div className="text-sm text-muted-foreground">Base network data</div>
              </div>
            </Button>
            
            <Button 
              variant={activeModel === "cog" ? "default" : "outline"} 
              className="flex items-center justify-start gap-2 p-4 h-auto"
              onClick={() => setActiveModel("cog")}
            >
              <Target className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Center of Gravity</div>
                <div className="text-sm text-muted-foreground">Facility location</div>
              </div>
            </Button>
            
            <Button 
              variant={activeModel === "network" ? "default" : "outline"} 
              className="flex items-center justify-start gap-2 p-4 h-auto"
              onClick={() => setActiveModel("network")}
            >
              <Network className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Network Flow</div>
                <div className="text-sm text-muted-foreground">Optimal routing</div>
              </div>
            </Button>
            
            <Button 
              variant={activeModel === "simulation" ? "default" : "outline"} 
              className="flex items-center justify-start gap-2 p-4 h-auto"
              onClick={() => setActiveModel("simulation")}
            >
              <Activity className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Simulation</div>
                <div className="text-sm text-muted-foreground">Stochastic analysis</div>
              </div>
            </Button>
            
            <Button 
              variant={activeModel === "heuristic" ? "default" : "outline"} 
              className="flex items-center justify-start gap-2 p-4 h-auto"
              onClick={() => setActiveModel("heuristic")}
            >
              <Box className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Heuristic</div>
                <div className="text-sm text-muted-foreground">Approximate solutions</div>
              </div>
            </Button>
            
            <Button 
              variant={activeModel === "isohedron" ? "default" : "outline"} 
              className="flex items-center justify-start gap-2 p-4 h-auto"
              onClick={() => setActiveModel("isohedron")}
            >
              <Building2 className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Isohedron</div>
                <div className="text-sm text-muted-foreground">Spatial optimization</div>
              </div>
            </Button>
          </div>
        </div>
      </Card>

      {activeModel === "general" && (
        <Card className="p-6">
          <Tabs defaultValue="nodes">
            <TabsList className="mb-6">
              <TabsTrigger value="nodes">Supply Nodes</TabsTrigger>
              <TabsTrigger value="demand">Demand Points</TabsTrigger>
              <TabsTrigger value="routes">Routes</TabsTrigger>
            </TabsList>
            <TabsContent value="nodes">
              <NodeForm />
            </TabsContent>
            <TabsContent value="demand">
              <DemandPointForm />
            </TabsContent>
            <TabsContent value="routes">
              <RouteForm />
            </TabsContent>
          </Tabs>
        </Card>
      )}

      {activeModel === "cog" && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Center of Gravity Data</h2>
          <Tabs defaultValue="demand-weights">
            <TabsList className="mb-6">
              <TabsTrigger value="demand-weights">Demand Weights</TabsTrigger>
              <TabsTrigger value="distance-metrics">Distance Metrics</TabsTrigger>
              <TabsTrigger value="cost-factors">Cost Factors</TabsTrigger>
            </TabsList>
            <TabsContent value="demand-weights">
              <p className="text-muted-foreground mb-4">
                Configure demand weights for Center of Gravity calculation. Weights determine the "pull" of each demand point.
              </p>
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">Coming soon - Use General Data demand points for now.</p>
              </div>
            </TabsContent>
            <TabsContent value="distance-metrics">
              <p className="text-muted-foreground mb-4">
                Set up distance calculation methods (Euclidean, Manhattan, etc.) for the analysis.
              </p>
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">Coming soon - Use default Euclidean distance for now.</p>
              </div>
            </TabsContent>
            <TabsContent value="cost-factors">
              <p className="text-muted-foreground mb-4">
                Define cost factors that vary with distance for a more accurate facility location.
              </p>
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">Coming soon - Using linear cost factors for now.</p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      )}
      
      {activeModel === "network" && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Network Flow Data</h2>
          <Tabs defaultValue="capacities">
            <TabsList className="mb-6">
              <TabsTrigger value="capacities">Node Capacities</TabsTrigger>
              <TabsTrigger value="flow-constraints">Flow Constraints</TabsTrigger>
              <TabsTrigger value="cost-matrix">Cost Matrix</TabsTrigger>
            </TabsList>
            <TabsContent value="capacities">
              <p className="text-muted-foreground mb-4">
                Define capacity constraints for each node in the network.
              </p>
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">Coming soon - Use General Data node capacities for now.</p>
              </div>
            </TabsContent>
            <TabsContent value="flow-constraints">
              <p className="text-muted-foreground mb-4">
                Set minimum and maximum flow constraints for each route in the network.
              </p>
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">Coming soon - Only using capacity constraints for now.</p>
              </div>
            </TabsContent>
            <TabsContent value="cost-matrix">
              <p className="text-muted-foreground mb-4">
                Upload or define a cost matrix for transportation between nodes.
              </p>
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">Coming soon - Using General Data route costs for now.</p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      )}
      
      {activeModel === "simulation" && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Simulation Data</h2>
          <Tabs defaultValue="demand-patterns">
            <TabsList className="mb-6">
              <TabsTrigger value="demand-patterns">Demand Patterns</TabsTrigger>
              <TabsTrigger value="lead-times">Lead Times</TabsTrigger>
              <TabsTrigger value="service-levels">Service Levels</TabsTrigger>
            </TabsList>
            <TabsContent value="demand-patterns">
              <p className="text-muted-foreground mb-4">
                Define demand patterns and variability for stochastic simulation.
              </p>
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">Coming soon - Using normal distribution with coefficient of variation 0.3 for now.</p>
              </div>
            </TabsContent>
            <TabsContent value="lead-times">
              <p className="text-muted-foreground mb-4">
                Set up lead time distributions for more realistic supply chain simulation.
              </p>
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">Coming soon - Using General Data transit times for now.</p>
              </div>
            </TabsContent>
            <TabsContent value="service-levels">
              <p className="text-muted-foreground mb-4">
                Configure target service levels for inventory optimization.
              </p>
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">Coming soon - Using default 95% service level for now.</p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      )}
      
      {activeModel === "heuristic" && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Heuristic Algorithm Data</h2>
          <Tabs defaultValue="algorithm-params">
            <TabsList className="mb-6">
              <TabsTrigger value="algorithm-params">Algorithm Parameters</TabsTrigger>
              <TabsTrigger value="initial-solution">Initial Solution</TabsTrigger>
              <TabsTrigger value="stopping-criteria">Stopping Criteria</TabsTrigger>
            </TabsList>
            <TabsContent value="algorithm-params">
              <p className="text-muted-foreground mb-4">
                Configure algorithm-specific parameters for the heuristic solver.
              </p>
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">Coming soon - Using default parameters for now.</p>
              </div>
            </TabsContent>
            <TabsContent value="initial-solution">
              <p className="text-muted-foreground mb-4">
                Define or import initial solutions for the heuristic algorithm.
              </p>
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">Coming soon - Using random initial solution for now.</p>
              </div>
            </TabsContent>
            <TabsContent value="stopping-criteria">
              <p className="text-muted-foreground mb-4">
                Set stopping criteria like time limit, iteration count, or solution quality.
              </p>
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">Coming soon - Using default 1000 iterations or 30 second time limit for now.</p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      )}
      
      {activeModel === "isohedron" && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Isohedron Analysis Data</h2>
          <Tabs defaultValue="spatial-params">
            <TabsList className="mb-6">
              <TabsTrigger value="spatial-params">Spatial Parameters</TabsTrigger>
              <TabsTrigger value="territory-divisions">Territory Divisions</TabsTrigger>
              <TabsTrigger value="balance-factors">Balance Factors</TabsTrigger>
            </TabsList>
            <TabsContent value="spatial-params">
              <p className="text-muted-foreground mb-4">
                Configure spatial parameters for isohedron tessellation and optimization.
              </p>
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">Coming soon - Using default spatial parameters for now.</p>
              </div>
            </TabsContent>
            <TabsContent value="territory-divisions">
              <p className="text-muted-foreground mb-4">
                Define territory division methods and constraints.
              </p>
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">Coming soon - Using Voronoi tessellation for now.</p>
              </div>
            </TabsContent>
            <TabsContent value="balance-factors">
              <p className="text-muted-foreground mb-4">
                Set balance factors for territory size, demand, and other attributes.
              </p>
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">Coming soon - Using default equal weighting for now.</p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </div>
  );
};

export default DataInput;
