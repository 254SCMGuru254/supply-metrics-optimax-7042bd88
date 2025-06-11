import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export type CogFormula = "weighted" | "geometric" | "economic" | "euclidean" | "haversine" | "manhattan" | "road-network" | "multi-criteria" | "seasonal-dynamic" | "risk-adjusted";

interface CogFormulaSelectorProps {
  selectedFormula: string;
  onFormulaChange: (formula: string) => void;
}

export function CogFormulaSelector({ 
  selectedFormula, 
  onFormulaChange 
}: CogFormulaSelectorProps) {
  const formulas = [
    { id: "weighted", label: "Weighted Average", description: "Standard demand-weighted calculation" },
    { id: "geometric", label: "Geometric Median", description: "Minimizes total distance (robust to outliers)" },
    { id: "economic", label: "Economic Center", description: "Cost-optimized location (cost-weighted)" },
    { id: "euclidean", label: "Euclidean Distance", description: "Straight-line distance optimization" },
    { id: "haversine", label: "Haversine (Great Circle)", description: "Accounts for Earth curvature (global)" },
    { id: "manhattan", label: "Manhattan Distance", description: "Grid-based (urban/city logistics)" },
    { id: "road-network", label: "Road Network", description: "Real road network distances (traffic-aware)" },
    { id: "multi-criteria", label: "Multi-Criteria", description: "Considers cost, time, capacity, environment" },
    { id: "seasonal-dynamic", label: "Dynamic Seasonal", description: "Adjusts for seasonal/temporal demand" },
    { id: "risk-adjusted", label: "Risk-Adjusted", description: "Incorporates risk factors (political, economic)" }
  ];

  return (
    <RadioGroup value={selectedFormula} onValueChange={onFormulaChange}>
      <div className="space-y-3">
        {formulas.map((formula) => (
          <div key={formula.id} className="flex items-center space-x-2">
            <RadioGroupItem value={formula.id} id={formula.id} />
            <Label htmlFor={formula.id} className="flex-1">
              <div className="font-medium">{formula.label}</div>
              <div className="text-sm text-muted-foreground">{formula.description}</div>
            </Label>
          </div>
        ))}
      </div>
    </RadioGroup>
  );
}
