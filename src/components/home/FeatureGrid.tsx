
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
    frontContent: "Start Smart with AI built in, not bolted on",
    backContent: "Real-time Kenya supply chain mapping with 50+ optimization models. Track tea, coffee, floriculture routes with predictive analytics.",
    href: "/kenya-supply-chain"
  },
  {
    icon: Building,
    title: "Center of Gravity",
    description: "Find optimal facility locations based on demand centers and weights",
    frontContent: "Know more...faster. In minutes, not days",
    backContent: "Advanced facility location algorithms with multi-criteria decision analysis. Reduce distribution costs by up to 30%.",
    href: "/center-of-gravity"
  },
  {
    icon: Network,
    title: "Network Optimization",
    description: "Optimize your supply chain network for cost efficiency and service levels",
    frontContent: "Connect minds. See, understand, act, collaborate",
    backContent: "Multi-echelon network optimization with AI-powered demand forecasting. Achieve 99.5% service levels with minimal inventory.",
    href: "/network-optimization"
  },
  {
    icon: LineChart,
    title: "Supply Chain Simulation",
    description: "Run discrete event simulations to analyze supply chain performance",
    frontContent: "Act decisively. Elevate human decision making",
    backContent: "Monte Carlo simulations with digital twin technology. Test scenarios before implementation with 95% accuracy.",
    href: "/simulation"
  },
  {
    icon: Truck,
    title: "Route Optimization",
    description: "Optimize delivery routes using advanced heuristic algorithms",
    frontContent: "Dynamic routing intelligence",
    backContent: "Vehicle routing with time windows, capacity constraints, and real-time traffic. Reduce fuel costs by 25%.",
    href: "/heuristic"
  },
  {
    icon: BarChart3,
    title: "Supply Chain Analytics",
    description: "Visualize and analyze key metrics for your supply chain operations",
    frontContent: "Real-time business intelligence",
    backContent: "Advanced analytics dashboard with KPI tracking, predictive alerts, and executive reporting capabilities.",
    href: "/analytics"
  },
  {
    icon: LayoutGrid,
    title: "Supply Chain Models",
    description: "Apply specialized models for resilience, risk, and sustainability",
    frontContent: "50+ Mathematical models",
    backContent: "Comprehensive model library: EOQ, Safety Stock, ABC Analysis, Risk Assessment, Sustainability Metrics, and more.",
    href: "/isohedron"
  },
  {
    icon: Compass,
    title: "Data Management",
    description: "Import, export, and manage your supply chain data",
    frontContent: "Seamless data integration",
    backContent: "ERP connectivity, Excel import/export, API integrations, and automated data validation with 99.9% accuracy.",
    href: "/data-input"
  },
  {
    icon: MessageSquare,
    title: "Supply Chain Assistant",
    description: "Get instant answers to your Kenyan supply chain questions",
    frontContent: "AI-powered assistant",
    backContent: "24/7 supply chain expert powered by GPT-4. Get instant answers, optimization suggestions, and best practices.",
    href: "/chat-assistant"
  }
];

const FeatureGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
      {features.map((feature) => (
        <FeatureCard 
          key={feature.title} 
          title={feature.title}
          description={feature.description}
          frontContent={feature.frontContent}
          backContent={feature.backContent}
          icon={feature.icon}
          href={feature.href}
        />
      ))}
    </div>
  );
};

export default FeatureGrid;
