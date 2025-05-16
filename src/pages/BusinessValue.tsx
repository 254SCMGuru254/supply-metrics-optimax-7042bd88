
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OptimizationValueMetrics } from "@/components/business-value/OptimizationValueMetrics";
import { ROICalculator } from "@/components/business-value/ROICalculator";
import { UserDataInput } from "@/components/business-value/UserDataInput";
import { BarChart3, Calculator, FileEdit } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ModelValueMetricsType, BusinessValueReport } from "@/types/business";

const BusinessValue = () => {
  const [selectedModel, setSelectedModel] = useState<string>("route-optimization");
  const [customBusinessData, setCustomBusinessData] = useState<Partial<BusinessValueReport>>({});

  const handleSaveUserData = (data: Partial<BusinessValueReport>) => {
    setCustomBusinessData(data);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Business Value & ROI</h1>
        <p className="text-muted-foreground mt-2">
          Quantifying the impact of supply chain optimization through measurable outcomes
        </p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="font-medium">Select Optimization Model:</div>
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="route-optimization">Route Optimization</SelectItem>
            <SelectItem value="inventory-management">Inventory Management</SelectItem>
            <SelectItem value="network-optimization">Network Optimization</SelectItem>
            <SelectItem value="center-of-gravity">Center of Gravity</SelectItem>
            <SelectItem value="heuristic">Heuristic Optimization</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Optimization Metrics</span>
          </TabsTrigger>
          <TabsTrigger value="roi" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            <span>ROI Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="your-data" className="flex items-center gap-2">
            <FileEdit className="h-4 w-4" />
            <span>Your Business Data</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="metrics" className="mt-6">
          <OptimizationValueMetrics 
            selectedModel={selectedModel} 
            customData={customBusinessData}
          />
        </TabsContent>
        
        <TabsContent value="roi" className="mt-6">
          <ROICalculator 
            selectedModel={selectedModel}
            customData={customBusinessData}
          />
        </TabsContent>

        <TabsContent value="your-data" className="mt-6">
          <UserDataInput 
            modelType={selectedModel as ModelValueMetricsType}
            onSave={handleSaveUserData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessValue;
