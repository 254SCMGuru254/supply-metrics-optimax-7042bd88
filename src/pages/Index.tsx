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
  Code,
  Lock,
  Server,
  Database,
  Zap,
  Hand,
  Globe,
} from "lucide-react";

const Index = () => {
  return (
    <div className="container py-10">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Supply Metrics Optimax</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-6">
          Empowering Kenyan Businesses with Free, Open-Source Supply Chain Optimization
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Code className="h-6 w-6 text-primary" />
            <p>Cutting-edge optimization algorithms using community-developed open-source libraries</p>
          </div>
          <div className="flex items-center gap-3">
            <Server className="h-6 w-6 text-primary" />
            <p>Serverless architecture for efficient, cost-effective API design</p>
          </div>
          <div className="flex items-center gap-3">
            <Database className="h-6 w-6 text-primary" />
            <p>Native NLP processing with local machine learning models, zero external dependencies</p>
          </div>
          <div className="flex items-center gap-3">
            <Zap className="h-6 w-6 text-primary" />
            <p>Intelligent data management with automated archiving and pruning</p>
          </div>
          <div className="flex items-center gap-3">
            <Lock className="h-6 w-6 text-primary" />
            <p>Fully transparent, community-reviewed codebase with open governance</p>
          </div>
          <div className="flex items-center gap-3">
            <Hand className="h-6 w-6 text-primary" />
            <p>Completely free platform with unrestricted commercial usage rights</p>
          </div>
        </div>
      </Card>

      <div className="flex justify-center mb-8">
        <Link to="/kenya-supply-chain">
          <Button size="lg">
            Start Optimizing Your Kenyan Supply Chain
          </Button>
        </Link>
      </div>

      <footer className="bg-muted/50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-muted-foreground">
                Supply Metrics Optimax is an open-source platform dedicated to empowering 
                Kenyan businesses with advanced supply chain optimization tools.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/introduction" className="text-muted-foreground hover:text-primary">Introduction</Link></li>
                <li><Link to="/data-input" className="text-muted-foreground hover:text-primary">Data Input</Link></li>
                <li><Link to="/analytics" className="text-muted-foreground hover:text-primary">Analytics</Link></li>
                <li><Link to="/onboarding" className="text-muted-foreground hover:text-primary">Onboarding</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="https://github.com/254SCMGuru254/supply-metrics-optimax" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                  <Globe className="h-6 w-6" />
                </a>
                {/* Add more social links as needed */}
              </div>
              <p className="mt-4 text-muted-foreground text-sm">
                © {new Date().getFullYear()} Supply Metrics Optimax. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
