
import { Node, Route } from '@/integrations/supabase/types';

export interface NetworkMapProps {
  nodes: Node[];
  routes: Route[];
  onMapClick?: (lat: number, lng: number) => void;
  className?: string;
}
