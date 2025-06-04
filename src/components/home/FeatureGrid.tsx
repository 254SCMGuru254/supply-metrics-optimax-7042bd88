
import { 
  Truck, 
  Network, 
  LineChart, 
  BarChart3, 
  Compass, 
  LayoutGrid, 
  Building, 
  Map, 
  MessageSquare 
} from "lucide-react";
import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: Map,
    title: "Kenya Supply Chain",
    description: "Explore Kenya's supply chain network with detailed maps and logistics data",
    href: "/kenya-supply-chain"
  },
  {
    icon: Building,
    title: "Center of Gravity",
    description: "Find optimal facility locations based on demand centers and weights",
    href: "/center-of-gravity"
  },
  {
    icon: Network,
    title: "Network Optimization",
    description: "Optimize your supply chain network for cost efficiency and service levels",
    href: "/network-optimization"
  },
  {
    icon: LineChart,
    title: "Supply Chain Simulation",
    description: "Run discrete event simulations to analyze supply chain performance",
    href: "/simulation"
  },
  {
    icon: Truck,
    title: "Route Optimization",
    description: "Optimize delivery routes using advanced heuristic algorithms",
    href: "/heuristic"
  },
  {
    icon: BarChart3,
    title: "Supply Chain Analytics",
    description: "Visualize and analyze key metrics for your supply chain operations",
    href: "/analytics"
  },
  {
    icon: LayoutGrid,
    title: "Supply Chain Models",
    description: "Apply specialized models for resilience, risk, and sustainability",
    href: "/isohedron"
  },
  {
    icon: Compass,
    title: "Data Management",
    description: "Import, export, and manage your supply chain data",
    href: "/data-input"
  },
  {
    icon: MessageSquare,
    title: "Supply Chain Assistant",
    description: "Get instant answers to your Kenyan supply chain questions",
    href: "/chat-assistant"
  }
];

const FeatureGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      {features.map((feature) => (
        <FeatureCard 
          key={feature.title} 
          title={feature.title}
          description={feature.description}
          icon={feature.icon}
          href={feature.href}
        />
      ))}
    </div>
  );
};

export default FeatureGrid;
