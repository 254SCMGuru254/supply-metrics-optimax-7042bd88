import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, Box, Route as RouteIcon } from "lucide-react";

const Index = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Supply Chain Network Design</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Welcome to Chainalyze.io. Start by inputting your supply chain network data using the forms below.
        </p>

        <div className="grid gap-6">
          {/* Supply Nodes Section */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-2">Supply Nodes</h2>
                <p className="text-muted-foreground mb-4">
                  Input your supply locations with their capacities and associated costs.
                </p>
                <ul className="list-disc list-inside mb-4 space-y-2 text-sm">
                  <li>Location coordinates (latitude/longitude)</li>
                  <li>Facility capacity limits</li>
                  <li>Fixed operational costs</li>
                  <li>Variable handling costs</li>
                </ul>
                <Link to="/data-input?tab=nodes">
                  <Button>Add Supply Nodes</Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Demand Points Section */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Box className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-2">Demand Points</h2>
                <p className="text-muted-foreground mb-4">
                  Define customer locations and their demand requirements.
                </p>
                <ul className="list-disc list-inside mb-4 space-y-2 text-sm">
                  <li>Customer location coordinates</li>
                  <li>Demand volumes</li>
                  <li>Required service levels</li>
                  <li>Location identifiers</li>
                </ul>
                <Link to="/data-input?tab=demand">
                  <Button>Add Demand Points</Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Routes Section */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <RouteIcon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-2">Transportation Routes</h2>
                <p className="text-muted-foreground mb-4">
                  Connect supply nodes to demand points with transportation details.
                </p>
                <ul className="list-disc list-inside mb-4 space-y-2 text-sm">
                  <li>Origin and destination pairs</li>
                  <li>Transportation distances</li>
                  <li>Cost per unit shipped</li>
                  <li>Transit times</li>
                </ul>
                <Link to="/data-input?tab=routes">
                  <Button>Add Routes</Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Getting Started Guide */}
          <Card className="p-6 bg-muted/50">
            <h3 className="text-lg font-semibold mb-2">Getting Started</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Start by adding your supply nodes (warehouses, factories, etc.)</li>
              <li>Next, input your demand points (customer locations)</li>
              <li>Finally, define the transportation routes between nodes and points</li>
              <li>Once your network is defined, use the analytics tools to optimize your supply chain</li>
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;