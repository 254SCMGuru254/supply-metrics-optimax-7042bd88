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

const CenterOfGravity = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Center of Gravity Model</h1>
      <Tabs defaultValue="guide">
        <TabsList className="mb-4">
          <TabsTrigger value="guide">User Guide</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="guide">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">How to Use the Center of Gravity Model</h2>
            
            <div className="space-y-4">
              <section>
                <h3 className="text-lg font-medium mb-2">1. Data Requirements</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Supply nodes with locations (latitude/longitude) and capacities</li>
                  <li>Demand points with locations and demand volumes</li>
                  <li>Transportation costs between nodes and demand points</li>
                </ul>
              </section>
              
              <section>
                <h3 className="text-lg font-medium mb-2">2. Process</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The model calculates the optimal facility location based on weighted distances</li>
                  <li>Weights are determined by demand volumes and transportation costs</li>
                  <li>Results show the optimal coordinates for minimizing total transportation costs</li>
                </ul>
              </section>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Ensure all locations and demand data are entered in the Data Input section before running the model.
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
                  <TableHead>Optimal Location</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead>Average Distance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Lat: 0.00, Long: 0.00</TableCell>
                  <TableCell>$0.00</TableCell>
                  <TableCell>0.00 km</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CenterOfGravity;