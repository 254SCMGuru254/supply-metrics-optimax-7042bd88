
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { generateBusinessValueReport } from "@/utils/businessValueExport";
import { ModelValueMetricsType, BusinessValueReport, CaseStudy } from "@/types/business";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, FileDown, Lightbulb } from "lucide-react";

interface UserDataInputProps {
  modelType: ModelValueMetricsType;
  onSave: (data: Partial<BusinessValueReport>) => void;
}

export function UserDataInput({ modelType, onSave }: UserDataInputProps) {
  const { toast } = useToast();
  const [companyMetrics, setCompanyMetrics] = useState({
    annualRevenue: "",
    annualCosts: "",
    employeeCount: "",
    fleetSize: "",
    inventoryValue: "",
    annualLogisticsCosts: "",
    serviceLevel: "",
  });

  const [caseStudy, setCaseStudy] = useState<CaseStudy>({
    company: "",
    industry: "",
    challenge: "",
    solution: "",
    results: "",
  });

  const handleMetricChange = (key: string, value: string) => {
    setCompanyMetrics(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleCaseStudyChange = (key: keyof CaseStudy, value: string) => {
    setCaseStudy(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleExport = () => {
    try {
      // Create a report with user data
      const metrics = [
        { name: "Annual Revenue", value: `$${companyMetrics.annualRevenue || "0"}`, icon: "dollar-sign" },
        { name: "Logistics Costs", value: `$${companyMetrics.annualLogisticsCosts || "0"}`, icon: "truck" },
        { name: "Inventory Value", value: `$${companyMetrics.inventoryValue || "0"}`, icon: "package" },
        { name: "Service Level", value: `${companyMetrics.serviceLevel || "0"}%`, icon: "bar-chart" }
      ];

      const userCaseStudies = caseStudy.company ? [caseStudy] : [];

      generateBusinessValueReport(
        getModelName(modelType),
        { metrics },
        { 
          difficulty: "Medium", 
          timeToValue: "2-4 months", 
          dataReadiness: "Partial",
          requirements: ["Historical logistics data", "Current transportation costs", "Demand data"],
          teamRoles: ["Supply Chain Manager", "Data Analyst", "IT Support"],
          skillsNeeded: ["Data analysis", "Supply chain knowledge", "Basic IT skills"]
        },
        userCaseStudies,
        `${modelType}-business-value-report`
      );

      toast({
        title: "Report Generated",
        description: "Your business value report has been generated and downloaded."
      });
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Export Failed",
        description: "Failed to generate business value report",
        variant: "destructive"
      });
    }
  };

  const handleSave = () => {
    const customMetrics = [
      { name: "Annual Revenue", value: `$${companyMetrics.annualRevenue || "0"}`, icon: "dollar-sign" },
      { name: "Logistics Costs", value: `$${companyMetrics.annualLogisticsCosts || "0"}`, icon: "truck" },
      { name: "Inventory Value", value: `$${companyMetrics.inventoryValue || "0"}`, icon: "package" },
      { name: "Service Level", value: `${companyMetrics.serviceLevel || "0"}%`, icon: "bar-chart" }
    ];
    
    const userCaseStudies = caseStudy.company ? [caseStudy] : [];
    
    onSave({ 
      metrics: customMetrics,
      caseStudies: userCaseStudies
    });
    
    toast({
      title: "Data Saved",
      description: "Your business information has been saved."
    });
  };

  const getModelName = (type: ModelValueMetricsType): string => {
    switch (type) {
      case "route-optimization":
        return "Route Optimization";
      case "inventory-management":
        return "Inventory Management";
      case "network-optimization":
        return "Network Optimization";
      case "center-of-gravity":
        return "Center of Gravity";
      case "heuristic":
        return "Heuristic Optimization";
      default:
        return "Supply Chain Optimization";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Enter your company's logistics and financial data to customize ROI calculations and reports.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="annualRevenue">Annual Revenue ($)</Label>
              <Input
                id="annualRevenue"
                value={companyMetrics.annualRevenue}
                onChange={(e) => handleMetricChange("annualRevenue", e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="annualCosts">Annual Costs ($)</Label>
              <Input
                id="annualCosts"
                value={companyMetrics.annualCosts}
                onChange={(e) => handleMetricChange("annualCosts", e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="employeeCount">Employee Count</Label>
              <Input
                id="employeeCount"
                value={companyMetrics.employeeCount}
                onChange={(e) => handleMetricChange("employeeCount", e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="fleetSize">Fleet Size</Label>
              <Input
                id="fleetSize"
                value={companyMetrics.fleetSize}
                onChange={(e) => handleMetricChange("fleetSize", e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="inventoryValue">Inventory Value ($)</Label>
              <Input
                id="inventoryValue"
                value={companyMetrics.inventoryValue}
                onChange={(e) => handleMetricChange("inventoryValue", e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="annualLogisticsCosts">Annual Logistics Costs ($)</Label>
              <Input
                id="annualLogisticsCosts"
                value={companyMetrics.annualLogisticsCosts}
                onChange={(e) => handleMetricChange("annualLogisticsCosts", e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="serviceLevel">Current Service Level (%)</Label>
              <Input
                id="serviceLevel"
                value={companyMetrics.serviceLevel}
                onChange={(e) => handleMetricChange("serviceLevel", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Your Success Story
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Document your company's optimization project to include in reports and ROI analysis.
          </p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  value={caseStudy.company}
                  onChange={(e) => handleCaseStudyChange("company", e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select 
                  value={caseStudy.industry} 
                  onValueChange={(value) => handleCaseStudyChange("industry", value)}
                >
                  <SelectTrigger id="industry">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Distribution">Distribution</SelectItem>
                    <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Agriculture">Agriculture</SelectItem>
                    <SelectItem value="Mining">Mining</SelectItem>
                    <SelectItem value="Construction">Construction</SelectItem>
                    <SelectItem value="Energy">Energy</SelectItem>
                    <SelectItem value="Logistics">Logistics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="challenge">Business Challenge</Label>
              <Textarea
                id="challenge"
                value={caseStudy.challenge}
                onChange={(e) => handleCaseStudyChange("challenge", e.target.value)}
                className="h-20"
              />
            </div>
            
            <div>
              <Label htmlFor="solution">Solution Implemented</Label>
              <Textarea
                id="solution"
                value={caseStudy.solution}
                onChange={(e) => handleCaseStudyChange("solution", e.target.value)}
                className="h-20"
              />
            </div>
            
            <div>
              <Label htmlFor="results">Business Results</Label>
              <Textarea
                id="results"
                value={caseStudy.results}
                onChange={(e) => handleCaseStudyChange("results", e.target.value)}
                className="h-20"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleExport}>
          <FileDown className="h-4 w-4 mr-2" />
          Export as PDF
        </Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Data
        </Button>
      </div>
    </div>
  );
}
