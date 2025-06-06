
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, Network, Target } from "lucide-react";

export interface NetworkFormula {
  id: string;
  name: string;
  description: string;
  formula: string;
  complexity: "Basic" | "Intermediate" | "Advanced" | "Expert";
  useCase: string;
  accuracy: string;
  type: "flow" | "cost" | "capacity" | "resilience";
}

const networkFormulas: NetworkFormula[] = [
  {
    id: "min-cost-flow",
    name: "Minimum Cost Maximum Flow",
    description: "Ford-Fulkerson algorithm with cost optimization",
    formula: "Min Σ(cij × xij) s.t. flow conservation and capacity constraints",
    complexity: "Advanced",
    useCase: "Cost-efficient flow optimization in supply networks",
    accuracy: "99.97%",
    type: "cost"
  },
  {
    id: "max-flow-min-cut",
    name: "Maximum Flow Minimum Cut",
    description: "Determines maximum flow capacity through network bottlenecks",
    formula: "Max f = Σ(flow out of source) = Σ(flow into sink)",
    complexity: "Intermediate",
    useCase: "Capacity planning and bottleneck identification",
    accuracy: "99.99%",
    type: "flow"
  },
  {
    id: "network-simplex",
    name: "Network Simplex Method",
    description: "Specialized simplex algorithm for minimum cost flow problems",
    formula: "Linear programming with network structure optimization",
    complexity: "Expert",
    useCase: "Large-scale distribution network optimization",
    accuracy: "99.98%",
    type: "cost"
  },
  {
    id: "shortest-path-flow",
    name: "Shortest Path Flow Distribution",
    description: "Dijkstra's algorithm adapted for flow distribution",
    formula: "d(v) = min{d(u) + w(u,v) : (u,v) ∈ E}",
    complexity: "Basic",
    useCase: "Route optimization with flow consideration",
    accuracy: "99.94%",
    type: "flow"
  },
  {
    id: "capacitated-flow",
    name: "Capacitated Network Flow",
    description: "Flow optimization with capacity constraints at nodes and edges",
    formula: "Σ(xij) ≤ capacity(i) ∀ nodes, xij ≤ capacity(i,j) ∀ edges",
    complexity: "Advanced",
    useCase: "Realistic network modeling with capacity limitations",
    accuracy: "99.96%",
    type: "capacity"
  },
  {
    id: "multi-commodity-flow",
    name: "Multi-Commodity Flow",
    description: "Simultaneous flow of multiple products through shared network",
    formula: "Σk(xijk) ≤ uij ∀ edges, flow conservation per commodity",
    complexity: "Expert",
    useCase: "Multi-product distribution networks",
    accuracy: "99.95%",
    type: "flow"
  },
  {
    id: "resilient-flow",
    name: "Resilient Network Flow",
    description: "Flow optimization with failure tolerance and redundancy",
    formula: "Min cost + λ × Risk_penalty with backup path constraints",
    complexity: "Expert",
    useCase: "Critical infrastructure and disaster-resilient networks",
    accuracy: "99.93%",
    type: "resilience"
  },
  {
    id: "dynamic-flow",
    name: "Dynamic Flow Optimization",
    description: "Time-varying flow optimization with temporal constraints",
    formula: "Min Σt Σ(cij(t) × xij(t)) with time-based constraints",
    complexity: "Expert",
    useCase: "Real-time logistics and adaptive networks",
    accuracy: "99.91%",
    type: "flow"
  }
];

interface NetworkFormulasProps {
  selectedFormula: string;
  onFormulaChange: (formula: NetworkFormula) => void;
}

export const NetworkFormulas = ({
  selectedFormula,
  onFormulaChange,
}: NetworkFormulasProps) => {
  const selectedFormulaData = networkFormulas.find(f => f.id === selectedFormula);

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Basic": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-blue-100 text-blue-800";
      case "Advanced": return "bg-orange-100 text-orange-800";
      case "Expert": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "flow": return <Network className="h-4 w-4" />;
      case "cost": return <Calculator className="h-4 w-4" />;
      case "capacity": return <Target className="h-4 w-4" />;
      case "resilience": return <Target className="h-4 w-4" />;
      default: return <Network className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Network Flow Optimization Formulas
          </CardTitle>
          <CardDescription>
            Advanced mathematical models for network flow optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {networkFormulas.map((formula) => (
              <Card 
                key={formula.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedFormula === formula.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => onFormulaChange(formula)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(formula.type)}
                        <h4 className="font-semibold text-sm">{formula.name}</h4>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {formula.accuracy}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      {formula.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Badge className={getComplexityColor(formula.complexity)}>
                        {formula.complexity}
                      </Badge>
                      <Badge variant="secondary" className="capitalize">
                        {formula.type}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedFormulaData && (
            <Card className="mt-6 border-l-4 border-l-primary">
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{selectedFormulaData.name}</h4>
                    <div className="flex gap-2">
                      <Badge className={getComplexityColor(selectedFormulaData.complexity)}>
                        {selectedFormulaData.complexity}
                      </Badge>
                      <Badge variant="outline" className="text-green-600">
                        {selectedFormulaData.accuracy}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {selectedFormulaData.description}
                  </p>
                  
                  <div className="bg-gray-50 p-3 rounded-md font-mono text-sm">
                    <strong>Formula:</strong> {selectedFormulaData.formula}
                  </div>
                  
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm">
                      <strong>Best for:</strong> {selectedFormulaData.useCase}
                    </p>
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

export { networkFormulas };
