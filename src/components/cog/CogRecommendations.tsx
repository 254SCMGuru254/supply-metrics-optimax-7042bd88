
import { Card } from "@/components/ui/card";
import { Node } from "@/components/NetworkMap";
import { calculateDistance } from "@/components/cog/CogUtils";

type CogRecommendationsProps = {
  nodes: Node[];
  optimalLocation: { lat: number; lng: number } | null;
  distanceReduction: number | null;
  existingWarehouse?: Node;
};

export const CogRecommendations = ({
  nodes, 
  optimalLocation, 
  distanceReduction,
  existingWarehouse
}: CogRecommendationsProps) => {
  if (!optimalLocation) return null;

  // Find the closest cities or known locations (for demonstration purposes)
  // In a real app, this would use a geolocation API to find nearby cities
  const nearestCity = "nearby city"; // Placeholder

  // Calculate distance from existing warehouse if available
  let distanceFromExisting: number | null = null;
  if (existingWarehouse && optimalLocation) {
    distanceFromExisting = calculateDistance(
      existingWarehouse.latitude, existingWarehouse.longitude,
      optimalLocation.lat, optimalLocation.lng
    );
  }

  return (
    <Card className="p-4 mt-4">
      <h3 className="text-lg font-semibold mb-3">Practical Recommendations</h3>
      <div className="space-y-3 text-sm">
        <p>
          <strong>Optimal Facility Location:</strong> The calculated optimal location is at 
          coordinates [{optimalLocation.lat.toFixed(4)}, {optimalLocation.lng.toFixed(4)}].
        </p>
        
        {nearestCity && (
          <p>
            <strong>Nearest Major City:</strong> Consider locations near {nearestCity} for practical implementation.
          </p>
        )}
        
        {distanceReduction !== null && (
          <p>
            <strong>Expected Improvement:</strong> This location can reduce weighted transportation distances by 
            approximately {distanceReduction.toFixed(1)}%.
          </p>
        )}
        
        {distanceFromExisting !== null && (
          <p>
            <strong>Distance from Existing Warehouse:</strong> The optimal location is {distanceFromExisting.toFixed(1)} km 
            from your current warehouse. {
              distanceFromExisting < 10 
                ? "Since this is relatively close, you might consider optimizing operations at your current location instead of relocating."
                : "Relocating to the optimal location could provide significant benefits."
            }
          </p>
        )}
        
        <p>
          <strong>Demand Concentration:</strong> {
            nodes.filter(n => n.type === "retail").length > 10 
              ? "Your demand points show significant clustering. Consider multiple smaller facilities instead of one central facility."
              : "Your demand pattern supports a centralized distribution model."
          }
        </p>
        
        <p>
          <strong>Additional Factors to Consider:</strong>
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Land availability and costs near the optimal location</li>
          <li>Local labor market and wages</li>
          <li>Proximity to major transportation infrastructure</li>
          <li>Tax incentives and regulatory environment</li>
          <li>Future growth projections for your demand areas</li>
        </ul>
      </div>
    </Card>
  );
};
