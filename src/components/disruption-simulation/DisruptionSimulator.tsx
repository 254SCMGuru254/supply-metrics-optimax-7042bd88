
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Node, Route } from '@/components/map/MapTypes';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { safeClick } from '@/utils/domUtils';

type NetworkType = {
  id: string;
  user_id: string;
  name: string;
  nodes: Node[];
  routes: Route[];
  created_at: string | null;
  updated_at: string | null;
}

export const DisruptionSimulator = () => {
  const [networks, setNetworks] = useState<NetworkType[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<string | undefined>(undefined);
  const [disruptionType, setDisruptionType] = useState<string>('earthquake');
  const [impactNodes, setImpactNodes] = useState<string[]>([]);
  const [impactSeverity, setImpactSeverity] = useState<number>(5);
  const [duration, setDuration] = useState<number>(24);

  const fetchNetworks = async () => {
    // Type-safe query with the correct path to supply_chain_networks
    const { data, error } = await supabase
      .from('supply_chain_networks')
      .select('*');
    
    if (error) {
      console.error('Error fetching networks:', error);
      return;
    }
    
    // Cast the data to the correct type
    setNetworks(data as unknown as NetworkType[] || []);
  };

  useEffect(() => {
    fetchNetworks();
  }, []);

  const handleSimulateDisruption = async () => {
    if (!selectedNetwork) {
      console.warn('No network selected');
      return;
    }

    const { data: user } = await supabase.auth.getUser();

    if (!user) {
      console.error('No authenticated user found');
      return;
    }

    // Type-safe insert into disruption_scenarios
    const { error } = await supabase
      .from('disruption_scenarios')
      .insert({
        user_id: user.user.id,
        name: `Disruption on ${new Date().toLocaleDateString()}`,
        type: disruptionType,
        impact_nodes: impactNodes,
        impact_severity: impactSeverity,
        duration: duration,
      });

    if (error) {
      console.error('Error creating disruption scenario:', error);
    } else {
      console.log('Disruption scenario created successfully');
    }
  };

  return (
    <Card className="w-[80%]">
      <CardHeader>
        <CardTitle>Disruption Simulator</CardTitle>
        <CardDescription>Simulate disruptions to your supply chain network.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="network">Select Network</Label>
          <Select onValueChange={setSelectedNetwork}>
            <SelectTrigger id="network">
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
        <div className="grid gap-2">
          <Label htmlFor="disruptionType">Disruption Type</Label>
          <Select onValueChange={setDisruptionType}>
            <SelectTrigger id="disruptionType">
              <SelectValue placeholder="Select disruption type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="earthquake">Earthquake</SelectItem>
              <SelectItem value="flood">Flood</SelectItem>
              <SelectItem value="hurricane">Hurricane</SelectItem>
              <SelectItem value="tsunami">Tsunami</SelectItem>
              <SelectItem value="fire">Fire</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="impactNodes">Impact Nodes (Comma Separated)</Label>
          <Input
            type="text"
            id="impactNodes"
            placeholder="Enter node IDs"
            onChange={(e) => setImpactNodes(e.target.value.split(','))}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="impactSeverity">Impact Severity (1-10)</Label>
          <Input
            type="number"
            id="impactSeverity"
            min="1"
            max="10"
            defaultValue={5}
            onChange={(e) => setImpactSeverity(Number(e.target.value))}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="duration">Duration (Hours)</Label>
          <Input
            type="number"
            id="duration"
            defaultValue={24}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </div>
        <Button onClick={handleSimulateDisruption}>Simulate Disruption</Button>
      </CardContent>
    </Card>
  );
};
