
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Calculator, TrendingUp, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CostModelingResult {
  success: boolean;
  result: any;
  recommendations: string[];
  formula: string;
}

export const ComprehensiveCostModeling = () => {
  const [activeTab, setActiveTab] = useState("abc-costing");
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [results, setResults] = useState<Record<string, CostModelingResult>>({});

  const handleInputChange = (key: string, value: any) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  // Activity-Based Costing Calculator
  const calculateABC = () => {
    const { activityRates = "100,200,150", activityUsage = "10,5,8" } = inputs;
    
    try {
      const rates = activityRates.split(',').map(Number);
      const usage = activityUsage.split(',').map(Number);
      
      if (rates.length !== usage.length) {
        throw new Error("Activity rates and usage must have same number of items");
      }
      
      const abcTotalCost = rates.reduce((total, rate, index) => total + (rate * usage[index]), 0);
      const activities = rates.map((rate, index) => ({
        activity: `Activity ${index + 1}`,
        rate: rate,
        usage: usage[index],
        cost: rate * usage[index]
      }));
      
      setResults(prev => ({
        ...prev,
        abc: {
          success: true,
          result: {
            abcTotalCost,
            activities,
            averageCostPerActivity: abcTotalCost / activities.length
          },
          recommendations: [
            `Total ABC Cost: Ksh ${abcTotalCost.toLocaleString()}`,
            "Review high-cost activities for optimization opportunities",
            "Consider activity consolidation where possible"
          ],
          formula: "ABC Cost = Σ(Activity Rate × Activity Usage)"
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        abc: {
          success: false,
          result: null,
          recommendations: ["Please provide valid comma-separated numbers"],
          formula: "ABC Cost = Σ(Activity Rate × Activity Usage)"
        }
      }));
    }
  };

  // Total Cost of Ownership Calculator
  const calculateTCO = () => {
    const { acquisition = 0, operating = 0, disposal = 0 } = inputs;
    
    const acquisitionCost = Number(acquisition);
    const operatingCost = Number(operating);
    const disposalCost = Number(disposal);
    
    const tco = acquisitionCost + operatingCost + disposalCost;
    const breakdown = {
      acquisition: { amount: acquisitionCost, percentage: (acquisitionCost / tco) * 100 },
      operating: { amount: operatingCost, percentage: (operatingCost / tco) * 100 },
      disposal: { amount: disposalCost, percentage: (disposalCost / tco) * 100 }
    };
    
    setResults(prev => ({
      ...prev,
      tco: {
        success: true,
        result: {
          tco,
          breakdown,
          largestComponent: Object.keys(breakdown).reduce((a, b) => 
            breakdown[a].amount > breakdown[b].amount ? a : b
          )
        },
        recommendations: [
          `Total Cost of Ownership: Ksh ${tco.toLocaleString()}`,
          `Largest cost component: ${Object.keys(breakdown).reduce((a, b) => 
            breakdown[a].amount > breakdown[b].amount ? a : b
          )} (${breakdown[Object.keys(breakdown).reduce((a, b) => 
            breakdown[a].amount > breakdown[b].amount ? a : b
          )].percentage.toFixed(1)}%)`,
          "Focus optimization efforts on the largest cost component"
        ],
        formula: "TCO = Acquisition Cost + Operating Cost + Disposal Cost"
      }
    }));
  };

  // Cost-Benefit Analysis Calculator
  const calculateCostBenefit = () => {
    const { benefits = "1000000,1200000,1500000", costs = "800000,900000,950000", 
            discountRate = 0.1, timePeriods = 3 } = inputs;
    
    try {
      const benefitValues = benefits.split(',').map(Number);
      const costValues = costs.split(',').map(Number);
      const rate = Number(discountRate);
      const periods = Number(timePeriods);
      
      let npv = 0;
      const yearlyAnalysis = [];
      
      for (let t = 1; t <= periods; t++) {
        const yearBenefit = benefitValues[t-1] || benefitValues[benefitValues.length-1];
        const yearCost = costValues[t-1] || costValues[costValues.length-1];
        const netCashFlow = yearBenefit - yearCost;
        const presentValue = netCashFlow / Math.pow(1 + rate, t);
        npv += presentValue;
        
        yearlyAnalysis.push({
          year: t,
          benefits: yearBenefit,
          costs: yearCost,
          netCashFlow,
          presentValue
        });
      }
      
      const totalBenefits = benefitValues.reduce((sum, b) => sum + b, 0);
      const totalCosts = costValues.reduce((sum, c) => sum + c, 0);
      const benefitCostRatio = totalBenefits / totalCosts;
      
      setResults(prev => ({
        ...prev,
        costBenefit: {
          success: true,
          result: {
            npv,
            benefitCostRatio,
            yearlyAnalysis,
            recommendation: npv > 0 ? "Investment is profitable" : "Investment is not profitable"
          },
          recommendations: [
            `Net Present Value: Ksh ${npv.toLocaleString()}`,
            `Benefit-Cost Ratio: ${benefitCostRatio.toFixed(2)}`,
            npv > 0 ? "✅ Investment recommended" : "❌ Investment not recommended"
          ],
          formula: "NPV = Σ[(Benefits - Costs) / (1 + r)^t]"
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        costBenefit: {
          success: false,
          result: null,
          recommendations: ["Please provide valid inputs for all fields"],
          formula: "NPV = Σ[(Benefits - Costs) / (1 + r)^t]"
        }
      }));
    }
  };

  // Break-Even Analysis Calculator
  const calculateBreakEven = () => {
    const { fixedCosts = 0, price = 0, variableCost = 0 } = inputs;
    
    const fixed = Number(fixedCosts);
    const sellingPrice = Number(price);
    const variable = Number(variableCost);
    
    const contributionMargin = sellingPrice - variable;
    
    if (contributionMargin <= 0) {
      setResults(prev => ({
        ...prev,
        breakEven: {
          success: false,
          result: null,
          recommendations: ["Selling price must be greater than variable cost"],
          formula: "Break-Even = Fixed Costs / (Price - Variable Cost)"
        }
      }));
      return;
    }
    
    const breakEvenVolume = fixed / contributionMargin;
    const breakEvenRevenue = breakEvenVolume * sellingPrice;
    const contributionMarginRatio = (contributionMargin / sellingPrice) * 100;
    
    setResults(prev => ({
      ...prev,
      breakEven: {
        success: true,
        result: {
          breakEvenVolume,
          breakEvenRevenue,
          contributionMargin,
          contributionMarginRatio,
          safetyMargin: contributionMarginRatio > 30 ? "High" : contributionMarginRatio > 15 ? "Medium" : "Low"
        },
        recommendations: [
          `Break-Even Volume: ${Math.ceil(breakEvenVolume).toLocaleString()} units`,
          `Break-Even Revenue: Ksh ${breakEvenRevenue.toLocaleString()}`,
          `Contribution Margin: ${contributionMarginRatio.toFixed(1)}%`
        ],
        formula: "Break-Even = Fixed Costs / (Price - Variable Cost)"
      }
    }));
  };

  const renderResultCard = (resultKey: string, title: string) => {
    const result = results[resultKey];
    if (!result) return null;

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {title} Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          {result.success ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="font-semibold text-green-800">Calculation Successful</p>
                <p className="text-sm text-green-600">Formula: {result.formula}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(result.result).map(([key, value]) => (
                  <div key={key} className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-sm text-blue-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-lg font-bold text-blue-900">
                      {typeof value === 'number' ? value.toLocaleString() : String(value)}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <p className="font-semibold">Recommendations:</p>
                {result.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-1">
                      {index + 1}
                    </Badge>
                    <p className="text-sm">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="font-semibold text-red-800">Calculation Failed</p>
              <p className="text-sm text-red-600">Formula: {result.formula}</p>
              <div className="mt-2 space-y-1">
                {result.recommendations.map((rec, index) => (
                  <p key={index} className="text-sm text-red-700">• {rec}</p>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <DollarSign className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Cost Modeling & Financial Analysis</h2>
          <p className="text-muted-foreground">Comprehensive financial modeling for supply chain investments</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="abc-costing">ABC Costing</TabsTrigger>
          <TabsTrigger value="tco-analysis">TCO Analysis</TabsTrigger>
          <TabsTrigger value="cost-benefit">Cost-Benefit</TabsTrigger>
          <TabsTrigger value="break-even">Break-Even</TabsTrigger>
        </TabsList>

        <TabsContent value="abc-costing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity-Based Costing (ABC)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="activityRates">Activity Rates (comma-separated)</Label>
                  <Input
                    id="activityRates"
                    value={inputs.activityRates || ""}
                    onChange={e => handleInputChange('activityRates', e.target.value)}
                    placeholder="100,200,150"
                  />
                </div>
                <div>
                  <Label htmlFor="activityUsage">Activity Usage (comma-separated)</Label>
                  <Input
                    id="activityUsage"
                    value={inputs.activityUsage || ""}
                    onChange={e => handleInputChange('activityUsage', e.target.value)}
                    placeholder="10,5,8"
                  />
                </div>
              </div>
              <Button onClick={calculateABC} className="w-full">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate ABC Cost
              </Button>
              {renderResultCard('abc', 'Activity-Based Costing')}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tco-analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Cost of Ownership (TCO)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="acquisition">Acquisition Cost (Ksh)</Label>
                  <Input
                    id="acquisition"
                    type="number"
                    value={inputs.acquisition || ""}
                    onChange={e => handleInputChange('acquisition', e.target.value)}
                    placeholder="1000000"
                  />
                </div>
                <div>
                  <Label htmlFor="operating">Operating Cost (Ksh)</Label>
                  <Input
                    id="operating"
                    type="number"
                    value={inputs.operating || ""}
                    onChange={e => handleInputChange('operating', e.target.value)}
                    placeholder="500000"
                  />
                </div>
                <div>
                  <Label htmlFor="disposal">Disposal Cost (Ksh)</Label>
                  <Input
                    id="disposal"
                    type="number"
                    value={inputs.disposal || ""}
                    onChange={e => handleInputChange('disposal', e.target.value)}
                    placeholder="50000"
                  />
                </div>
              </div>
              <Button onClick={calculateTCO} className="w-full">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate TCO
              </Button>
              {renderResultCard('tco', 'Total Cost of Ownership')}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cost-benefit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cost-Benefit Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="benefits">Benefits per Year (comma-separated)</Label>
                  <Input
                    id="benefits"
                    value={inputs.benefits || ""}
                    onChange={e => handleInputChange('benefits', e.target.value)}
                    placeholder="1000000,1200000,1500000"
                  />
                </div>
                <div>
                  <Label htmlFor="costs">Costs per Year (comma-separated)</Label>
                  <Input
                    id="costs"
                    value={inputs.costs || ""}
                    onChange={e => handleInputChange('costs', e.target.value)}
                    placeholder="800000,900000,950000"
                  />
                </div>
                <div>
                  <Label htmlFor="discountRate">Discount Rate (decimal)</Label>
                  <Input
                    id="discountRate"
                    type="number"
                    step="0.01"
                    value={inputs.discountRate || ""}
                    onChange={e => handleInputChange('discountRate', e.target.value)}
                    placeholder="0.1"
                  />
                </div>
                <div>
                  <Label htmlFor="timePeriods">Time Periods (years)</Label>
                  <Input
                    id="timePeriods"
                    type="number"
                    value={inputs.timePeriods || ""}
                    onChange={e => handleInputChange('timePeriods', e.target.value)}
                    placeholder="3"
                  />
                </div>
              </div>
              <Button onClick={calculateCostBenefit} className="w-full">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate NPV
              </Button>
              {renderResultCard('costBenefit', 'Cost-Benefit Analysis')}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="break-even" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Break-Even Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="fixedCosts">Fixed Costs (Ksh)</Label>
                  <Input
                    id="fixedCosts"
                    type="number"
                    value={inputs.fixedCosts || ""}
                    onChange={e => handleInputChange('fixedCosts', e.target.value)}
                    placeholder="500000"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Selling Price per Unit (Ksh)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={inputs.price || ""}
                    onChange={e => handleInputChange('price', e.target.value)}
                    placeholder="100"
                  />
                </div>
                <div>
                  <Label htmlFor="variableCost">Variable Cost per Unit (Ksh)</Label>
                  <Input
                    id="variableCost"
                    type="number"
                    value={inputs.variableCost || ""}
                    onChange={e => handleInputChange('variableCost', e.target.value)}
                    placeholder="60"
                  />
                </div>
              </div>
              <Button onClick={calculateBreakEven} className="w-full">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Break-Even Point
              </Button>
              {renderResultCard('breakEven', 'Break-Even Analysis')}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprehensiveCostModeling;
