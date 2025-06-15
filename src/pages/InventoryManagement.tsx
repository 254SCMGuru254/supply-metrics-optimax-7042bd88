
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Package, Boxes, Truck, Database, LineChart, BarChart3, Upload, Download, CalculatorIcon, Settings, FileText, TrendingUp } from "lucide-react";
import { InventoryOptimizationContent } from "@/components/inventory-optimization/InventoryOptimizationContent";
import { ExportPdfButton } from "@/components/ui/ExportPdfButton";
import { ModelFormulas } from "@/components/shared/ModelFormulas";
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
              
              <Card className="p-4 border-l-4 border-l-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Service Level</p>
                    <p className="text-2xl font-bold text-gray-900">96.2%</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-orange-500" />
                </div>
              </Card>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <ExportPdfButton
              exportId="inventory-management-page"
              fileName="inventory_management_report"
            />
            <Button onClick={handleImportData} className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import Data
            </Button>
            <Button variant="outline" onClick={handleDownloadTemplate} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Template
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 w-full h-auto bg-gray-50 p-1 rounded-lg">
              <TabsTrigger 
                value="overview" 
                className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="optimization" 
                className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Optimization</span>
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all"
              >
                <LineChart className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger 
                value="forecasting" 
                className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all"
              >
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Forecasting</span>
              </TabsTrigger>
              <TabsTrigger 
                value="reports" 
                className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Reports</span>
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all"
              >
                <Database className="h-4 w-4" />
                <span className="hidden sm:inline">Data</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <TabsContent value="overview" className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Inventory Overview Dashboard</h2>
                <ExportPdfButton
                  exportId="inventory-overview-content"
                  fileName="inventory_overview_report"
                />
              </div>
              <div id="inventory-overview-content">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-700">Active Products</p>
                        <p className="text-3xl font-bold text-blue-900">1,247</p>
                        <p className="text-xs text-blue-600 mt-1">+5.2% from last month</p>
                      </div>
                      <Boxes className="h-10 w-10 text-blue-600" />
                    </div>
                  </Card>
                  
                  <Card className="p-6 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-700">Low Stock Items</p>
                        <p className="text-3xl font-bold text-green-900">23</p>
                        <p className="text-xs text-green-600 mt-1">-12% from last week</p>
                      </div>
                      <Package className="h-10 w-10 text-green-600" />
                    </div>
                  </Card>
                  
                  <Card className="p-6 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-orange-700">Out of Stock</p>
                        <p className="text-3xl font-bold text-orange-900">8</p>
                        <p className="text-xs text-orange-600 mt-1">Critical attention needed</p>
                      </div>
                      <AlertTriangle className="h-10 w-10 text-orange-600" />
                    </div>
                  </Card>
                  
                  <Card className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-700">Reorder Pending</p>
                        <p className="text-3xl font-bold text-purple-900">47</p>
                        <p className="text-xs text-purple-600 mt-1">Processing required</p>
                      </div>
                      <Truck className="h-10 w-10 text-purple-600" />
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Inventory Optimization Tools</h2>
                <ExportPdfButton
                  exportId="optimization-tools-content"
                  fileName="optimization_tools_report"
                />
              </div>
              <div id="optimization-tools-content">
                <InventoryOptimizationContent />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Advanced Analytics</h2>
                <ExportPdfButton
                  exportId="analytics-content"
                  fileName="inventory_analytics_report"
                />
              </div>
              <div id="analytics-content" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Inventory Turnover Analysis</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Fast Moving (A-Class)</span>
                      <span className="font-semibold">247 items</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Medium Moving (B-Class)</span>
                      <span className="font-semibold">624 items</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Slow Moving (C-Class)</span>
                      <span className="font-semibold">376 items</span>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Cost Analysis</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Holding Cost</span>
                      <span className="font-semibold text-red-600">$145,230</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Ordering Cost</span>
                      <span className="font-semibold text-blue-600">$23,450</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Stockout Cost</span>
                      <span className="font-semibold text-orange-600">$8,760</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="forecasting" className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Demand Forecasting</h2>
                <ExportPdfButton
                  exportId="forecasting-content"
                  fileName="demand_forecasting_report"
                />
              </div>
              <div id="forecasting-content">
                <p className="text-gray-600 mb-4">
                  Advanced demand forecasting using machine learning algorithms and historical data analysis.
                </p>
                <div className="text-center py-8 text-gray-400">
                  <LineChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Forecasting module coming soon</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Inventory Reports</h2>
                <ExportPdfButton
                  exportId="reports-content"
                  fileName="inventory_reports_summary"
                />
              </div>
              <div id="reports-content">
                <ModelFormulas modelId="inventory-optimization" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Data Management</h2>
                <ExportPdfButton
                  exportId="settings-content"
                  fileName="data_management_settings"
                />
              </div>
              <div id="settings-content">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Data Import/Export</h3>
                    <div className="space-y-3">
                      <Button className="w-full" onClick={handleImportData}>
                        <Upload className="h-4 w-4 mr-2" />
                        Import Inventory Data
                      </Button>
                      <Button variant="outline" className="w-full" onClick={handleDownloadTemplate}>
                        <Download className="h-4 w-4 mr-2" />
                        Download CSV Template
                      </Button>
                    </div>
                  </Card>
                  
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">System Settings</h3>
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600">
                        Configure default parameters, service levels, and optimization preferences.
                      </div>
                      <Button variant="outline" className="w-full">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure Settings
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InventoryManagement;
