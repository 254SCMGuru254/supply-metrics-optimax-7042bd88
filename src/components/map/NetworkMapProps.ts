
import { Node, Route } from '@/integrations/supabase/types';

export interface NetworkMapProps {
  nodes?: Node[];
  routes?: Route[];
  className?: string;
  onNodeClick?: (node: Node) => void;
  onRouteClick?: (route: Route) => void;
  onMapClick?: (lat: number, lng: number) => void;
  isOptimized?: boolean;
  highlightNodes?: string[];
  selectable?: boolean;
  onNodeSelect?: (nodes: string[]) => void;
  disruptionData?: any;
  resilienceMetrics?: any;
  airportNodes?: any[];
}
