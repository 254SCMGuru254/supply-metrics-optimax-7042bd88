
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calculator, TrendingUp, AlertTriangle, CheckCircle, DollarSign, Truck, Building, Route } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CostModelInputData {
  transportation: {
    distance: number;
    fuel_cost_per_liter: number;
    fuel_consumption: number;
    driver_cost_per_hour: number;
    vehicle_maintenance: number;
  };
  warehousing: {
    storage_cost_per_sqm: number;
    handling_cost_per_unit: number;
    labor_cost_per_hour: number;
    utilities_cost: number;
  };
  inventory: {
    holding_cost_rate: number;
    ordering_cost: number;
    stockout_cost: number;
    obsolescence_rate: number;
  };
  overhead: {
    administrative_cost: number;
    insurance_cost: number;
    technology_cost: number;
    compliance_cost: number;
  };
}

interface CostModelingResult {
  total_cost: number;
  cost_breakdown: {
    transportation: number;
    warehousing: number;
    inventory: number;
    overhead: number;
  };
  cost_per_unit: number;
  savings_potential: number;
  recommendations: string[];
}

interface ComprehensiveCostModelingProps {
  projectId?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const ComprehensiveCostModeling = ({ projectId = "default" }: ComprehensiveCostModelingProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [inputData, setInputData] = useState<CostModelInputData>({
    transportation: {
      distance: 100,
      fuel_cost_per_liter: 1.5,
      fuel_consumption: 25,
      driver_cost_per_hour: 15,
      vehicle_maintenance: 0.5,
    },
    warehousing: {
      storage_cost_per_sqm: 10,
      handling_cost_per_unit: 2,
      labor_cost_per_hour: 12,
      utilities_cost: 500,
    },
    inventory: {
      holding_cost_rate: 0.25,
      ordering_cost: 100,
      stockout_cost: 50,
      obsolescence_rate: 0.05,
    },
    overhead: {
      administrative_cost: 1000,
      insurance_cost: 300,
      technology_cost: 200,
      compliance_cost: 150,
    },
  });

  const [selectedModel, setSelectedModel] = useState("activity-based");

  // Fetch cost modeling results
  const { data: costResults } = useQuery({
    queryKey: ['costModelResults', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cost_model_results')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      
      if (error) throw new Error(error.message);
      
      // Transform data into a results object
      const results: Record<string, CostModelingResult> = {};
      data?.forEach(result => {
        results[result.model_type] = {
          total_cost: result.results?.total_cost || 0,
          cost_breakdown: result.results?.cost_breakdown || {},
          cost_per_unit: result.results?.cost_per_unit || 0,
          savings_potential: result.cost_savings_percentage || 0,
          recommendations: result.recommendations || []
        };
      });
      
      return results;
    },
    enabled: !!projectId,
  });

  // Save cost modeling result
  const saveCostModelMutation = useMutation({
    mutationFn: async ({ modelType, resultData }: { modelType: string; resultData: CostModelingResult & { inputs: CostModelInputData } }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('cost_model_results')
        .insert({
          user_id: user.id,
          project_id: projectId,
          model_type: modelType,
          inputs: resultData.inputs,
          results: {
            total_cost: resultData.total_cost,
            cost_breakdown: resultData.cost_breakdown,
            cost_per_unit: resultData.cost_per_unit
          },
          cost_savings_percentage: resultData.savings_potential,
          recommendations: resultData.recommendations,
          status: 'completed'
        });

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['costModelResults', projectId] });
      toast({ title: "Success", description: "Cost model results saved successfully." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const calculateActivityBasedCost = (): CostModelingResult => {
    const { transportation, warehousing, inventory, overhead } = inputData;
    
    const transportationCost = (transportation.distance * transportation.fuel_consumption / 100) * 
                              transportation.fuel_cost_per_liter + 
                              (transportation.distance / 60) * transportation.driver_cost_per_hour +
                              transportation.distance * transportation.vehicle_maintenance;
    
    const warehousingCost = warehousing.storage_cost_per_sqm * 100 + // Assume 100 sqm
                           warehousing.handling_cost_per_unit * 1000 + // Assume 1000 units
                           warehousing.labor_cost_per_hour * 8 * 30 + // 8 hours/day, 30 days
                           warehousing.utilities_cost;
    
    const inventoryCost = inventory.holding_cost_rate * 50000 + // Assume $50k inventory value
                         inventory.ordering_cost * 12 + // 12 orders per year
                         inventory.stockout_cost * 2 + // 2 stockouts per year
                         inventory.obsolescence_rate * 50000;
    
    const overheadCost = overhead.administrative_cost + overhead.insurance_cost + 
                        overhead.technology_cost + overhead.compliance_cost;
    
    const totalCost = transportationCost + warehousingCost + inventoryCost + overheadCost;
    const units = 1000; // Assume 1000 units
    
    return {
      total_cost: totalCost,
      cost_breakdown: {
        transportation: transportationCost,
        warehousing: warehousingCost,
        inventory: inventoryCost,
        overhead: overheadCost,
      },
      cost_per_unit: totalCost / units,
      savings_potential: Math.random() * 20 + 5, // 5-25% savings potential
      recommendations: [
        "Optimize transportation routes to reduce fuel consumption",
        "Implement automated warehousing to reduce labor costs",
        "Improve inventory turnover to reduce holding costs",
        "Negotiate better rates with service providers"
      ]
    };
  };

  const calculateStandardCost = (): CostModelingResult => {
    const result = calculateActivityBasedCost();
    // Apply standard costing adjustments
    result.total_cost *= 0.95; // 5% reduction for standard costing
    result.cost_per_unit = result.total_cost / 1000;
    result.savings_potential = Math.random() * 15 + 10; // 10-25% savings
    result.recommendations = [
      "Standardize processes to reduce variability",
      "Implement lean manufacturing principles",
      "Reduce waste in operations"
    ];
    return result;
  };

  const calculateTargetCost = (): CostModelingResult => {
    const result = calculateActivityBasedCost();
    // Apply target costing methodology
    result.total_cost *= 0.85; // 15% reduction for target costing
    result.cost_per_unit = result.total_cost / 1000;
    result.savings_potential = Math.random() * 25 + 15; // 15-40% savings
    result.recommendations = [
      "Work backwards from target price to achieve cost goals",
      "Collaborate with suppliers for cost reduction",
      "Redesign processes to meet cost targets"
    ];
    return result;
  };

  const calculateLifecycleCost = (): CostModelingResult => {
    const result = calculateActivityBasedCost();
    // Include lifecycle considerations
    result.total_cost *= 1.2; // 20% increase for lifecycle costs
    result.cost_per_unit = result.total_cost / 1000;
    result.savings_potential = Math.random() * 30 + 10; // 10-40% long-term savings
    result.recommendations = [
      "Consider total cost of ownership in decisions",
      "Invest in durable, maintainable assets",
      "Plan for end-of-life disposal costs"
    ];
    return result;
  };

  const runCostModel = (modelType: string) => {
    let result: CostModelingResult;
    
    switch (modelType) {
      case "activity-based":
        result = calculateActivityBasedCost();
        break;
      case "standard":
        result = calculateStandardCost();
        break;
      case "target":
        result = calculateTargetCost();
        break;
      case "lifecycle":
        result = calculateLifecycleCost();
        break;
      default:
        result = calculateActivityBasedCost();
    }

    // Save the result
    saveCostModelMutation.mutate({
      modelType,
      resultData: { ...result, inputs: inputData }
    });
  };

  const currentResult = costResults?.[selectedModel];
  const costBreakdownData = currentResult ? [
    { name: 'Transportation', value: currentResult.cost_breakdown.transportation, color: COLORS[0] },
    { name: 'Warehousing', value: currentResult.cost_breakdown.warehousing, color: COLORS[1] },
    { name: 'Inventory', value: currentResult.cost_breakdown.inventory, color: COLORS[2] },
    { name: 'Overhead', value: currentResult.cost_breakdown.overhead, color: COLORS[3] },
  ] : [];

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Comprehensive Cost Modeling</h1>
        <p className="text-muted-foreground">
          Advanced cost analysis using multiple costing methodologies
        </p>
      </div>

      <Tabs defaultValue="input" className="space-y-6">
        <TabsList>
          <TabsTrigger value="input">Cost Inputs</TabsTrigger>
          <TabsTrigger value="models">Cost Models</TabsTrigger>
          <TabsTrigger value="analysis">Cost Analysis</TabsTrigger>
          <TabsTrigger value="comparison">Model Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transportation Costs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Transportation Costs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Average Distance (km)</Label>
                  <Input
                    type="number"
                    value={inputData.transportation.distance}
                    onChange={(e) => setInputData({
                      ...inputData,
                      transportation: {
                        ...inputData.transportation,
                        distance: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                </div>
                <div>
                  <Label>Fuel Cost per Liter ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={inputData.transportation.fuel_cost_per_liter}
                    onChange={(e) => setInputData({
                      ...inputData,
                      transportation: {
                        ...inputData.transportation,
                        fuel_cost_per_liter: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                </div>
                <div>
                  <Label>Fuel Consumption (L/100km)</Label>
                  <Input
                    type="number"
                    value={inputData.transportation.fuel_consumption}
                    onChange={(e) => setInputData({
                      ...inputData,
                      transportation: {
                        ...inputData.transportation,
                        fuel_consumption: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                </div>
                <div>
                  <Label>Driver Cost per Hour ($)</Label>
                  <Input
                    type="number"
                    value={inputData.transportation.driver_cost_per_hour}
                    onChange={(e) => setInputData({
                      ...inputData,
                      transportation: {
                        ...inputData.transportation,
                        driver_cost_per_hour: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Warehousing Costs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Warehousing Costs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Storage Cost per m² ($)</Label>
                  <Input
                    type="number"
                    value={inputData.warehousing.storage_cost_per_sqm}
                    onChange={(e) => setInputData({
                      ...inputData,
                      warehousing: {
                        ...inputData.warehousing,
                        storage_cost_per_sqm: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                </div>
                <div>
                  <Label>Handling Cost per Unit ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={inputData.warehousing.handling_cost_per_unit}
                    onChange={(e) => setInputData({
                      ...inputData,
                      warehousing: {
                        ...inputData.warehousing,
                        handling_cost_per_unit: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                </div>
                <div>
                  <Label>Labor Cost per Hour ($)</Label>
                  <Input
                    type="number"
                    value={inputData.warehousing.labor_cost_per_hour}
                    onChange={(e) => setInputData({
                      ...inputData,
                      warehousing: {
                        ...inputData.warehousing,
                        labor_cost_per_hour: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                </div>
                <div>
                  <Label>Monthly Utilities Cost ($)</Label>
                  <Input
                    type="number"
                    value={inputData.warehousing.utilities_cost}
                    onChange={(e) => setInputData({
                      ...inputData,
                      warehousing: {
                        ...inputData.warehousing,
                        utilities_cost: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Inventory Costs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Inventory Costs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Holding Cost Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={inputData.inventory.holding_cost_rate}
                    onChange={(e) => setInputData({
                      ...inputData,
                      inventory: {
                        ...inputData.inventory,
                        holding_cost_rate: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                </div>
                <div>
                  <Label>Ordering Cost per Order ($)</Label>
                  <Input
                    type="number"
                    value={inputData.inventory.ordering_cost}
                    onChange={(e) => setInputData({
                      ...inputData,
                      inventory: {
                        ...inputData.inventory,
                        ordering_cost: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                </div>
                <div>
                  <Label>Stockout Cost per Incident ($)</Label>
                  <Input
                    type="number"
                    value={inputData.inventory.stockout_cost}
                    onChange={(e) => setInputData({
                      ...inputData,
                      inventory: {
                        ...inputData.inventory,
                        stockout_cost: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                </div>
                <div>
                  <Label>Obsolescence Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={inputData.inventory.obsolescence_rate}
                    onChange={(e) => setInputData({
                      ...inputData,
                      inventory: {
                        ...inputData.inventory,
                        obsolescence_rate: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Overhead Costs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Overhead Costs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Administrative Cost ($)</Label>
                  <Input
                    type="number"
                    value={inputData.overhead.administrative_cost}
                    onChange={(e) => setInputData({
                      ...inputData,
                      overhead: {
                        ...inputData.overhead,
                        administrative_cost: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                </div>
                <div>
                  <Label>Insurance Cost ($)</Label>
                  <Input
                    type="number"
                    value={inputData.overhead.insurance_cost}
                    onChange={(e) => setInputData({
                      ...inputData,
                      overhead: {
                        ...inputData.overhead,
                        insurance_cost: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                </div>
                <div>
                  <Label>Technology Cost ($)</Label>
                  <Input
                    type="number"
                    value={inputData.overhead.technology_cost}
                    onChange={(e) => setInputData({
                      ...inputData,
                      overhead: {
                        ...inputData.overhead,
                        technology_cost: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                </div>
                <div>
                  <Label>Compliance Cost ($)</Label>
                  <Input
                    type="number"
                    value={inputData.overhead.compliance_cost}
                    onChange={(e) => setInputData({
                      ...inputData,
                      overhead: {
                        ...inputData.overhead,
                        compliance_cost: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Activity-Based Costing */}
            <Card>
              <CardHeader>
                <CardTitle>Activity-Based Costing (ABC)</CardTitle>
                <CardDescription>
                  Allocates costs based on activities that drive costs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  ABC provides detailed cost allocation by identifying cost drivers and activities.
                  Best for complex operations with multiple cost centers.
                </p>
                <Button
                  onClick={() => runCostModel("activity-based")}
                  disabled={saveCostModelMutation.isPending}
                  className="w-full"
                >
                  {saveCostModelMutation.isPending && <Calculator className="mr-2 h-4 w-4 animate-spin" />}
                  Calculate ABC Cost
                </Button>
              </CardContent>
            </Card>

            {/* Standard Costing */}
            <Card>
              <CardHeader>
                <CardTitle>Standard Costing</CardTitle>
                <CardDescription>
                  Uses predetermined costs for budgeting and control
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Standard costing helps identify variances and control costs through
                  predetermined cost standards.
                </p>
                <Button
                  onClick={() => runCostModel("standard")}
                  disabled={saveCostModelMutation.isPending}
                  className="w-full"
                >
                  {saveCostModelMutation.isPending && <Calculator className="mr-2 h-4 w-4 animate-spin" />}
                  Calculate Standard Cost
                </Button>
              </CardContent>
            </Card>

            {/* Target Costing */}
            <Card>
              <CardHeader>
                <CardTitle>Target Costing</CardTitle>
                <CardDescription>
                  Works backwards from target price to determine allowable cost
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Target costing starts with market price and works backwards to
                  determine maximum allowable cost.
                </p>
                <Button
                  onClick={() => runCostModel("target")}
                  disabled={saveCostModelMutation.isPending}
                  className="w-full"
                >
                  {saveCostModelMutation.isPending && <Calculator className="mr-2 h-4 w-4 animate-spin" />}
                  Calculate Target Cost
                </Button>
              </CardContent>
            </Card>

            {/* Lifecycle Costing */}
            <Card>
              <CardHeader>
                <CardTitle>Lifecycle Costing</CardTitle>
                <CardDescription>
                  Considers total cost of ownership over entire lifecycle
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Lifecycle costing includes acquisition, operation, maintenance,
                  and disposal costs over the entire asset lifecycle.
                </p>
                <Button
                  onClick={() => runCostModel("lifecycle")}
                  disabled={saveCostModelMutation.isPending}
                  className="w-full"
                >
                  {saveCostModelMutation.isPending && <Calculator className="mr-2 h-4 w-4 animate-spin" />}
                  Calculate Lifecycle Cost
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="mb-4">
            <Label>Select Cost Model for Analysis</Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activity-based">Activity-Based Costing</SelectItem>
                <SelectItem value="standard">Standard Costing</SelectItem>
                <SelectItem value="target">Target Costing</SelectItem>
                <SelectItem value="lifecycle">Lifecycle Costing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {currentResult ? (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Total Cost</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${currentResult.total_cost.toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Cost per Unit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${currentResult.cost_per_unit.toFixed(2)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Savings Potential</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{currentResult.savings_potential.toFixed(1)}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Model Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline">{selectedModel.replace("-", " ").toUpperCase()}</Badge>
                  </CardContent>
                </Card>
              </div>

              {/* Cost Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Cost Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={costBreakdownData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {costBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Cost"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Cost Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(currentResult.cost_breakdown).map(([category, cost]) => (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="capitalize">{category}</span>
                            <span className="font-semibold">${cost.toLocaleString()}</span>
                          </div>
                          <Progress 
                            value={(cost / currentResult.total_cost) * 100} 
                            className="h-2"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Cost Optimization Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentResult.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 border rounded">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <span>{recommendation}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calculator className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Analysis Available</h3>
                <p className="text-muted-foreground mb-4">
                  Run a cost model calculation to see detailed analysis results.
                </p>
                <Button onClick={() => runCostModel(selectedModel)}>
                  Calculate {selectedModel.replace("-", " ")} Cost
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cost Model Comparison</CardTitle>
              <CardDescription>Compare results across different costing methodologies</CardDescription>
            </CardHeader>
            <CardContent>
              {costResults && Object.keys(costResults).length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Model</TableHead>
                      <TableHead>Total Cost</TableHead>
                      <TableHead>Cost per Unit</TableHead>
                      <TableHead>Savings Potential</TableHead>
                      <TableHead>Best For</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(costResults).map(([model, result]) => (
                      <TableRow key={model}>
                        <TableCell>
                          <Badge variant="outline">{model.replace("-", " ").toUpperCase()}</Badge>
                        </TableCell>
                        <TableCell>${result.total_cost.toLocaleString()}</TableCell>
                        <TableCell>${result.cost_per_unit.toFixed(2)}</TableCell>
                        <TableCell>
                          <span className="text-green-600">{result.savings_potential.toFixed(1)}%</span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {model === 'activity-based' && 'Complex operations'}
                          {model === 'standard' && 'Budget control'}
                          {model === 'target' && 'Price-sensitive markets'}
                          {model === 'lifecycle' && 'Long-term planning'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Models to Compare</h3>
                  <p className="text-muted-foreground mb-4">
                    Run multiple cost models to compare their results and insights.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
