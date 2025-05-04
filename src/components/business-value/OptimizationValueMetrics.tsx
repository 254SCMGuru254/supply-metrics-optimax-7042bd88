import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react";
import { useEffect, useState } from "react";

type MetricState = {
  value: number | string;
  unit: string;
  changeDirection?: "increase" | "decrease" | "neutral";
  changePercentage?: number;
};

type OptimizationMetric = {
  name: string;
  description: string;
  currentState: MetricState;
  estimatedState: MetricState;
  actualState?: MetricState;
};

type ModelMetrics = {
  modelName: string;
  description: string;
  metrics: OptimizationMetric[];
};

interface OptimizationValueMetricsProps {
  selectedModel?: string;
}

export const OptimizationValueMetrics = ({ selectedModel }: OptimizationValueMetricsProps) => {
  const [metricsData, setMetricsData] = useState<ModelMetrics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        // Fetch current state metrics from your backend
        const currentMetrics = await fetch('/api/metrics/current').then(res => res.json());
        
        // Get model recommendations and estimated improvements
        const estimatedMetrics = await fetch('/api/metrics/estimated').then(res => res.json());
        
        // Get actual implementation results if available
        const actualMetrics = await fetch('/api/metrics/actual').then(res => res.json());

        // Transform the data into the required format
        const transformedMetrics = transformMetricsData(currentMetrics, estimatedMetrics, actualMetrics);
        setMetricsData(transformedMetrics);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [selectedModel]);

  const getChangeIcon = (direction?: string) => {
    if (direction === "increase") return <ArrowUpIcon className="text-green-500 h-4 w-4" />;
    if (direction === "decrease") return <ArrowDownIcon className="text-green-500 h-4 w-4" />;
    return <MinusIcon className="text-gray-500 h-4 w-4" />;
  };

  const renderMetricValue = (metric: MetricState) => (
    <div className="flex items-center gap-1">
      <span className="text-2xl font-semibold">{metric.value}</span>
      <span className="text-sm text-muted-foreground">{metric.unit}</span>
      {metric.changePercentage !== undefined && (
        <span className="flex items-center ml-2 text-sm">
          {getChangeIcon(metric.changeDirection)}
          {metric.changePercentage}%
        </span>
      )}
    </div>
  );

  const transformMetricsData = (
    currentMetrics: any[],
    estimatedMetrics: any[],
    actualMetrics: any[]
  ): ModelMetrics[] => {
    // Transform the data into the required format
    return currentMetrics.map((currentMetric, index) => ({
      modelName: currentMetric.modelName,
      description: currentMetric.description,
      metrics: currentMetric.metrics.map((metric: any, metricIndex: number) => ({
        name: metric.name,
        description: metric.description,
        currentState: metric,
        estimatedState: estimatedMetrics[index]?.metrics.find((m: any) => m.name === metric.name) || {},
        actualState: actualMetrics[index]?.metrics.find((m: any) => m.name === metric.name) || undefined,
      })),
    }));
  };

  const filteredMetrics = selectedModel 
    ? metricsData.filter(model => model.modelName === selectedModel)
    : metricsData;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Business Value Metrics</CardTitle>
          <CardDescription>
            Measurable outcomes before and after optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Tabs defaultValue={filteredMetrics[0]?.modelName || "route-optimization"} className="space-y-4">
              <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {metricsData.map(model => (
                  <TabsTrigger 
                    key={model.modelName} 
                    value={model.modelName}
                    className="text-xs md:text-sm"
                  >
                    {model.modelName.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {metricsData.map(model => (
                <TabsContent key={model.modelName} value={model.modelName} className="space-y-4">
                  <p className="text-muted-foreground">{model.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {model.metrics.map((metric, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-md">{metric.name}</CardTitle>
                          <CardDescription className="text-xs">{metric.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Current State</p>
                            {renderMetricValue(metric.currentState)}
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Estimated Improvement</p>
                            {renderMetricValue(metric.estimatedState)}
                          </div>
                          
                          {metric.actualState && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Actual Results</p>
                              {renderMetricValue(metric.actualState)}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
