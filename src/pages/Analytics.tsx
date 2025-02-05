
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Warehouse, Network, Truck, BarChart3, Cube } from "lucide-react";

const analyticsModels = [
  {
    title: "Center of Gravity",
    description: "Optimize facility locations based on weighted distances",
    icon: Warehouse,
    path: "/center-of-gravity",
  },
  {
    title: "Network Optimization",
    description: "Minimize costs across your supply chain network",
    icon: Network,
    path: "/network-optimization",
  },
  {
    title: "Simulation",
    description: "Model and analyze supply chain scenarios",
    icon: Truck,
    path: "/simulation",
  },
  {
    title: "Heuristic Analysis",
    description: "Quick solutions for complex distribution problems",
    icon: BarChart3,
    path: "/heuristic",
  },
  {
    title: "Isohedron Analysis",
    description: "Optimize territory coverage and spatial distribution",
    icon: Cube,
    path: "/isohedron",
  },
];

const Analytics = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Supply Chain Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {analyticsModels.map((model) => (
          <Card key={model.title} className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <model.icon className="h-8 w-8 text-primary" />
              <h2 className="text-xl font-semibold">{model.title}</h2>
            </div>
            <p className="text-muted-foreground mb-4">{model.description}</p>
            <Link to={model.path}>
              <Button className="w-full">Launch Model</Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Analytics;
