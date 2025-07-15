
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Calculator, 
  Map, 
  Network, 
  Package, 
  TrendingUp, 
  Settings,
  ArrowRight,
  Code,
  FileText,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

const Documentation = () => {
  const formulaCategories = [
    {
      title: "Route Optimization Formulas",
      icon: Map,
      count: 12,
      formulas: [
        { name: "Traveling Salesman Problem (TSP)", formula: "min Σ(i,j∈E) c_ij * x_ij", description: "Minimize total distance for visiting all nodes exactly once" },
        { name: "Vehicle Routing Problem (VRP)", formula: "min Σ_k Σ_(i,j) c_ij * x_ijk", description: "Optimize multiple vehicle routes with capacity constraints" },
        { name: "Dijkstra's Algorithm", formula: "d[v] = min(d[v], d[u] + w(u,v))", description: "Find shortest path between nodes" },
        { name: "A* Search Algorithm", formula: "f(n) = g(n) + h(n)", description: "Heuristic pathfinding algorithm" }
      ]
    },
    {
      title: "Inventory Management Formulas",
      icon: Package,
      count: 15,
      formulas: [
        { name: "Economic Order Quantity (EOQ)", formula: "EOQ = √(2DS/H)", description: "Optimal order quantity to minimize total inventory costs" },
        { name: "Safety Stock", formula: "SS = Z * σ * √L", description: "Buffer stock to maintain service levels" },
        { name: "Reorder Point", formula: "ROP = (D * L) + SS", description: "Inventory level triggering new orders" },
        { name: "ABC Analysis", formula: "Class A: 80% value, Class B: 15% value, Class C: 5% value", description: "Inventory classification by value" }
      ]
    },
    {
      title: "Network Optimization Formulas",
      icon: Network,
      count: 10,
      formulas: [
        { name: "Minimum Cost Flow", formula: "min Σ_(i,j) c_ij * x_ij", description: "Minimize cost of flow through network" },
        { name: "Maximum Flow", formula: "max f subject to capacity constraints", description: "Maximum flow from source to sink" },
        { name: "Center of Gravity", formula: "CoG = (Σ(Wi * Xi), Σ(Wi * Yi)) / ΣWi", description: "Optimal facility location based on demand weights" },
        { name: "P-Median Problem", formula: "min Σ_i Σ_j d_ij * x_ij", description: "Locate P facilities to minimize total distance" }
      ]
    },
    {
      title: "Cost Modeling Formulas",
      icon: Calculator,
      count: 8,
      formulas: [
        { name: "Total Cost of Ownership", formula: "TCO = Purchase + Operating + Maintenance + Disposal", description: "Complete cost analysis over asset lifecycle" },
        { name: "Activity-Based Costing", formula: "Cost = Σ(Activity Rate * Activity Driver)", description: "Allocate costs based on activities" },
        { name: "Transportation Cost", formula: "TC = Fixed Cost + (Variable Cost * Distance * Volume)", description: "Calculate transportation expenses" },
        { name: "Holding Cost", formula: "HC = (Average Inventory * Unit Cost * Holding Rate)", description: "Cost of carrying inventory" }
      ]
    },
    {
      title: "Heuristic Algorithms",
      icon: TrendingUp,
      count: 12,
      formulas: [
        { name: "Simulated Annealing", formula: "P(accept) = exp(-ΔE/T)", description: "Probabilistic optimization technique" },
        { name: "Genetic Algorithm", formula: "Fitness = f(chromosome)", description: "Evolutionary optimization approach" },
        { name: "Tabu Search", formula: "Best non-tabu solution or aspiration criterion", description: "Local search with memory" },
        { name: "Ant Colony Optimization", formula: "τ_ij(t+1) = (1-ρ)τ_ij(t) + Δτ_ij", description: "Swarm intelligence optimization" }
      ]
    }
  ];

  const pageDocumentation = [
    {
      page: "Route Optimization",
      path: "/route-optimization",
      description: "Solve TSP, VRP, and shortest path problems with advanced algorithms",
      features: ["Interactive map visualization", "Multiple algorithm options", "Real-time optimization", "Export results"]
    },
    {
      page: "Inventory Management",
      path: "/inventory-management",
      description: "Optimize inventory levels, safety stock, and reorder points",
      features: ["EOQ calculations", "ABC analysis", "Safety stock optimization", "Multi-echelon support"]
    },
    {
      page: "Network Design",
      path: "/network-design",
      description: "Design and optimize supply chain networks",
      features: ["Facility location", "Network flow", "Cost modeling", "Scenario analysis"]
    },
    {
      page: "Analytics Dashboard",
      path: "/analytics-dashboard",
      description: "Comprehensive analytics and performance monitoring",
      features: ["Real-time metrics", "Cost analysis", "Performance tracking", "Custom reports"]
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
          <BookOpen className="h-10 w-10" />
          Documentation & Formulas
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Comprehensive guide to all mathematical models, formulas, and features in Supply Metrics Optimax
        </p>
      </div>

      <Tabs defaultValue="formulas" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="formulas">Mathematical Formulas</TabsTrigger>
          <TabsTrigger value="pages">Page Documentation</TabsTrigger>
          <TabsTrigger value="api">API Reference</TabsTrigger>
          <TabsTrigger value="guides">User Guides</TabsTrigger>
        </TabsList>

        <TabsContent value="formulas">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {formulaCategories.map((category, index) => (
                <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <category.icon className="h-8 w-8 text-blue-600" />
                      <Badge variant="outline">{category.count} formulas</Badge>
                    </div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {formulaCategories.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <category.icon className="h-6 w-6" />
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.formulas.map((formula, formulaIndex) => (
                      <div key={formulaIndex} className="p-4 border rounded-lg">
                        <h4 className="font-semibold text-lg mb-2">{formula.name}</h4>
                        <div className="bg-gray-100 p-3 rounded font-mono text-sm mb-2">
                          {formula.formula}
                        </div>
                        <p className="text-gray-600 text-sm">{formula.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pages">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pageDocumentation.map((page, index) => (
              <Card key={index} className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {page.page}
                    <ArrowRight className="h-5 w-5 text-blue-600" />
                  </CardTitle>
                  <p className="text-muted-foreground">{page.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-medium">Key Features:</h4>
                    <ul className="space-y-1">
                      {page.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-6 w-6" />
                API Reference
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Authentication</h3>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <code>POST /api/auth/login</code>
                    <p className="text-sm text-gray-600 mt-2">Authenticate user and obtain access token</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Optimization Endpoints</h3>
                  <div className="space-y-3">
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <code>POST /api/optimize/route</code>
                      <p className="text-sm text-gray-600 mt-2">Execute route optimization algorithms</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <code>POST /api/optimize/inventory</code>
                      <p className="text-sm text-gray-600 mt-2">Calculate optimal inventory parameters</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <code>POST /api/optimize/network</code>
                      <p className="text-sm text-gray-600 mt-2">Optimize network design and flow</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guides">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-6 w-6" />
                  Getting Started Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Badge variant="outline">1</Badge>
                    <div>
                      <h4 className="font-medium">Create Account</h4>
                      <p className="text-sm text-gray-600">Sign up and verify your email address</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Badge variant="outline">2</Badge>
                    <div>
                      <h4 className="font-medium">Create Project</h4>
                      <p className="text-sm text-gray-600">Set up your first optimization project</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Badge variant="outline">3</Badge>
                    <div>
                      <h4 className="font-medium">Input Data</h4>
                      <p className="text-sm text-gray-600">Add your supply chain data and constraints</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Badge variant="outline">4</Badge>
                    <div>
                      <h4 className="font-medium">Run Optimization</h4>
                      <p className="text-sm text-gray-600">Execute algorithms and analyze results</p>
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-6 w-6" />
                  Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Data Quality</h4>
                    <p className="text-sm text-gray-600">Ensure accurate and complete data for optimal results</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Model Selection</h4>
                    <p className="text-sm text-gray-600">Choose appropriate algorithms based on problem complexity</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Validation</h4>
                    <p className="text-sm text-gray-600">Always validate results against business constraints</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Continuous Improvement</h4>
                    <p className="text-sm text-gray-600">Regularly update models with new data and insights</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documentation;
