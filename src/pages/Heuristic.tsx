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

const Heuristic = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Heuristic Analysis</h1>
      <Tabs defaultValue="guide">
        <TabsList className="mb-4">
          <TabsTrigger value="guide">User Guide</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="guide">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">How to Use Heuristic Analysis</h2>
            
            <div className="space-y-4">
              <section>
                <h3 className="text-lg font-medium mb-2">1. Data Requirements</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Network nodes and connections</li>
                  <li>Demand and capacity constraints</li>
                  <li>Cost parameters</li>
                </ul>
              </section>
              
              <section>
                <h3 className="text-lg font-medium mb-2">2. Process</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Applies quick solution methods for complex problems</li>
                  <li>Uses approximation algorithms for faster results</li>
                  <li>Provides good solutions for large-scale networks</li>
                </ul>
              </section>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  While not guaranteed to find the optimal solution, heuristic methods provide practical solutions quickly.
                </AlertDescription>
              </Alert>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="results">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Analysis Results</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Solution</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Quality</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Pending analysis</TableCell>
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

export default Heuristic;