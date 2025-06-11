import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { modelFormulaRegistry } from "@/data/modelFormulaRegistry";
// Import your route optimization calculation functions here
// import { solveTSP, solveVRP, solveVRPTW } from "@/components/route-optimization/RouteOptimizationUtils";

const routeModel = modelFormulaRegistry.find(m => m.id === "route-optimization");

// Dynamic dispatcher for backend functions
const formulaDispatcher: Record<string, Function> = {
  // solveTSP: (values: any) => solveTSP(values),
  // solveVRP: (values: any) => solveVRP(values),
  // solveVRPTW: (values: any) => solveVRPTW(values),
};

const RouteOptimization = () => {
  const [selectedFormulaId, setSelectedFormulaId] = useState(routeModel?.formulas[0]?.id || "");
  const [inputValues, setInputValues] = useState<Record<string, any>>({});
  const [result, setResult] = useState<any>(null);

  if (!routeModel) return <div>Model not found.</div>;
  const selectedFormula = routeModel.formulas.find(f => f.id === selectedFormulaId);

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Route Optimization</h1>
      <p className="text-muted-foreground mb-6">Optimize delivery routes using advanced algorithms and constraints.</p>
      <div className="mb-6">
        <label className="block font-medium mb-2">Select Formula</label>
        <select
          className="border rounded px-3 py-2"
          value={selectedFormulaId}
          onChange={e => setSelectedFormulaId(e.target.value)}
        >
          {routeModel.formulas.map(formula => (
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
  );
};

export default RouteOptimization;
