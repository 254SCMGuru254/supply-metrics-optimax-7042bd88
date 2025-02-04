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

const Heuristic = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Heuristic Analysis</h1>
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
              <h2 className="text-2xl font-semibold">How to Use Heuristic Analysis</h2>
            </div>
            
            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <Info className="h-5 w-5 text-muted-foreground" />
                  1. Data Requirements
                </h3>
                <div className="pl-7 space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Problem Definition:</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Network structure and constraints</li>
                      <li>Objective function parameters</li>
                      <li>Decision variables</li>
                      <li>Time limitations</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Operational Parameters:</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Resource capacities</li>
                      <li>Processing times</li>
                      <li>Setup requirements</li>
                      <li>Cost factors</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Solution Requirements:</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Solution quality threshold</li>
                      <li>Computation time limits</li>
                      <li>Feasibility constraints</li>
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
                  <li>Applies efficient approximation algorithms</li>
                  <li>Generates quick solutions for complex problems</li>
                  <li>Evaluates multiple starting points</li>
                  <li>Provides solution quality estimates</li>
                </ul>
              </section>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  While heuristic methods may not guarantee optimal solutions, they provide good solutions quickly for large-scale problems.
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
                <h3 className="text-lg font-medium mb-4">Solution Summary</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Quality Estimate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Objective Value</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Computation Time</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Gap to Best Known</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </section>

              <section>
                <h3 className="text-lg font-medium mb-4">Solution Details</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Component</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Feasibility</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Constraints Met</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Local Optimality</TableCell>
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

export default Heuristic;