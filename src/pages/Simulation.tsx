import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, BookOpen, ChartBar, Info } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Simulation = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Supply Chain Simulation</h1>
      <Tabs defaultValue="guide">
        <TabsList className="mb-4">
          <TabsTrigger value="guide" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            User Guide
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <ChartBar className="h-4 w-4" />
            Results
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="guide">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">How to Use Supply Chain Simulation</h2>
            </div>
            
            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <Info className="h-5 w-5 text-muted-foreground" />
                  1. Data Requirements
                </h3>
                <div className="pl-7 space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Historical Data:</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Demand patterns and seasonality</li>
                      <li>Lead time distributions</li>
                      <li>Production/supply variability</li>
                      <li>Cost fluctuations</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Network Parameters:</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Facility capacities and constraints</li>
                      <li>Transportation modes and times</li>
                      <li>Inventory policies</li>
                      <li>Service level targets</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Scenario Inputs:</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Demand growth projections</li>
                      <li>Network changes</li>
                      <li>Policy modifications</li>
                      <li>Risk events</li>
                    </ul>
                  </div>
                </div>
              </section>
              
              <section>
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <Info className="h-5 w-5 text-muted-foreground" />
                  2. Simulation Process
                </h3>
                <ul className="list-disc pl-7 space-y-2">
                  <li>Runs multiple scenarios with stochastic variables</li>
                  <li>Analyzes system behavior over time</li>
                  <li>Evaluates performance metrics</li>
                  <li>Identifies bottlenecks and risks</li>
                </ul>
              </section>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Include sufficient historical data to capture variability patterns. More simulation runs will provide more reliable results.
                </AlertDescription>
              </Alert>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="results">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <ChartBar className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Simulation Results</h2>
            </div>
            
            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-medium mb-4">Performance Metrics</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead>Average</TableHead>
                      <TableHead>Min</TableHead>
                      <TableHead>Max</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Service Level</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Inventory Turns</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Lead Time (days)</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </section>

              <section>
                <h3 className="text-lg font-medium mb-4">Resource Utilization</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Resource</TableHead>
                      <TableHead>Utilization</TableHead>
                      <TableHead>Bottleneck Risk</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Production</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Storage</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Transportation</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </section>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Simulation;