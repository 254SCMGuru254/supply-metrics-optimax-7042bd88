import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format } from "date-fns";

type AccuracyData = {
  modelName: string;
  metrics: {
    [key: string]: number;  // Accuracy percentage per metric
  };
};

type TrendData = {
  date: string;
  estimated: number;
  actual: number;
};

interface AccuracyDashboardProps {
  selectedModel?: string;
}

export const AccuracyDashboard = ({ selectedModel }: AccuracyDashboardProps) => {
  const [accuracyData, setAccuracyData] = useState<AccuracyData[]>([]);
  const [trendData, setTrendData] = useState<{ [key: string]: TrendData[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccuracyData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/metrics/accuracy');
        const data = await response.json();
        setAccuracyData(data);
        
        // Fetch trend data for each model
        const trends: { [key: string]: TrendData[] } = {};
        for (const model of data) {
          const trendResponse = await fetch(`/api/metrics/trend/${model.modelName}`);
          const trendData = await trendResponse.json();
          trends[model.modelName] = trendData;
        }
        setTrendData(trends);
      } catch (error) {
        console.error('Error fetching accuracy data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccuracyData();
  }, [selectedModel]);

  const filteredData = selectedModel 
    ? accuracyData.filter(model => model.modelName === selectedModel)
    : accuracyData;

  const renderAccuracyCard = (modelName: string, metrics: { [key: string]: number }) => (
    <Card key={modelName}>
      <CardHeader>
        <CardTitle>{modelName.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')}</CardTitle>
        <CardDescription>Model estimation accuracy analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(metrics).map(([metric, accuracy]) => (
            <div key={metric} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{metric.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}</span>
                <span className={accuracy >= 90 ? 'text-green-500' : 
                               accuracy >= 75 ? 'text-yellow-500' : 'text-red-500'}>
                  {accuracy.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    accuracy >= 90 ? 'bg-green-500' : 
                    accuracy >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${accuracy}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {trendData[modelName] && (
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">Historical Trend</h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData[modelName]}>
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => format(new Date(date), 'MMM dd')}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(date) => format(new Date(date), 'MMM dd, yyyy')}
                    formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="estimated" 
                    stroke="#2563eb" 
                    name="Estimated"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#16a34a" 
                    name="Actual"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Estimation Accuracy</CardTitle>
          <CardDescription>
            Analysis of model estimation accuracy compared to actual results
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading accuracy data...</p>
          ) : (
            <Tabs defaultValue={filteredData[0]?.modelName} className="space-y-4">
              <TabsList className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {filteredData.map(model => (
                  <TabsTrigger 
                    key={model.modelName} 
                    value={model.modelName}
                    className="text-xs md:text-sm"
                  >
                    {model.modelName.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {filteredData.map(model => (
                <TabsContent 
                  key={model.modelName} 
                  value={model.modelName}
                  className="space-y-4"
                >
                  {renderAccuracyCard(model.modelName, model.metrics)}
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};