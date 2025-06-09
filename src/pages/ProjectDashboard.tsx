
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectManager } from '@/components/project-management/ProjectManager';
import { DataImportExport } from '@/components/data-management/DataImportExport';
import { EditableMapPoints } from '@/components/interactive-editing/EditableMapPoints';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FolderOpen, Upload, Map, Settings, BarChart3, Truck, Package, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProjectDashboard = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const { toast } = useToast();

  const handleOptimization = async (type: string) => {
    if (!selectedProjectId) {
      toast({
        title: "No Project Selected",
        description: "Please select a project first",
        variant: "destructive"
      });
      return;
    }

    try {
      // This would integrate with the optimization engine
      toast({
        title: "Optimization Started",
        description: `${type} optimization is running...`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start optimization",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Supply Chain Optimization Platform</h1>
        <p className="text-muted-foreground">
          Complete project management and optimization suite for real-world supply chain challenges
        </p>
      </div>

      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Data
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            Map Editor
          </TabsTrigger>
          <TabsTrigger value="optimize" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Optimize
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <ProjectManager 
            onProjectSelect={setSelectedProjectId}
            selectedProjectId={selectedProjectId}
          />
        </TabsContent>

        <TabsContent value="data">
          <div className="space-y-6">
            {selectedProjectId ? (
              <DataImportExport projectId={selectedProjectId} />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Project Selected</h3>
                  <p className="text-muted-foreground text-center">
                    Please select a project from the Projects tab to manage data imports and exports.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="map">
          <div className="space-y-6">
            {selectedProjectId ? (
              <EditableMapPoints projectId={selectedProjectId} />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Map className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Project Selected</h3>
                  <p className="text-muted-foreground text-center">
                    Please select a project from the Projects tab to use the interactive map editor.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="optimize">
          <div className="space-y-6">
            {selectedProjectId ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-blue-500" />
                      Route Optimization
                    </CardTitle>
                    <CardDescription>
                      Optimize delivery routes and vehicle scheduling
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full" 
                      onClick={() => handleOptimization('Route')}
                    >
                      Start Optimization
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-green-500" />
                      Facility Location
                    </CardTitle>
                    <CardDescription>
                      Determine optimal facility locations and assignments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full" 
                      onClick={() => handleOptimization('Facility')}
                    >
                      Start Optimization
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-purple-500" />
                      Inventory Management
                    </CardTitle>
                    <CardDescription>
                      Optimize inventory levels and reorder policies
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full" 
                      onClick={() => handleOptimization('Inventory')}
                    >
                      Start Optimization
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Map className="h-5 w-5 text-orange-500" />
                      Center of Gravity
                    </CardTitle>
                    <CardDescription>
                      Calculate optimal facility placement using COG method
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full" 
                      onClick={() => handleOptimization('COG')}
                    >
                      Calculate COG
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-red-500" />
                      Network Optimization
                    </CardTitle>
                    <CardDescription>
                      Optimize entire supply network configuration
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full" 
                      onClick={() => handleOptimization('Network')}
                    >
                      Start Optimization
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-teal-500" />
                      Multi-Echelon Analysis
                    </CardTitle>
                    <CardDescription>
                      Advanced multi-tier supply chain optimization
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full" 
                      onClick={() => handleOptimization('Multi-Echelon')}
                    >
                      <Badge className="mr-2">Enterprise</Badge>
                      Start Analysis
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Settings className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Project Selected</h3>
                  <p className="text-muted-foreground text-center">
                    Please select a project from the Projects tab to run optimizations.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                View optimization results and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Analytics dashboard will be populated once optimizations are run.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Project Settings</CardTitle>
              <CardDescription>
                Configure project parameters and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Project settings configuration panel.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDashboard;
