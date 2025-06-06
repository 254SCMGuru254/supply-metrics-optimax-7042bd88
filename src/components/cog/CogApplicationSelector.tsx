
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Warehouse, Factory, Truck, Shield, Store, MapPin } from "lucide-react";

export type CogApplication = {
  id: string;
  name: string;
  description: string;
  icon: any;
  useCase: string;
  formula: string;
  factors: string[];
  complexity: "Basic" | "Intermediate" | "Advanced";
};

const cogApplications: CogApplication[] = [
  {
    id: "warehouse",
    name: "Warehouse Location",
    description: "Find optimal distribution center locations to minimize total transportation costs",
    icon: Warehouse,
    useCase: "Distribution Centers",
    formula: "Weighted Euclidean Distance",
    factors: ["Demand Volume", "Transportation Costs", "Distance"],
    complexity: "Basic"
  },
  {
    id: "manufacturing",
    name: "Manufacturing Plants",
    description: "Position facilities to balance raw material sourcing and finished goods distribution",
    icon: Factory,
    useCase: "Industrial Planning",
    formula: "Multi-Source COG",
    factors: ["Raw Material Sources", "Distribution Points", "Production Capacity"],
    complexity: "Advanced"
  },
  {
    id: "regional",
    name: "Regional Distribution",
    description: "Determine service territories and delivery routes for maximum efficiency",
    icon: Truck,
    useCase: "Logistics Networks",
    formula: "Network Flow COG",
    factors: ["Service Areas", "Delivery Routes", "Fleet Capacity"],
    complexity: "Intermediate"
  },
  {
    id: "emergency",
    name: "Emergency Response",
    description: "Position emergency supplies and response centers for rapid deployment",
    icon: Shield,
    useCase: "Critical Infrastructure",
    formula: "Time-Weighted COG",
    factors: ["Response Time", "Population Density", "Risk Zones"],
    complexity: "Advanced"
  },
  {
    id: "retail",
    name: "Retail Networks",
    description: "Optimize store locations relative to customer density and demographics",
    icon: Store,
    useCase: "Commercial Networks",
    formula: "Demographic-Weighted COG",
    factors: ["Customer Demographics", "Competition", "Accessibility"],
    complexity: "Intermediate"
  },
  {
    id: "service",
    name: "Service Territories",
    description: "Define optimal service boundaries for field operations",
    icon: MapPin,
    useCase: "Field Services",
    formula: "Constrained COG",
    factors: ["Service Capacity", "Geographic Constraints", "Travel Time"],
    complexity: "Intermediate"
  }
];

interface CogApplicationSelectorProps {
  selectedApplication: string;
  onApplicationChange: (application: CogApplication) => void;
}

export const CogApplicationSelector = ({
  selectedApplication,
  onApplicationChange,
}: CogApplicationSelectorProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const selectedApp = cogApplications.find(app => app.id === selectedApplication);

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Basic": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-blue-100 text-blue-800";
      case "Advanced": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Center of Gravity Applications</CardTitle>
          <CardDescription>
            Choose the type of facility location problem you want to solve
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Select Application Type
            </label>
            <Select 
              value={selectedApplication} 
              onValueChange={(value) => {
                const app = cogApplications.find(a => a.id === value);
                if (app) onApplicationChange(app);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose an application..." />
              </SelectTrigger>
              <SelectContent>
                {cogApplications.map((app) => (
                  <SelectItem key={app.id} value={app.id}>
                    <div className="flex items-center gap-2">
                      <app.icon className="h-4 w-4" />
                      <span>{app.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedApp && (
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <selectedApp.icon className="h-5 w-5" />
                      <h4 className="font-semibold">{selectedApp.name}</h4>
                    </div>
                    <Badge className={getComplexityColor(selectedApp.complexity)}>
                      {selectedApp.complexity}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {selectedApp.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted p-3 rounded-md">
                    <div>
                      <p className="text-sm font-medium">Use Case:</p>
                      <p className="text-sm text-muted-foreground">{selectedApp.useCase}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Formula Type:</p>
                      <p className="text-sm text-muted-foreground">{selectedApp.formula}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Key Factors:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedApp.factors.map((factor, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
