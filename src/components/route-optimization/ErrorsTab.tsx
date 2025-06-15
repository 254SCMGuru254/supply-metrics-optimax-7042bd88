
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ErrorHandlingService } from "@/services/ErrorHandlingService";

interface ErrorsTabProps {
  errorSummary: any;
  errorHandler: ErrorHandlingService;
}

export const ErrorsTab = ({ errorSummary, errorHandler }: ErrorsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Error Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {errorSummary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {Object.entries(errorSummary.bySeverity || {}).map(([severity, count]) => (
              <div key={severity} className="text-center">
                <div className="text-2xl font-bold">{count as number}</div>
                <div className="text-sm text-gray-500 capitalize">{severity}</div>
              </div>
            ))}
          </div>
        )}
        
        <div className="space-y-2">
          {errorHandler.getErrorHistory().slice(0, 5).map((error, index) => (
            <div key={index} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{error.code}</span>
                <Badge variant={error.severity === 'critical' ? 'destructive' : 'secondary'}>
                  {error.severity}
                </Badge>
              </div>
              <div className="text-sm text-gray-600">{error.message}</div>
              <div className="text-xs text-gray-400 mt-1">
                {error.timestamp.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
