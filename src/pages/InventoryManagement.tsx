
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Package, Boxes, Truck, Database, LineChart, BarChart3, Upload, Download, CalculatorIcon, Settings } from "lucide-react";
import { InventoryOptimizationContent } from "@/components/inventory-optimization/InventoryOptimizationContent";
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
    enabled: false, // Don't fetch automatically, will enable when API is ready
  });

  const handleImportData = () => {
    toast({
      title: "Data Import",
      description: "Ready to connect with backend inventory services",
    });
  };

  const handleDownloadTemplate = () => {
    // Generate a sample CSV with headers for inventory data
    const headers = "product_id,name,category,unit_cost,annual_demand,ordering_cost,holding_cost,lead_time,service_level";
    const sampleData = [
      "P001,Rice,Grains,100,2000,50,0.2,7,95",
      "P002,Beans,Legumes,80,1500,50,0.15,5,95",
      "P003,Sugar,Essentials,120,3000,50,0.2,10,98"
    ];
    const csvContent = [headers, ...sampleData].join("\n");
    
    // Create a download link
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
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Package className="h-8 w-8" />
            Inventory Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Optimize inventory levels and stock policies using industry-standard models
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownloadTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
          
          <Button onClick={handleImportData}>
            <Upload className="h-4 w-4 mr-2" />
            Import Inventory Data
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="optimization">Inventory Optimization</TabsTrigger>
          <TabsTrigger value="multi-echelon">Multi-Echelon Analysis</TabsTrigger>
          <TabsTrigger value="forecasting">Stock Forecasting</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6 flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">321</h3>
              <p className="text-sm text-muted-foreground">Total SKUs</p>
            </Card>
            
            <Card className="p-6 flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CalculatorIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold">$847,320</h3>
              <p className="text-sm text-muted-foreground">Total Inventory Value</p>
            </Card>
            
            <Card className="p-6 flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold">7.2</h3>
              <p className="text-sm text-muted-foreground">Inventory Turns</p>
            </Card>
            
            <Card className="p-6 flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <LineChart className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold">98.3%</h3>
              <p className="text-sm text-muted-foreground">Service Level</p>
            </Card>
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Inventory Management System</h2>
            <p className="mb-6">
              The Inventory Management System helps you optimize stock levels across your supply chain.
              It provides tools built on established mathematical models for inventory optimization, multi-echelon analysis, and stock forecasting.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <Card className="p-4 border-l-4 border-l-blue-500">
                <div className="flex items-center gap-3 mb-2">
                  <Boxes className="h-5 w-5 text-blue-500" />
                  <h3 className="font-medium">EOQ Optimization</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Calculate Economic Order Quantities, safety stock levels, and reorder points using the Wilson formula and statistical models.
                </p>
                <div className="mt-2 text-xs text-blue-600">
                  <strong>Models used:</strong> Wilson EOQ, Safety Stock Calculation, Reorder Point Optimization
                </div>
              </Card>
              
              <Card className="p-4 border-l-4 border-l-green-500">
                <div className="flex items-center gap-3 mb-2">
                  <Truck className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium">Multi-Echelon Analysis</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Optimize inventory across multiple tiers using the METRIC model and risk pooling principles.
                </p>
                <div className="mt-2 text-xs text-green-600">
                  <strong>Models used:</strong> METRIC, Clark-Scarf Model, Graves-Willems Algorithm
                </div>
              </Card>
              
              <Card className="p-4 border-l-4 border-l-purple-500">
                <div className="flex items-center gap-3 mb-2">
                  <LineChart className="h-5 w-5 text-purple-500" />
                  <h3 className="font-medium">Demand Forecasting</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Predict future inventory needs using time-series models, exponential smoothing, and machine learning techniques.
                </p>
                <div className="mt-2 text-xs text-purple-600">
                  <strong>Models used:</strong> ARIMA, Holt-Winters, Prophet, Machine Learning
                </div>
              </Card>
            </div>

            <div className="mt-8 p-4 bg-muted rounded-md">
              <div className="flex items-start">
                <Database className="h-5 w-5 text-muted-foreground mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Industry-Standard Implementation</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Our inventory management system implements established mathematical models used by leading 
                    supply chain software. All calculations follow published academic formulations and industry benchmarks.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">ABC Analysis Distribution</h3>
                <div className="h-[200px] bg-slate-50 rounded flex items-center justify-center">
                  <BarChart3 className="h-24 w-24 text-muted-foreground/30" />
                </div>
                <div className="flex justify-around mt-4 text-xs text-muted-foreground">
                  <div className="text-center">
                    <div className="font-medium text-sm">Class A</div>
                    <div>20% of Items</div>
                    <div>70% of Value</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-sm">Class B</div>
                    <div>30% of Items</div>
                    <div>20% of Value</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-sm">Class C</div>
                    <div>50% of Items</div>
                    <div>10% of Value</div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Monthly Inventory Value Trend</h3>
                <div className="h-[200px] bg-slate-50 rounded flex items-center justify-center">
                  <LineChart className="h-24 w-24 text-muted-foreground/30" />
                </div>
                <div className="mt-4 text-xs text-center text-muted-foreground">
                  Showing 12-month trend data with seasonality pattern
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="optimization">
          <InventoryOptimizationContent />
        </TabsContent>

        <TabsContent value="multi-echelon" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Multi-Echelon Inventory Analysis</h2>
            <p className="text-muted-foreground mb-6">
              Optimize inventory across multiple tiers in your supply chain network using industry-standard multi-echelon models.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="p-4 bg-blue-50 dark:bg-blue-900/20">
                <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Graves-Willems Model</h3>
                <p className="text-sm text-muted-foreground">
                  Optimize strategic safety stocks in general networks while considering service time constraints.
                </p>
              </Card>
              <Card className="p-4 bg-green-50 dark:bg-green-900/20">
                <h3 className="font-medium text-green-700 dark:text-green-300 mb-2">METRIC Model</h3>
                <p className="text-sm text-muted-foreground">
                  Multi-Echelon Technique for Recoverable Item Control for spare parts management.
                </p>
              </Card>
              <Card className="p-4 bg-purple-50 dark:bg-purple-900/20">
                <h3 className="font-medium text-purple-700 dark:text-purple-300 mb-2">Serial System Model</h3>
                <p className="text-sm text-muted-foreground">
                  Analyze serial multi-echelon systems with risk-pooling effects.
                </p>
              </Card>
            </div>
            
            <div className="border rounded-md p-6">
              <h3 className="text-lg font-medium mb-4">Multi-Echelon Network Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Network Structure</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure your multi-echelon network by defining the relationships between facilities.
                  </p>
                  <div className="h-[300px] flex items-center justify-center border rounded-md bg-slate-50">
                    <Boxes className="h-16 w-16 text-muted-foreground/30" />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Parameters</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Set lead times, review periods, service levels and other parameters for each echelon.
                  </p>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border rounded-md p-3">
                        <h5 className="text-sm font-medium">Echelon 1: Distribution Centers</h5>
                        <p className="text-xs text-muted-foreground">3 facilities</p>
                        <p className="text-xs text-muted-foreground">Lead time: 5-7 days</p>
                      </div>
                      <div className="border rounded-md p-3">
                        <h5 className="text-sm font-medium">Echelon 2: Regional Warehouses</h5>
                        <p className="text-xs text-muted-foreground">8 facilities</p>
                        <p className="text-xs text-muted-foreground">Lead time: 2-3 days</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border rounded-md p-3">
                        <h5 className="text-sm font-medium">Echelon 3: Local Stores</h5>
                        <p className="text-xs text-muted-foreground">42 facilities</p>
                        <p className="text-xs text-muted-foreground">Lead time: 1 day</p>
                      </div>
                      <div className="border rounded-md p-3">
                        <h5 className="text-sm font-medium">Target Service Level</h5>
                        <p className="text-xs text-muted-foreground">System-wide: 98%</p>
                        <p className="text-xs text-muted-foreground">Local: 95%</p>
                      </div>
                    </div>
                    <Button className="w-full">Run Multi-Echelon Optimization</Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Stock Forecasting</h2>
            <p className="text-muted-foreground mb-6">
              Predict future inventory levels using time-series models and machine learning techniques.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="p-4 border-l-4 border-l-blue-500">
                <h3 className="font-medium mb-2">Time Series Models</h3>
                <p className="text-sm text-muted-foreground">
                  ARIMA, Seasonal ARIMA (SARIMA), and Exponential Smoothing (ETS) for forecasting demand.
                </p>
              </Card>
              <Card className="p-4 border-l-4 border-l-green-500">
                <h3 className="font-medium mb-2">Machine Learning Models</h3>
                <p className="text-sm text-muted-foreground">
                  Random Forest, XGBoost, and LSTM Neural Networks for complex pattern recognition.
                </p>
              </Card>
              <Card className="p-4 border-l-4 border-l-amber-500">
                <h3 className="font-medium mb-2">Ensemble Forecasts</h3>
                <p className="text-sm text-muted-foreground">
                  Combined forecasts from multiple models weighted by historical accuracy.
                </p>
              </Card>
            </div>
            
            <div className="border rounded-md p-6">
              <h3 className="font-medium mb-4">Demand Forecast Chart</h3>
              <div className="h-[300px] bg-slate-50 rounded flex items-center justify-center">
                <LineChart className="h-16 w-16 text-muted-foreground/30" />
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                  <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Forecast Accuracy (MAPE)
                  </h4>
                  <p className="text-2xl font-bold mt-1">8.7%</p>
                  <p className="text-xs text-muted-foreground">Last 3 months average</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                  <h4 className="text-sm font-medium text-green-700 dark:text-green-300">
                    Bias
                  </h4>
                  <p className="text-2xl font-bold mt-1">+2.3%</p>
                  <p className="text-xs text-muted-foreground">Slight over-forecasting</p>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md">
                  <h4 className="text-sm font-medium text-amber-700 dark:text-amber-300">
                    Seasonality Detected
                  </h4>
                  <p className="text-2xl font-bold mt-1">Weekly</p>
                  <p className="text-xs text-muted-foreground">Pattern strength: High</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Inventory Reports</h2>
            <p className="text-muted-foreground mb-6">
              Generate comprehensive inventory reports with key metrics and analytics.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="p-4">
                <h3 className="font-medium mb-2">Inventory Health Report</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Overview of inventory status, turnover, and obsolescence risks.
                </p>
                <Button variant="outline" className="w-full">Generate Report</Button>
              </Card>
              <Card className="p-4">
                <h3 className="font-medium mb-2">Stock Level Analysis</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Detailed analysis of current stock levels vs. optimal levels.
                </p>
                <Button variant="outline" className="w-full">Generate Report</Button>
              </Card>
              <Card className="p-4">
                <h3 className="font-medium mb-2">Inventory Cost Report</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Cost breakdown of ordering, holding, and stockout costs.
                </p>
                <Button variant="outline" className="w-full">Generate Report</Button>
              </Card>
            </div>
            
            <div className="border rounded-md p-6">
              <h3 className="font-medium mb-4">Inventory KPIs Dashboard</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-3 border rounded-md">
                  <h4 className="text-xs font-medium text-muted-foreground">Inventory Turnover</h4>
                  <p className="text-xl font-bold mt-1">7.2</p>
                </div>
                <div className="p-3 border rounded-md">
                  <h4 className="text-xs font-medium text-muted-foreground">Days of Supply</h4>
                  <p className="text-xl font-bold mt-1">50.7</p>
                </div>
                <div className="p-3 border rounded-md">
                  <h4 className="text-xs font-medium text-muted-foreground">Fill Rate</h4>
                  <p className="text-xl font-bold mt-1">98.3%</p>
                </div>
                <div className="p-3 border rounded-md">
                  <h4 className="text-xs font-medium text-muted-foreground">Stock-to-Sales Ratio</h4>
                  <p className="text-xl font-bold mt-1">1.8</p>
                </div>
              </div>
              
              <div className="h-[250px] bg-slate-50 rounded flex items-center justify-center mb-4">
                <BarChart3 className="h-16 w-16 text-muted-foreground/30" />
              </div>
              
              <div className="flex justify-end">
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Export Dashboard
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryManagement;
