
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileDown, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ROICalculatorProps {
  selectedModel?: string;
}

interface ROIParameters {
  initialInvestment: number;
  annualSavings: number;
  implementationTime: number;
  annualMaintenanceCost: number;
  projectLifespan: number;
}

interface ROIResults {
  roi: number;
  paybackPeriod: number;
  npv: number;
  irr: number;
}

export const ROICalculator = ({ selectedModel }: ROICalculatorProps) => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [parameters, setParameters] = useState<ROIParameters>({
    initialInvestment: 50000,
    annualSavings: 150000,
    implementationTime: 3,
    annualMaintenanceCost: 10000,
    projectLifespan: 5
  });
  const [results, setResults] = useState<ROIResults | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load default parameters based on the selected model
    if (selectedModel) {
      const modelDefaults = getModelDefaults(selectedModel);
      setParameters(modelDefaults);
    }
  }, [selectedModel]);

  const getModelDefaults = (model: string): ROIParameters => {
    // Default parameters specific to each optimization model
    const defaults: { [key: string]: ROIParameters } = {
      "route-optimization": {
        initialInvestment: 50000,
        annualSavings: 150000,
        implementationTime: 2,
        annualMaintenanceCost: 10000,
        projectLifespan: 5
      },
      "inventory-management": {
        initialInvestment: 75000,
        annualSavings: 300000,
        implementationTime: 3,
        annualMaintenanceCost: 15000,
        projectLifespan: 5
      },
      "network-optimization": {
        initialInvestment: 100000,
        annualSavings: 400000,
        implementationTime: 4,
        annualMaintenanceCost: 20000,
        projectLifespan: 5
      },
      "center-of-gravity": {
        initialInvestment: 60000,
        annualSavings: 200000,
        implementationTime: 2,
        annualMaintenanceCost: 12000,
        projectLifespan: 5
      },
      "heuristic": {
        initialInvestment: 65000,
        annualSavings: 250000,
        implementationTime: 2,
        annualMaintenanceCost: 13000,
        projectLifespan: 5
      }
    };

    return defaults[model] || defaults["route-optimization"];
  };

  const handleInputChange = (key: keyof ROIParameters, value: string) => {
    const numericValue = parseFloat(value) || 0;
    setParameters({ ...parameters, [key]: numericValue });
  };

  const calculateROI = () => {
    setIsCalculating(true);
    
    // Simulate API call or complex calculation
    setTimeout(() => {
      const { initialInvestment, annualSavings, implementationTime, annualMaintenanceCost, projectLifespan } = parameters;
      
      // Basic ROI calculation over project lifespan
      const totalCost = initialInvestment + (annualMaintenanceCost * projectLifespan);
      const totalSavings = annualSavings * (projectLifespan - (implementationTime / 12));
      const roi = ((totalSavings - totalCost) / totalCost) * 100;
      
      // Payback period calculation (in months)
      const monthlySavings = annualSavings / 12;
      const paybackPeriod = (initialInvestment / monthlySavings) + implementationTime;
      
      // NPV Calculation (simplified with 5% discount rate)
      const discountRate = 0.05;
      let npv = -initialInvestment;
      for (let year = 1; year <= projectLifespan; year++) {
        // No savings during implementation period
        const yearSavings = year <= implementationTime / 12 ? 0 : annualSavings - annualMaintenanceCost;
        npv += yearSavings / Math.pow(1 + discountRate, year);
      }
      
      // Simple IRR approximation
      const irr = (annualSavings - annualMaintenanceCost) / initialInvestment * 100;
      
      setResults({
        roi: parseFloat(roi.toFixed(2)),
        paybackPeriod: parseFloat(paybackPeriod.toFixed(1)),
        npv: parseFloat(npv.toFixed(2)),
        irr: parseFloat(irr.toFixed(2))
      });
      
      setIsCalculating(false);
    }, 1000);
  };

  const handleExportPDF = async () => {
    if (!results) return;
    
    setIsExporting(true);
    
    try {
      // This would be imported from your exportToPdf utility
      const { exportOptimizationResultsToPdf } = await import('@/utils/exportToPdf');
      
      exportOptimizationResultsToPdf(
        `${selectedModel || 'Supply Chain'} Optimization`,
        "ROI Analysis",
        {
          parameters,
          results,
          date: new Date().toISOString()
        },
        `${selectedModel || 'optimization'}-roi-analysis`
      );
      
      toast({
        title: "Export Complete",
        description: "The ROI analysis has been exported as PDF"
      });
    } catch (error) {
      console.error("PDF export error:", error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "An error occurred while generating the PDF"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getModelName = (modelId: string): string => {
    const modelNames: {[key: string]: string} = {
      "route-optimization": "Route Optimization",
      "inventory-management": "Inventory Management",
      "network-optimization": "Network Optimization",
      "center-of-gravity": "Center of Gravity",
      "heuristic": "Heuristic Optimization"
    };
    return modelNames[modelId] || "Supply Chain Optimization";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">ROI Calculator</h2>
        {results && (
          <Button 
            variant="outline" 
            onClick={handleExportPDF} 
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileDown className="h-4 w-4" />
            )}
            Export PDF
          </Button>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{getModelName(selectedModel || "route-optimization")} ROI Analysis</CardTitle>
          <CardDescription>
            Calculate the return on investment for implementing this optimization solution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="parameters" className="space-y-4">
            <TabsList>
              <TabsTrigger value="parameters">Parameters</TabsTrigger>
              <TabsTrigger value="results" disabled={!results}>Results</TabsTrigger>
            </TabsList>
            
            <TabsContent value="parameters" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="initialInvestment">Initial Investment (USD)</Label>
                  <Input
                    id="initialInvestment"
                    type="number"
                    value={parameters.initialInvestment}
                    onChange={(e) => handleInputChange('initialInvestment', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    The upfront cost of implementing the optimization solution
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="annualSavings">Expected Annual Savings (USD)</Label>
                  <Input
                    id="annualSavings"
                    type="number"
                    value={parameters.annualSavings}
                    onChange={(e) => handleInputChange('annualSavings', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    The yearly cost savings expected from the optimization
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="implementationTime">Implementation Time (months)</Label>
                  <Input
                    id="implementationTime"
                    type="number"
                    value={parameters.implementationTime}
                    onChange={(e) => handleInputChange('implementationTime', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Time required to fully implement the solution
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="annualMaintenanceCost">Annual Maintenance Cost (USD)</Label>
                  <Input
                    id="annualMaintenanceCost"
                    type="number"
                    value={parameters.annualMaintenanceCost}
                    onChange={(e) => handleInputChange('annualMaintenanceCost', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Yearly cost to maintain and support the solution
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="projectLifespan">Project Lifespan (years)</Label>
                  <Input
                    id="projectLifespan"
                    type="number"
                    value={parameters.projectLifespan}
                    onChange={(e) => handleInputChange('projectLifespan', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Expected useful life of the solution
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <Button 
                  onClick={calculateROI}
                  disabled={isCalculating}
                >
                  {isCalculating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Calculating...
                    </>
                  ) : "Calculate ROI"}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="results">
              {results && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-primary">{results.roi}%</div>
                        <p className="text-sm font-medium">Return on Investment</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-primary">{results.paybackPeriod} months</div>
                        <p className="text-sm font-medium">Payback Period</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-primary">${results.npv.toLocaleString()}</div>
                        <p className="text-sm font-medium">Net Present Value</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-primary">{results.irr}%</div>
                        <p className="text-sm font-medium">Internal Rate of Return</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Analysis</h3>
                    <p className="text-muted-foreground">
                      Based on your inputs, the {getModelName(selectedModel || "route-optimization")} project is expected to 
                      yield a {results.roi}% return on investment over {parameters.projectLifespan} years. 
                      The initial investment of ${parameters.initialInvestment.toLocaleString()} will be recovered in 
                      approximately {results.paybackPeriod} months, with annual savings of ${parameters.annualSavings.toLocaleString()}.
                    </p>
                    <p className="text-muted-foreground mt-2">
                      With a positive NPV of ${results.npv.toLocaleString()}, this project is financially viable and expected to 
                      create significant value for your organization.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
