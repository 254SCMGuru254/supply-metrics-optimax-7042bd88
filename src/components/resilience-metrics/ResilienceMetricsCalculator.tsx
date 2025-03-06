import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { NetworkMap } from '@/components/NetworkMap';
import { Loader2, RefreshCw } from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend
} from 'recharts';

type SupplyChainNetwork = Database['public']['Tables']['supply_chain_networks']['Row'];
type ResilienceMetric = Database['public']['Tables']['resilience_metrics']['Row'];

export function ResilienceMetricsCalculator() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [networks, setNetworks] = useState<SupplyChainNetwork[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<ResilienceMetric | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Load user's networks and metrics
  useEffect(() => {
    if (user) {
      loadNetworks();
    }
  }, [user]);
  
  useEffect(() => {
    if (selectedNetwork) {
      loadMetrics(selectedNetwork);
    }
  }, [selectedNetwork]);
  
  const loadNetworks = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('supply_chain_networks')
        .select('*')
        .eq('user_id', user?.id);
        
      if (error) throw error;
      setNetworks(data || []);
      if (data && data.length > 0) {
        setSelectedNetwork(data[0].id);
      }
    } catch (error) {
      console.error('Error loading networks:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your supply chain networks.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadMetrics = async (networkId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('resilience_metrics')
        .select('*')
        .eq('network_id', networkId)
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (error) throw error;
      setMetrics(data && data.length > 0 ? data[0] : null);
    } catch (error) {
      console.error('Error loading metrics:', error);
      toast({
        title: 'Error',
        description: 'Failed to load resilience metrics.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const calculateMetrics = async () => {
    if (!selectedNetwork) {
      toast({
        title: 'Error',
        description: 'Please select a network first.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsCalculating(true);
      
      // Call the Supabase function to calculate metrics
      const { data, error } = await supabase.rpc(
        'calculate_network_resilience',
        { 
          network_id: selectedNetwork
        }
      );
      
      if (error) throw error;
      
      toast({
        title: 'Calculation Complete',
        description: 'Network resilience metrics have been calculated.',
      });
      
      // Reload metrics to get the latest calculation
      loadMetrics(selectedNetwork);
      
    } catch (error) {
      console.error('Error calculating metrics:', error);
      toast({
        title: 'Error',
        description: 'Failed to calculate resilience metrics.',
        variant: 'destructive',
      });
    } finally {
      setIsCalculating(false);
    }
  };
  
  // Find the currently selected network for visualization
  const currentNetwork = networks.find(n => n.id === selectedNetwork);
  
  // Format metrics for radar chart
  const radarData = metrics ? [
    {
      metric: "Connectivity",
      value: metrics.connectivity_score,
      fullMark: 100,
    },
    {
      metric: "Redundancy",
      value: metrics.redundancy_score,
      fullMark: 100,
    },
    {
      metric: "Adaptability",
      value: metrics.adaptability_score,
      fullMark: 100,
    },
    {
      metric: "Recovery Speed",
      value: 100 - (metrics.recovery_time / 30) * 100, // Convert days to a score
      fullMark: 100,
    },
    {
      metric: "Robustness",
      value: 100 - metrics.vulnerability_index,
      fullMark: 100,
    },
  ] : [];
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Resilience Metrics Calculator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Network Selection */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Network Selection</CardTitle>
            <CardDescription>
              Select a network to calculate resilience metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select
                value={selectedNetwork || ''}
                onValueChange={setSelectedNetwork}
                disabled={isLoading || isCalculating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a network" />
                </SelectTrigger>
                <SelectContent>
                  {networks.map((network) => (
                    <SelectItem key={network.id} value={network.id}>
                      {network.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                onClick={calculateMetrics} 
                disabled={isCalculating || !selectedNetwork}
                className="w-full"
              >
                {isCalculating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                {isCalculating ? 'Calculating...' : 'Calculate Metrics'}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Resilience Summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Resilience Summary</CardTitle>
            <CardDescription>
              {metrics ? 'Overview of network resilience metrics' : 'Select a network and calculate metrics to see results'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {metrics ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm font-medium">Resilience Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {metrics ? Math.round((metrics.connectivity_score + metrics.redundancy_score + metrics.adaptability_score) / 3) : '-'}%
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm font-medium">Recovery Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {metrics ? Math.round(metrics.recovery_time) : '-'} days
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm font-medium">Vulnerability</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {metrics ? Math.round(metrics.vulnerability_index) : '-'}%
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm font-medium">Nodes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {metrics?.metrics_data?.node_count || '-'}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Radar Chart */}
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Resilience"
                        dataKey="value"
                        stroke="#2563eb"
                        fill="#3b82f6"
                        fillOpacity={0.6}
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-center">
                <p className="text-muted-foreground mb-4">No resilience metrics to display.</p>
                <Button 
                  variant="outline" 
                  onClick={calculateMetrics}
                  disabled={!selectedNetwork}
                >
                  Calculate Metrics
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Network Visualization */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Network Visualization</CardTitle>
            <CardDescription>
              Visual representation of your supply chain network
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentNetwork ? (
              <div className="h-[400px] border rounded-md overflow-hidden">
                <NetworkMap 
                  network={currentNetwork}
                  resilienceMetrics={metrics}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-[400px] text-center">
                <p className="text-muted-foreground">Select a network to visualize</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Detailed Metrics */}
        {metrics && (
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Detailed Metrics</CardTitle>
              <CardDescription>
                Detailed breakdown of resilience metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Network Structure</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Nodes:</span>
                        <span className="font-medium">{metrics.metrics_data.node_count}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Connections:</span>
                        <span className="font-medium">{metrics.metrics_data.edge_count}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Avg. Connections per Node:</span>
                        <span className="font-medium">{metrics.metrics_data.avg_degree.toFixed(1)}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Network Density:</span>
                        <span className="font-medium">{metrics.metrics_data.network_density.toFixed(2)}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Resilience Scores</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Connectivity Score:</span>
                        <span className="font-medium">{metrics.connectivity_score.toFixed(1)}%</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Redundancy Score:</span>
                        <span className="font-medium">{metrics.redundancy_score.toFixed(1)}%</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Adaptability Score:</span>
                        <span className="font-medium">{metrics.adaptability_score.toFixed(1)}%</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Vulnerability Index:</span>
                        <span className="font-medium">{metrics.vulnerability_index.toFixed(1)}%</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {metrics.connectivity_score < 60 && (
                        <li>Increase connections between nodes to improve network connectivity</li>
                      )}
                      {metrics.redundancy_score < 60 && (
                        <li>Add redundant supply paths for critical product flows</li>
                      )}
                      {metrics.recovery_time > 15 && (
                        <li>Implement strategies to reduce recovery time after disruptions</li>
                      )}
                      {metrics.vulnerability_index > 40 && (
                        <li>Diversify supplier base to reduce vulnerability</li>
                      )}
                      <li>Regularly test network resilience with simulated disruptions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
