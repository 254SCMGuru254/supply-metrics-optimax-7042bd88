
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Info } from "lucide-react";
import type { Node } from "@/components/map/MapTypes";

export interface CogRecommendationsProps {
  selectedApplication: string;
  cogResult: { lat: number; lng: number } | null;
  demandNodes: Node[];
}

export function CogRecommendations({ 
  selectedApplication, 
  cogResult, 
  demandNodes 
}: CogRecommendationsProps) {
  if (!cogResult) return null;

  const getApplicationRecommendations = () => {
    switch (selectedApplication) {
      case "warehouse":
        return {
          title: "Warehouse Location Recommendations",
          recommendations: [
            "Consider transportation infrastructure near the calculated location",
            "Evaluate land availability and zoning regulations",
            "Assess proximity to major highways and distribution networks",
            "Factor in labor availability and operational costs"
          ]
        };
      case "distribution":
        return {
          title: "Distribution Center Recommendations", 
          recommendations: [
            "Verify last-mile delivery capabilities from this location",
            "Consider seasonal demand variations in the calculation",
            "Evaluate cross-docking and consolidation opportunities",
            "Assess technology infrastructure requirements"
          ]
        };
      default:
        return {
          title: "Location Recommendations",
          recommendations: [
            "Validate the calculated location with real-world constraints",
            "Consider regulatory and environmental factors",
            "Evaluate infrastructure and accessibility",
            "Review cost-benefit analysis for the proposed location"
          ]
        };
    }
  };

  const { title, recommendations } = getApplicationRecommendations();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm">{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          The center of gravity calculation provides a mathematical optimum based on demand weights and distances. 
          Real-world implementation should consider additional factors like infrastructure, regulations, and operational constraints.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Implementation Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-1 text-sm">
              <li>1. Site selection and feasibility study</li>
              <li>2. Infrastructure assessment</li>
              <li>3. Cost-benefit analysis</li>
              <li>4. Regulatory compliance review</li>
              <li>5. Final location confirmation</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Key Considerations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Demand Points:</span>
                <Badge variant="secondary">{demandNodes.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Coverage Area:</span>
                <Badge variant="secondary">Regional</Badge>
              </div>
              <div className="flex justify-between">
                <span>Optimization:</span>
                <Badge variant="secondary">Distance-based</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
