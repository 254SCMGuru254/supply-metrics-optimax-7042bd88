
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Package, Boxes, Truck, Database, LineChart, BarChart3, Upload } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState("optimization");
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

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Package className="h-8 w-8" />
            Inventory Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Optimize inventory levels and stock policies
          </p>
        </div>

        <Button onClick={handleImportData}>
          <Upload className="mr-2 h-4 w-4" />
          Import Inventory Data
        </Button>
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
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Inventory Management System</h2>
            <p className="mb-4">
              The Inventory Management System helps you optimize stock levels across your supply chain.
              It provides tools for inventory optimization, multi-echelon analysis, and stock forecasting.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <Card className="p-4 border-l-4 border-l-blue-500">
                <div className="flex items-center gap-3 mb-2">
                  <Boxes className="h-5 w-5 text-blue-500" />
                  <h3 className="font-medium">Inventory Optimization</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Calculate optimal order quantities, safety stock levels, and reorder points.
                </p>
              </Card>
              
              <Card className="p-4 border-l-4 border-l-green-500">
                <div className="flex items-center gap-3 mb-2">
                  <Truck className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium">Multi-Echelon Analysis</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Optimize inventory across multiple tiers in your supply chain network.
                </p>
              </Card>
              
              <Card className="p-4 border-l-4 border-l-purple-500">
                <div className="flex items-center gap-3 mb-2">
                  <LineChart className="h-5 w-5 text-purple-500" />
                  <h3 className="font-medium">Stock Forecasting</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Predict future inventory levels and potential stockouts.
                </p>
              </Card>
            </div>

            <div className="mt-8 p-4 bg-muted rounded-md">
              <div className="flex items-start">
                <Database className="h-5 w-5 text-muted-foreground mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Getting Started</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    To begin, navigate to the Inventory Optimization tab and enter your inventory data
                    or import it from your existing systems.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Inventory Performance</h3>
              <div className="h-[200px] flex items-center justify-center border rounded-md bg-slate-50">
                <BarChart3 className="h-24 w-24 text-muted-foreground/50" />
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Inventory optimization performed</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Boxes className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Stock levels updated</p>
                    <p className="text-xs text-muted-foreground">Yesterday</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization">
          <InventoryOptimizationContent />
        </TabsContent>

        <TabsContent value="multi-echelon" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Multi-Echelon Inventory Analysis</h2>
            <p className="text-muted-foreground mb-6">
              Optimize inventory across multiple tiers in your supply chain network.
            </p>
            <div className="h-[300px] flex items-center justify-center border rounded-md bg-slate-50">
              <p className="text-muted-foreground">Multi-echelon analysis interface will be displayed here</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Stock Forecasting</h2>
            <p className="text-muted-foreground mb-6">
              Predict future inventory levels and potential stockouts.
            </p>
            <div className="h-[300px] flex items-center justify-center border rounded-md bg-slate-50">
              <p className="text-muted-foreground">Stock forecasting interface will be displayed here</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Inventory Reports</h2>
            <p className="text-muted-foreground mb-6">
              Generate reports and analytics for your inventory management.
            </p>
            <div className="h-[300px] flex items-center justify-center border rounded-md bg-slate-50">
              <p className="text-muted-foreground">Reporting interface will be displayed here</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryManagement;
