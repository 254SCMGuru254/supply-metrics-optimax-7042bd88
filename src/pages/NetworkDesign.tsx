
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, MapPin, DollarSign, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { NetworkDesignForm } from '@/components/network-design/NetworkDesignForm';
import { CostBreakdown } from '@/components/network-design/CostBreakdown';
import { NetworkDesignModel } from '@/components/network-design/NetworkDesignModel';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define interfaces locally
interface Node {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  capacity?: number;
  demand?: number;
  fixed_cost?: number;
  variable_cost?: number;
}

interface Route {
  id: string;
  origin_id: string;
  destination_id: string;
  distance?: number;
  cost_per_unit?: number;
  transit_time?: number;
}

interface Facility {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  capacity: number;
  fixed_cost: number;
  variable_cost: number;
  facility_type: string;
  ownership_type: string;
}

const NetworkDesign = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [optimizationResults, setOptimizationResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectId, setProjectId] = useState('demo-network-design');
  const { toast } = useToast();

  useEffect(() => {
    const loadUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Load user's network design data
      }
    };
    
    loadUserData();
  }, []);

  const handleOptimizeNetwork = async (formData: any) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate network optimization
      const optimalNetwork = NetworkDesignModel(nodes, routes, facilities, formData);
      setOptimizationResults(optimalNetwork);

      toast({
        title: "Network Optimization Complete",
        description: `Optimal network design found with total cost: KES ${optimalNetwork.totalCost?.toLocaleString() || 0}`
      });
    } catch (err: any) {
      console.error("Optimization error:", err);
      setError(err.message || "An error occurred during optimization.");
      toast({
        title: "Optimization Error",
        description: "Failed to optimize network. Please check inputs.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold flex items-center">
            <Building className="h-6 w-6" />
            Network Design Optimization
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-muted-foreground">
            Design and optimize your supply chain network to minimize costs and improve efficiency.
          </p>

          <NetworkDesignForm
            onSubmit={handleOptimizeNetwork}
            loading={loading}
          />

          {error && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive">
              <AlertTriangle className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}

          {optimizationResults && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Optimization Results</h2>
              <CostBreakdown results={optimizationResults} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkDesign;
