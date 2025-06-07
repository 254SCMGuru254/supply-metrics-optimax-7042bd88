
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Package, Boxes, Truck, Database, LineChart, BarChart3, Upload, Download, CalculatorIcon, Settings, FileText, TrendingUp } from "lucide-react";
import { InventoryOptimizationContent } from "@/components/inventory-optimization/InventoryOptimizationContent";
import { ExportPdfButton } from "@/components/ui/ExportPdfButton";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const fetchInventoryData = async () => {
  try {
    const response = await axios.get(`${backendUrl}/api/inventory/data`);
    return response.data;
  } catch (error) {
    console.error("Error fetching inventory data:", error);
    throw new Error("Failed to fetch inventory data");
  }
};

const InventoryManagement = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['inventoryData'],
    queryFn: fetchInventoryData,
    enabled: false,
  });

  const handleImportData = () => {
    toast({
      title: "Data Import",
      description: "Ready to connect with backend inventory services",
    });
  };

  const handleDownloadTemplate = () => {
    const headers = "product_id,name,category,unit_cost,annual_demand,ordering_cost,holding_cost,lead_time,service_level";
    const sampleData = [
      "P001,Rice,Grains,100,2000,50,0.2,7,95",
      "P002,Beans,Legumes,80,1500,50,0.15,5,95",
      "P003,Sugar,Essentials,120,3000,50,0.2,10,98"
    ];
    const csvContent = [headers, ...sampleData].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Template Downloaded",
      description: "CSV template has been downloaded successfully"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" id="inventory-management-page">
      <div className="container mx-auto py-8 space-y-8">
        {/* Professional Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white rounded-xl shadow-sm p-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Inventory Management System
                </h1>
                <p className="text-gray-600 mt-1">
                  Enterprise-grade inventory optimization with industry-standard mathematical models
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <Card className="p-4 border-l-4 border-l-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total SKUs</p>
                    <p className="text-2xl font-bold text-gray-900">1,247</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-500" />
                </div>
              </Card>
              
              <Card className="p-4 border-l-4 border-l-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Inventory Value</p>
                    <p className="text-2xl font-bold text-gray-900">$2.4M</p>
                  </div>
                  <CalculatorIcon className="h-8 w-8 text-green-500" />
                </div>
              </Card>
              
              <Card className="p-4 border-l-4 border-l-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Turnover Rate</p>
                    <p className="text-2xl font-bold text-gray-900">8.3x</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                </div>
              </Card>
              
              <Card className="p-4 border-l-4 border-l-amber-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Service Level</p>
                    <p className="text-2xl font-bold text-gray-900">98.7%</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-amber-500" />
                </div>
              </Card>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-3">
            <ExportPdfButton 
              title="Inventory Management Report"
              exportId="inventory-management-page"
              fileName="inventory_management_report"
            />
            
            <Button variant="outline" onClick={handleDownloadTemplate} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Template
            </Button>
            
            <Button onClick={handleImportData} className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import Data
            </Button>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-white rounded-xl shadow-sm p-2 mb-8">
            <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full h-auto p-1 bg-transparent">
              <TabsTrigger 
                value="overview" 
                className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg transition-all"
              >
                <Database className="h-5 w-5" />
                <span className="text-sm font-medium">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="optimization" 
                className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg transition-all"
              >
                <Settings className="h-5 w-5" />
                <span className="text-sm font-medium">EOQ & Safety Stock</span>
              </TabsTrigger>
              <TabsTrigger 
                value="multi-echelon" 
                className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg transition-all"
              >
                <Boxes className="h-5 w-5" />
                <span className="text-sm font-medium">Multi-Echelon</span>
              </TabsTrigger>
              <TabsTrigger 
                value="forecasting" 
                className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg transition-all"
              >
                <LineChart className="h-5 w-5" />
                <span className="text-sm font-medium">Forecasting</span>
              </TabsTrigger>
              <TabsTrigger 
                value="reports" 
                className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg transition-all"
              >
                <FileText className="h-5 w-5" />
                <span className="text-sm font-medium">Reports</span>
              </TabsTrigger>
              <TabsTrigger 
                value="advanced" 
                className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg transition-all"
              >
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium">Advanced Models</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 bg-white shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Boxes className="h-5 w-5 text-primary" />
                  Mathematical Models Implemented
                </h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-l-blue-500 pl-4">
                    <h4 className="font-semibold text-blue-700">Wilson EOQ Formula</h4>
                    <p className="text-sm text-gray-600">Economic Order Quantity optimization with holding and ordering costs</p>
                  </div>
                  <div className="border-l-4 border-l-green-500 pl-4">
                    <h4 className="font-semibold text-green-700">METRIC Multi-Echelon Model</h4>
                    <p className="text-sm text-gray-600">Multi-Echelon Technique for Recoverable Item Control</p>
                  </div>
                  <div className="border-l-4 border-l-purple-500 pl-4">
                    <h4 className="font-semibold text-purple-700">Graves-Willems Algorithm</h4>
                    <p className="text-sm text-gray-600">Strategic safety stock placement in general networks</p>
                  </div>
                  <div className="border-l-4 border-l-amber-500 pl-4">
                    <h4 className="font-semibold text-amber-700">Prophet Time Series</h4>
                    <p className="text-sm text-gray-600">Advanced demand forecasting with seasonality</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Performance Metrics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-700">Inventory Accuracy</h4>
                    <p className="text-2xl font-bold text-blue-900">99.2%</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="text-sm font-medium text-green-700">Fill Rate</h4>
                    <p className="text-2xl font-bold text-green-900">98.7%</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="text-sm font-medium text-purple-700">Days of Supply</h4>
                    <p className="text-2xl font-bold text-purple-900">42.3</p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-lg">
                    <h4 className="text-sm font-medium text-amber-700">Stockout Events</h4>
                    <p className="text-2xl font-bold text-amber-900">0.8%</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="optimization">
            <InventoryOptimizationContent />
          </TabsContent>

          <TabsContent value="multi-echelon" className="space-y-6">
            <Card className="p-6 bg-white shadow-sm">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Boxes className="h-6 w-6 text-primary" />
                Multi-Echelon Inventory Analysis
              </h2>
              <p className="text-gray-600 mb-6">
                Optimize inventory across multiple supply chain tiers using the METRIC model and Graves-Willems algorithm.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">Echelon 1: Distribution Centers</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Facilities:</strong> 3 centers</p>
                    <p><strong>Lead Time:</strong> 5-7 days</p>
                    <p><strong>Service Level:</strong> 99%</p>
                    <p><strong>Safety Stock:</strong> 15 days</p>
                  </div>
                </Card>
                
                <Card className="p-4 bg-green-50 border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">Echelon 2: Regional Warehouses</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Facilities:</strong> 8 warehouses</p>
                    <p><strong>Lead Time:</strong> 2-3 days</p>
                    <p><strong>Service Level:</strong> 97%</p>
                    <p><strong>Safety Stock:</strong> 8 days</p>
                  </div>
                </Card>
                
                <Card className="p-4 bg-purple-50 border-purple-200">
                  <h3 className="font-semibold text-purple-800 mb-2">Echelon 3: Local Stores</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Facilities:</strong> 42 stores</p>
                    <p><strong>Lead Time:</strong> 1 day</p>
                    <p><strong>Service Level:</strong> 95%</p>
                    <p><strong>Safety Stock:</strong> 3 days</p>
                  </div>
                </Card>
              </div>

              <div className="flex gap-4">
                <Button className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Run Multi-Echelon Optimization
                </Button>
                <ExportPdfButton 
                  title="Multi-Echelon Analysis Report"
                  exportId="inventory-management-page"
                  fileName="multi_echelon_analysis"
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="forecasting" className="space-y-6">
            <Card className="p-6 bg-white shadow-sm">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <LineChart className="h-6 w-6 text-primary" />
                Advanced Demand Forecasting
              </h2>
              <p className="text-gray-600 mb-6">
                Predict future inventory needs using Prophet, ARIMA, and machine learning models.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="p-4 border-l-4 border-l-blue-500">
                  <h3 className="font-semibold text-blue-700 mb-2">Prophet Time Series</h3>
                  <p className="text-sm text-gray-600 mb-3">Facebook's robust forecasting with seasonality detection</p>
                  <div className="text-xs text-blue-600">
                    <p><strong>MAPE:</strong> 7.2%</p>
                    <p><strong>Coverage:</strong> 94.5%</p>
                  </div>
                </Card>
                
                <Card className="p-4 border-l-4 border-l-green-500">
                  <h3 className="font-semibold text-green-700 mb-2">ARIMA Models</h3>
                  <p className="text-sm text-gray-600 mb-3">Auto-regressive integrated moving average</p>
                  <div className="text-xs text-green-600">
                    <p><strong>MAPE:</strong> 8.7%</p>
                    <p><strong>AIC:</strong> -1847.2</p>
                  </div>
                </Card>
                
                <Card className="p-4 border-l-4 border-l-purple-500">
                  <h3 className="font-semibold text-purple-700 mb-2">Ensemble Methods</h3>
                  <p className="text-sm text-gray-600 mb-3">Combined forecasts weighted by accuracy</p>
                  <div className="text-xs text-purple-600">
                    <p><strong>MAPE:</strong> 6.1%</p>
                    <p><strong>Models:</strong> 5 combined</p>
                  </div>
                </Card>
              </div>

              <div className="flex gap-4">
                <Button className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Generate Forecast
                </Button>
                <ExportPdfButton 
                  title="Demand Forecasting Report"
                  exportId="inventory-management-page"
                  fileName="demand_forecast_analysis"
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card className="p-6 bg-white shadow-sm">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                Comprehensive Reports
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-4 border hover:shadow-md transition-shadow">
                  <h3 className="font-semibold mb-2">Inventory Health Report</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Complete analysis of inventory status, turnover, and obsolescence risks
                  </p>
                  <ExportPdfButton 
                    title="Inventory Health Report"
                    exportId="inventory-management-page"
                    fileName="inventory_health_report"
                  />
                </Card>
                
                <Card className="p-4 border hover:shadow-md transition-shadow">
                  <h3 className="font-semibold mb-2">EOQ Analysis Report</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Economic order quantities, reorder points, and safety stock calculations
                  </p>
                  <ExportPdfButton 
                    title="EOQ Analysis Report"
                    exportId="inventory-management-page"
                    fileName="eoq_analysis_report"
                  />
                </Card>
                
                <Card className="p-4 border hover:shadow-md transition-shadow">
                  <h3 className="font-semibold mb-2">ABC Classification Report</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Pareto analysis and item categorization for focused management
                  </p>
                  <ExportPdfButton 
                    title="ABC Classification Report"
                    exportId="inventory-management-page"
                    fileName="abc_classification_report"
                  />
                </Card>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card className="p-6 bg-white shadow-sm">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                Advanced Optimization Models
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Industry-Specific Models</h3>
                  <div className="space-y-3">
                    <Card className="p-4 bg-blue-50">
                      <h4 className="font-medium text-blue-800">Horticultural EOQ</h4>
                      <p className="text-sm text-gray-600">Perishability-adjusted model for fresh produce</p>
                    </Card>
                    <Card className="p-4 bg-green-50">
                      <h4 className="font-medium text-green-800">Cold Chain Optimization</h4>
                      <p className="text-sm text-gray-600">Temperature-controlled inventory management</p>
                    </Card>
                    <Card className="p-4 bg-purple-50">
                      <h4 className="font-medium text-purple-800">Retail Supply Chain</h4>
                      <p className="text-sm text-gray-600">Multi-echelon retail optimization (MERO)</p>
                    </Card>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Optimization Techniques</h3>
                  <div className="space-y-3">
                    <Card className="p-4 bg-amber-50">
                      <h4 className="font-medium text-amber-800">Stochastic Programming</h4>
                      <p className="text-sm text-gray-600">Uncertainty handling in demand variability</p>
                    </Card>
                    <Card className="p-4 bg-red-50">
                      <h4 className="font-medium text-red-800">Robust Optimization</h4>
                      <p className="text-sm text-gray-600">Worst-case scenario protection</p>
                    </Card>
                    <Card className="p-4 bg-indigo-50">
                      <h4 className="font-medium text-indigo-800">Dynamic Programming</h4>
                      <p className="text-sm text-gray-600">Multi-period inventory optimization</p>
                    </Card>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InventoryManagement;
