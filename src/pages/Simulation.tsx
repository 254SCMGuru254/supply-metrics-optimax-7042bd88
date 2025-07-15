
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Play,
  Square,
  RotateCcw,
  Settings
} from 'lucide-react';

const Simulation = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Supply Chain Simulation</h2>
        <p className="text-muted-foreground">
          Run simulations to test different scenarios and optimize your supply chain performance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Play className="mr-2 h-5 w-5" />
              Run Simulation
            </CardTitle>
            <CardDescription>Start a new simulation with your current configuration.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full">
              <Play className="mr-2 h-4 w-4" />
              Start Simulation
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Configuration
            </CardTitle>
            <CardDescription>Configure simulation parameters and scenarios.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full">
              <Settings className="mr-2 h-4 w-4" />
              Configure
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Simulation;
