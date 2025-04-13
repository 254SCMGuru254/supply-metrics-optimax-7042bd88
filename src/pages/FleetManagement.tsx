
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { FleetManagementContent } from "@/components/fleet-management/FleetManagementContent";
import { Truck, TrendingUp, Settings, BarChart3, FileText, Upload } from "lucide-react";

const FleetManagement = () => {
  const [activeTab, setActiveTab] = useState("management");
  const { toast } = useToast();

  const handleImportData = () => {
    toast({
      title: "Data Import",
      description: "Ready to import fleet data",
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Truck className="h-8 w-8" />
            Fleet Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Optimize your vehicle fleet for maximum efficiency
          </p>
        </div>

        <Button onClick={handleImportData}>
          <Upload className="mr-2 h-4 w-4" />
          Import Fleet Data
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="management">Fleet Management</TabsTrigger>
          <TabsTrigger value="analytics">Fleet Analytics</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Fleet Management System</h2>
            <p className="mb-4">
              The Fleet Management System helps you optimize your vehicle operations, 
              track maintenance schedules, and analyze fleet performance metrics.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <Card className="p-4 border-l-4 border-l-blue-500">
                <div className="flex items-center gap-3 mb-2">
                  <Truck className="h-5 w-5 text-blue-500" />
                  <h3 className="font-medium">Vehicle Management</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Track vehicle information, status, and assignment across your fleet.
                </p>
              </Card>
              
              <Card className="p-4 border-l-4 border-l-green-500">
                <div className="flex items-center gap-3 mb-2">
                  <Settings className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium">Maintenance Scheduling</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Schedule and track preventive maintenance to reduce downtime.
                </p>
              </Card>
              
              <Card className="p-4 border-l-4 border-l-purple-500">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <h3 className="font-medium">Performance Analytics</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Analyze fuel efficiency, utilization rates, and operational costs.
                </p>
              </Card>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Fleet Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-700">Total Vehicles</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
                <div className="p-4 bg-green-50 rounded-md">
                  <p className="text-sm text-green-700">Active Vehicles</p>
                  <p className="text-2xl font-bold">18</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-md">
                  <p className="text-sm text-amber-700">In Maintenance</p>
                  <p className="text-2xl font-bold">4</p>
                </div>
                <div className="p-4 bg-red-50 rounded-md">
                  <p className="text-sm text-red-700">Out of Service</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Truck className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Vehicle KBZ-123 maintenance scheduled</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Fleet report generated</p>
                    <p className="text-xs text-muted-foreground">Yesterday</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="management">
          <FleetManagementContent />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Fleet Analytics</h2>
            <p className="text-muted-foreground mb-6">
              Analyze fleet performance metrics and identify optimization opportunities.
            </p>
            <div className="h-[300px] flex items-center justify-center border rounded-md bg-slate-50">
              <BarChart3 className="h-24 w-24 text-muted-foreground/50" />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Maintenance Scheduling</h2>
            <p className="text-muted-foreground mb-6">
              Schedule and track vehicle maintenance activities.
            </p>
            <div className="h-[300px] flex items-center justify-center border rounded-md bg-slate-50">
              <p className="text-muted-foreground">Maintenance schedule calendar will be displayed here</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FleetManagement;
