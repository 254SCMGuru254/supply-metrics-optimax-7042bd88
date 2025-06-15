
import { RouteOptimizationContent } from "@/components/route-optimization/RouteOptimizationContent";
import { EnhancedMapbox } from "@/components/maps/EnhancedMapbox";
import { EditableMapPoints } from "@/components/interactive-editing/EditableMapPoints";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Route, Calculator } from "lucide-react";

const RouteOptimization = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Route Optimization
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Advanced vehicle routing and transportation optimization with interactive maps and real-time analysis
        </p>
      </div>

      <Tabs defaultValue="optimization" className="space-y-6">
        <TabsList className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <TabsTrigger value="optimization" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Route Optimization
          </TabsTrigger>
          <TabsTrigger value="mapbox" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Interactive Maps
          </TabsTrigger>
          <TabsTrigger value="editor" className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            Map Editor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="optimization">
          <RouteOptimizationContent />
        </TabsContent>

        <TabsContent value="mapbox">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Enhanced Mapbox Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedMapbox />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="editor">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5" />
                Interactive Map Editor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EditableMapPoints 
                projectId="route-optimization-project"
                onNodesChange={(nodes) => console.log('Nodes updated:', nodes)}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RouteOptimization;
