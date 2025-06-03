
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building, Truck, Users, Shield, Store } from "lucide-react";

export const CogInstructions = () => {
  const useCases = [
    {
      icon: <Building className="h-4 w-4" />,
      title: "Warehouse Location",
      description: "Find optimal distribution center locations to minimize total transportation costs",
      badge: "Primary Use"
    },
    {
      icon: <Store className="h-4 w-4" />,
      title: "Manufacturing Plants", 
      description: "Position facilities to balance raw material sourcing and finished goods distribution",
      badge: "Industrial"
    },
    {
      icon: <Truck className="h-4 w-4" />,
      title: "Regional Distribution",
      description: "Determine service territories and delivery routes for maximum efficiency",
      badge: "Logistics"
    },
    {
      icon: <Shield className="h-4 w-4" />,
      title: "Emergency Response",
      description: "Position emergency supplies and response centers for rapid deployment",
      badge: "Critical"
    },
    {
      icon: <Users className="h-4 w-4" />,
      title: "Retail Networks",
      description: "Optimize store locations relative to customer density and demographics",
      badge: "Commercial"
    }
  ];

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Center of Gravity Applications
      </h3>
      
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          This model helps find the optimal location that minimizes weighted distances to all demand points.
        </p>
        
        <div className="space-y-3">
          {useCases.map((useCase, index) => (
            <div key={index} className="p-3 border rounded-lg">
              <div className="flex items-start gap-2 mb-2">
                {useCase.icon}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{useCase.title}</span>
                    <Badge variant="secondary" className="text-xs">
                      {useCase.badge}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {useCase.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Quick Start Guide:</h4>
          <ol className="text-xs space-y-1 text-muted-foreground">
            <li>1. Click on map to add demand points (customers/destinations)</li>
            <li>2. Adjust weights to reflect demand volume or importance</li>
            <li>3. Optionally add existing facility for comparison</li>
            <li>4. Run optimization to find optimal location</li>
            <li>5. Review recommendations and export results</li>
          </ol>
        </div>
      </div>
    </Card>
  );
};
