import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
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
          <TabsTrigger value="guide">User Guide</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="guide">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">How to Use Supply Chain Simulation</h2>
            
            <div className="space-y-4">
              <section>
                <h3 className="text-lg font-medium mb-2">1. Data Requirements</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Network configuration (nodes and routes)</li>
                  <li>Demand patterns and variability</li>
                  <li>Transit times and service levels</li>
                </ul>
              </section>
              
              <section>
                <h3 className="text-lg font-medium mb-2">2. Process</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Simulates supply chain operations over time</li>
                  <li>Analyzes system performance under uncertainty</li>
                  <li>Evaluates service level achievement</li>
                </ul>
              </section>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Historical demand data and network parameters should be entered for accurate simulation results.
                </AlertDescription>
              </Alert>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="results">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Simulation Results</h2>
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
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Simulation;