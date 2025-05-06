
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownIcon, ArrowUpIcon, FileDown, Loader2, MinusIcon } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";

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
  const [exportingPdf, setExportingPdf] = useState(false);
  const metricsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        // Fetch current state metrics from your backend
        const response = await fetch('/api/metrics/current');
        if (!response.ok) {
          // If API is not available, use sample data
          setTimeout(() => {
            setMetricsData(getSampleMetricsData());
            setLoading(false);
          }, 1000);
          return;
        }
        
        const currentMetrics = await response.json();
        
        // Get model recommendations and estimated improvements
        const estimatedResponse = await fetch('/api/metrics/estimated');
        const estimatedMetrics = await estimatedResponse.json();
        
        // Get actual implementation results if available
        const actualResponse = await fetch('/api/metrics/actual');
        const actualMetrics = await actualResponse.json();

        // Transform the data into the required format
        const transformedMetrics = transformMetricsData(currentMetrics, estimatedMetrics, actualMetrics);
        setMetricsData(transformedMetrics);
      } catch (error) {
        console.error('Error fetching metrics:', error);
        // Fall back to sample data if API fails
        setMetricsData(getSampleMetricsData());
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [selectedModel]);

  const handleExportPdf = async () => {
    if (!metricsRef.current) {
      toast({
        variant: "destructive",
        title: "Export Error",
        description: "Could not find content to export"
      });
      return;
    }

    try {
      setExportingPdf(true);
      
      // This would be imported from your exportToPdf utility
      const { exportToPdf } = await import('@/utils/exportToPdf');
      
      await exportToPdf(
        'metrics-content', 
        `${selectedModel || 'optimization'}-metrics-report`
      );
      
      toast({
        title: "Export Complete",
        description: "The metrics report has been exported as PDF"
      });
    } catch (error) {
      console.error("PDF export error:", error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "An error occurred while generating the PDF"
      });
    } finally {
      setExportingPdf(false);
    }
  };

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

  // Sample data for when the API is not available
  const getSampleMetricsData = (): ModelMetrics[] => [
    {
      modelName: "route-optimization",
      description: "Route optimization performance metrics before and after optimization",
      metrics: [
        {
          name: "Transportation Cost",
          description: "Cost per unit for transportation across network",
          currentState: { value: 3.75, unit: "$/unit" },
          estimatedState: { 
            value: 2.85, 
            unit: "$/unit", 
            changeDirection: "decrease", 
            changePercentage: 24
          }
        },
        {
          name: "Vehicle Utilization",
          description: "Percentage of available vehicle capacity used",
          currentState: { value: 68.5, unit: "%" },
          estimatedState: { 
            value: 85.2, 
            unit: "%", 
            changeDirection: "increase", 
            changePercentage: 24.4
          }
        },
        {
          name: "On-Time Delivery",
          description: "Percentage of deliveries completed on time",
          currentState: { value: 82.3, unit: "%" },
          estimatedState: { 
            value: 94.5, 
            unit: "%", 
            changeDirection: "increase", 
            changePercentage: 14.8
          }
        },
        {
          name: "Average Transit Time",
          description: "Time taken to transport goods between locations",
          currentState: { value: 4.8, unit: "hours" },
          estimatedState: { 
            value: 3.6, 
            unit: "hours", 
            changeDirection: "decrease", 
            changePercentage: 25
          }
        },
        {
          name: "Money Saved",
          description: "Estimated money saved if optimization is adopted",
          currentState: { value: 0, unit: "USD" },
          estimatedState: { 
            value: 156500, 
            unit: "USD", 
            changeDirection: "increase"
          },
          actualState: {
            value: 142300,
            unit: "USD",
            changeDirection: "increase",
            changePercentage: 91
          }
        }
      ]
    },
    {
      modelName: "inventory-management",
      description: "Inventory management performance metrics before and after optimization",
      metrics: [
        {
          name: "Inventory Holding Cost",
          description: "Annual cost to hold inventory as % of inventory value",
          currentState: { value: 24.5, unit: "%" },
          estimatedState: { 
            value: 18.2, 
            unit: "%", 
            changeDirection: "decrease", 
            changePercentage: 25.7
          }
        },
        {
          name: "Stockout Rate",
          description: "Percentage of demand that cannot be fulfilled immediately",
          currentState: { value: 8.6, unit: "%" },
          estimatedState: { 
            value: 2.3, 
            unit: "%", 
            changeDirection: "decrease", 
            changePercentage: 73.3
          }
        },
        {
          name: "Inventory Turnover",
          description: "Number of times inventory is sold/replaced in a year",
          currentState: { value: 6.2, unit: "turns/year" },
          estimatedState: { 
            value: 9.8, 
            unit: "turns/year", 
            changeDirection: "increase", 
            changePercentage: 58.1
          }
        },
        {
          name: "Service Level",
          description: "Percentage of time products are in stock",
          currentState: { value: 91.4, unit: "%" },
          estimatedState: { 
            value: 97.7, 
            unit: "%", 
            changeDirection: "increase", 
            changePercentage: 6.9
          }
        },
        {
          name: "Money Saved",
          description: "Estimated money saved if optimization is adopted",
          currentState: { value: 0, unit: "USD" },
          estimatedState: { 
            value: 325000, 
            unit: "USD", 
            changeDirection: "increase"
          }
        }
      ]
    },
    {
      modelName: "network-optimization",
      description: "Network optimization performance metrics before and after optimization",
      metrics: [
        {
          name: "Network Throughput",
          description: "Volume of goods moving through network per day",
          currentState: { value: 3250, unit: "units" },
          estimatedState: { 
            value: 4100, 
            unit: "units", 
            changeDirection: "increase", 
            changePercentage: 26.2
          }
        },
        {
          name: "Bottleneck Count",
          description: "Number of bottleneck points in network",
          currentState: { value: 7, unit: "points" },
          estimatedState: { 
            value: 2, 
            unit: "points", 
            changeDirection: "decrease", 
            changePercentage: 71.4
          }
        },
        {
          name: "Resource Utilization",
          description: "Average capacity utilization across facilities",
          currentState: { value: 65.3, unit: "%" },
          estimatedState: { 
            value: 82.7, 
            unit: "%", 
            changeDirection: "increase", 
            changePercentage: 26.7
          }
        },
        {
          name: "Network Reliability",
          description: "Percentage of successful deliveries",
          currentState: { value: 88.6, unit: "%" },
          estimatedState: { 
            value: 96.2, 
            unit: "%", 
            changeDirection: "increase", 
            changePercentage: 8.6
          }
        },
        {
          name: "Money Saved",
          description: "Estimated money saved if optimization is adopted",
          currentState: { value: 0, unit: "USD" },
          estimatedState: { 
            value: 275000, 
            unit: "USD", 
            changeDirection: "increase"
          }
        }
      ]
    },
    {
      modelName: "center-of-gravity",
      description: "Center of gravity optimization metrics before and after optimization",
      metrics: [
        {
          name: "Transportation Distance",
          description: "Total distance traveled to serve all demand points",
          currentState: { value: 12500, unit: "km" },
          estimatedState: { 
            value: 8750, 
            unit: "km", 
            changeDirection: "decrease", 
            changePercentage: 30
          }
        },
        {
          name: "Delivery Cost",
          description: "Average cost per delivery",
          currentState: { value: 425, unit: "USD" },
          estimatedState: { 
            value: 285, 
            unit: "USD", 
            changeDirection: "decrease", 
            changePercentage: 32.9
          }
        },
        {
          name: "Response Time",
          description: "Average time to reach demand points",
          currentState: { value: 6.8, unit: "hours" },
          estimatedState: { 
            value: 4.2, 
            unit: "hours", 
            changeDirection: "decrease", 
            changePercentage: 38.2
          }
        },
        {
          name: "Service Coverage",
          description: "Percentage of demand points served within target time",
          currentState: { value: 72.5, unit: "%" },
          estimatedState: { 
            value: 91.8, 
            unit: "%", 
            changeDirection: "increase", 
            changePercentage: 26.6
          }
        },
        {
          name: "Money Saved",
          description: "Estimated money saved if optimization is adopted",
          currentState: { value: 0, unit: "USD" },
          estimatedState: { 
            value: 195000, 
            unit: "USD", 
            changeDirection: "increase"
          }
        }
      ]
    },
    {
      modelName: "heuristic",
      description: "Heuristic optimization metrics before and after optimization",
      metrics: [
        {
          name: "Network Cost",
          description: "Total cost of operating the network",
          currentState: { value: 1850000, unit: "USD" },
          estimatedState: { 
            value: 1480000, 
            unit: "USD", 
            changeDirection: "decrease", 
            changePercentage: 20
          }
        },
        {
          name: "Computation Time",
          description: "Time required to find optimal solution",
          currentState: { value: 24, unit: "hours" },
          estimatedState: { 
            value: 0.5, 
            unit: "hours", 
            changeDirection: "decrease", 
            changePercentage: 97.9
          }
        },
        {
          name: "Resource Utilization",
          description: "Average utilization of resources in network",
          currentState: { value: 62.5, unit: "%" },
          estimatedState: { 
            value: 78.8, 
            unit: "%", 
            changeDirection: "increase", 
            changePercentage: 26.1
          }
        },
        {
          name: "Solution Quality",
          description: "Quality of solution compared to optimal",
          currentState: { value: 85.2, unit: "%" },
          estimatedState: { 
            value: 96.4, 
            unit: "%", 
            changeDirection: "increase", 
            changePercentage: 13.1
          }
        },
        {
          name: "Money Saved",
          description: "Estimated money saved if optimization is adopted",
          currentState: { value: 0, unit: "USD" },
          estimatedState: { 
            value: 370000, 
            unit: "USD", 
            changeDirection: "increase"
          }
        }
      ]
    }
  ];

  const filteredMetrics = selectedModel 
    ? metricsData.filter(model => model.modelName === selectedModel)
    : metricsData;

  return (
    <div className="space-y-6" id="metrics-content" ref={metricsRef}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Business Value Metrics</h2>
        <Button 
          variant="outline" 
          onClick={handleExportPdf} 
          disabled={exportingPdf}
          className="flex items-center gap-2"
        >
          {exportingPdf ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileDown className="h-4 w-4" />
          )}
          Export PDF
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Measurable Business Outcomes</CardTitle>
          <CardDescription>
            Comparing as-is metrics with estimated improvements and actual results
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Tabs defaultValue={filteredMetrics[0]?.modelName || "route-optimization"} className="space-y-4">
              {filteredMetrics.length > 1 && (
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
              )}
              
              {filteredMetrics.map(model => (
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
                            <p className="text-sm font-medium text-muted-foreground">Current State (As-Is)</p>
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
              
              {filteredMetrics.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No metrics available for the selected model.
                </p>
              )}
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
