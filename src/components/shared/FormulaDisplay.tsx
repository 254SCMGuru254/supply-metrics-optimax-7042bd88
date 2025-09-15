import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { ChevronRight, BarChart3, Settings } from 'lucide-react';

interface BusinessContextProps {
  problem: string;
  impact: string;
  application: string;
  constraints: string[];
}

interface FormulaDisplayProps {
  name: string;
  description: string;
  businessContext: BusinessContextProps;
  onSelect: () => void;
}

const FormulaDisplay: React.FC<FormulaDisplayProps> = ({
  name,
  description,
  businessContext,
  onSelect
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card className="cursor-pointer transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{name}</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{businessContext.problem}</p>
          </CardContent>
        </Card>
      </HoverCardTrigger>
      <HoverCardContent className="w-96">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Business Impact</h4>
            <p className="text-sm text-muted-foreground">{businessContext.impact}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Typical Application</h4>
            <p className="text-sm text-muted-foreground">{businessContext.application}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Key Considerations</h4>
            <ul className="text-sm text-muted-foreground list-disc pl-4">
              {businessContext.constraints.map((constraint, index) => (
                <li key={index}>{constraint}</li>
              ))}
            </ul>
          </div>
          <Button onClick={onSelect} className="w-full">
            <Settings className="mr-2 h-4 w-4" />
            Configure Solution
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export interface ModelFormulasProps {
  modelId: string;
}

export function ModelFormulas({ modelId }: ModelFormulasProps) {
  const [selectedFormula, setSelectedFormula] = React.useState<string | null>(null);

  const handleFormulaSelect = (formulaId: string) => {
    setSelectedFormula(formulaId);
    // Additional logic for formula selection
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Business Solutions</h2>
          <p className="text-muted-foreground">
            Select a solution to optimize your supply chain
          </p>
        </div>
        {selectedFormula && (
          <Button variant="outline" onClick={() => setSelectedFormula(null)}>
            Back to Solutions
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Formula cards will be rendered here based on modelId */}
      </div>
    </div>
  );
}
