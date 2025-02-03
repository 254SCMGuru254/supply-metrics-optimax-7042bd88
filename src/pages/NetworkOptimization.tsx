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

const NetworkOptimization = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Network Optimization Model</h1>
      <Tabs defaultValue="guide">
        <TabsList className="mb-4">
          <TabsTrigger value="guide">User Guide</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="guide">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">How to Use Network Optimization</h2>
            
            <div className="space-y-4">
              <section>
                <h3 className="text-lg font-medium mb-2">1. Data Requirements</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Supply nodes with capacities and fixed/variable costs</li>
                  <li>Demand points with service level requirements</li>
                  <li>Transportation routes with distances and costs</li>
                </ul>
              </section>
              
              <section>
                <h3 className="text-lg font-medium mb-2">2. Process</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The model minimizes total network costs</li>
                  <li>Considers facility, transportation, and inventory costs</li>
                  <li>Ensures demand satisfaction and service level constraints</li>
                </ul>
              </section>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Complete network data including costs and constraints must be entered before optimization.
                </AlertDescription>
              </Alert>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="results">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Optimization Results</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Facility</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Flow</TableHead>
                  <TableHead>Total Cost</TableHead>
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

export default NetworkOptimization;