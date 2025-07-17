import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Play,
  Square,
  RotateCcw,
  Activity,
  Settings,
  BarChart3
} from 'lucide-react';

const Simulation = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Supply Chain Simulation</h2>
        <p className="text-muted-foreground">
          Run advanced simulations to test and optimize your supply chain strategies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Play className="mr-2 h-5 w-5" />
              Start Simulation
            </CardTitle>
            <CardDescription>Run new simulation scenarios</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Create and execute simulation models to test different supply chain configurations.
            </p>
            <Button className="w-full">
              <Play className="mr-2 h-4 w-4" />
              New Simulation
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Square className="mr-2 h-5 w-5" />
              Control Center
            </CardTitle>
            <CardDescription>Monitor running simulations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              View and control active simulation processes in real-time.
            </p>
            <Button className="w-full">
              <Activity className="mr-2 h-4 w-4" />
              Monitor Simulations
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <RotateCcw className="mr-2 h-5 w-5" />
              Results Analysis
            </CardTitle>
            <CardDescription>Analyze simulation outcomes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Review and compare results from completed simulation runs.
            </p>
            <Button className="w-full">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Results
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Configuration
            </CardTitle>
            <CardDescription>Simulation parameters and settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Configure simulation parameters, scenarios, and optimization objectives.
            </p>
            <Button className="w-full">
              <Settings className="mr-2 h-4 w-4" />
              Configure Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Simulation;
