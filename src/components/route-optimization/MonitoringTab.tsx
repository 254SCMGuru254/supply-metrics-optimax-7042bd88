
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface OptimizationProgress {
  id: string;
  status: string;
  stage: string;
  progress: number;
  estimatedCompletion?: Date;
}

interface MonitoringTabProps {
  activeOptimizations: OptimizationProgress[];
}

export const MonitoringTab = ({ activeOptimizations }: MonitoringTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Optimizations</CardTitle>
      </CardHeader>
      <CardContent>
        {activeOptimizations.length > 0 ? (
          <div className="space-y-4">
            {activeOptimizations.map((opt) => (
              <div key={opt.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Optimization {opt.id}</span>
                  <Badge variant={opt.status === 'running' ? 'default' : 'secondary'}>
                    {opt.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{opt.stage}</span>
                    <span>{opt.progress}%</span>
                  </div>
                  <Progress value={opt.progress} className="h-2" />
                  {opt.estimatedCompletion && (
                    <div className="text-xs text-gray-500">
                      ETA: {new Date(opt.estimatedCompletion).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No active optimizations
          </div>
        )}
      </CardContent>
    </Card>
  );
};
