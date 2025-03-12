import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { NetworkMap } from "@/components/NetworkMap";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type DisruptionScenario = Database['public']['Tables']['disruption_scenarios']['Row'];
type SupplyChainNetwork = Database['public']['Tables']['supply_chain_networks']['Row'];

export function DisruptionSimulator() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [networks, setNetworks] = useState<SupplyChainNetwork[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [scenarios, setScenarios] = useState<DisruptionScenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState<any | null>(null);
  
  const [newScenario, setNewScenario] = useState({
    name: '',
    description: '',
    disruption_type: 'natural_disaster',
    impact_level: 50,
    duration: 30,
    probability: 0.5,
    affected_nodes: []
  });
  
  useEffect(() => {
    if (user) {
      loadNetworks();
      loadScenarios();
    }
  }, [user]);
  
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
  
  const loadScenarios = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('disruption_scenarios')
        .select('*')
        .eq('user_id', user?.id);
        
      if (error) throw error;
      setScenarios(data || []);
    } catch (error) {
      console.error('Error loading scenarios:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your disruption scenarios.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const createScenario = async () => {
    if (!selectedNetwork) {
      toast({
        title: 'Error',
        description: 'Please select a network first.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('disruption_scenarios')
        .insert({
          ...newScenario,
          user_id: user?.id,
        })
        .select();
        
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Disruption scenario created successfully.',
      });
      
      setNewScenario({
        name: '',
        description: '',
        disruption_type: 'natural_disaster',
        impact_level: 50,
        duration: 30,
        probability: 0.5,
        affected_nodes: []
      });
      
      loadScenarios();
      
    } catch (error) {
      console.error('Error creating scenario:', error);
      toast({
        title: 'Error',
        description: 'Failed to create disruption scenario.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const runSimulation = async () => {
    if (!selectedNetwork || !selectedScenario) {
      toast({
        title: 'Error',
        description: 'Please select both a network and a scenario.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsSimulating(true);
      
      const { data, error } = await supabase.rpc(
        'generate_disruption_impact',
        { 
          network_id: selectedNetwork,
          disruption_id: selectedScenario
        }
      );
      
      if (error) throw error;
      
      setSimulationResults(data);
      
      toast({
        title: 'Simulation Complete',
        description: 'Disruption impact simulation has finished running.',
      });
      
    } catch (error) {
      console.error('Error running simulation:', error);
      toast({
        title: 'Error',
        description: 'Failed to run disruption simulation.',
        variant: 'destructive',
      });
    } finally {
      setIsSimulating(false);
    }
  };
  
  const handleDownload = () => {
    const element = document.getElementById("download-btn");
    if (element instanceof HTMLElement) {
      element.click();
    }
  };
  
  const currentNetwork = networks.find(n => n.id === selectedNetwork);
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Disruption Simulation</h1>
      
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create Scenario</TabsTrigger>
          <TabsTrigger value="run">Run Simulation</TabsTrigger>
          <TabsTrigger value="results">Results & Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Disruption Scenario</CardTitle>
              <CardDescription>
                Define parameters for a new supply chain disruption scenario
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="network">Select Supply Chain Network</Label>
                    <Select
                      value={selectedNetwork || ''}
                      onValueChange={setSelectedNetwork}
                      disabled={isLoading}
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
                  </div>
                  
                  <div>
                    <Label htmlFor="name">Scenario Name</Label>
                    <Input
                      id="name"
                      value={newScenario.name}
                      onChange={(e) => setNewScenario({ ...newScenario, name: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={newScenario.description}
                      onChange={(e) => setNewScenario({ ...newScenario, description: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="disruption_type">Disruption Type</Label>
                    <Select
                      value={newScenario.disruption_type}
                      onValueChange={(value) => setNewScenario({ ...newScenario, disruption_type: value })}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="natural_disaster">Natural Disaster</SelectItem>
                        <SelectItem value="pandemic">Pandemic</SelectItem>
                        <SelectItem value="political_instability">Political Instability</SelectItem>
                        <SelectItem value="infrastructure_failure">Infrastructure Failure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label>Impact Level ({newScenario.impact_level}%)</Label>
                    <Slider
                      value={[newScenario.impact_level]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => setNewScenario({ ...newScenario, impact_level: value[0] })}
                      disabled={isLoading}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label>Duration ({newScenario.duration} days)</Label>
                    <Slider
                      value={[newScenario.duration]}
                      min={1}
                      max={365}
                      step={1}
                      onValueChange={(value) => setNewScenario({ ...newScenario, duration: value[0] })}
                      disabled={isLoading}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label>Probability ({(newScenario.probability * 100).toFixed(0)}%)</Label>
                    <Slider
                      value={[newScenario.probability * 100]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => setNewScenario({ ...newScenario, probability: value[0] / 100 })}
                      disabled={isLoading}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label>Affected Nodes (Select on Map)</Label>
                    {currentNetwork && (
                      <div className="border rounded-md mt-2 h-[200px] overflow-hidden">
                        <NetworkMap 
                          network={currentNetwork}
                          selectable={true}
                          onNodeSelect={(nodes) => setNewScenario({ ...newScenario, affected_nodes: nodes })}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={createScenario} 
                disabled={isLoading || !newScenario.name || !selectedNetwork}
                className="ml-auto"
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Scenario
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="run">
          <Card>
            <CardHeader>
              <CardTitle>Run Disruption Simulation</CardTitle>
              <CardDescription>
                Select a network and disruption scenario to simulate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="network">Select Supply Chain Network</Label>
                  <Select
                    value={selectedNetwork || ''}
                    onValueChange={setSelectedNetwork}
                    disabled={isSimulating}
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
                </div>
                
                <div>
                  <Label htmlFor="scenario">Select Disruption Scenario</Label>
                  <Select
                    value={selectedScenario || ''}
                    onValueChange={setSelectedScenario}
                    disabled={isSimulating}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a scenario" />
                    </SelectTrigger>
                    <SelectContent>
                      {scenarios.map((scenario) => (
                        <SelectItem key={scenario.id} value={scenario.id}>
                          {scenario.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {currentNetwork && (
                <div className="border rounded-md mt-4 h-[300px] overflow-hidden">
                  <NetworkMap 
                    network={currentNetwork}
                    highlightNodes={
                      selectedScenario 
                        ? scenarios.find(s => s.id === selectedScenario)?.affected_nodes || []
                        : []
                    }
                  />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={runSimulation} 
                disabled={isSimulating || !selectedNetwork || !selectedScenario}
                className="ml-auto"
              >
                {isSimulating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                {isSimulating ? 'Running Simulation...' : 'Run Simulation'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Simulation Results & Analysis</CardTitle>
              <CardDescription>
                {simulationResults ? 'View the impact of the disruption scenario on your supply chain network' : 'Run a simulation to see results here'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {simulationResults ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Delivery Delay</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">
                          {simulationResults.average_delay.toFixed(1)} days
                        </div>
                        <p className="text-sm text-muted-foreground">Average delivery delay</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Cost Impact</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">
                          ${simulationResults.cost_impact.toFixed(2)}K
                        </div>
                        <p className="text-sm text-muted-foreground">Additional costs incurred</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Service Level</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">
                          {simulationResults.service_level.toFixed(1)}%
                        </div>
                        <p className="text-sm text-muted-foreground">Expected service level</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="text-lg font-semibold mb-2">Recovery Plan</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {simulationResults.recovery_actions.map((action: string, index: number) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="border rounded-md mt-4 h-[300px] overflow-hidden">
                    {currentNetwork && (
                      <NetworkMap 
                        network={currentNetwork}
                        disruptionData={simulationResults.network_impact}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <p className="text-muted-foreground mb-4">No simulation results to display.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => document.querySelector('[data-value="run"]')?.click()}
                  >
                    Run a Simulation
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
