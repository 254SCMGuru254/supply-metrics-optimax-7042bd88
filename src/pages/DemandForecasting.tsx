
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  TrendingUp, FileInput, BarChart3, LineChart, Calendar, Upload, 
  Download, ArrowDownToLine, Play, AlertCircle, Check, RefreshCcw 
} from "lucide-react";
import axios from "axios";

// Mock backend URL (should be replaced with environment variable)
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

interface ForecastParams {
  startDate: string;
  periods: number;
  frequency: string;
  model: string;
  includeSeasonality: boolean;
  includeTrend: boolean;
  includeHolidays: boolean;
}

interface ForecastResult {
  dates: string[];
  predictions: number[];
  lowerBound: number[];
  upperBound: number[];
  metrics: {
    mape: number;
    rmse: number;
    mae: number;
  };
}

// API functions
const fetchHistoricalData = async () => {
  try {
    const response = await axios.get(`${backendUrl}/api/forecasting/data`);
    return response.data;
  } catch (error) {
    console.error("Error fetching historical data:", error);
    throw new Error("Failed to fetch historical data");
  }
};

const generateForecast = async (params: ForecastParams) => {
  try {
    const response = await axios.post(`${backendUrl}/api/forecasting/predict`, params);
    return response.data;
  } catch (error) {
    console.error("Error generating forecast:", error);
    throw new Error("Failed to generate forecast");
  }
};

