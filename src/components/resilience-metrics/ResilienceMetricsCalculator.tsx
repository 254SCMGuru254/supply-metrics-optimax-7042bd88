
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NetworkMap } from '@/components/NetworkMap';
import { AlertTriangle, Shield, TrendingUp, Activity, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ResilienceMetricsProps {
  projectId?: string;
}

const ResilienceMetricsCalculator: React.FC<ResilienceMetricsProps> = ({ projectId }) => {
  const [metrics, setMetrics] = useState({
    redundancy: 0,
    flexibility: 0,
    velocity: 0,
    visibility: 0,
    collaboration: 0
  });

  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const calculateResilience = () => {
    setLoading(true);
    
    // Simulate calculation
    setTimeout(() => {
      const overallScore = Object.values(metrics).reduce((sum, score) => sum + score, 0) / Object.keys(metrics).length;
      
      const resilienceLevel = overallScore >= 80 ? 'High' : overallScore >= 60 ? 'Medium' : 'Low';
      const riskLevel = overallScore >= 80 ? 'Low' : overallScore >= 60 ? 'Medium' : 'High';
      
      setResults({
        overallScore,
        resilienceLevel,
        riskLevel,
        recommendations: [
          'Increase supplier diversification to improve redundancy',
          'Implement real-time visibility tools',
          'Develop contingency plans for critical disruptions'
        ]
      });
      setLoading(false);
      
      toast({
        title: "Resilience Analysis Complete",
        description: `Overall resilience score: ${overallScore.toFixed(1)}%`
      });
    }, 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          Supply Chain Resilience Metrics
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mt-2">
          Assess and improve your supply chain's ability to withstand and recover from disruptions
        </p>
      </div>

      <Tabs defaultValue="assessment" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="assessment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Resilience Factors Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="redundancy">Redundancy Score (0-100)</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Input
                      id="redundancy"
                      type="number"
                      min="0"
                      max="100"
                      value={metrics.redundancy || ''}
                      onChange={(e) => setMetrics({...metrics, redundancy: parseInt(e.target.value) || 0})}
                      placeholder="Enter redundancy score"
                    />
                    <Progress value={metrics.redundancy} className="flex-1" />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Alternative suppliers, routes, and facilities</p>
                </div>

                <div>
                  <Label htmlFor="flexibility">Flexibility Score (0-100)</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Input
                      id="flexibility"
                      type="number"
                      min="0"
                      max="100"
                      value={metrics.flexibility || ''}
                      onChange={(e) => setMetrics({...metrics, flexibility: parseInt(e.target.value) || 0})}
                      placeholder="Enter flexibility score"
                    />
                    <Progress value={metrics.flexibility} className="flex-1" />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Ability to adapt to changing conditions</p>
                </div>

                <div>
                  <Label htmlFor="velocity">Velocity Score (0-100)</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Input
                      id="velocity"
                      type="number"
                      min="0"
                      max="100"
                      value={metrics.velocity || ''}
                      onChange={(e) => setMetrics({...metrics, velocity: parseInt(e.target.value) || 0})}
                      placeholder="Enter velocity score"
                    />
                    <Progress value={metrics.velocity} className="flex-1" />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Speed of response to disruptions</p>
                </div>

                <div>
                  <Label htmlFor="visibility">Visibility Score (0-100)</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Input
                      id="visibility"
                      type="number"
                      min="0"
                      max="100"
                      value={metrics.visibility || ''}
                      onChange={(e) => setMetrics({...metrics, visibility: parseInt(e.target.value) || 0})}
                      placeholder="Enter visibility score"
                    />
                    <Progress value={metrics.visibility} className="flex-1" />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Real-time monitoring and transparency</p>
                </div>

                <div>
                  <Label htmlFor="collaboration">Collaboration Score (0-100)</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Input
                      id="collaboration"
                      type="number"
                      min="0"
                      max="100"
                      value={metrics.collaboration || ''}
                      onChange={(e) => setMetrics({...metrics, collaboration: parseInt(e.target.value) || 0})}
                      placeholder="Enter collaboration score"
                    />
                    <Progress value={metrics.collaboration} className="flex-1" />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Partnership strength and communication</p>
                </div>
              </div>

              <div className="mt-6">
                <Button 
                  onClick={calculateResilience} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Calculating...' : 'Calculate Resilience Score'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {results && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Overall Resilience Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className={`text-6xl font-bold ${getScoreColor(results.overallScore)}`}>
                      {results.overallScore.toFixed(1)}%
                    </div>
                    <div className="flex justify-center gap-2">
                      <Badge variant={getScoreBadge(results.overallScore)}>
                        {results.resilienceLevel} Resilience
                      </Badge>
                      <Badge variant={results.riskLevel === 'Low' ? 'default' : results.riskLevel === 'Medium' ? 'secondary' : 'destructive'}>
                        {results.riskLevel} Risk
                      </Badge>
                    </div>
                    <Progress value={results.overallScore} className="mt-4" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Factor Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(metrics).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="capitalize">{key}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={value} className="w-20" />
                          <span className={`font-semibold ${getScoreColor(value)}`}>{value}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          {results && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Improvement Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-semibold">Recommendation {index + 1}</div>
                        <div className="text-sm text-gray-600">{rec}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResilienceMetricsCalculator;
