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

const CenterOfGravity = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Center of Gravity Model</h1>
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
              <h2 className="text-2xl font-semibold">How to Use the Center of Gravity Model</h2>
            </div>
            
            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <Info className="h-5 w-5 text-muted-foreground" />
                  1. Data Requirements
                </h3>
                <div className="pl-7 space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Supply Node Data:</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Location coordinates (latitude/longitude)</li>
                      <li>Production or storage capacity</li>
                      <li>Fixed facility costs</li>
                      <li>Variable handling costs</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Demand Point Data:</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Customer location coordinates</li>
                      <li>Demand volumes</li>
                      <li>Service level requirements</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Transportation Data:</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Distance between nodes</li>
                      <li>Transportation costs per unit</li>
                      <li>Mode of transport constraints</li>
                    </ul>
                  </div>
                </div>
              </section>
              
              <section>
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <Info className="h-5 w-5 text-muted-foreground" />
                  2. Analysis Process
                </h3>
                <ul className="list-disc pl-7 space-y-2">
                  <li>Model calculates weighted center point based on demand volumes</li>
                  <li>Optimizes facility location to minimize total transportation costs</li>
                  <li>Considers both inbound and outbound logistics costs</li>
                  <li>Evaluates multiple scenarios for sensitivity analysis</li>
                </ul>
              </section>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Ensure all location coordinates are in the same format (decimal degrees) and costs are in consistent units before running the analysis.
                </AlertDescription>
              </Alert>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="results">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <ChartBar className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Analysis Results</h2>
            </div>
            
            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-medium mb-4">Optimal Facility Location</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Unit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Latitude</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>degrees</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Longitude</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>degrees</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Total Cost</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>USD</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </section>

              <section>
                <h3 className="text-lg font-medium mb-4">Cost Analysis</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cost Component</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Transportation</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Facility</TableCell>
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
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CenterOfGravity;