
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

const Isohedron = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Isohedron Analysis</h1>
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
              <h2 className="text-2xl font-semibold">How to Use Isohedron Analysis</h2>
            </div>
            
            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <Info className="h-5 w-5 text-muted-foreground" />
                  1. Data Requirements
                </h3>
                <div className="pl-7 space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Network Parameters:</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Node coordinates and weights</li>
                      <li>Connection strengths</li>
                      <li>Spatial constraints</li>
                      <li>Cost matrices</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Optimization Parameters:</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Target function specifications</li>
                      <li>Convergence criteria</li>
                      <li>Balance factors</li>
                      <li>Iteration limits</li>
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
                  <li>Constructs spatial tessellation based on supply chain nodes</li>
                  <li>Optimizes node placement using isohedron geometry</li>
                  <li>Balances spatial coverage with transportation costs</li>
                  <li>Generates optimal territory divisions</li>
                </ul>
              </section>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Ensure your network data is properly normalized and validated before running the isohedron analysis.
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
                <h3 className="text-lg font-medium mb-4">Optimization Results</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Improvement</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Coverage Score</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Balance Index</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Cost Efficiency</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </section>

              <section>
                <h3 className="text-lg font-medium mb-4">Territory Analysis</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Territory</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Demand Coverage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Region 1</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Region 2</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Region 3</TableCell>
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

export default Isohedron;
