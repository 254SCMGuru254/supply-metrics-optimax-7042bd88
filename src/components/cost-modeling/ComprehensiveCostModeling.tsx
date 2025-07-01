import React, { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

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
      if (error) throw new Error(error.message);
      return data.reduce((acc, curr) => ({ ...acc, [curr.model_type]: curr.inputs }), {});
    },
    enabled: !!projectId && !!user,
  });

  const { data: savedResults, isLoading: isLoadingResults } = useQuery<Record<string, CostModelingResult>>({
    queryKey: ['costModelResults', projectId],
    queryFn: async () => {
      if (!projectId || !user) return {};
      const { data, error } = await supabase
        .from('cost_model_results')
        .select('model_type, results, recommendations, formula')
        .eq('project_id', projectId)
        .eq('user_id', user.id);
      if (error) throw new Error(error.message);
      return data.reduce((acc, curr) => ({ 
          ...acc, 
          [curr.model_type]: {
              success: true,
              result: curr.results,
              recommendations: curr.recommendations,
              formula: curr.formula,
          }
      }), {});
    },
    enabled: !!projectId && !!user,
  });

  useEffect(() => {
    if (savedResults) {
      setResults(savedResults);
    }
  }, [savedResults]);

  const upsertInputsMutation = useMutation({
    mutationFn: async ({ modelType, newInputs }: { modelType: string; newInputs: CostModelInputData }) => {
      if (!projectId || !user) return;
      const { error } = await supabase.from('cost_model_inputs').upsert(
        { project_id: projectId, user_id: user.id, model_type: modelType, inputs: newInputs },
        { onConflict: 'project_id, user_id, model_type' }
      );
      if (error) throw new Error(error.message);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['costModelInputs', projectId] });
    },
    onError: (error: Error) => {
      toast({ title: `Error saving inputs`, description: error.message, variant: 'destructive' });
    }
  });

  const upsertResultsMutation = useMutation({
    mutationFn: async ({ modelType, resultData }: { modelType: string; resultData: CostModelingResult & { inputs: CostModelInputData } }) => {
      if (!projectId || !user) return;
      const { error } = await supabase.from('cost_model_results').upsert(
          { 
              project_id: projectId,
              user_id: user.id,
              model_type: modelType,
              inputs: resultData.inputs,
              results: resultData.result,
              recommendations: resultData.recommendations,
              formula: resultData.formula,
          },
          { onConflict: 'project_id, user_id, model_type' }
      );
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['costModelResults', projectId] });
        toast({ title: 'Analysis Saved', description: 'Your calculation results have been saved.' });
    },
    onError: (error: Error) => {
      toast({ title: `Error saving results`, description: error.message, variant: 'destructive' });
    }
  });

  const handleInputChange = (modelType: string, key: string, value: any) => {
    const currentInputs = inputs?.[modelType] || {};
    const newInputs = { ...currentInputs, [key]: value };
    upsertInputsMutation.mutate({ modelType, newInputs });
  };
  
  const runAndSaveAnalysis = (modelType: string, calculationFn: () => (CostModelingResult | null)) => {
      const resultData = calculationFn();
      if (resultData) {
          setResults(prev => ({...prev, [modelType]: resultData}));
          upsertResultsMutation.mutate({ 
              modelType, 
              resultData: { ...resultData, inputs: inputs?.[modelType] || {} }
          });
      }
  };

  const calculateABC = (): CostModelingResult | null => {
    const abcInputs = inputs?.['abc-costing'] || {};
    const { activityRates = "100,200,150", activityUsage = "10,5,8" } = abcInputs;
    
    try {
      const rates = activityRates.split(',').map(Number);
      const usage = activityUsage.split(',').map(Number);
      if (rates.some(isNaN) || usage.some(isNaN)) throw new Error("Invalid number format.");
      if (rates.length !== usage.length) throw new Error("Activity rates and usage must have same number of items");
      
      const abcTotalCost = rates.reduce((total, rate, index) => total + (rate * usage[index]), 0);
      const activities = rates.map((rate, index) => ({ activity: `Activity ${index + 1}`, rate, usage, cost: rate * usage[index] }));
      
      return {
          success: true,
          result: { abcTotalCost, activities, averageCostPerActivity: abcTotalCost / activities.length },
          recommendations: [`Total ABC Cost: Ksh ${abcTotalCost.toLocaleString()}`, "Review high-cost activities", "Consider activity consolidation"],
          formula: "ABC Cost = Σ(Activity Rate × Activity Usage)"
      };
    } catch (error) {
      toast({ title: 'ABC Calculation Error', description: (error as Error).message, variant: 'destructive' });
      return null;
    }
  };

  const calculateTCO = (): CostModelingResult | null => {
    const tcoInputs = inputs?.['tco'] || {};
    const { acquisition = 0, operating = 0, disposal = 0 } = tcoInputs;
    
    const acquisitionCost = Number(acquisition);
    const operatingCost = Number(operating);
    const disposalCost = Number(disposal);
    
    const tco = acquisitionCost + operatingCost + disposalCost;
    if (tco === 0) {
        toast({ title: 'TCO Calculation Error', description: 'Total cost is zero, cannot provide breakdown.', variant: 'destructive' });
        return null;
    }

    const breakdown = {
      acquisition: { amount: acquisitionCost, percentage: (acquisitionCost / tco) * 100 },
      operating: { amount: operatingCost, percentage: (operatingCost / tco) * 100 },
      disposal: { amount: disposalCost, percentage: (disposalCost / tco) * 100 }
    };
    
    const largestComponent = Object.keys(breakdown).reduce((a, b) => breakdown[a].amount > breakdown[b].amount ? a : b);

    return {
        success: true,
        result: { tco, breakdown, largestComponent },
        recommendations: [`TCO: Ksh ${tco.toLocaleString()}`, `Largest cost: ${largestComponent} (${breakdown[largestComponent].percentage.toFixed(1)}%)`, "Focus on optimizing the largest cost component"],
        formula: "TCO = Acquisition Cost + Operating Cost + Disposal Cost"
    };
  };

  const calculateCostBenefit = (): CostModelingResult | null => {
    const cbInputs = inputs?.['cost-benefit'] || {};
    const { benefits = "1000000", costs = "800000", discountRate = 0.1, timePeriods = 3 } = cbInputs;
    
    try {
      const benefitValues = benefits.split(',').map(Number);
      const costValues = costs.split(',').map(Number);
      const rate = Number(discountRate);
      const periods = Number(timePeriods);
      if (isNaN(rate) || isNaN(periods)) throw new Error("Invalid number format for rate or periods.");

      let npv = 0;
      const yearlyAnalysis = [];
      
      for (let t = 1; t <= periods; t++) {
        const yearBenefit = benefitValues[t-1] || benefitValues[benefitValues.length-1];
        const yearCost = costValues[t-1] || costValues[costValues.length-1];
        const netCashFlow = yearBenefit - yearCost;
        const presentValue = netCashFlow / Math.pow(1 + rate, t);
        npv += presentValue;
        yearlyAnalysis.push({ year: t, netCashFlow, presentValue });
      }
      
      const totalBenefits = yearlyAnalysis.reduce((sum, y) => sum + (benefitValues[y.year-1] || 0), 0);
      const totalCosts = yearlyAnalysis.reduce((sum, y) => sum + (costValues[y.year-1] || 0), 0);
      const bcr = totalBenefits / totalCosts;

      return {
          success: true,
          result: { npv, bcr, yearlyAnalysis },
          recommendations: [`Net Present Value (NPV): Ksh ${npv.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, `Benefit-Cost Ratio (BCR): ${bcr.toFixed(2)}`, npv > 0 ? "Project is financially viable." : "Project is not financially viable."],
          formula: "NPV = Σ [ (Benefit - Cost) / (1 + r)^t ]"
      };
    } catch (error) {
      toast({ title: 'Cost-Benefit Calculation Error', description: (error as Error).message, variant: 'destructive' });
      return null;
    }
  };

  const calculateBreakEven = (): CostModelingResult | null => {
      const beInputs = inputs?.['break-even'] || {};
      const { fixedCosts = 0, variableCostPerUnit = 0, pricePerUnit = 0 } = beInputs;

      const fc = Number(fixedCosts);
      const vcu = Number(variableCostPerUnit);
      const ppu = Number(pricePerUnit);

      if (ppu <= vcu) {
          toast({ title: 'Break-Even Error', description: 'Price per unit must be greater than variable cost per unit.', variant: 'destructive'});
          return null;
      }

      const breakEvenUnits = fc / (ppu - vcu);
      const breakEvenRevenue = breakEvenUnits * ppu;

      return {
          success: true,
          result: { breakEvenUnits, breakEvenRevenue },
          recommendations: [`Break-even point: ${breakEvenUnits.toFixed(2)} units`, `Break-even revenue: Ksh ${breakEvenRevenue.toLocaleString()}`, "Monitor fixed costs and pricing to manage break-even point."],
          formula: "Break-Even Units = Fixed Costs / (Price Per Unit - Variable Cost)"
      };
  };

  const renderResultCard = (resultKey: string, title: string) => {
    const result = results[resultKey];
    if (!result || !result.success) return null;

    const renderResultContent = () => {
        // Custom render logic for each model type can go here
        return <pre className="text-sm bg-gray-100 p-2 rounded-md whitespace-pre-wrap">{JSON.stringify(result.result, null, 2)}</pre>;
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {title} Results <Badge variant="secondary">{result.formula}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Analysis</h4>
            {renderResultContent()}
          </div>
          <div>
            <h4 className="font-semibold mb-2">Recommendations</h4>
            <ul className="list-disc pl-5 space-y-1">
              {result.recommendations.map((rec, i) => <li key={i} className="text-sm">{rec}</li>)}
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  const isLoading = isLoadingInputs || isLoadingResults;

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Comprehensive Cost Modeling</h1>
        <p className="text-muted-foreground">Analyze your supply chain costs from every angle.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="abc-costing">Activity-Based Costing</TabsTrigger>
          <TabsTrigger value="tco">Total Cost of Ownership</TabsTrigger>
          <TabsTrigger value="cost-benefit">Cost-Benefit Analysis</TabsTrigger>
          <TabsTrigger value="break-even">Break-Even Analysis</TabsTrigger>
        </TabsList>

        {isLoading && <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>}

        {!isLoading && (
          <>
            <TabsContent value="abc-costing">
              <Card>
                <CardHeader><CardTitle>Activity-Based Costing (ABC)</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="activityRates">Activity Rates (comma-separated)</Label>
                    <Input id="activityRates" value={inputs?.['abc-costing']?.activityRates || ""} onChange={(e) => handleInputChange('abc-costing', 'activityRates', e.target.value)} placeholder="e.g., 100,200,150" />
                  </div>
                  <div>
                    <Label htmlFor="activityUsage">Activity Usage (comma-separated)</Label>
                    <Input id="activityUsage" value={inputs?.['abc-costing']?.activityUsage || ""} onChange={(e) => handleInputChange('abc-costing', 'activityUsage', e.target.value)} placeholder="e.g., 10,5,8" />
                  </div>
                  <Button onClick={() => runAndSaveAnalysis('abc', calculateABC)} disabled={upsertResultsMutation.isPending}>
                    {upsertResultsMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calculator className="mr-2 h-4 w-4" />} Calculate ABC
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tco">
                <Card>
                    <CardHeader><CardTitle>Total Cost of Ownership (TCO)</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="acquisition">Acquisition Costs</Label>
                            <Input id="acquisition" type="number" value={inputs?.['tco']?.acquisition || 0} onChange={(e) => handleInputChange('tco', 'acquisition', e.target.valueAsNumber)} />
                        </div>
                        <div>
                            <Label htmlFor="operating">Operating Costs</Label>
                            <Input id="operating" type="number" value={inputs?.['tco']?.operating || 0} onChange={(e) => handleInputChange('tco', 'operating', e.target.valueAsNumber)} />
                        </div>
                        <div>
                            <Label htmlFor="disposal">Disposal Costs</Label>
                            <Input id="disposal" type="number" value={inputs?.['tco']?.disposal || 0} onChange={(e) => handleInputChange('tco', 'disposal', e.target.valueAsNumber)} />
                        </div>
                        <Button onClick={() => runAndSaveAnalysis('tco', calculateTCO)} disabled={upsertResultsMutation.isPending}>
                            {upsertResultsMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calculator className="mr-2 h-4 w-4" />} Calculate TCO
                        </Button>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="cost-benefit">
                <Card>
                    <CardHeader><CardTitle>Cost-Benefit Analysis (CBA)</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                         <div>
                            <Label htmlFor="benefits">Benefits (comma-separated per period)</Label>
                            <Input id="benefits" value={inputs?.['cost-benefit']?.benefits || ""} onChange={(e) => handleInputChange('cost-benefit', 'benefits', e.target.value)} placeholder="e.g., 10000,12000,15000" />
                        </div>
                        <div>
                            <Label htmlFor="costs">Costs (comma-separated per period)</Label>
                            <Input id="costs" value={inputs?.['cost-benefit']?.costs || ""} onChange={(e) => handleInputChange('cost-benefit', 'costs', e.target.value)} placeholder="e.g., 8000,9000,9500" />
                        </div>
                        <div>
                            <Label htmlFor="discountRate">Discount Rate (%)</Label>
                            <Input id="discountRate" type="number" step="0.01" value={inputs?.['cost-benefit']?.discountRate || 0.1} onChange={(e) => handleInputChange('cost-benefit', 'discountRate', e.target.valueAsNumber)} />
                        </div>
                         <div>
                            <Label htmlFor="timePeriods">Time Periods (e.g., years)</Label>
                            <Input id="timePeriods" type="number" value={inputs?.['cost-benefit']?.timePeriods || 3} onChange={(e) => handleInputChange('cost-benefit', 'timePeriods', e.target.valueAsNumber)} />
                        </div>
                        <Button onClick={() => runAndSaveAnalysis('cost-benefit', calculateCostBenefit)} disabled={upsertResultsMutation.isPending}>
                            {upsertResultsMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calculator className="mr-2 h-4 w-4" />} Calculate CBA
                        </Button>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="break-even">
                <Card>
                    <CardHeader><CardTitle>Break-Even Analysis</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="fixedCosts">Total Fixed Costs</Label>
                            <Input id="fixedCosts" type="number" value={inputs?.['break-even']?.fixedCosts || 0} onChange={(e) => handleInputChange('break-even', 'fixedCosts', e.target.valueAsNumber)} />
                        </div>
                        <div>
                            <Label htmlFor="variableCostPerUnit">Variable Cost Per Unit</Label>
                            <Input id="variableCostPerUnit" type="number" value={inputs?.['break-even']?.variableCostPerUnit || 0} onChange={(e) => handleInputChange('break-even', 'variableCostPerUnit', e.target.valueAsNumber)} />
                        </div>
                        <div>
                            <Label htmlFor="pricePerUnit">Price Per Unit</Label>
                            <Input id="pricePerUnit" type="number" value={inputs?.['break-even']?.pricePerUnit || 0} onChange={(e) => handleInputChange('break-even', 'pricePerUnit', e.target.valueAsNumber)} />
                        </div>
                        <Button onClick={() => runAndSaveAnalysis('break-even', calculateBreakEven)} disabled={upsertResultsMutation.isPending}>
                            {upsertResultsMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calculator className="mr-2 h-4 w-4" />} Calculate Break-Even
                        </Button>
                    </CardContent>
                </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
      
      <div className="space-y-4">
        {renderResultCard('abc', 'Activity-Based Costing')}
        {renderResultCard('tco', 'Total Cost of Ownership')}
        {renderResultCard('cost-benefit', 'Cost-Benefit Analysis')}
        {renderResultCard('break-even', 'Break-Even Analysis')}
      </div>
    </div>
  );
};
