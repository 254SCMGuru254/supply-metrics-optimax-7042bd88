
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import NetworkMap from '@/components/NetworkMap';
import { Shield, Activity, AlertTriangle, CheckCircle } from 'lucide-react';

export const ResilienceMetricsCalculator = () => {
  const [resilienceScore, setResilienceScore] = useState(0);
  const [metrics, setMetrics] = useState([
    { name: 'Network Redundancy', score: 85, status: 'good' },
    { name: 'Supplier Diversity', score: 72, status: 'moderate' },
    { name: 'Risk Mitigation', score: 91, status: 'excellent' },
    { name: 'Recovery Time', score: 68, status: 'moderate' }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'good': return <Activity className="h-4 w-4 text-blue-600" />;
      case 'moderate': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };

  const calculateResilience = () => {
    const average = metrics.reduce((sum, metric) => sum + metric.score, 0) / metrics.length;
    setResilienceScore(Math.round(average));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Supply Chain Resilience Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Resilience Components</h3>
              {metrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(metric.status)}
                    <span>{metric.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={metric.score} className="w-20" />
                    <Badge variant="secondary">{metric.score}%</Badge>
                  </div>
                </div>
              ))}
              
              <Button onClick={calculateResilience} className="w-full">
                Calculate Overall Resilience
              </Button>
              
              {resilienceScore > 0 && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{resilienceScore}%</div>
                  <div className="text-sm text-gray-600">Overall Resilience Score</div>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Network Visualization</h3>
              <NetworkMap nodes={[]} routes={[]} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
