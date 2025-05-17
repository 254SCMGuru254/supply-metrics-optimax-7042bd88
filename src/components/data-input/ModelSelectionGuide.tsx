// Correct imports
import { 
  AlertCircle, 
  Building, 
  BarChart3,
  CheckCircle2,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ModelSelectionGuide() {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Model Selection Guide</CardTitle>
        <CardDescription>
          Choose the right supply chain model for your needs
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <h3 className="text-lg font-semibold">Unsure where to start?</h3>
          </div>
          <p className="text-muted-foreground">
            Answer a few questions to find the best model for your specific
            supply chain challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                Network Optimization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Optimize your supply chain network for cost efficiency and
                service levels.
              </p>
              <div className="flex items-center justify-end space-x-2 mt-4">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <ArrowRight className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                Demand Forecasting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Predict future demand to optimize inventory and reduce stockouts.
              </p>
              <div className="flex items-center justify-end space-x-2 mt-4">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <ArrowLeft className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
