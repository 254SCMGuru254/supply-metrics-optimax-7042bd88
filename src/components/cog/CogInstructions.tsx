
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, Calculator, Map, Target } from "lucide-react";

interface CogInstructionsProps {
  selectedApplication: string;
  selectedFormula: string;
}

export function CogInstructions({ selectedApplication, selectedFormula }: CogInstructionsProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Center of Gravity Analysis Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">What is Center of Gravity Analysis?</h4>
              <p className="text-sm text-muted-foreground">
                Center of Gravity (COG) analysis is a mathematical technique used to find the optimal location 
                for a facility (warehouse, distribution center, etc.) that minimizes transportation costs and 
                distances to demand points based on their weights or volumes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Mathematical Formula
                </h4>
                <div className="text-sm space-y-1">
                  <p><strong>X-coordinate:</strong> Σ(Wi × Xi) / ΣWi</p>
                  <p><strong>Y-coordinate:</strong> Σ(Wi × Yi) / ΣWi</p>
                  <p className="text-muted-foreground">Where Wi = weight/demand, Xi,Yi = coordinates</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Key Benefits
                </h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Minimizes transportation costs</li>
                  <li>• Optimizes service coverage</li>
                  <li>• Data-driven location decisions</li>
                  <li>• Scalable for multiple scenarios</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedApplication && (
        <Alert>
          <Map className="h-4 w-4" />
          <AlertDescription>
            <strong>Selected Application: {selectedApplication}</strong><br />
            The analysis will be optimized for {selectedApplication} location requirements with {selectedFormula} calculation method.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
