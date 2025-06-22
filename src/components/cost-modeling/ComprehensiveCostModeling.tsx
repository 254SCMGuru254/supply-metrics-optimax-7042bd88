import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Calculator, TrendingUp, BarChart3, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useParams } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface CostModelingResult {
  success: boolean;
  result: any;
  recommendations: string[];
  formula: string;
}

interface CostModelInputData {
  [key: string]: any;
}

export const ComprehensiveCostModeling = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("abc-costing");
  const [results, setResults] = useState<Record<string, CostModelingResult>>({});

  const { data: inputs, isLoading: isLoadingInputs } = useQuery<Record<string, CostModelInputData>>({
    queryKey: ['costModelInputs', projectId],
    queryFn: async () => {
      if (!projectId || !user) return {};

      const { data, error } = await supabase
        .from('cost_model_inputs')
        .select('model_type, inputs')
        .eq('project_id', projectId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching cost model inputs:', error);
        throw new Error(error.message);
      }
      
      const formattedData = data.reduce((acc, curr) => {
        acc[curr.model_type] = curr.inputs;
        return acc;
      }, {} as Record<string, CostModelInputData>);

      return formattedData;
    },
    enabled: !!projectId && !!user,
  });

  const upsertMutation = useMutation({
    mutationFn: async ({ modelType, newInputs }: { modelType: string; newInputs: CostModelInputData }) => {
      if (!projectId || !user) return;

      const { error } = await supabase.from('cost_model_inputs').upsert(
        {
          project_id: projectId,
          user_id: user.id,
          model_type: modelType,
          inputs: newInputs,
        },
        { onConflict: 'project_id, user_id, model_type' }
      );

      if (error) {
        console.error(`Error upserting ${modelType} data:`, error);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['costModelInputs', projectId] });
    },
  });

  const handleInputChange = (modelType: string, key: string, value: any) => {
    const currentInputs = inputs?.[modelType] || {};
    const newInputs = { ...currentInputs, [key]: value };
    upsertMutation.mutate({ modelType, newInputs });
  };
  
  // Activity-Based Costing Calculator
  const calculateABC = () => {
    const abcInputs = inputs?.['abc-costing'] || {};
    const { activityRates = "100,200,150", activityUsage = "10,5,8" } = abcInputs;
    
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
    const tcoInputs = inputs?.['tco'] || {};
    const { acquisition = 0, operating = 0, disposal = 0 } = tcoInputs;
    
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
    const costBenefitInputs = inputs?.['cost-benefit'] || {};
    const { benefits = "1000000,1200000,1500000", costs = "800000,900000,950000", 
            discountRate = 0.1, timePeriods = 3 } = costBenefitInputs;
    
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
    const breakEvenInputs = inputs?.['break-even'] || {};
    const { fixedCosts = 0, price = 0, variableCost = 0 } = breakEvenInputs;
    
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
                {result.result && Object.entries(result.result).map(([key, value]) => (
                  <div key={key} className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium text-gray-500">{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {typeof value === 'number' ? `Ksh ${value.toLocaleString(undefined, {maximumFractionDigits: 2})}` : typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                    </p>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="font-semibold mb-2">Recommendations</h4>
                <ul className="list-disc list-inside space-y-1">
                  {result.recommendations.map((rec, index) => <li key={index} className="text-sm text-gray-700">{rec}</li>)}
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="font-semibold text-red-800">Calculation Failed</p>
              {result.recommendations.map((rec, index) => <p key={index} className="text-sm text-red-600">{rec}</p>)}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoadingInputs) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading cost models...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Comprehensive Cost Modeling</h1>
        <p className="text-muted-foreground">Analyze and optimize your supply chain costs.</p>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="abc-costing" onClick={() => setActiveTab('abc-costing')}>Activity-Based Costing</TabsTrigger>
          <TabsTrigger value="tco" onClick={() => setActiveTab('tco')}>Total Cost of Ownership</TabsTrigger>
          <TabsTrigger value="cost-benefit" onClick={() => setActiveTab('cost-benefit')}>Cost-Benefit Analysis</TabsTrigger>
          <TabsTrigger value="break-even" onClick={() => setActiveTab('break-even')}>Break-Even Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="abc-costing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart3/> Activity-Based Costing (ABC)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="activityRates">Activity Rates (comma-separated)</Label>
                <Input id="activityRates" value={inputs?.['abc-costing']?.activityRates ?? ''} onChange={e => handleInputChange('abc-costing', 'activityRates', e.target.value)} placeholder="e.g., 100,200,150" />
              </div>
              <div>
                <Label htmlFor="activityUsage">Activity Usage (comma-separated)</Label>
                <Input id="activityUsage" value={inputs?.['abc-costing']?.activityUsage ?? ''} onChange={e => handleInputChange('abc-costing', 'activityUsage', e.target.value)} placeholder="e.g., 10,5,8" />
              </div>
              <Button onClick={calculateABC}><Calculator className="mr-2 h-4 w-4"/> Calculate ABC</Button>
              {renderResultCard('abc', 'Activity-Based Costing')}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tco">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><DollarSign/> Total Cost of Ownership (TCO)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div>
                <Label htmlFor="acquisition">Acquisition Cost</Label>
                <Input id="acquisition" type="number" value={inputs?.['tco']?.acquisition ?? 0} onChange={e => handleInputChange('tco', 'acquisition', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="operating">Operating Cost</Label>
                <Input id="operating" type="number" value={inputs?.['tco']?.operating ?? 0} onChange={e => handleInputChange('tco', 'operating', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="disposal">Disposal Cost</Label>
                <Input id="disposal" type="number" value={inputs?.['tco']?.disposal ?? 0} onChange={e => handleInputChange('tco', 'disposal', e.target.value)} />
              </div>
              <Button onClick={calculateTCO}><Calculator className="mr-2 h-4 w-4"/> Calculate TCO</Button>
              {renderResultCard('tco', 'Total Cost of Ownership')}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cost-benefit">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><TrendingUp/> Cost-Benefit Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="benefits">Benefits (comma-separated per period)</Label>
                <Input id="benefits" value={inputs?.['cost-benefit']?.benefits ?? ''} onChange={e => handleInputChange('cost-benefit', 'benefits', e.target.value)} placeholder="e.g., 1000000,1200000" />
              </div>
              <div>
                <Label htmlFor="costs">Costs (comma-separated per period)</Label>
                <Input id="costs" value={inputs?.['cost-benefit']?.costs ?? ''} onChange={e => handleInputChange('cost-benefit', 'costs', e.target.value)} placeholder="e.g., 800000,900000" />
              </div>
              <div>
                <Label htmlFor="discountRate">Discount Rate (e.g., 0.1 for 10%)</Label>
                <Input id="discountRate" type="number" step="0.01" value={inputs?.['cost-benefit']?.discountRate ?? 0.1} onChange={e => handleInputChange('cost-benefit', 'discountRate', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="timePeriods">Number of Time Periods (years)</Label>
                <Input id="timePeriods" type="number" value={inputs?.['cost-benefit']?.timePeriods ?? 3} onChange={e => handleInputChange('cost-benefit', 'timePeriods', e.target.value)} />
              </div>
              <Button onClick={calculateCostBenefit}><Calculator className="mr-2 h-4 w-4"/> Calculate Cost-Benefit</Button>
              {renderResultCard('costBenefit', 'Cost-Benefit Analysis')}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="break-even">
          <Card>
            <CardHeader>
              <CardTitle  className="flex items-center gap-2"><BarChart3/> Break-Even Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fixedCosts">Total Fixed Costs</Label>
                <Input id="fixedCosts" type="number" value={inputs?.['break-even']?.fixedCosts ?? 0} onChange={e => handleInputChange('break-even', 'fixedCosts', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="price">Selling Price Per Unit</Label>
                <Input id="price" type="number" value={inputs?.['break-even']?.price ?? 0} onChange={e => handleInputChange('break-even', 'price', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="variableCost">Variable Cost Per Unit</Label>
                <Input id="variableCost" type="number" value={inputs?.['break-even']?.variableCost ?? 0} onChange={e => handleInputChange('break-even', 'variableCost', e.target.value)} />
              </div>
              <Button onClick={calculateBreakEven}><Calculator className="mr-2 h-4 w-4"/> Calculate Break-Even Point</Button>
              {renderResultCard('breakEven', 'Break-Even Analysis')}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 