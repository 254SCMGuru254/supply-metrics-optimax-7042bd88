
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Truck,
  Network,
  LineChart,
  BarChart3,
  Compass,
  LayoutGrid,
  Building2,
  Map,
  MessageSquare,
  MapPin,
} from "lucide-react";

const Index = () => {
  return (
    <div className="container py-10">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Supply Metrics Optimax</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-6">
          Comprehensive supply chain optimization tailored for the Kenyan logistics ecosystem
        </p>
        <div className="flex gap-4">
          <Link to="/kenya-supply-chain">
            <Button>
              <MapPin className="mr-2 h-4 w-4" />
              Explore Kenya Supply Chain
            </Button>
          </Link>
          <Link to="/onboarding">
            <Button variant="outline">
              <Compass className="mr-2 h-4 w-4" />
              Start Onboarding
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Link to="/kenya-supply-chain" className="group">
          <Card className="p-6 h-full transition-all hover:shadow-md group-hover:border-primary/50">
            <Map className="h-10 w-10 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Kenya Supply Chain</h2>
            <p className="text-muted-foreground mb-4">
              Explore Kenya's supply chain network with detailed maps and logistics data
            </p>
            <Button variant="ghost" size="sm" className="group-hover:bg-primary/10">
              Explore Kenya
            </Button>
          </Card>
        </Link>

        <Link to="/center-of-gravity" className="group">
          <Card className="p-6 h-full transition-all hover:shadow-md group-hover:border-primary/50">
            <Building2 className="h-10 w-10 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Center of Gravity</h2>
            <p className="text-muted-foreground mb-4">
              Find optimal facility locations based on demand centers and weights
            </p>
            <Button variant="ghost" size="sm" className="group-hover:bg-primary/10">
              Optimize Locations
            </Button>
          </Card>
        </Link>

        <Link to="/network-optimization" className="group">
          <Card className="p-6 h-full transition-all hover:shadow-md group-hover:border-primary/50">
            <Network className="h-10 w-10 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Network Optimization</h2>
            <p className="text-muted-foreground mb-4">
              Optimize your supply chain network for cost efficiency and service levels
            </p>
            <Button variant="ghost" size="sm" className="group-hover:bg-primary/10">
              Build Network
            </Button>
          </Card>
        </Link>

        <Link to="/simulation" className="group">
          <Card className="p-6 h-full transition-all hover:shadow-md group-hover:border-primary/50">
            <LineChart className="h-10 w-10 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Supply Chain Simulation</h2>
            <p className="text-muted-foreground mb-4">
              Run discrete event simulations to analyze supply chain performance
            </p>
            <Button variant="ghost" size="sm" className="group-hover:bg-primary/10">
              Run Simulation
            </Button>
          </Card>
        </Link>

        <Link to="/heuristic" className="group">
          <Card className="p-6 h-full transition-all hover:shadow-md group-hover:border-primary/50">
            <Truck className="h-10 w-10 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Route Optimization</h2>
            <p className="text-muted-foreground mb-4">
              Optimize delivery routes using advanced heuristic algorithms
            </p>
            <Button variant="ghost" size="sm" className="group-hover:bg-primary/10">
              Optimize Routes
            </Button>
          </Card>
        </Link>

        <Link to="/analytics" className="group">
          <Card className="p-6 h-full transition-all hover:shadow-md group-hover:border-primary/50">
            <BarChart3 className="h-10 w-10 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Supply Chain Analytics</h2>
            <p className="text-muted-foreground mb-4">
              Visualize and analyze key metrics for your supply chain operations
            </p>
            <Button variant="ghost" size="sm" className="group-hover:bg-primary/10">
              View Analytics
            </Button>
          </Card>
        </Link>

        <Link to="/isohedron" className="group">
          <Card className="p-6 h-full transition-all hover:shadow-md group-hover:border-primary/50">
            <LayoutGrid className="h-10 w-10 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Supply Chain Models</h2>
            <p className="text-muted-foreground mb-4">
              Apply specialized models for resilience, risk, and sustainability
            </p>
            <Button variant="ghost" size="sm" className="group-hover:bg-primary/10">
              Apply Models
            </Button>
          </Card>
        </Link>

        <Link to="/data-input" className="group">
          <Card className="p-6 h-full transition-all hover:shadow-md group-hover:border-primary/50">
            <Compass className="h-10 w-10 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Data Management</h2>
            <p className="text-muted-foreground mb-4">
              Import, export, and manage your supply chain data
            </p>
            <Button variant="ghost" size="sm" className="group-hover:bg-primary/10">
              Manage Data
            </Button>
          </Card>
        </Link>

        <Link to="/chat-assistant" className="group">
          <Card className="p-6 h-full transition-all hover:shadow-md group-hover:border-primary/50">
            <MessageSquare className="h-10 w-10 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Supply Chain Assistant</h2>
            <p className="text-muted-foreground mb-4">
              Get instant answers to your Kenyan supply chain questions
            </p>
            <Button variant="ghost" size="sm" className="group-hover:bg-primary/10">
              Chat Now
            </Button>
          </Card>
        </Link>
      </div>

      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">100% Free & Open-Source</h2>
        <p className="mb-4">
          Supply Metrics Optimax is committed to providing completely free and open-source
          supply chain optimization tools tailored for the Kenyan market:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-2">
            <div className="w-1 h-1 rounded-full bg-primary mt-2" />
            <p>All optimization algorithms use free, open-source libraries</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1 h-1 rounded-full bg-primary mt-2" />
            <p>Lightweight API design for minimal hosting costs</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1 h-1 rounded-full bg-primary mt-2" />
            <p>Free NLP implementation without external API dependencies</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1 h-1 rounded-full bg-primary mt-2" />
            <p>Data auto-deletion to reduce storage costs</p>
          </div>
        </div>
      </Card>

      <div className="flex justify-center">
        <Link to="/kenya-supply-chain">
          <Button size="lg">
            Start Optimizing Your Kenyan Supply Chain
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
