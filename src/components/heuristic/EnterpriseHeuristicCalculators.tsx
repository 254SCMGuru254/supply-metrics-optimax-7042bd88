
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// CHANGED: import { Bolt } with upper case B
import { Bolt } from "lucide-react";

const formulas = [
  {
    id: "simulated-annealing",
    name: "Simulated Annealing",
    inputs: [
      { label: "Initial Temperature", name: "initialTemp", type: "number" },
      { label: "Cooling Rate", name: "coolingRate", type: "number" }
    ],
    desc: "Metaheuristic for combinatorial optimization problems."
  },
  {
    id: "genetic-algorithm",
    name: "Genetic Algorithm",
    inputs: [
      { label: "Population Size", name: "populationSize", type: "number" },
      { label: "Generations", name: "generations", type: "number" }
    ],
    desc: "Evolutionary search algorithm using crossover/mutation."
  },
  {
    id: "particle-swarm",
    name: "Particle Swarm Optimization",
    inputs: [
      { label: "Number of Particles", name: "numParticles", type: "number" },
      { label: "Iterations", name: "iterations", type: "number" }
    ],
    desc: "Swarm-based optimization using velocity/social learning."
  },
  {
    id: "tabu-search",
    name: "Tabu Search",
    inputs: [
      { label: "Tabu List Size", name: "tabuListSize", type: "number" },
      { label: "Max Iterations", name: "maxIterations", type: "number" }
    ],
    desc: "Improvement algorithm to escape local optima."
  }
];

export function EnterpriseHeuristicCalculators() {
  const [activeTab, setActiveTab] = useState(formulas[0].id);
  const [inputs, setInputs] = useState({});
  const [result, setResult] = useState(null);

  const handleInputChange = (id, value) => {
    setInputs(inputs => ({ ...inputs, [id]: value }));
  };

  // Dummy result generator (replace with real backend/logic)
  const handleRun = () => {
    setResult({
      status: "success",
      message: "Heuristic run complete.",
      output: { ...inputs }
    });
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 lg:grid-cols-4">
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
                      <input
                        type="number"
                        value={inputs[input.name] || ""}
                        onChange={e => handleInputChange(input.name, e.target.value)}
                        className="w-full border rounded p-2"
                        min={0}
                      />
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

export default EnterpriseHeuristicCalculators;
