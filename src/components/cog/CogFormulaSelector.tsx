
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export type CogFormula = "weighted" | "geometric" | "economic" | "euclidean";

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
    { id: "geometric", label: "Geometric Median", description: "Minimizes total distance" },
    { id: "economic", label: "Economic Center", description: "Cost-optimized location" },
    { id: "euclidean", label: "Euclidean Distance", description: "Straight-line distance optimization" }
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
