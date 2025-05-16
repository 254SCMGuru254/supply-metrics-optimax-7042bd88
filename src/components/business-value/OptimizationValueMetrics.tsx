
import { Card } from "@/components/ui/card";
import { ModelValueMetrics } from "@/components/business-value/ModelValueMetrics";
import { ModelValueMetricsType, BusinessValueReport } from "@/types/business";

interface OptimizationValueMetricsProps {
  selectedModel: string;
  customData?: Partial<BusinessValueReport>;
}

export const OptimizationValueMetrics = ({ 
  selectedModel,
  customData
}: OptimizationValueMetricsProps) => {
  return (
    <div className="space-y-6">
      <ModelValueMetrics 
        modelType={selectedModel as ModelValueMetricsType}
        showDescription={true}
        customMetrics={customData?.metrics}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Industry-Specific Impact</h3>
          <p className="text-muted-foreground">
            {selectedModel === 'route-optimization' && 'Transportation companies see the highest ROI from route optimization, with cost reductions of 15-25% and significant decreases in fleet size requirements.'}
            {selectedModel === 'inventory-management' && 'Retail and manufacturing industries benefit most from inventory optimization, with up to 30% inventory reduction while maintaining or improving service levels.'}
            {selectedModel === 'network-optimization' && 'Logistics providers and retailers with multi-echelon networks achieve the greatest benefits, with network cost reductions of 10-30%.'}
            {selectedModel === 'center-of-gravity' && 'Companies with expanding distribution networks or changing market demographics achieve optimal facility locations that reduce overall logistics costs by 15-25%.'}
            {selectedModel === 'heuristic' && 'Complex operations with many variables and constraints benefit most from heuristic optimization, allowing near-optimal solutions in minutes rather than days.'}
          </p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Implementation Considerations</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Data quality is critical for optimization success</li>
            <li>• Change management may be needed for organizational adoption</li>
            <li>• Initial setup typically requires 4-8 weeks</li>
            <li>• Maximum benefits achieved after 3-6 months of operation</li>
            <li>• Regular model recalibration recommended every 6-12 months</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};