const DemandForecasting = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [forecastParams, setForecastParams] = useState<ForecastParams>({
    startDate: new Date().toISOString().split('T')[0],
    periods: 30,
    frequency: "D",
    model: "prophet",
    includeSeasonality: true,
    includeTrend: true,
    includeHolidays: false,
  });
  const [forecastResults, setForecastResults] = useState<ForecastResult | null>(null);
  const { toast } = useToast();

  // Fetch historical data - mark as enabled: false for now until API is ready
  const { data: historicalData, isLoading: isLoadingData, error: dataError } = useQuery({
    queryKey: ['historicalData'],
    queryFn: fetchHistoricalData,
    enabled: false, // Don't fetch automatically until API is ready
  });

  // Mutation for forecast generation
  const { mutate: runForecast, isPending: isGeneratingForecast } = useMutation({
    mutationFn: generateForecast,
    onSuccess: (data) => {
      setForecastResults(data);
      toast({
        title: "Forecast Generated",
        description: "Demand forecast has been successfully generated",
      });
      setActiveTab("results");
    },
    onError: (error) => {
      toast({
        title: "Forecast Error",
        description: "Failed to generate forecast. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleImportData = () => {
    toast({
      title: "Data Import",
      description: "Ready to import historical data",
    });
  };

  const handleGenerateForecast = () => {
    // For now, use mock data since API isn't connected
    const mockResults: ForecastResult = {
      dates: Array.from({ length: forecastParams.periods }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return date.toISOString().split('T')[0];
      }),
      predictions: Array.from({ length: forecastParams.periods }, () => Math.floor(Math.random() * 1000) + 500),
      lowerBound: Array.from({ length: forecastParams.periods }, () => Math.floor(Math.random() * 400) + 300),
      upperBound: Array.from({ length: forecastParams.periods }, () => Math.floor(Math.random() * 1500) + 1000),
      metrics: {
        mape: 12.5,
        rmse: 45.3,
        mae: 35.7
      }
    };
    
    setForecastResults(mockResults);
    toast({
      title: "Forecast Generated",
      description: "Demand forecast has been successfully generated",
    });
    setActiveTab("results");
    
    // When API is ready, uncomment this:
    // runForecast(forecastParams);
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="h-8 w-8" />
            Demand Forecasting
          </h1>
          <p className="text-muted-foreground mt-2">
            Predict future demand using advanced time-series analysis
          </p>
        </div>

        <Button onClick={handleImportData}>
          <Upload className="mr-2 h-4 w-4" />
          Import Historical Data
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
          <TabsTrigger value="models">Forecast Models</TabsTrigger>
          <TabsTrigger value="results">Results & Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">About Demand Forecasting</h2>
            <p className="mb-4">
              Demand forecasting helps predict future customer demand using historical data and statistical techniques.
              Accurate forecasts allow you to optimize inventory levels, production schedules, and resource allocation.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <Card className="p-4 border-l-4 border-l-blue-500">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <h3 className="font-medium">Time-Series Analysis</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Identify trends, seasonality, and patterns in historical data to predict future demand.
                </p>
              </Card>
              
              <Card className="p-4 border-l-4 border-l-green-500">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium">Multiple Models</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Compare different forecasting methods including ARIMA, Prophet, and machine learning algorithms.
                </p>
              </Card>
              
              <Card className="p-4 border-l-4 border-l-purple-500">
                <div className="flex items-center gap-3 mb-2">
                  <LineChart className="h-5 w-5 text-purple-500" />
                  <h3 className="font-medium">Accuracy Metrics</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Evaluate forecasts with metrics like MAPE, MAE, and RMSE to ensure reliable predictions.
                </p>
              </Card>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Getting Started</h3>
              <ol className="space-y-4 list-decimal list-inside">
                <li className="text-muted-foreground">Import or upload your historical demand data</li>
                <li className="text-muted-foreground">Configure forecast parameters and select models</li>
                <li className="text-muted-foreground">Generate and compare forecast results</li>
                <li className="text-muted-foreground">Export or integrate forecasts into your supply chain</li>
              </ol>
              <Button variant="outline" className="mt-6">
                <FileInput className="mr-2 h-4 w-4" />
                View Documentation
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Sample Forecasts</h3>
              <div className="h-[200px] flex items-center justify-center border rounded-md bg-slate-50">
                <LineChart className="h-24 w-24 text-muted-foreground/50" />
              </div>
              <div className="flex justify-center mt-4">
                <Button variant="outline" onClick={() => setActiveTab("models")}>
                  Try Forecasting
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Data Management</h2>
            <p className="text-muted-foreground mb-6">
              Import, view, and prepare your historical demand data for forecasting.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="importFile">Import Data File</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input id="importFile" type="file" accept=".csv,.xlsx" />
                    <Button>Upload</Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supported formats: CSV, Excel (.xlsx)
                  </p>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-md font-medium mb-2">Sample Data</h3>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download Template
                    </Button>
                    <Button variant="outline" size="sm">
                      <ArrowDownToLine className="h-4 w-4 mr-1" />
                      Load Sample Data
                    </Button>
                  </div>
                </div>
              </div>
              
              <Card className="p-4 bg-muted/50">
                <h3 className="text-md font-medium mb-2">Data Requirements</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Date column in YYYY-MM-DD format</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Demand/quantity values as numbers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Consistent time intervals (daily, weekly, monthly)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Optional: External factors as additional columns</span>
                  </li>
                </ul>
              </Card>
            </div>
            
            <div className="mt-6">
              <h3 className="text-md font-medium mb-2">Data Preview</h3>
              <div className="border rounded-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr className="text-left">
                        <th className="p-2 font-medium">Date</th>
                        <th className="p-2 font-medium">Demand</th>
                        <th className="p-2 font-medium">Product</th>
                        <th className="p-2 font-medium">Region</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoadingData ? (
                        <tr>
                          <td colSpan={4} className="p-4 text-center">Loading data...</td>
                        </tr>
                      ) : dataError ? (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-red-500">
                            <AlertCircle className="h-4 w-4 inline-block mr-1" />
                            Error loading data
                          </td>
                        </tr>
                      ) : (
                        <>
                          <tr>
                            <td className="p-2">2023-01-01</td>
                            <td className="p-2">345</td>
                            <td className="p-2">Product A</td>
                            <td className="p-2">Nairobi</td>
                          </tr>
                          <tr>
                            <td className="p-2">2023-01-02</td>
                            <td className="p-2">322</td>
                            <td className="p-2">Product A</td>
                            <td className="p-2">Nairobi</td>
                          </tr>
                          <tr>
                            <td className="p-2">2023-01-03</td>
                            <td className="p-2">378</td>
                            <td className="p-2">Product A</td>
                            <td className="p-2">Nairobi</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button onClick={() => setActiveTab("models")}>
                Continue to Forecast Models
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Forecast Models</h2>
            <p className="text-muted-foreground mb-6">
              Configure and run different forecasting models to predict future demand.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="forecastStart">Forecast Start Date</Label>
                    <Input 
                      id="forecastStart" 
                      type="date"
                      value={forecastParams.startDate}
                      onChange={(e) => setForecastParams({...forecastParams, startDate: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="periods">Forecast Periods</Label>
                    <Input 
                      id="periods" 
                      type="number" 
                      min={1} 
                      max={365}
                      value={forecastParams.periods}
                      onChange={(e) => setForecastParams({...forecastParams, periods: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="frequency">Time Frequency</Label>
                    <Select 
                      value={forecastParams.frequency}
                      onValueChange={(value) => setForecastParams({...forecastParams, frequency: value})}
                    >
                      <SelectTrigger id="frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="D">Daily</SelectItem>
                        <SelectItem value="W">Weekly</SelectItem>
                        <SelectItem value="M">Monthly</SelectItem>
                        <SelectItem value="Q">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="model">Forecasting Model</Label>
                    <Select
                      value={forecastParams.model}
                      onValueChange={(value) => setForecastParams({...forecastParams, model: value})}
                    >
                      <SelectTrigger id="model">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prophet">Facebook Prophet</SelectItem>
                        <SelectItem value="arima">ARIMA</SelectItem>
                        <SelectItem value="exponential">Exponential Smoothing</SelectItem>
                        <SelectItem value="randomforest">Random Forest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-md font-medium">Model Parameters</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="seasonality" 
                      checked={forecastParams.includeSeasonality}
                      onCheckedChange={(checked) => 
                        setForecastParams({...forecastParams, includeSeasonality: checked === true})
                      }
                    />
                    <Label htmlFor="seasonality">Include seasonality</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="trend" 
                      checked={forecastParams.includeTrend}
                      onCheckedChange={(checked) => 
                        setForecastParams({...forecastParams, includeTrend: checked === true})
                      }
                    />
                    <Label htmlFor="trend">Include trend</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="holidays" 
                      checked={forecastParams.includeHolidays}
                      onCheckedChange={(checked) => 
                        setForecastParams({...forecastParams, includeHolidays: checked === true})
                      }
                    />
                    <Label htmlFor="holidays">Include holiday effects (Kenya)</Label>
                  </div>
                </div>
              </div>
              
              <Card className="p-4 bg-muted/50">
                <h3 className="text-md font-medium mb-4">Model Information</h3>
                
                {forecastParams.model === "prophet" && (
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Facebook Prophet</span> - Decomposable time series model with trend, seasonality, and holiday effects.</p>
                    <p className="text-muted-foreground">Best for: Data with strong seasonal patterns and multiple seasonalities</p>
                  </div>
                )}
                
                {forecastParams.model === "arima" && (
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">ARIMA</span> - AutoRegressive Integrated Moving Average model.</p>
                    <p className="text-muted-foreground">Best for: Stationary time series with no strong seasonal components</p>
                  </div>
                )}
                
                {forecastParams.model === "exponential" && (
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Exponential Smoothing</span> - Weighted averaging with exponentially decreasing weights.</p>
                    <p className="text-muted-foreground">Best for: Short-term forecasting with limited data</p>
                  </div>
                )}
                
                {forecastParams.model === "randomforest" && (
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Random Forest</span> - Machine learning ensemble method.</p>
                    <p className="text-muted-foreground">Best for: Complex datasets with many external features</p>
                  </div>
                )}
              </Card>
            </div>
            
            <div className="flex justify-end mt-8">
              <Button onClick={handleGenerateForecast} disabled={isGeneratingForecast}>
                {isGeneratingForecast ? (
                  <>
                    <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Generate Forecast
                  </>
                )}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Forecast Results</h2>
            <p className="text-muted-foreground mb-6">
              View and analyze forecast results and accuracy metrics.
            </p>
            
            {forecastResults ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 bg-muted/50">
                    <h3 className="text-sm font-medium text-muted-foreground">MAPE</h3>
                    <p className="text-2xl font-bold">{forecastResults.metrics.mape.toFixed(2)}%</p>
                    <p className="text-xs text-muted-foreground">Mean Absolute Percentage Error</p>
                  </Card>
                  
                  <Card className="p-4 bg-muted/50">
                    <h3 className="text-sm font-medium text-muted-foreground">RMSE</h3>
                    <p className="text-2xl font-bold">{forecastResults.metrics.rmse.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Root Mean Square Error</p>
                  </Card>
                  
                  <Card className="p-4 bg-muted/50">
                    <h3 className="text-sm font-medium text-muted-foreground">MAE</h3>
                    <p className="text-2xl font-bold">{forecastResults.metrics.mae.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Mean Absolute Error</p>
                  </Card>
                </div>
                
                <div className="h-[300px] flex items-center justify-center border rounded-md bg-slate-50">
                  <p className="text-muted-foreground">Forecast chart will be displayed here</p>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-md font-medium mb-2">Forecast Data</h3>
                  <div className="border rounded-md overflow-hidden">
                    <div className="overflow-x-auto max-h-[300px]">
                      <table className="w-full">
                        <thead className="bg-muted sticky top-0">
                          <tr className="text-left">
                            <th className="p-2 font-medium">Date</th>
                            <th className="p-2 font-medium">Forecast</th>
                            <th className="p-2 font-medium">Lower Bound</th>
                            <th className="p-2 font-medium">Upper Bound</th>
                          </tr>
                        </thead>
                        <tbody>
                          {forecastResults.dates.map((date, index) => (
                            <tr key={date}>
                              <td className="p-2">{date}</td>
                              <td className="p-2">{forecastResults.predictions[index].toFixed(2)}</td>
                              <td className="p-2">{forecastResults.lowerBound[index].toFixed(2)}</td>
                              <td className="p-2">{forecastResults.upperBound[index].toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button variant="outline" className="mr-2">
                    <Download className="mr-2 h-4 w-4" />
                    Export Results
                  </Button>
                  <Button onClick={() => setActiveTab("models")}>
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Run Another Forecast
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <LineChart className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No forecast results yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Configure and generate a forecast to see results
                </p>
                
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setActiveTab("models")}
                >
                  Go to Forecast Models
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DemandForecasting;
