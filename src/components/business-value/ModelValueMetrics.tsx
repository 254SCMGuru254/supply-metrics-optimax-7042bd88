
import { Card } from "@/components/ui/card";
import { ModelValueMetricsType } from "@/types/business";

interface ModelValueMetricsProps {
  modelType: ModelValueMetricsType;
  showDescription?: boolean;
  customMetrics?: any[];
}

export const ModelValueMetrics = ({ 
  modelType, 
  showDescription = false,
  customMetrics
}: ModelValueMetricsProps) => {

  // Define default metrics based on model type
  const getMetrics = () => {
    switch (modelType) {
      case 'route-optimization':
        return [
          { name: "Fuel Cost Reduction", value: "15-25%", icon: "fuel" },
          { name: "CO2 Reduction", value: "10-20%", icon: "leaf" },
          { name: "Driver Productivity", value: "20-30%", icon: "users" },
          { name: "Vehicle Utilization", value: "25-35%", icon: "truck" },
        ];
      case 'inventory-management':
        return [
          { name: "Inventory Reduction", value: "20-30%", icon: "package" },
          { name: "Service Level Improvement", value: "5-15%", icon: "percent" },
          { name: "Working Capital Freed", value: "15-25%", icon: "coins" },
          { name: "Stockout Reduction", value: "30-50%", icon: "alert-triangle" },
        ];
      case 'center-of-gravity':
        return [
          { name: "Transportation Cost Savings", value: "15-25%", icon: "truck" },
          { name: "Delivery Time Reduction", value: "20-40%", icon: "clock" },
          { name: "Service Radius Improvement", value: "30-45%", icon: "map-pin" },
          { name: "Customer Satisfaction", value: "+15-25%", icon: "heart" },
        ];
      case 'heuristic':
        return [
          { name: "Planning Time Reduction", value: "70-90%", icon: "clock" },
          { name: "Constraint Satisfaction", value: "95-100%", icon: "check-square" },
          { name: "Solution Quality", value: "Near optimal", icon: "award" },
          { name: "Flexibility", value: "High", icon: "settings" },
        ];
      case 'network-optimization':
        return [
          { name: "Total Network Cost Savings", value: "10-30%", icon: "dollar-sign" },
          { name: "Facility Utilization", value: "+15-25%", icon: "home" },
          { name: "Transit Time Reduction", value: "20-40%", icon: "clock" },
          { name: "Service Level Improvement", value: "5-15%", icon: "trending-up" },
        ];
      default:
        return [];
    }
  };

  const metrics = customMetrics || getMetrics();

  const descriptions = {
    'route-optimization': "Route optimization typically delivers 15-25% reduction in transportation costs through reduced mileage, better vehicle utilization, and lower fuel consumption. Our customers also report significant improvements in on-time deliveries and driver productivity.",
    'inventory-management': "Our multi-echelon inventory optimization helps businesses reduce inventory while maintaining or improving service levels. Most organizations see a 20-30% reduction in inventory, freeing up working capital and warehouse space.",
    'center-of-gravity': "Warehouse and distribution center location has a major impact on logistics costs. Our center of gravity analysis helps companies find optimal facility locations to minimize transportation costs while maximizing service levels.",
    'heuristic': "Complex supply chain problems often require sophisticated solution techniques. Our heuristic algorithms solve otherwise intractable problems quickly, delivering near-optimal solutions for real-world constraints.",
    'network-optimization': "Supply chain network optimization considers the entire distribution system to minimize total costs. Our models typically identify 10-30% cost savings by optimizing facility locations, transportation lanes, and inventory policies."
  };

  return (
    <div className="space-y-4">
      {showDescription && (
        <p className="text-muted-foreground mb-6">
          {descriptions[modelType]}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <IconPlaceholder icon={metric.icon} />
              </div>
              <h3 className="font-semibold text-lg mb-1">{metric.name}</h3>
              <p className="text-2xl font-bold text-primary">{metric.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <p className="text-sm text-muted-foreground mt-4">
        * Results may vary based on specific business circumstances, data quality, and implementation factors.
      </p>
    </div>
  );
};

// Simple icon placeholder component
const IconPlaceholder = ({ icon }: { icon: string }) => {
  return <span className="text-primary">{icon.charAt(0).toUpperCase()}</span>;
};
