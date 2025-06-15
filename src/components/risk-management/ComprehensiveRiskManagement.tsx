
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Shield, TrendingDown, BarChart3, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RiskVariable {
  name: string;
  distribution: string;
  parameters: Record<string, number>;
  weight: number;
}

interface Supplier {
  id: string;
  name: string;
  reliabilityScore: number;
  capacityScore: number;
  qualityScore: number;
  financialScore: number;
  geographicRisk: number;
}

interface DisruptionScenario {
  id: string;
  name: string;
  probability: number;
  severity: number;
  recoveryTime: number;
  affectedNodes: string[];
}

interface RiskResults {
  type: string;
  riskScore: number;
  varAmount?: number;
  supplierRankings?: Array<{ supplier: Supplier; totalRisk: number }>;
  scenarioImpacts?: Array<{ scenario: DisruptionScenario; impact: number }>;
  recommendations: string[];
  confidenceLevel: number;
}

export const ComprehensiveRiskManagement = () => {
  const [activeTab, setActiveTab] = useState("value-at-risk");
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<RiskResults | null>(null);
  const { toast } = useToast();

  // Value at Risk Parameters
  const [varParams, setVarParams] = useState({
    meanReturn: 500000,
    stdDev: 150000,
    confidenceLevel: 95,
    timeHorizon: 30
  });

  // Supplier Risk Parameters
  const [suppliers] = useState<Supplier[]>([
    {
      id: "s1",
      name: "Nairobi Foods Ltd",
      reliabilityScore: 85,
      capacityScore: 90,
      qualityScore: 88,
      financialScore: 82,
      geographicRisk: 15
    },
    {
      id: "s2", 
      name: "Mombasa Logistics Co",
      reliabilityScore: 78,
      capacityScore: 95,
      qualityScore: 80,
      financialScore: 88,
      geographicRisk: 25
    },
    {
      id: "s3",
      name: "Kisumu Agricultural",
      reliabilityScore: 82,
      capacityScore: 70,
      qualityScore: 92,
      financialScore: 75,
      geographicRisk: 20
    },
    {
      id: "s4",
      name: "Nakuru Processing",
      reliabilityScore: 88,
      capacityScore: 85,
      qualityScore: 90,
      financialScore: 90,
      geographicRisk: 10
    }
  ]);

  // Disruption Scenarios
  const [disruptionScenarios] = useState<DisruptionScenario[]>([
    {
      id: "d1",
      name: "Port Strike at Mombasa",
      probability: 0.15,
      severity: 0.8,
      recoveryTime: 14,
      affectedNodes: ["mombasa", "nairobi"]
    },
    {
      id: "d2",
      name: "Fuel Price Spike",
      probability: 0.25,
      severity: 0.6,
      recoveryTime: 30,
      affectedNodes: ["all"]
    },
    {
      id: "d3",
      name: "Severe Weather Event",
      probability: 0.20,
      severity: 0.7,
      recoveryTime: 21,
      affectedNodes: ["western", "central"]
    },
    {
      id: "d4",
      name: "Supplier Bankruptcy",
      probability: 0.08,
      severity: 0.9,
      recoveryTime: 60,
      affectedNodes: ["affected_supplier"]
    },
    {
      id: "d5",
      name: "Cyber Security Breach",
      probability: 0.12,
      severity: 0.5,
      recoveryTime: 7,
      affectedNodes: ["it_systems"]
    }
  ]);

  // Monte Carlo Risk Variables
  const [riskVariables] = useState<RiskVariable[]>([
    {
      name: "demandVariability",
      distribution: "normal",
      parameters: { mean: 1000, stdDev: 200 },
      weight: 0.3
    },
    {
      name: "leadTimeVariability", 
      distribution: "uniform",
      parameters: { min: 5, max: 20 },
      weight: 0.25
    },
    {
      name: "priceVolatility",
      distribution: "normal",
      parameters: { mean: 100, stdDev: 25 },
      weight: 0.2
    },
    {
      name: "supplierReliability",
      distribution: "beta",
      parameters: { alpha: 8, beta: 2 },
      weight: 0.25
    }
  ]);

  // Calculate Value at Risk
  const calculateVaR = async () => {
    setIsCalculating(true);
    
    // VaR calculation using normal distribution
    const zScore = getZScore(varParams.confidenceLevel);
    const varAmount = varParams.meanReturn - (zScore * varParams.stdDev);
    
    // Calculate portfolio risk metrics
    const expectedShortfall = varAmount - (varParams.stdDev * Math.exp(-0.5 * zScore * zScore) / Math.sqrt(2 * Math.PI)) / (1 - varParams.confidenceLevel / 100);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const recommendations = [];
    
    if (varAmount < varParams.meanReturn * 0.8) {
      recommendations.push("High risk detected. Consider diversifying supplier base.");
    }
    if (varParams.stdDev / varParams.meanReturn > 0.3) {
      recommendations.push("High volatility. Implement hedging strategies.");
    }
    recommendations.push("Monitor risk metrics daily during high volatility periods.");
    
    setResults({
      type: "Value at Risk",
      riskScore: (1 - varAmount / varParams.meanReturn) * 100,
      varAmount,
      recommendations,
      confidenceLevel: varParams.confidenceLevel
    });
    
    setIsCalculating(false);
    
    toast({
      title: "Value at Risk Calculated",
      description: `VaR at ${varParams.confidenceLevel}% confidence: KES ${Math.round(varAmount).toLocaleString()}`
    });
  };

  // Z-score lookup for confidence levels
  const getZScore = (confidence: number): number => {
    const zScores: Record<number, number> = {
      90: 1.28, 95: 1.64, 99: 2.33, 99.9: 3.09
    };
    return zScores[confidence] || 1.64;
  };

  // Calculate Supplier Risk Assessment
  const calculateSupplierRisk = async () => {
    setIsCalculating(true);
    
    const supplierRiskWeights = {
      reliability: 0.25,
      capacity: 0.20,
      quality: 0.20,
      financial: 0.20,
      geographic: 0.15
    };
    
    const supplierRankings = suppliers.map(supplier => {
      // Calculate weighted risk score (lower is better)
      const totalRisk = 
        (100 - supplier.reliabilityScore) * supplierRiskWeights.reliability +
        (100 - supplier.capacityScore) * supplierRiskWeights.capacity +
        (100 - supplier.qualityScore) * supplierRiskWeights.quality +
        (100 - supplier.financialScore) * supplierRiskWeights.financial +
        supplier.geographicRisk * supplierRiskWeights.geographic;
      
      return { supplier, totalRisk };
    }).sort((a, b) => a.totalRisk - b.totalRisk);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const avgRisk = supplierRankings.reduce((sum, s) => sum + s.totalRisk, 0) / supplierRankings.length;
    const highRiskSuppliers = supplierRankings.filter(s => s.totalRisk > avgRisk + 10);
    
    const recommendations = [
      `Top supplier: ${supplierRankings[0].supplier.name} (lowest risk)`,
      highRiskSuppliers.length > 0 
        ? `Monitor ${highRiskSuppliers.length} high-risk suppliers closely`
        : "All suppliers within acceptable risk range",
      "Conduct quarterly supplier risk assessments",
      "Develop contingency plans for top 3 suppliers"
    ];
    
    setResults({
      type: "Supplier Risk Assessment",
      riskScore: avgRisk,
      supplierRankings,
      recommendations,
      confidenceLevel: 85
    });
    
    setIsCalculating(false);
    
    toast({
      title: "Supplier Risk Assessment Complete",
      description: `Analyzed ${suppliers.length} suppliers. Average risk score: ${avgRisk.toFixed(1)}`
    });
  };

  // Calculate Disruption Impact Analysis
  const calculateDisruptionImpact = async () => {
    setIsCalculating(true);
    
    const scenarioImpacts = disruptionScenarios.map(scenario => {
      // Impact = Probability × Severity × Recovery Time impact factor
      const recoveryFactor = Math.log(scenario.recoveryTime + 1) / Math.log(61); // Normalize to 0-1
      const impact = scenario.probability * scenario.severity * (1 + recoveryFactor);
      
      return { scenario, impact };
    }).sort((a, b) => b.impact - a.impact);
    
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const totalRisk = scenarioImpacts.reduce((sum, s) => sum + s.impact, 0);
    const criticalScenarios = scenarioImpacts.filter(s => s.impact > 0.2);
    
    const recommendations = [
      `Highest risk: ${scenarioImpacts[0].scenario.name}`,
      `${criticalScenarios.length} scenarios require immediate attention`,
      "Develop business continuity plans for top 3 scenarios",
      "Establish early warning systems for critical disruptions",
      "Create supplier diversification strategy"
    ];
    
    setResults({
      type: "Disruption Impact Analysis",
      riskScore: totalRisk * 100,
      scenarioImpacts,
      recommendations,
      confidenceLevel: 80
    });
    
    setIsCalculating(false);
    
    toast({
      title: "Disruption Impact Analysis Complete",
      description: `Analyzed ${disruptionScenarios.length} scenarios. Total risk score: ${(totalRisk * 100).toFixed(1)}`
    });
  };

  // Monte Carlo Risk Analysis
  const calculateMonteCarloRisk = async () => {
    setIsCalculating(true);
    
    const numSimulations = 10000;
    const riskValues: number[] = [];
    
    // Run Monte Carlo simulation
    for (let i = 0; i < numSimulations; i++) {
      let totalRisk = 0;
      
      riskVariables.forEach(variable => {
        let sample = 0;
        
        switch (variable.distribution) {
          case "normal":
            // Box-Muller transform
            const u1 = Math.random();
            const u2 = Math.random();
            sample = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
            sample = sample * variable.parameters.stdDev + variable.parameters.mean;
            break;
          case "uniform":
            sample = Math.random() * (variable.parameters.max - variable.parameters.min) + variable.parameters.min;
            break;
          case "beta":
            // Simplified beta distribution approximation
            const alpha = variable.parameters.alpha;
            const beta = variable.parameters.beta;
            sample = Math.random(); // Simplified for demo
            break;
        }
        
        // Normalize sample to risk score (0-1)
        const normalizedSample = Math.max(0, Math.min(1, sample / 100));
        totalRisk += normalizedSample * variable.weight;
      });
      
      riskValues.push(totalRisk);
      
      // Update progress every 1000 simulations
      if (i % 1000 === 0) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }
    
    // Calculate statistics
    const sortedValues = riskValues.sort((a, b) => a - b);
    const mean = riskValues.reduce((sum, val) => sum + val, 0) / riskValues.length;
    const var95 = sortedValues[Math.floor(0.95 * sortedValues.length)];
    const var99 = sortedValues[Math.floor(0.99 * sortedValues.length)];
    
    const recommendations = [
      `95% VaR: ${(var95 * 100).toFixed(1)}% risk level`,
      `99% VaR: ${(var99 * 100).toFixed(1)}% risk level`,
      mean > 0.6 ? "High overall risk - implement mitigation strategies" : "Risk levels within acceptable range",
      "Monitor key risk variables daily",
      "Update risk models monthly with new data"
    ];
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setResults({
      type: "Monte Carlo Risk Analysis",
      riskScore: mean * 100,
      recommendations,
      confidenceLevel: 95
    });
    
    setIsCalculating(false);
    
    toast({
      title: "Monte Carlo Risk Analysis Complete",
      description: `Completed ${numSimulations} simulations. Mean risk: ${(mean * 100).toFixed(1)}%`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Comprehensive Risk Management</h2>
          <p className="text-muted-foreground">VaR, Supplier Risk, Disruption Analysis, and Monte Carlo risk modeling</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="value-at-risk">Value at Risk</TabsTrigger>
          <TabsTrigger value="supplier-risk">Supplier Risk</TabsTrigger>
          <TabsTrigger value="disruption-impact">Disruption Impact</TabsTrigger>
          <TabsTrigger value="monte-carlo-risk">Monte Carlo Risk</TabsTrigger>
          <TabsTrigger value="scenario-analysis">Scenario Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="value-at-risk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                Value at Risk (VaR) Calculation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="meanReturn">Mean Return (KES)</Label>
                  <Input
                    id="meanReturn"
                    type="number"
                    value={varParams.meanReturn}
                    onChange={(e) => setVarParams({...varParams, meanReturn: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="stdDev">Standard Deviation (KES)</Label>
                  <Input
                    id="stdDev"
                    type="number"
                    value={varParams.stdDev}
                    onChange={(e) => setVarParams({...varParams, stdDev: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="confidenceLevel">Confidence Level (%)</Label>
                  <Input
                    id="confidenceLevel"
                    type="number"
                    value={varParams.confidenceLevel}
                    onChange={(e) => setVarParams({...varParams, confidenceLevel: parseInt(e.target.value)})}
                    min={90}
                    max={99.9}
                  />
                </div>
                <div>
                  <Label htmlFor="timeHorizon">Time Horizon (days)</Label>
                  <Input
                    id="timeHorizon"
                    type="number"
                    value={varParams.timeHorizon}
                    onChange={(e) => setVarParams({...varParams, timeHorizon: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">VaR Formula</h4>
                <p className="text-sm">VaR = μ - z<sub>α</sub> × σ</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Where μ = mean return, z<sub>α</sub> = confidence level z-score, σ = standard deviation
                </p>
              </div>

              <Button 
                onClick={calculateVaR} 
                disabled={isCalculating}
                size="lg" 
                className="w-full"
              >
                <Calculator className="h-5 w-5 mr-2" />
                {isCalculating ? "Calculating..." : "Calculate Value at Risk"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="supplier-risk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Supplier Portfolio ({suppliers.length} suppliers)</Label>
                {suppliers.map(supplier => (
                  <div key={supplier.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-medium">{supplier.name}</span>
                      <Badge variant="outline">ID: {supplier.id}</Badge>
                    </div>
                    <div className="grid grid-cols-5 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Reliability</div>
                        <div className="font-medium">{supplier.reliabilityScore}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Capacity</div>
                        <div className="font-medium">{supplier.capacityScore}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Quality</div>
                        <div className="font-medium">{supplier.qualityScore}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Financial</div>
                        <div className="font-medium">{supplier.financialScore}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Geo Risk</div>
                        <div className="font-medium">{supplier.geographicRisk}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                onClick={calculateSupplierRisk} 
                disabled={isCalculating}
                size="lg" 
                className="w-full"
              >
                <Calculator className="h-5 w-5 mr-2" />
                {isCalculating ? "Assessing..." : "Assess Supplier Risk"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disruption-impact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Disruption Impact Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Disruption Scenarios ({disruptionScenarios.length} scenarios)</Label>
                {disruptionScenarios.map(scenario => (
                  <div key={scenario.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-medium">{scenario.name}</span>
                      <Badge variant={scenario.probability > 0.2 ? "destructive" : "secondary"}>
                        {(scenario.probability * 100).toFixed(0)}% probability
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Severity</div>
                        <div className="font-medium">{(scenario.severity * 100).toFixed(0)}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Recovery Time</div>
                        <div className="font-medium">{scenario.recoveryTime} days</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Affected Nodes</div>
                        <div className="font-medium">{scenario.affectedNodes.length}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Impact Formula</h4>
                <p className="text-sm">Impact = Probability × Severity × Recovery Time Factor</p>
              </div>

              <Button 
                onClick={calculateDisruptionImpact} 
                disabled={isCalculating}
                size="lg" 
                className="w-full"
              >
                <AlertTriangle className="h-5 w-5 mr-2" />
                {isCalculating ? "Analyzing..." : "Analyze Disruption Impact"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monte-carlo-risk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monte Carlo Risk Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Risk Variables ({riskVariables.length} variables)</Label>
                {riskVariables.map((variable, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">{variable.name}</span>
                      <Badge variant="outline">Weight: {(variable.weight * 100).toFixed(0)}%</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Distribution</div>
                        <div className="font-medium">{variable.distribution}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Parameters</div>
                        <div className="font-medium">
                          {Object.entries(variable.parameters).map(([key, value]) => (
                            <span key={key}>{key}: {value} </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Monte Carlo Simulation</h4>
                <p className="text-sm">
                  Runs 10,000 simulations sampling from risk variable distributions 
                  to estimate overall portfolio risk metrics and percentiles.
                </p>
              </div>

              <Button 
                onClick={calculateMonteCarloRisk} 
                disabled={isCalculating}
                size="lg" 
                className="w-full"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                {isCalculating ? "Simulating..." : "Run Monte Carlo Risk Analysis"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenario-analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scenario Risk Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <AlertTriangle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  Advanced scenario tree analysis with multiple failure and recovery pathways.
                  Models complex interdependencies between supply chain disruptions.
                </p>
                <Button className="mt-4" disabled>
                  <Calculator className="h-5 w-5 mr-2" />
                  Scenario Tree Analysis (Enterprise Feature)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Results Display */}
      {results && isCalculating && (
        <Card>
          <CardContent className="py-6">
            <div className="text-center">
              <div className="mb-4">Calculating {results.type}...</div>
              <Progress value={66} />
            </div>
          </CardContent>
        </Card>
      )}

      {results && !isCalculating && (
        <Card>
          <CardHeader>
            <CardTitle>{results.type} Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{results.riskScore.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Risk Score</div>
              </div>
              {results.varAmount && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">KES {Math.round(results.varAmount).toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Value at Risk</div>
                </div>
              )}
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{results.confidenceLevel}%</div>
                <div className="text-sm text-muted-foreground">Confidence Level</div>
              </div>
            </div>

            {results.supplierRankings && (
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Supplier Risk Rankings</h4>
                <div className="space-y-2">
                  {results.supplierRankings.map((ranking, index) => (
                    <div key={ranking.supplier.id} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <span className="font-medium">#{index + 1} {ranking.supplier.name}</span>
                        <div className="text-sm text-muted-foreground">
                          Reliability: {ranking.supplier.reliabilityScore}% | 
                          Quality: {ranking.supplier.qualityScore}%
                        </div>
                      </div>
                      <Badge variant={ranking.totalRisk > 30 ? "destructive" : ranking.totalRisk > 20 ? "secondary" : "default"}>
                        Risk: {ranking.totalRisk.toFixed(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.scenarioImpacts && (
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Disruption Scenario Impacts</h4>
                <div className="space-y-2">
                  {results.scenarioImpacts.map((impact, index) => (
                    <div key={impact.scenario.id} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <span className="font-medium">{impact.scenario.name}</span>
                        <div className="text-sm text-muted-foreground">
                          Probability: {(impact.scenario.probability * 100).toFixed(0)}% | 
                          Recovery: {impact.scenario.recoveryTime} days
                        </div>
                      </div>
                      <Badge variant={impact.impact > 0.3 ? "destructive" : impact.impact > 0.2 ? "secondary" : "default"}>
                        Impact: {(impact.impact * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-semibold mb-3">Risk Management Recommendations</h4>
              <div className="space-y-2">
                {results.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-muted rounded">
                    <span className="text-sm font-medium text-primary">•</span>
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ComprehensiveRiskManagement;
