
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Bolt } from "lucide-react";

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

export function EnterpriseNetworkCalculators() {
  const [activeTab, setActiveTab] = useState(formulas[0].id);
  const [inputs, setInputs] = useState({});
  const [result, setResult] = useState(null);

  const handleInputChange = (id, value) => {
    setInputs(inputs => ({ ...inputs, [id]: value }));
  };

  // Dummy result generator (replace with real backend)
  const handleRun = () => {
    setResult({
      status: "success",
      message: "Optimization complete.",
      output: { ...inputs }
    });
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 lg:grid-cols-6">
          {formulas.map(f => (
            <TabsTrigger key={f.id} value={f.id}>{f.name}</TabsTrigger>
          ))}
        </TabsList>
        {formulas.map(formula => (
          <TabsContent key={formula.id} value={formula.id}>
            <Card className="my-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bolt className="h-5 w-5" />
                  {formula.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleRun(); }}>
                  {formula.inputs.map(input => (
                    <div key={input.name}>
                      <label className="block text-sm font-medium mb-1">{input.label}:</label>
                      {input.type === "textarea" ? (
                        <textarea
                          value={inputs[input.name] || ""}
                          onChange={e => handleInputChange(input.name, e.target.value)}
                          className="w-full border rounded p-2"
                          rows={3}
                        />
                      ) : (
                        <input
                          type="text"
                          value={inputs[input.name] || ""}
                          onChange={e => handleInputChange(input.name, e.target.value)}
                          className="w-full border rounded p-2"
                        />
                      )}
                    </div>
                  ))}
                  <button
                    className="mt-2 bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                    type="submit"
                  >
                    Run
                  </button>
                </form>
                <div className="mt-4">
                  {result && (
                    <Card className="p-3 border border-primary bg-blue-50 mt-4">
                      <div className="font-semibold">Results:</div>
                      <pre className="text-xs">{JSON.stringify(result, null, 2)}</pre>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default EnterpriseNetworkCalculators;
