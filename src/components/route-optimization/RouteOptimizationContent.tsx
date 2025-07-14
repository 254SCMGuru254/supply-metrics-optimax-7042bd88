
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NetworkMap from '@/components/NetworkMap';
import { Trash2, Plus, MapPin, Route } from 'lucide-react';

interface RouteOptimizationContentProps {
  projectId: string;
}

export const RouteOptimizationContent: React.FC<RouteOptimizationContentProps> = ({ projectId }) => {
  const [nodes, setNodes] = useState([]);
  const [routes, setRoutes] = useState([]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Route Optimization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NetworkMap 
            nodes={nodes} 
            routes={routes}
            className="mb-6"
          />
          
          <div className="flex gap-2">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Location
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Optimize Routes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
