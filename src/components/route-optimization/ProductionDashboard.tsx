
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Lightbulb,
  Shield,
  BarChart3
} from "lucide-react";
import { PerformanceMonitoringService } from "@/services/PerformanceMonitoringService";
import { ErrorHandlingService } from "@/services/ErrorHandlingService";
import { OptimizationMonitoringService } from "@/services/OptimizationMonitoringService";

export const ProductionDashboard = () => {
  const [performanceReport, setPerformanceReport] = useState<any>(null);
  const [errorSummary, setErrorSummary] = useState<any>(null);
  const [activeOptimizations, setActiveOptimizations] = useState<any[]>([]);

  const performance = PerformanceMonitoringService.getInstance();
  const errorHandler = ErrorHandlingService.getInstance();
  const monitor = OptimizationMonitoringService.getInstance();

  useEffect(() => {
    const updateDashboard = () => {
      setPerformanceReport(performance.getPerformanceReport());
      setErrorSummary(errorHandler.getErrorSummary());
      setActiveOptimizations(monitor.getActiveOptimizations());
    };

    updateDashboard();
    const interval = setInterval(updateDashboard, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const getSystemHealthStatus = () => {
    if (!errorSummary || !performanceReport) return 'unknown';
    
    const criticalErrors = errorSummary.bySeverity?.critical || 0;
    const avgTime = performanceReport.averageTime || 0;
    
    if (criticalErrors > 0) return 'critical';
    if (avgTime > 30000) return 'warning'; // 30 seconds
    return 'healthy';
  };

  const healthStatus = getSystemHealthStatus();
  const healthColors = {
    healthy: 'bg-green-500',
    warning: 'bg-yellow-500',
    critical: 'bg-red-500',
    unknown: 'bg-gray-500'
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Production System Status
            <Badge className={`${healthColors[healthStatus]} text-white`}>
              {healthStatus.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="flex flex-col items-center justify-center p-4">
                <Activity className="h-6 w-6 text-blue-500 mb-2" />
                <div className="text-2xl font-bold">{activeOptimizations.length}</div>
                <div className="text-sm text-gray-500">Active Optimizations</div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200">
              <CardContent className="flex flex-col items-center justify-center p-4">
                <CheckCircle className="h-6 w-6 text-green-500 mb-2" />
                <div className="text-2xl font-bold">{performanceReport?.totalOptimizations || 0}</div>
                <div className="text-sm text-gray-500">Total Completed</div>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="flex flex-col items-center justify-center p-4">
                <Clock className="h-6 w-6 text-purple-500 mb-2" />
                <div className="text-2xl font-bold">
                  {performanceReport?.averageTime ? (performanceReport.averageTime / 1000).toFixed(1) : 0}s
                </div>
                <div className="text-sm text-gray-500">Avg Response Time</div>
              </CardContent>
            </Card>
            
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="flex flex-col items-center justify-center p-4">
                <AlertTriangle className="h-6 w-6 text-orange-500 mb-2" />
                <div className="text-2xl font-bold">{errorSummary?.total || 0}</div>
                <div className="text-sm text-gray-500">Total Errors</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Live Monitoring
          </TabsTrigger>
          <TabsTrigger value="errors" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Error Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance by Complexity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {performanceReport?.performanceByComplexity && (
                  <div className="space-y-3">
                    {Object.entries(performanceReport.performanceByComplexity).map(([complexity, time]) => (
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
                  {performanceReport?.recommendations?.map((rec: string, index: number) => (
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
        </TabsContent>

        <TabsContent value="monitoring">
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
        </TabsContent>

        <TabsContent value="errors">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};
