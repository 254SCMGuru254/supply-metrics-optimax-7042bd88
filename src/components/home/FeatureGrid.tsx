
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
    linkTo: "/kenya-supply-chain",
    buttonText: "Explore Kenya"
  },
  {
    icon: Building,
    title: "Center of Gravity",
    description: "Find optimal facility locations based on demand centers and weights",
    linkTo: "/center-of-gravity",
    buttonText: "Optimize Locations"
  },
  {
    icon: Network,
    title: "Network Optimization",
    description: "Optimize your supply chain network for cost efficiency and service levels",
    linkTo: "/network-optimization",
    buttonText: "Build Network"
  },
  {
    icon: LineChart,
    title: "Supply Chain Simulation",
    description: "Run discrete event simulations to analyze supply chain performance",
    linkTo: "/simulation",
    buttonText: "Run Simulation"
  },
  {
    icon: Truck,
    title: "Route Optimization",
    description: "Optimize delivery routes using advanced heuristic algorithms",
    linkTo: "/heuristic",
    buttonText: "Optimize Routes"
  },
  {
    icon: BarChart3,
    title: "Supply Chain Analytics",
    description: "Visualize and analyze key metrics for your supply chain operations",
    linkTo: "/analytics",
    buttonText: "View Analytics"
  },
  {
    icon: LayoutGrid,
    title: "Supply Chain Models",
    description: "Apply specialized models for resilience, risk, and sustainability",
    linkTo: "/isohedron",
    buttonText: "Apply Models"
  },
  {
    icon: Compass,
    title: "Data Management",
    description: "Import, export, and manage your supply chain data",
    linkTo: "/data-input",
    buttonText: "Manage Data"
  },
  {
    icon: MessageSquare,
    title: "Supply Chain Assistant",
    description: "Get instant answers to your Kenyan supply chain questions",
    linkTo: "/chat-assistant",
    buttonText: "Chat Now"
  }
];

const FeatureGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      {features.map((feature, index) => (
        <FeatureCard 
          key={feature.title} 
          {...feature} 
          index={index}
        />
      ))}
    </div>
  );
};

export default FeatureGrid;
