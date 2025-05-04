
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react";

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

  // Business value metrics for each model
  const modelMetricsData: ModelMetrics[] = [
    {
      modelName: "route-optimization",
      description: "Optimize delivery routes to minimize distance, time and cost",
      metrics: [
        {
          name: "Average Transit Time",
          description: "Time taken to transport goods between locations",
          currentState: { value: 72, unit: "hours" },
          estimatedState: { 
            value: 58, 
            unit: "hours", 
            changeDirection: "decrease", 
            changePercentage: 19.4 
          },
          actualState: { 
            value: 55, 
            unit: "hours", 
            changeDirection: "decrease", 
            changePercentage: 23.6 
          }
        },
        {
          name: "Transportation Cost",
          description: "Cost per unit for transportation across network",
          currentState: { value: 4.75, unit: "$/unit" },
          estimatedState: { 
            value: 3.80, 
            unit: "$/unit", 
            changeDirection: "decrease", 
            changePercentage: 20.0
          },
          actualState: { 
            value: 3.65, 
            unit: "$/unit", 
            changeDirection: "decrease", 
            changePercentage: 23.2
          }
        },
        {
          name: "Vehicle Utilization",
          description: "Percentage of available vehicle capacity used",
          currentState: { value: 68, unit: "%" },
          estimatedState: { 
            value: 82, 
            unit: "%", 
            changeDirection: "increase", 
            changePercentage: 20.6
          },
          actualState: { 
            value: 85, 
            unit: "%", 
            changeDirection: "increase", 
            changePercentage: 25.0
          }
        }
      ]
    },
    {
      modelName: "inventory-management",
      description: "Optimize inventory levels and stock policies",
      metrics: [
        {
          name: "Inventory Holding Cost",
          description: "Annual cost to hold inventory as % of inventory value",
          currentState: { value: 24, unit: "%" },
          estimatedState: { 
            value: 18, 
            unit: "%", 
            changeDirection: "decrease", 
            changePercentage: 25.0 
          },
          actualState: { 
            value: 17.5, 
            unit: "%", 
            changeDirection: "decrease", 
            changePercentage: 27.1 
          }
        },
        {
          name: "Stockout Rate",
          description: "Percentage of demand that cannot be fulfilled immediately",
          currentState: { value: 8.5, unit: "%" },
          estimatedState: { 
            value: 3.2, 
            unit: "%", 
            changeDirection: "decrease", 
            changePercentage: 62.4
          },
          actualState: { 
            value: 2.8, 
            unit: "%", 
            changeDirection: "decrease", 
            changePercentage: 67.1
          }
        },
        {
          name: "Working Capital Requirement",
          description: "Capital tied up in inventory",
          currentState: { value: 3.2, unit: "M $" },
          estimatedState: { 
            value: 2.3, 
            unit: "M $", 
            changeDirection: "decrease", 
            changePercentage: 28.1
          },
          actualState: { 
            value: 2.1, 
            unit: "M $", 
            changeDirection: "decrease", 
            changePercentage: 34.4
          }
        }
      ]
    },
    {
      modelName: "center-of-gravity",
      description: "Optimize facility locations based on weighted demand points",
      metrics: [
        {
          name: "Transportation Distance",
          description: "Average weighted distance to serve demand points",
          currentState: { value: 385, unit: "km" },
          estimatedState: { 
            value: 275, 
            unit: "km", 
            changeDirection: "decrease", 
            changePercentage: 28.6 
          },
          actualState: { 
            value: 268, 
            unit: "km", 
            changeDirection: "decrease", 
            changePercentage: 30.4 
          }
        },
        {
          name: "Delivery Cost",
          description: "Average cost per delivery",
          currentState: { value: 783, unit: "$" },
          estimatedState: { 
            value: 589, 
            unit: "$", 
            changeDirection: "decrease", 
            changePercentage: 24.8
          },
          actualState: { 
            value: 562, 
            unit: "$", 
            changeDirection: "decrease", 
            changePercentage: 28.2
          }
        },
        {
          name: "Customer Response Time",
          description: "Average time to fulfill customer orders",
          currentState: { value: 52, unit: "hours" },
          estimatedState: { 
            value: 36, 
            unit: "hours", 
            changeDirection: "decrease", 
            changePercentage: 30.8
          },
          actualState: { 
            value: 33, 
            unit: "hours", 
            changeDirection: "decrease", 
            changePercentage: 36.5
          }
        }
      ]
    },
    {
      modelName: "heuristic",
      description: "Optimize network configuration using simulated annealing algorithm",
      metrics: [
        {
          name: "Network Flow Cost",
          description: "Total cost to move goods through network",
          currentState: { value: 5.8, unit: "M $" },
          estimatedState: { 
            value: 4.9, 
            unit: "M $", 
            changeDirection: "decrease", 
            changePercentage: 15.5
          },
          actualState: { 
            value: 4.6, 
            unit: "M $", 
            changeDirection: "decrease", 
            changePercentage: 20.7
          }
        },
        {
          name: "Execution Time",
          description: "Time to solve complex optimization problems",
          currentState: { value: "Hours", unit: "" },
          estimatedState: { 
            value: "Minutes", 
            unit: "", 
            changeDirection: "decrease", 
            changePercentage: 95
          }
        },
        {
          name: "Resource Allocation Efficiency",
          description: "Efficiency of resource distribution across network",
          currentState: { value: 71, unit: "%" },
          estimatedState: { 
            value: 84, 
            unit: "%", 
            changeDirection: "increase", 
            changePercentage: 18.3
          },
          actualState: { 
            value: 87, 
            unit: "%", 
            changeDirection: "increase", 
            changePercentage: 22.5
          }
        }
      ]
    },
    {
      modelName: "network-optimization",
      description: "Optimize network flows to minimize costs and maximize efficiency",
      metrics: [
        {
          name: "Network Throughput",
          description: "Volume of goods moving through network per day",
          currentState: { value: 12500, unit: "units" },
          estimatedState: { 
            value: 15800, 
            unit: "units", 
            changeDirection: "increase", 
            changePercentage: 26.4
          },
          actualState: { 
            value: 16200, 
            unit: "units", 
            changeDirection: "increase", 
            changePercentage: 29.6
          }
        },
        {
          name: "Bottleneck Reduction",
          description: "Reduction in flow constraints throughout network",
          currentState: { value: 6, unit: "points" },
          estimatedState: { 
            value: 2, 
            unit: "points", 
            changeDirection: "decrease", 
            changePercentage: 66.7
          },
          actualState: { 
            value: 1, 
            unit: "points", 
            changeDirection: "decrease", 
            changePercentage: 83.3
          }
        },
        {
          name: "Resource Utilization",
          description: "Average capacity utilization across facilities",
          currentState: { value: 65, unit: "%" },
          estimatedState: { 
            value: 83, 
            unit: "%", 
            changeDirection: "increase", 
            changePercentage: 27.7
          },
          actualState: { 
            value: 86, 
            unit: "%", 
            changeDirection: "increase", 
            changePercentage: 32.3
          }
        }
      ]
    }
  ];

  // Filter metrics by selected model or show all
  const filteredMetrics = selectedModel 
    ? modelMetricsData.filter(model => model.modelName === selectedModel)
    : modelMetricsData;

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
          <Tabs defaultValue={filteredMetrics[0]?.modelName || "route-optimization"} className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {modelMetricsData.map(model => (
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
            
            {modelMetricsData.map(model => (
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
        </CardContent>
      </Card>
    </div>
  );
};
