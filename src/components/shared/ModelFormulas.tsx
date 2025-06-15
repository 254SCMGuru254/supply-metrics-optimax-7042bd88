
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { modelFormulaRegistry, type SupplyChainModel } from "@/data/modelFormulaRegistry";
import { cn } from "@/lib/utils";

interface ModelFormulasProps {
  modelId: string;
}

function BadgeWithText({ variant, children }: { variant: "default" | "outline" | "secondary" | "destructive", children: React.ReactNode }) {
  return (
    <div className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
      variant === "outline" ? "border-current" : "border-transparent"
    )}>
      {children}
    </div>
  );
}

export function ModelFormulas({ modelId }: ModelFormulasProps) {
  const model = modelFormulaRegistry.find((m) => m.id === modelId);

  if (!model) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>Available Formulas</div>
          <BadgeWithText variant="outline">{model.formulas.length} formulas</BadgeWithText>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {model.formulas.map((formula) => (
            <Card key={formula.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{formula.name}</h3>
                <BadgeWithText variant="outline">{formula.complexity}</BadgeWithText>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{formula.description}</p>
              {formula.formula && (
                <div className="bg-muted p-3 rounded-md mb-3">
                  <code className="text-sm">{formula.formula}</code>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Accuracy:</span> {formula.accuracy}
                </div>
                <div>
                  <span className="font-medium">Use Case:</span> {formula.useCase}
                </div>
              </div>
              {formula.inputs && formula.inputs.length > 0 && (
                <div className="mt-3">
                  <h4 className="font-medium text-sm mb-1">Inputs:</h4>
                  <ul className="text-sm text-muted-foreground list-disc pl-4">
                    {formula.inputs.map((input) => (
                      <li key={input.name}>
                        {input.label}
                        {input.unit && ` (${input.unit})`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {formula.outputs && formula.outputs.length > 0 && (
                <div className="mt-3">
                  <h4 className="font-medium text-sm mb-1">Outputs:</h4>
                  <ul className="text-sm text-muted-foreground list-disc pl-4">
                    {formula.outputs.map((output) => (
                      <li key={output.name}>
                        {output.label}
                        {output.unit && ` (${output.unit})`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
