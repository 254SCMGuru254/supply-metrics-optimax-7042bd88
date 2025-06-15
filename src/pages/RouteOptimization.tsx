
import { RouteOptimizationContent } from "@/components/route-optimization/RouteOptimizationContent";
import { RouteFormulas } from "@/components/route-optimization/RouteFormulas";
import { LeafletMapbox } from "@/components/maps/LeafletMapbox";
import { EditableMapPoints } from "@/components/interactive-editing/EditableMapPoints";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calculator, Activity } from "lucide-react";

const RouteOptimization = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Route Optimization Suite
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Complete route optimization with TSP, VRP, path algorithms, and real-time analysis using free, open-source mapping
        </p>
      </div>

      <Tabs defaultValue="formulas" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="formulas" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Route Formulas
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Live Optimization
          </TabsTrigger>
          <TabsTrigger value="leaflet" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Free Maps (Leaflet)
          </TabsTrigger>
          <TabsTrigger value="editor" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Map Editor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="formulas">
          <RouteFormulas />
        </TabsContent>

        <TabsContent value="optimization">
          <RouteOptimizationContent />
        </TabsContent>

        <TabsContent value="leaflet">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Free Open Source Mapping (Leaflet + OpenStreetMap)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LeafletMapbox />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="editor">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
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
