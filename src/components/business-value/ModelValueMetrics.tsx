
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ModelValueMetricsProps {
  modelType: 'route-optimization' | 'inventory-management' | 'center-of-gravity' | 'heuristic' | 'network-optimization';
  showDescription?: boolean;
}

export const ModelValueMetrics = ({ modelType, showDescription = true }: ModelValueMetricsProps) => {
  // Model-specific metrics and descriptions
  const metricsData = {
    'route-optimization': {
      description: "Route optimization typically delivers 15-25% cost savings by minimizing distance traveled, reducing fuel consumption, and improving vehicle utilization.",
      metrics: [
        { name: "Transportation Cost Reduction", value: "15-25%", icon: "💰" },
        { name: "Delivery Time Improvement", value: "18-30%", icon: "⏱️" },
        { name: "Vehicle Utilization Increase", value: "20-30%", icon: "🚚" },
        { name: "CO₂ Emissions Reduction", value: "10-20%", icon: "🌱" },
        { name: "Driver Productivity", value: "+25%", icon: "👤" }
      ]
    },
    'inventory-management': {
      description: "Inventory optimization can reduce working capital by 20-30% while simultaneously improving product availability and minimizing stockouts.",
      metrics: [
        { name: "Inventory Reduction", value: "20-30%", icon: "📦" },
        { name: "Stockout Reduction", value: "60-80%", icon: "✓" },
        { name: "Holding Cost Savings", value: "25-35%", icon: "💰" },
        { name: "Working Capital Release", value: "$250K-1M+", icon: "💵" },
        { name: "Inventory Turnover", value: "+40%", icon: "🔄" }
      ]
    },
    'center-of-gravity': {
      description: "Center of gravity analysis typically reduces transportation costs by 25-35% by optimizing facility locations relative to customer demand.",
      metrics: [
        { name: "Transportation Distance", value: "-30-40%", icon: "📏" },
        { name: "Delivery Cost Reduction", value: "25-35%", icon: "💰" },
        { name: "Response Time Improvement", value: "30-45%", icon: "⏱️" },
        { name: "Service Coverage", value: "+15-25%", icon: "🌐" },
        { name: "Transportation CO₂", value: "-25-35%", icon: "🌱" }
      ]
    },
    'heuristic': {
      description: "Heuristic algorithms solve complex problems quickly, providing near-optimal solutions that improve overall network efficiency by 15-25%.",
      metrics: [
        { name: "Network Cost Reduction", value: "15-25%", icon: "💰" },
        { name: "Problem Solving Speed", value: "Hours → Minutes", icon: "⏱️" },
        { name: "Resource Utilization", value: "+15-25%", icon: "📊" },
        { name: "Solution Quality", value: "95-98% of optimal", icon: "✓" },
        { name: "Adaptability", value: "Real-time adjustments", icon: "🔄" }
      ]
    },
    'network-optimization': {
      description: "Network flow optimization typically delivers 20-30% cost savings by optimizing product flow through the supply chain network.",
      metrics: [
        { name: "Network Cost Reduction", value: "20-30%", icon: "💰" },
        { name: "Throughput Increase", value: "25-35%", icon: "📈" },
        { name: "Resource Utilization", value: "+25-40%", icon: "📊" },
        { name: "Bottleneck Reduction", value: "70-90%", icon: "🔄" },
        { name: "Service Level", value: "+10-20%", icon: "✓" }
      ]
    }
  };

  const selectedMetrics = metricsData[modelType];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Business Value Metrics</CardTitle>
        {showDescription && (
          <CardDescription>{selectedMetrics.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {selectedMetrics.metrics.map((metric, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="bg-primary/10 p-2 text-center">
                <span className="text-2xl">{metric.icon}</span>
              </div>
              <div className="p-3 text-center">
                <p className="text-sm font-medium">{metric.name}</p>
                <p className="text-xl font-bold text-primary mt-1">{metric.value}</p>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
