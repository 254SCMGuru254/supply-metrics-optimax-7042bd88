
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export type CogApplication = 
  | "warehouse" 
  | "distribution" 
  | "retail" 
  | "manufacturing" 
  | "logistics";

interface CogApplicationSelectorProps {
  selectedApplication: string;
  onApplicationChange: (application: string) => void;
}

export function CogApplicationSelector({ 
  selectedApplication, 
  onApplicationChange 
}: CogApplicationSelectorProps) {
  const applications = [
    { id: "warehouse", label: "Warehouse Location", description: "Find optimal warehouse placement" },
    { id: "distribution", label: "Distribution Center", description: "Optimize distribution network" },
    { id: "retail", label: "Retail Store", description: "Strategic retail location" },
    { id: "manufacturing", label: "Manufacturing Plant", description: "Production facility placement" },
    { id: "logistics", label: "Logistics Hub", description: "Transportation center optimization" }
  ];

  return (
    <RadioGroup value={selectedApplication} onValueChange={onApplicationChange}>
      <div className="space-y-3">
        {applications.map((app) => (
          <div key={app.id} className="flex items-center space-x-2">
            <RadioGroupItem value={app.id} id={app.id} />
            <Label htmlFor={app.id} className="flex-1">
              <div className="font-medium">{app.label}</div>
              <div className="text-sm text-muted-foreground">{app.description}</div>
            </Label>
          </div>
        ))}
      </div>
    </RadioGroup>
  );
}
