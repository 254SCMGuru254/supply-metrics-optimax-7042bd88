
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Lightbulb, CheckCircle } from "lucide-react";

interface PerformanceTabProps {
  performanceByComplexity?: Record<string, number>;
  recommendations?: string[];
}

export const PerformanceTab = ({ performanceByComplexity, recommendations }: PerformanceTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance by Complexity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {performanceByComplexity && (
            <div className="space-y-3">
              {Object.entries(performanceByComplexity).map(([complexity, time]) => (
                <div key={complexity} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{complexity}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={Math.min((time as number) / 100, 100)} className="w-20 h-2" />
                    <span className="text-sm text-gray-500">{((time as number) / 1000).toFixed(1)}s</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Optimization Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recommendations?.map((rec: string, index: number) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{rec}</span>
              </div>
            )) || (
              <div className="text-sm text-gray-500">No recommendations available</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
