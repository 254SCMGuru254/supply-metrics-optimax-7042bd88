
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ModelValueMetrics } from "./ModelValueMetrics";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BusinessImpactDashboardProps {
  selectedModel: string;
}

export const BusinessImpactDashboard = ({ selectedModel }: BusinessImpactDashboardProps) => {
  // Map model types to their specific metrics
  const getModelType = () => {
    switch (selectedModel) {
      case "route-optimization":
        return 'route-optimization' as const;
      case "inventory-management":
        return 'inventory-management' as const;
      case "network-optimization":
        return 'network-optimization' as const;
      case "center-of-gravity":
        return 'center-of-gravity' as const;
      case "heuristic":
        return 'heuristic' as const;
      default:
        return 'route-optimization' as const;
    }
  };

  // Calculate implementation difficulty score (0-100)
  const getImplementationDifficulty = () => {
    switch (selectedModel) {
      case "route-optimization":
        return 65;
      case "inventory-management":
        return 45;
      case "network-optimization":
        return 85;
      case "center-of-gravity":
        return 35;
      case "heuristic":
        return 75;
      default:
        return 50;
    }
  };

  // Calculate time to value in months
  const getTimeToValue = () => {
    switch (selectedModel) {
      case "route-optimization":
        return "2-3 months";
      case "inventory-management":
        return "1-2 months";
      case "network-optimization":
        return "6-12 months";
      case "center-of-gravity":
        return "1 month";
      case "heuristic":
        return "3-6 months";
      default:
        return "2-4 months";
    }
  };

  // Get implementation requirements
  const getImplementationRequirements = () => {
    switch (selectedModel) {
      case "route-optimization":
        return [
          "Fleet GPS/telematics integration",
          "Order management system integration",
          "Driver mobile app",
          "Real-time traffic data"
        ];
      case "inventory-management":
        return [
          "ERP/WMS integration",
          "Demand forecasting capability",
          "SKU master data",
          "Historical inventory levels"
        ];
      case "network-optimization":
        return [
          "Transportation cost matrix",
          "Facility cost data",
          "GIS/mapping capability",
          "Scenario planning tools",
          "Multi-period planning capability"
        ];
      case "center-of-gravity":
        return [
          "Customer location data",
          "Demand volumes",
          "Transportation rates",
          "GIS/mapping capability"
        ];
      case "heuristic":
        return [
          "Complex constraint definitions",
          "Business rule formalization",
          "Data preprocessing capabilities",
          "Computational resources"
        ];
      default:
        return [
          "Data collection process",
          "System integration capabilities",
          "User training program"
        ];
    }
  };

  const implementationDifficulty = getImplementationDifficulty();
  const difficultyColor = implementationDifficulty > 70 ? "text-red-500" : 
                         implementationDifficulty > 50 ? "text-yellow-500" : 
                         "text-green-500";

  return (
    <div className="space-y-6">
      <ModelValueMetrics modelType={getModelType()} />
      
      <Tabs defaultValue="implementation">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="implementation">Implementation</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="implementation" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Implementation Complexity</CardTitle>
              <CardDescription>Estimated effort and resource requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Difficulty Level</span>
                  <span className={`text-sm font-bold ${difficultyColor}`}>
                    {implementationDifficulty > 70 ? "High" : 
                     implementationDifficulty > 50 ? "Medium" : 
                     "Low"}
                  </span>
                </div>
                <Progress value={implementationDifficulty} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Time to Value</h4>
                  <p className="text-2xl font-bold">{getTimeToValue()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Data Readiness</h4>
                  <p className="text-2xl font-bold">
                    {implementationDifficulty > 70 ? "Extensive" : 
                     implementationDifficulty > 50 ? "Moderate" : 
                     "Basic"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Success Factors</CardTitle>
              <CardDescription>Key elements for successful implementation</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="bg-green-500 rounded-full h-2 w-2 mt-2 mr-2"></span>
                  <span>Executive sponsorship and clear goals</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-500 rounded-full h-2 w-2 mt-2 mr-2"></span>
                  <span>Clean, accurate data inputs</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-500 rounded-full h-2 w-2 mt-2 mr-2"></span>
                  <span>User training and change management</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-500 rounded-full h-2 w-2 mt-2 mr-2"></span>
                  <span>Integration with existing systems</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-500 rounded-full h-2 w-2 mt-2 mr-2"></span>
                  <span>Regular model validation and updating</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="requirements" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Technical Requirements</CardTitle>
              <CardDescription>System and data requirements for implementation</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {getImplementationRequirements().map((req, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-blue-500 rounded-full h-2 w-2 mt-2 mr-2"></span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Resource Requirements</CardTitle>
              <CardDescription>Team and skill requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Team Roles</h4>
                  <ul className="space-y-1 text-sm">
                    <li>Project Manager</li>
                    <li>Data Analyst</li>
                    <li>Supply Chain SME</li>
                    <li>IT Integration Specialist</li>
                    {selectedModel === "network-optimization" && <li>GIS Specialist</li>}
                    {(selectedModel === "heuristic" || selectedModel === "network-optimization") && <li>Operations Research Specialist</li>}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Skills Needed</h4>
                  <ul className="space-y-1 text-sm">
                    <li>Data Analysis</li>
                    <li>Supply Chain Knowledge</li>
                    <li>Process Mapping</li>
                    <li>System Integration</li>
                    {(selectedModel === "heuristic" || selectedModel === "network-optimization") && <li>Mathematical Modeling</li>}
                    {selectedModel === "route-optimization" && <li>Geospatial Analysis</li>}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
