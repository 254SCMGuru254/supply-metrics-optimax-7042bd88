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

const NetworkOptimization = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Network Optimization Model</h1>
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
              <h2 className="text-2xl font-semibold">How to Use Network Optimization</h2>
            </div>
            
            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <Info className="h-5 w-5 text-muted-foreground" />
                  1. Data Requirements
                </h3>
                <div className="pl-7 space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Network Configuration:</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Facility locations and capacities</li>
                      <li>Customer demand points</li>
                      <li>Transportation routes and modes</li>
                      <li>Flow constraints</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Cost Parameters:</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Fixed facility costs</li>
                      <li>Variable handling costs</li>
                      <li>Transportation costs per unit-distance</li>
                      <li>Volume-based discounts</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Service Requirements:</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Delivery time windows</li>
                      <li>Service level agreements</li>
                      <li>Capacity utilization limits</li>
                    </ul>
                  </div>
                </div>
              </section>
              
              <section>
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <Info className="h-5 w-5 text-muted-foreground" />
                  2. Optimization Process
                </h3>
                <ul className="list-disc pl-7 space-y-2">
                  <li>Minimizes total network costs while meeting service requirements</li>
                  <li>Determines optimal facility locations and capacities</li>
                  <li>Optimizes transportation flows and routes</li>
                  <li>Evaluates trade-offs between cost and service levels</li>
                </ul>
              </section>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Verify that all cost data is in consistent units and time periods. Include all relevant constraints to ensure feasible solutions.
                </AlertDescription>
              </Alert>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="results">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <ChartBar className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Optimization Results</h2>
            </div>
            
            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-medium mb-4">Network Configuration</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Facility</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Utilization</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </section>

              <section>
                <h3 className="text-lg font-medium mb-4">Cost Summary</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cost Component</TableHead>
                      <TableHead>Total Cost</TableHead>
                      <TableHead>Cost per Unit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Fixed Costs</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Transportation</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Handling</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </section>

              <section>
                <h3 className="text-lg font-medium mb-4">Service Level Performance</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Achieved</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>On-Time Delivery</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Order Fill Rate</TableCell>
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

export default NetworkOptimization;