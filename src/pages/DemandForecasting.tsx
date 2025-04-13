
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { TrendingUp, FileInput, BarChart3, LineChart, Calendar, Upload } from "lucide-react";

const DemandForecasting = () => {
  const [activeTab, setActiveTab] = useState("overview");

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

        <Button>
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
                <Button variant="outline">
                  View Examples
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
            <div className="h-[300px] flex items-center justify-center border rounded-md bg-slate-50">
              <p className="text-muted-foreground">Data management interface will be displayed here</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Forecast Models</h2>
            <p className="text-muted-foreground mb-6">
              Configure and run different forecasting models to predict future demand.
            </p>
            <div className="h-[300px] flex items-center justify-center border rounded-md bg-slate-50">
              <p className="text-muted-foreground">Forecasting models interface will be displayed here</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Results & Analysis</h2>
            <p className="text-muted-foreground mb-6">
              View, compare, and analyze forecast results and accuracy metrics.
            </p>
            <div className="h-[300px] flex items-center justify-center border rounded-md bg-slate-50">
              <p className="text-muted-foreground">Forecast results and analysis will be displayed here</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DemandForecasting;
