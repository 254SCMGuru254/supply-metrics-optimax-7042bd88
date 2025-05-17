import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BusinessValueReport } from "@/types/business";

interface ROICalculatorProps {
  selectedModel: string;
  customData?: Partial<BusinessValueReport>;
}

export const ROICalculator = ({ selectedModel, customData }: ROICalculatorProps) => {
  // Define the helper function before using it
  const getDefaultSavingsPercent = (model: string) => {
    switch (model) {
      case "route-optimization": return "20";
      case "inventory-management": return "25";
      case "network-optimization": return "22";
      case "center-of-gravity": return "28";
      case "heuristic": return "18";
      default: return "20";
    }
  };

  const [values, setValues] = useState({
    annualRevenue: customData?.metrics?.find(m => m.name === "Annual Revenue")?.value?.toString().replace('$', '') || "1000000",
    annualCost: customData?.metrics?.find(m => m.name === "Logistics Costs")?.value?.toString().replace('$', '') || "300000",
    implementationCost: "50000",
    annualSavingsPercent: getDefaultSavingsPercent(selectedModel),
  });

  const [calculatedResults, setCalculatedResults] = useState({
    annualSavings: 0,
    implementationROI: 0,
    threeYearROI: 0,
    paybackMonths: 0,
    npv: 0,
  });

  const [hasCalculated, setHasCalculated] = useState(false);

  const handleChange = (field: string, value: string) => {
    setValues({
      ...values,
      [field]: value,
    });
  };

  const calculateROI = () => {
    const annualRevenue = parseFloat(values.annualRevenue);
    const annualCost = parseFloat(values.annualCost);
    const implementationCost = parseFloat(values.implementationCost);
    const savingsPercent = parseFloat(values.annualSavingsPercent) / 100;
    
    const annualSavings = annualCost * savingsPercent;
    const implementationROI = (annualSavings / implementationCost) * 100;
    const threeYearROI = ((annualSavings * 3) / implementationCost) * 100;
    const paybackMonths = (implementationCost / annualSavings) * 12;
    
    // Calculate Net Present Value (NPV) with 10% discount rate
    const discountRate = 0.10;
    let npv = -implementationCost;
    for (let i = 1; i <= 3; i++) {
      npv += annualSavings / Math.pow(1 + discountRate, i);
    }
    
    setCalculatedResults({
      annualSavings,
      implementationROI,
      threeYearROI,
      paybackMonths,
      npv,
    });
    
    setHasCalculated(true);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">ROI Inputs</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="annualRevenue">Annual Revenue ($)</Label>
                <Input
                  id="annualRevenue"
                  type="number"
                  value={values.annualRevenue}
                  onChange={(e) => handleChange("annualRevenue", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="annualCost">Annual Logistics/Supply Chain Cost ($)</Label>
                <Input
                  id="annualCost"
                  type="number"
                  value={values.annualCost}
                  onChange={(e) => handleChange("annualCost", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="implementationCost">Expected Implementation Cost ($)</Label>
                <Input
                  id="implementationCost"
                  type="number"
                  value={values.implementationCost}
                  onChange={(e) => handleChange("implementationCost", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="annualSavingsPercent">Expected Annual Savings (%)</Label>
                <Input
                  id="annualSavingsPercent"
                  type="number"
                  min="1"
                  max="100"
                  value={values.annualSavingsPercent}
                  onChange={(e) => handleChange("annualSavingsPercent", e.target.value)}
                />
              </div>
              <Button onClick={calculateROI} className="w-full">
                Calculate ROI
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">ROI Results</h3>
            {hasCalculated ? (
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground">Annual Cost Savings</p>
                  <p className="text-3xl font-semibold">${calculatedResults.annualSavings.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">First Year ROI</p>
                    <p className="text-2xl font-semibold">{calculatedResults.implementationROI.toFixed(0)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Three Year ROI</p>
                    <p className="text-2xl font-semibold">{calculatedResults.threeYearROI.toFixed(0)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payback Period</p>
                    <p className="text-2xl font-semibold">{calculatedResults.paybackMonths.toFixed(1)} months</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">3-Year NPV</p>
                    <p className="text-2xl font-semibold">${calculatedResults.npv.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                  </div>
                </div>
                <hr />
                <div>
                  <h4 className="font-medium mb-2">Implementation Recommendation</h4>
                  <p className="text-sm">
                    {calculatedResults.paybackMonths < 12
                      ? "This investment has a strong ROI with payback in less than a year. Highly recommended to proceed with implementation."
                      : calculatedResults.paybackMonths < 24
                      ? "This investment shows a moderate ROI with payback in less than two years. Consider proceeding with a phased approach."
                      : "This investment has a longer payback period. Consider negotiating costs or implementing a more targeted solution."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-muted-foreground">Enter your values and calculate ROI to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {hasCalculated && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Implementation Timeline</h3>
          <div className="relative">
            <div className="h-2 bg-muted rounded-full mb-8">
              <div className="h-2 bg-primary rounded-full" style={{ width: "100%" }}></div>
              <div className="absolute -top-1 left-0" style={{ left: "0%" }}>
                <div className="h-4 w-4 rounded-full bg-primary"></div>
                <p className="absolute -bottom-8 transform -translate-x-1/2 text-xs text-center w-20">Project Start</p>
              </div>
              <div className="absolute -top-1" style={{ left: "30%" }}>
                <div className="h-4 w-4 rounded-full bg-primary"></div>
                <p className="absolute -bottom-8 transform -translate-x-1/2 text-xs text-center w-20">Data Integration</p>
              </div>
              <div className="absolute -top-1" style={{ left: "60%" }}>
                <div className="h-4 w-4 rounded-full bg-primary"></div>
                <p className="absolute -bottom-8 transform -translate-x-1/2 text-xs text-center w-20">Deployment</p>
              </div>
              <div className="absolute -top-1" style={{ left: "90%" }}>
                <div className="h-4 w-4 rounded-full bg-primary"></div>
                <p className="absolute -bottom-8 transform -translate-x-1/2 text-xs text-center w-20">Full ROI</p>
              </div>
            </div>
          </div>
          <div className="mt-12 text-sm text-muted-foreground">
            <p>* ROI calculations are estimates based on industry standards and the values you provided. Actual results may vary.</p>
            <p>* Implementation timeline shown is approximate and will vary based on your organization's specific requirements.</p>
          </div>
        </div>
      )}
    </div>
  );
};
