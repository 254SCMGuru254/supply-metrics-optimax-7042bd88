import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { NetworkMap } from "@/components/NetworkMap";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Database, ResilienceMetricsProps } from "@/types/network";

export const ResilienceMetricsCalculator: React.FC<ResilienceMetricsProps> = ({
  network,
  metrics
}) => {
  const [activeTab, setActiveTab] = useState("robustness");
  const [selectedMetric, setSelectedMetric] = useState("node_connectivity");
  const [calculationProgress, setCalculationProgress] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [thresholdValue, setThresholdValue] = useState([0.75]);
  const [includeWeights, setIncludeWeights] = useState(true);
  const [normalizeResults, setNormalizeResults] = useState(true);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [calculationMethod, setCalculationMethod] = useState("exact");

  // Sample metrics data for demonstration
  const sampleMetrics = {
    robustness: {
      node_connectivity: 0.78,
      edge_connectivity: 0.65,
      algebraic_connectivity: 0.42,
      natural_connectivity: 0.81,
      average_path_length: 2.34,
      clustering_coefficient: 0.56
    },
    reliability: {
      network_reliability: 0.92,
      all_terminal_reliability: 0.87,
      two_terminal_reliability: 0.94,
      expected_demand_satisfaction: 0.89,
      service_availability: 0.95
    },
    resilience: {
      recovery_time: 3.2,
      adaptation_capacity: 0.76,
      vulnerability_index: 0.34,
      critical_node_percentage: 0.12,
      resilience_index: 0.82
    }
  };

  // Simulate calculation process
  const calculateMetrics = () => {
    setIsCalculating(true);
    setCalculationProgress(0);
    
    const interval = setInterval(() => {
      setCalculationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCalculating(false);
          
          // Set sample results based on the selected metric
          const category = activeTab;
          const metric = selectedMetric;
          
          setResults({
            value: sampleMetrics[category as keyof typeof sampleMetrics][metric as any],
            threshold: thresholdValue[0],
            status: sampleMetrics[category as keyof typeof sampleMetrics][metric as any] > thresholdValue[0] ? "pass" : "fail",
            details: {
              nodes: network?.nodes?.length || 0,
              routes: network?.routes?.length || 0,
              method: calculationMethod,
              weighted: includeWeights,
              normalized: normalizeResults
            }
          });
          
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  // Reset calculation
  const resetCalculation = () => {
    setResults(null);
    setCalculationProgress(0);
    setIsCalculating(false);
  };

  // Get metric options based on active tab
  const getMetricOptions = () => {
    switch (activeTab) {
      case "robustness":
        return [
          { value: "node_connectivity", label: "Node Connectivity" },
          { value: "edge_connectivity", label: "Edge Connectivity" },
          { value: "algebraic_connectivity", label: "Algebraic Connectivity" },
          { value: "natural_connectivity", label: "Natural Connectivity" },
          { value: "average_path_length", label: "Average Path Length" },
          { value: "clustering_coefficient", label: "Clustering Coefficient" }
        ];
      case "reliability":
        return [
          { value: "network_reliability", label: "Network Reliability" },
          { value: "all_terminal_reliability", label: "All-Terminal Reliability" },
          { value: "two_terminal_reliability", label: "Two-Terminal Reliability" },
          { value: "expected_demand_satisfaction", label: "Expected Demand Satisfaction" },
          { value: "service_availability", label: "Service Availability" }
        ];
      case "resilience":
        return [
          { value: "recovery_time", label: "Recovery Time" },
          { value: "adaptation_capacity", label: "Adaptation Capacity" },
          { value: "vulnerability_index", label: "Vulnerability Index" },
          { value: "critical_node_percentage", label: "Critical Node Percentage" },
          { value: "resilience_index", label: "Resilience Index" }
        ];
      default:
        return [];
    }
  };

  // Handle tab change
  useEffect(() => {
    // Reset selected metric when tab changes
    const options = getMetricOptions();
    if (options.length > 0) {
      setSelectedMetric(options[0].value);
    }
    resetCalculation();
  }, [activeTab]);

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Network Resilience Metrics</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="robustness">Robustness</TabsTrigger>
          <TabsTrigger value="reliability">Reliability</TabsTrigger>
          <TabsTrigger value="resilience">Resilience</TabsTrigger>
        </TabsList>
        
        <TabsContent value="robustness" className="space-y-4 mt-4">
          <p className="text-muted-foreground">
            Robustness metrics measure the network's ability to maintain functionality when subjected to failures or attacks.
          </p>
        </TabsContent>
        
        <TabsContent value="reliability" className="space-y-4 mt-4">
          <p className="text-muted-foreground">
            Reliability metrics quantify the probability that the network will perform its intended function under specified conditions.
          </p>
        </TabsContent>
        
        <TabsContent value="resilience" className="space-y-4 mt-4">
          <p className="text-muted-foreground">
            Resilience metrics evaluate the network's ability to recover from disruptions and adapt to changing conditions.
          </p>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Select Metric</Label>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger>
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                {getMetricOptions().map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Calculation Method</Label>
            <RadioGroup value={calculationMethod} onValueChange={setCalculationMethod}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="exact" id="exact" />
                <Label htmlFor="exact">Exact</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="approximate" id="approximate" />
                <Label htmlFor="approximate">Approximate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monte_carlo" id="monte_carlo" />
                <Label htmlFor="monte_carlo">Monte Carlo</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label>Threshold Value: {thresholdValue[0]}</Label>
            <Slider
              value={thresholdValue}
              onValueChange={setThresholdValue}
              min={0}
              max={1}
              step={0.01}
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="include-weights" 
                checked={includeWeights} 
                onCheckedChange={(checked) => setIncludeWeights(checked as boolean)} 
              />
              <Label htmlFor="include-weights">Include Edge Weights</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="normalize-results" 
                checked={normalizeResults} 
                onCheckedChange={(checked) => setNormalizeResults(checked as boolean)} 
              />
              <Label htmlFor="normalize-results">Normalize Results</Label>
            </div>
          </div>
          
          <div className="space-y-2">
            {isCalculating ? (
              <div className="space-y-2">
                <Label>Calculating...</Label>
                <Progress value={calculationProgress} />
              </div>
            ) : (
              <div className="flex space-x-2">
                <Button onClick={calculateMetrics}>Calculate</Button>
                {results && <Button variant="outline" onClick={resetCalculation}>Reset</Button>}
              </div>
            )}
          </div>
          
          {results && (
            <div className="border p-4 rounded-md bg-muted/50">
              <h3 className="font-semibold text-lg mb-2">Results</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Value:</span>
                  <span className="font-medium">{results.value.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Threshold:</span>
                  <span>{results.threshold.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={results.status === "pass" ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                    {results.status.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <h4 className="font-medium mt-4 mb-2">Calculation Details</h4>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Nodes</TableCell>
                    <TableCell>{results.details.nodes}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Routes</TableCell>
                    <TableCell>{results.details.routes}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Method</TableCell>
                    <TableCell className="capitalize">{results.details.method}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Weighted</TableCell>
                    <TableCell>{results.details.weighted ? "Yes" : "No"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Normalized</TableCell>
                    <TableCell>{results.details.normalized ? "Yes" : "No"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </div>
        
        <div>
          <div className="h-[400px] border rounded-md overflow-hidden">
            {network && (
              <NetworkMap 
                network={network}
                highlightNodes={selectedNodes}
                resilienceMetrics={results}
              />
            )}
          </div>
          
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Interpretation</h3>
            <p className="text-sm text-muted-foreground">
              {activeTab === "robustness" && (
                "Robustness metrics indicate how well the network maintains functionality when components fail. Higher values generally indicate better performance."
              )}
              {activeTab === "reliability" && (
                "Reliability metrics show the probability of successful operation. Values closer to 1.0 indicate higher reliability."
              )}
              {activeTab === "resilience" && (
                "Resilience metrics measure the network's ability to recover from disruptions. Lower recovery times and higher adaptation capacities are desirable."
              )}
            </p>
            
            <h3 className="font-semibold mt-4 mb-2">Recommendations</h3>
            {results ? (
              <ul className="text-sm space-y-1 list-disc pl-5">
                {results.status === "pass" ? (
                  <>
                    <li>Network shows good performance for this metric</li>
                    <li>Consider testing with more stringent thresholds</li>
                    <li>Evaluate performance under different disruption scenarios</li>
                  </>
                ) : (
                  <>
                    <li>Consider adding redundant connections to critical nodes</li>
                    <li>Identify and strengthen vulnerable network components</li>
                    <li>Implement backup systems for critical paths</li>
                  </>
                )}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Calculate metrics to see recommendations.
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ResilienceMetricsCalculator;
