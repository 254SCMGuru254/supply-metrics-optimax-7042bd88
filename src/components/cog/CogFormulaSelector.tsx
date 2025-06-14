
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export type CogFormula = "weighted" | "geometric" | "economic" | "euclidean" | "haversine" | "manhattan" | "road-network" | "multi-criteria" | "seasonal-dynamic" | "risk-adjusted";

interface ModelFormula {
  id: string;
  name: string;
  description: string;
}

interface CogFormulaSelectorProps {
  formulas: ModelFormula[];
  selectedFormulaId: string;
  onFormulaChange: (formula: string) => void;
}

export function CogFormulaSelector({ 
  formulas,
  selectedFormulaId, 
  onFormulaChange 
}: CogFormulaSelectorProps) {
  return (
    <RadioGroup value={selectedFormulaId} onValueChange={onFormulaChange}>
      <div className="space-y-3">
        {formulas.map((formula) => (
          <div key={formula.id} className="flex items-center space-x-2">
            <RadioGroupItem value={formula.id} id={formula.id} />
            <Label htmlFor={formula.id} className="flex-1">
              <div className="font-medium">{formula.name}</div>
              <div className="text-sm text-muted-foreground">{formula.description}</div>
            </Label>
          </div>
        ))}
      </div>
    </RadioGroup>
  );
}
