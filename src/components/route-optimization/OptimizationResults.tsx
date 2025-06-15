
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  MapPin, 
  Clock, 
  DollarSign, 
  Target,
  CheckCircle,
  AlertCircle,
  Download
} from "lucide-react";
import type { Route } from "@/components/map/MapTypes";

interface OptimizationResultsProps {
  results: {
    optimizedRoutes: Route[];
    totalCost: number;
    totalDistance: number;
    totalTime: number;
    efficiency: number;
    costSavings: number;
    recommendations: string[];
  } | null;
  originalRoutes: Route[];
  onApplyRoutes?: (routes: Route[]) => void;
  onExportResults?: () => void;
}

export const OptimizationResults = ({ 
  results, 
  originalRoutes, 
  onApplyRoutes,
  onExportResults 
}: OptimizationResultsProps) => {
  if (!results) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Optimization Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No optimization results yet. Run an optimization to see results.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const originalCost = originalRoutes.reduce((sum, route) => sum + route.cost, 0);
  const originalDistance = originalRoutes.reduce((sum, route) => {
    // Estimate distance from cost if not available
    return sum + (route.cost / 2.5); // Assuming 2.5 cost per km
  }, 0);
  const originalTime = originalRoutes.reduce((sum, route) => sum + route.transitTime, 0);

  const costImprovement = ((originalCost - results.totalCost) / originalCost) * 100;
  const distanceImprovement = ((originalDistance - results.totalDistance) / originalDistance) * 100;
  const timeImprovement = ((originalTime - results.totalTime) / originalTime) * 100;

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Optimization Results
            <Badge variant="default" className="bg-green-500">
              Success
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="flex flex-col items-center justify-center p-4">
                <DollarSign className="h-6 w-6 text-blue-500 mb-2" />
                <div className="text-2xl font-bold">${results.totalCost.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Total Cost</div>
                {costImprovement > 0 && (
                  <Badge variant="secondary" className="text-green-600 mt-1">
                    -{costImprovement.toFixed(1)}%
                  </Badge>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200">
              <CardContent className="flex flex-col items-center justify-center p-4">
                <MapPin className="h-6 w-6 text-green-500 mb-2" />
                <div className="text-2xl font-bold">{results.totalDistance.toFixed(0)} km</div>
                <div className="text-sm text-gray-500">Total Distance</div>
                {distanceImprovement > 0 && (
                  <Badge variant="secondary" className="text-green-600 mt-1">
                    -{distanceImprovement.toFixed(1)}%
                  </Badge>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="flex flex-col items-center justify-center p-4">
                <Clock className="h-6 w-6 text-purple-500 mb-2" />
                <div className="text-2xl font-bold">{results.totalTime.toFixed(1)}h</div>
                <div className="text-sm text-gray-500">Total Time</div>
                {timeImprovement > 0 && (
                  <Badge variant="secondary" className="text-green-600 mt-1">
                    -{timeImprovement.toFixed(1)}%
                  </Badge>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="flex flex-col items-center justify-center p-4">
                <TrendingUp className="h-6 w-6 text-orange-500 mb-2" />
                <div className="text-2xl font-bold">{results.efficiency}%</div>
                <div className="text-sm text-gray-500">Efficiency</div>
                <Badge variant="default" className="mt-1">
                  Optimized
                </Badge>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Route Efficiency</span>
                <span className="text-sm text-gray-500">{results.efficiency}%</span>
              </div>
              <Progress value={results.efficiency} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Cost Savings</span>
                <span className="text-sm text-gray-500">${results.costSavings.toLocaleString()}</span>
              </div>
              <Progress value={Math.min(results.costSavings / 1000 * 10, 100)} className="h-2" />
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            {onApplyRoutes && (
              <Button
                onClick={() => onApplyRoutes(results.optimizedRoutes)}
                className="flex-1"
              >
                Apply Optimized Routes
              </Button>
            )}
            {onExportResults && (
              <Button variant="outline" onClick={onExportResults}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {results.recommendations.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{recommendation}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
