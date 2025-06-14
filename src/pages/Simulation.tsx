
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimulationEngine } from "@/components/simulation/SimulationEngine";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Zap, Shield, Target } from "lucide-react";

const Simulation = () => {
  const [projectId] = useState('demo-simulation-project');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Supply Chain Simulation</h1>
        <p className="text-muted-foreground">
          Advanced Monte Carlo simulation and scenario analysis for supply chain optimization.
        </p>
      </div>

      <Tabs defaultValue="simulation" className="space-y-6">
        <TabsList>
          <TabsTrigger value="simulation">Monte Carlo Simulation</TabsTrigger>
          <TabsTrigger value="scenarios">Scenario Analysis</TabsTrigger>
          <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
        </TabsList>

        <TabsContent value="simulation">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="flex items-center p-6">
                <div className="p-2 bg-blue-100 rounded-lg mr-4">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Simulation Type</p>
                  <p className="text-2xl font-bold">Monte Carlo</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <div className="p-2 bg-green-100 rounded-lg mr-4">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Scenarios</p>
                  <p className="text-2xl font-bold">4 Types</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <div className="p-2 bg-yellow-100 rounded-lg mr-4">
                  <Shield className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Risk Analysis</p>
                  <p className="text-2xl font-bold">VaR/CVaR</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <div className="p-2 bg-purple-100 rounded-lg mr-4">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Accuracy</p>
                  <p className="text-2xl font-bold">95% CI</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <SimulationEngine projectId={projectId} />
        </TabsContent>

        <TabsContent value="scenarios">
          <Card>
            <CardHeader>
              <CardTitle>Scenario Analysis Framework</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Available Scenarios</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Baseline Scenario</p>
                        <p className="text-sm text-muted-foreground">Normal operating conditions</p>
                      </div>
                      <Badge variant="default">Standard</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Demand Spike</p>
                        <p className="text-sm text-muted-foreground">Unexpected demand increases</p>
                      </div>
                      <Badge variant="secondary">Variable</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Supply Disruption</p>
                        <p className="text-sm text-muted-foreground">Supplier failures or delays</p>
                      </div>
                      <Badge variant="destructive">High Risk</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Cost Increase</p>
                        <p className="text-sm text-muted-foreground">Transportation/material cost changes</p>
                      </div>
                      <Badge variant="outline">Economic</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Simulation Parameters</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">Demand Variability</p>
                      <p className="text-sm text-muted-foreground">±20% standard deviation</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">Lead Time Variation</p>
                      <p className="text-sm text-muted-foreground">±15% standard deviation</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">Disruption Probability</p>
                      <p className="text-sm text-muted-foreground">5% chance per period</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">Cost Volatility</p>
                      <p className="text-sm text-muted-foreground">±10% standard deviation</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Value at Risk (VaR)</h4>
                    <p className="text-sm text-muted-foreground">
                      Maximum expected loss at 95% confidence level over a given time period.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Conditional Value at Risk (CVaR)</h4>
                    <p className="text-sm text-muted-foreground">
                      Expected loss given that the loss exceeds the VaR threshold.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Maximum Loss</h4>
                    <p className="text-sm text-muted-foreground">
                      Worst-case scenario loss across all simulation runs.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Mitigation Strategies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                    <p className="font-medium">Diversification</p>
                    <p className="text-sm text-muted-foreground">
                      Multiple suppliers and distribution channels
                    </p>
                  </div>
                  <div className="p-3 border-l-4 border-green-500 bg-green-50">
                    <p className="font-medium">Safety Stock</p>
                    <p className="text-sm text-muted-foreground">
                      Buffer inventory for demand variability
                    </p>
                  </div>
                  <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50">
                    <p className="font-medium">Flexible Capacity</p>
                    <p className="text-sm text-muted-foreground">
                      Scalable resources for demand spikes
                    </p>
                  </div>
                  <div className="p-3 border-l-4 border-purple-500 bg-purple-50">
                    <p className="font-medium">Insurance</p>
                    <p className="text-sm text-muted-foreground">
                      Coverage for major disruptions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Simulation;
