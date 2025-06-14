
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, TrendingUp, DollarSign, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface BusinessMetrics {
  currentCosts: {
    transportation: number;
    inventory: number;
    warehousing: number;
    operations: number;
  };
  currentPerformance: {
    serviceLevel: number;
    inventoryTurnover: number;
    deliveryTime: number;
    costPerOrder: number;
  };
  projectedImprovements: {
    costReduction: number;
    serviceImprovement: number;
    efficiencyGain: number;
  };
}

export const AdvancedBusinessValueCalculator = () => {
  const [companySize, setCompanySize] = useState<string>("medium");
  const [industry, setIndustry] = useState<string>("manufacturing");
  const [metrics, setMetrics] = useState<BusinessMetrics>({
    currentCosts: {
      transportation: 1000000,
      inventory: 2500000,
      warehousing: 800000,
      operations: 1200000
    },
    currentPerformance: {
      serviceLevel: 85,
      inventoryTurnover: 6,
      deliveryTime: 5,
      costPerOrder: 45
    },
    projectedImprovements: {
      costReduction: 20,
      serviceImprovement: 15,
      efficiencyGain: 25
    }
  });

  const [calculatedROI, setCalculatedROI] = useState<any>(null);

  const calculateBusinessValue = () => {
    const totalCurrentCosts = Object.values(metrics.currentCosts).reduce((sum, cost) => sum + cost, 0);
    
    // Cost savings calculations
    const annualSavings = {
      transportation: metrics.currentCosts.transportation * (metrics.projectedImprovements.costReduction / 100),
      inventory: metrics.currentCosts.inventory * 0.15, // Inventory optimization
      warehousing: metrics.currentCosts.warehousing * 0.12, // Warehouse efficiency
      operations: metrics.currentCosts.operations * (metrics.projectedImprovements.efficiencyGain / 100)
    };

    const totalAnnualSavings = Object.values(annualSavings).reduce((sum, saving) => sum + saving, 0);

    // Performance improvements
    const performanceValue = {
      serviceLevel: metrics.currentPerformance.serviceLevel * (metrics.projectedImprovements.serviceImprovement / 100) * 50000, // Revenue impact
      efficiency: metrics.projectedImprovements.efficiencyGain * 10000, // Productivity value
      customerSatisfaction: metrics.projectedImprovements.serviceImprovement * 15000 // Customer retention value
    };

    const totalPerformanceValue = Object.values(performanceValue).reduce((sum, value) => sum + value, 0);

    // Implementation costs
    const implementationCost = totalCurrentCosts * 0.05; // 5% of current costs
    const yearlyLicenseCost = 300000; // KES

    // ROI Calculation
    const totalBenefit = totalAnnualSavings + totalPerformanceValue;
    const totalCost = implementationCost + yearlyLicenseCost;
    const roi = ((totalBenefit - totalCost) / totalCost) * 100;
    const paybackPeriod = totalCost / (totalBenefit / 12); // months

    const result = {
      annualSavings,
      totalAnnualSavings,
      performanceValue,
      totalPerformanceValue,
      totalBenefit,
      totalCost,
      roi,
      paybackPeriod,
      threeYearValue: totalBenefit * 3 - totalCost
    };

    setCalculatedROI(result);
  };

  const getIndustryBenchmarks = (industry: string) => {
    const benchmarks = {
      manufacturing: {
        avgCostReduction: "18-25%",
        avgServiceImprovement: "12-20%",
        typicalROI: "240-350%",
        paybackPeriod: "8-14 months"
      },
      retail: {
        avgCostReduction: "15-22%",
        avgServiceImprovement: "20-30%",
        typicalROI: "200-300%",
        paybackPeriod: "6-12 months"
      },
      agriculture: {
        avgCostReduction: "20-30%",
        avgServiceImprovement: "25-40%",
        typicalROI: "300-450%",
        paybackPeriod: "10-18 months"
      }
    };

    return benchmarks[industry as keyof typeof benchmarks] || benchmarks.manufacturing;
  };

  const updateMetric = (category: keyof BusinessMetrics, field: string, value: number) => {
    setMetrics(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const benchmarks = getIndustryBenchmarks(industry);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Business Value Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label>Company Size</Label>
              <Select value={companySize} onValueChange={setCompanySize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (10-50 employees)</SelectItem>
                  <SelectItem value="medium">Medium (50-500 employees)</SelectItem>
                  <SelectItem value="large">Large (500+ employees)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Industry</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="retail">Retail & Distribution</SelectItem>
                  <SelectItem value="agriculture">Agriculture & Food</SelectItem>
                  <SelectItem value="logistics">Logistics & Transport</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="costs" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="costs">Current Costs</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="projections">Projections</TabsTrigger>
              <TabsTrigger value="results">ROI Results</TabsTrigger>
            </TabsList>
            
            <TabsContent value="costs" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Transportation Costs (KES/year)</Label>
                  <Input
                    type="number"
                    value={metrics.currentCosts.transportation}
                    onChange={(e) => updateMetric('currentCosts', 'transportation', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>Inventory Costs (KES/year)</Label>
                  <Input
                    type="number"
                    value={metrics.currentCosts.inventory}
                    onChange={(e) => updateMetric('currentCosts', 'inventory', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>Warehousing Costs (KES/year)</Label>
                  <Input
                    type="number"
                    value={metrics.currentCosts.warehousing}
                    onChange={(e) => updateMetric('currentCosts', 'warehousing', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>Operations Costs (KES/year)</Label>
                  <Input
                    type="number"
                    value={metrics.currentCosts.operations}
                    onChange={(e) => updateMetric('currentCosts', 'operations', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Current Service Level (%)</Label>
                  <Input
                    type="number"
                    value={metrics.currentPerformance.serviceLevel}
                    onChange={(e) => updateMetric('currentPerformance', 'serviceLevel', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>Inventory Turnover (times/year)</Label>
                  <Input
                    type="number"
                    value={metrics.currentPerformance.inventoryTurnover}
                    onChange={(e) => updateMetric('currentPerformance', 'inventoryTurnover', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>Average Delivery Time (days)</Label>
                  <Input
                    type="number"
                    value={metrics.currentPerformance.deliveryTime}
                    onChange={(e) => updateMetric('currentPerformance', 'deliveryTime', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>Cost Per Order (KES)</Label>
                  <Input
                    type="number"
                    value={metrics.currentPerformance.costPerOrder}
                    onChange={(e) => updateMetric('currentPerformance', 'costPerOrder', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="projections" className="space-y-4">
              <div className="space-y-6">
                <div>
                  <Label>Expected Cost Reduction (%)</Label>
                  <div className="flex items-center space-x-4">
                    <Input
                      type="number"
                      value={metrics.projectedImprovements.costReduction}
                      onChange={(e) => updateMetric('projectedImprovements', 'costReduction', parseInt(e.target.value) || 0)}
                      className="w-24"
                    />
                    <Progress value={metrics.projectedImprovements.costReduction} className="flex-1" />
                    <span className="text-sm text-muted-foreground">Industry avg: {benchmarks.avgCostReduction}</span>
                  </div>
                </div>
                
                <div>
                  <Label>Expected Service Improvement (%)</Label>
                  <div className="flex items-center space-x-4">
                    <Input
                      type="number"
                      value={metrics.projectedImprovements.serviceImprovement}
                      onChange={(e) => updateMetric('projectedImprovements', 'serviceImprovement', parseInt(e.target.value) || 0)}
                      className="w-24"
                    />
                    <Progress value={metrics.projectedImprovements.serviceImprovement} className="flex-1" />
                    <span className="text-sm text-muted-foreground">Industry avg: {benchmarks.avgServiceImprovement}</span>
                  </div>
                </div>
                
                <div>
                  <Label>Expected Efficiency Gain (%)</Label>
                  <div className="flex items-center space-x-4">
                    <Input
                      type="number"
                      value={metrics.projectedImprovements.efficiencyGain}
                      onChange={(e) => updateMetric('projectedImprovements', 'efficiencyGain', parseInt(e.target.value) || 0)}
                      className="w-24"
                    />
                    <Progress value={metrics.projectedImprovements.efficiencyGain} className="flex-1" />
                  </div>
                </div>
              </div>
              
              <Button onClick={calculateBusinessValue} className="w-full">
                Calculate Business Value
              </Button>
            </TabsContent>
            
            <TabsContent value="results" className="space-y-6">
              {calculatedROI ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 bg-green-50">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <h4 className="font-medium">Annual Savings</h4>
                      </div>
                      <p className="text-2xl font-bold text-green-700">
                        KES {calculatedROI.totalAnnualSavings.toLocaleString()}
                      </p>
                    </Card>
                    
                    <Card className="p-4 bg-blue-50">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        <h4 className="font-medium">ROI</h4>
                      </div>
                      <p className="text-2xl font-bold text-blue-700">
                        {calculatedROI.roi.toFixed(1)}%
                      </p>
                    </Card>
                    
                    <Card className="p-4 bg-purple-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-5 w-5 text-purple-600" />
                        <h4 className="font-medium">Payback Period</h4>
                      </div>
                      <p className="text-2xl font-bold text-purple-700">
                        {calculatedROI.paybackPeriod.toFixed(1)} months
                      </p>
                    </Card>
                  </div>
                  
                  <Card className="p-6">
                    <h4 className="font-medium mb-4">Detailed Breakdown</h4>
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-medium text-green-700 mb-2">Annual Cost Savings:</h5>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>Transportation: KES {calculatedROI.annualSavings.transportation.toLocaleString()}</div>
                          <div>Inventory: KES {calculatedROI.annualSavings.inventory.toLocaleString()}</div>
                          <div>Warehousing: KES {calculatedROI.annualSavings.warehousing.toLocaleString()}</div>
                          <div>Operations: KES {calculatedROI.annualSavings.operations.toLocaleString()}</div>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-blue-700 mb-2">3-Year Value:</h5>
                        <p className="text-lg font-bold">KES {calculatedROI.threeYearValue.toLocaleString()}</p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium mb-2">Industry Comparison:</h5>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>Your ROI: {calculatedROI.roi.toFixed(1)}%</div>
                          <div>Industry Average: {benchmarks.typicalROI}</div>
                          <div>Your Payback: {calculatedROI.paybackPeriod.toFixed(1)} months</div>
                          <div>Industry Average: {benchmarks.paybackPeriod}</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Complete the projections and calculate to see ROI results
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
