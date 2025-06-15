
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Activity, AlertTriangle } from "lucide-react";
import { PerformanceMonitoringService } from "@/services/PerformanceMonitoringService";
import { ErrorHandlingService } from "@/services/ErrorHandlingService";
import { OptimizationMonitoringService } from "@/services/OptimizationMonitoringService";
import { SystemStatusCard } from "./SystemStatusCard";
import { MetricsCards } from "./MetricsCards";
import { PerformanceTab } from "./PerformanceTab";
import { MonitoringTab } from "./MonitoringTab";
import { ErrorsTab } from "./ErrorsTab";

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
    const interval = setInterval(updateDashboard, 5000);

    return () => clearInterval(interval);
  }, []);

  const getSystemHealthStatus = () => {
    if (!errorSummary || !performanceReport) return 'unknown';
    
    const criticalErrors = errorSummary.bySeverity?.critical || 0;
    const avgTime = performanceReport.averageTime || 0;
    
    if (criticalErrors > 0) return 'critical';
    if (avgTime > 30000) return 'warning';
    return 'healthy';
  };

  const healthStatus = getSystemHealthStatus();

  return (
    <div className="space-y-6">
      <SystemStatusCard healthStatus={healthStatus} />
      
      <MetricsCards 
        activeOptimizations={activeOptimizations.length}
        totalOptimizations={performanceReport?.totalOptimizations || 0}
        averageTime={performanceReport?.averageTime || 0}
        totalErrors={errorSummary?.total || 0}
      />

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
          <PerformanceTab 
            performanceByComplexity={performanceReport?.performanceByComplexity}
            recommendations={performanceReport?.recommendations}
          />
        </TabsContent>

        <TabsContent value="monitoring">
          <MonitoringTab activeOptimizations={activeOptimizations} />
        </TabsContent>

        <TabsContent value="errors">
          <ErrorsTab 
            errorSummary={errorSummary}
            errorHandler={errorHandler}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
