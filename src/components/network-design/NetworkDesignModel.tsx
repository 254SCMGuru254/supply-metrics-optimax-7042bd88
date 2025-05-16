
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NetworkModel } from "./types/NetworkTypes";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface NetworkDesignModelProps {
  networkModel: NetworkModel | null;
}

export const NetworkDesignModel = ({ networkModel }: NetworkDesignModelProps) => {
  if (!networkModel || networkModel.factories.length === 0 || networkModel.depots.length === 0) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Model Incomplete</AlertTitle>
        <AlertDescription>
          Please add at least one factory and one depot to see the mathematical model.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mathematical Model</CardTitle>
        <CardDescription>
          The underlying optimization formulation for network design
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Objective Function</h3>
          <div className="bg-muted p-4 rounded-md font-mono text-sm">
            <p>Minimize Z = ∑<sub>i,j</sub> c<sub>ij</sub>X<sub>ij</sub> + ∑<sub>j</sub> f<sub>j</sub>Y<sub>j</sub> + ∑<sub>i,j</sub> h<sub>ij</sub>S<sub>ij</sub></p>
            <p className="mt-2">where:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>c<sub>ij</sub> = Transportation cost from factory i to depot j</li>
              <li>X<sub>ij</sub> = Flow quantity from factory i to depot j</li>
              <li>f<sub>j</sub> = Fixed cost of operating depot j</li>
              <li>Y<sub>j</sub> = Binary decision variable (1 if depot j is open, 0 otherwise)</li>
              <li>h<sub>ij</sub> = Inventory holding cost for products from factory i at depot j</li>
              <li>S<sub>ij</sub> = Safety stock level for products from factory i at depot j</li>
            </ul>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Constraints</h3>
          <div className="bg-muted p-4 rounded-md font-mono text-sm">
            <p>1. Demand satisfaction: ∑<sub>j</sub> Z<sub>jk</sub> = d<sub>k</sub> for all customers k</p>
            <p>2. Flow conservation: ∑<sub>i</sub> X<sub>ij</sub> = ∑<sub>k</sub> Z<sub>jk</sub> for all depots j</p>
            <p>3. Capacity constraints: ∑<sub>k</sub> Z<sub>jk</sub> ≤ cap<sub>j</sub>Y<sub>j</sub> for all depots j</p>
            <p>4. Safety stock: S<sub>ij</sub> = z × σ<sub>d</sub> × √L × X<sub>ij</sub> / ∑<sub>i</sub> X<sub>ij</sub></p>
            <p>5. Nonnegativity: X<sub>ij</sub> ≥ 0, Z<sub>jk</sub> ≥ 0, S<sub>ij</sub> ≥ 0</p>
            <p>6. Binary constraints: Y<sub>j</sub> ∈ {0,1}</p>
            <p className="mt-2">where:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Z<sub>jk</sub> = Flow quantity from depot j to customer k</li>
              <li>d<sub>k</sub> = Demand of customer k</li>
              <li>cap<sub>j</sub> = Capacity of depot j</li>
              <li>z = Service level factor</li>
              <li>σ<sub>d</sub> = Standard deviation of demand</li>
              <li>L = Lead time</li>
            </ul>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Component</TableHead>
              <TableHead>Current Model Parameter</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Stock Level Days</TableCell>
              <TableCell>Safety stock parameter</TableCell>
              <TableCell>{networkModel.settings.stockLevelDays} days</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Transit Time Days</TableCell>
              <TableCell>Lead time parameter</TableCell>
              <TableCell>{networkModel.settings.transitTimeDays} days</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Monthly Holding Rate</TableCell>
              <TableCell>Inventory carrying cost</TableCell>
              <TableCell>{(networkModel.settings.monthlyHoldingRate * 100).toFixed(2)}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Factories</TableCell>
              <TableCell>Supply nodes</TableCell>
              <TableCell>{networkModel.factories.length}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Depots</TableCell>
              <TableCell>Distribution nodes</TableCell>
              <TableCell>{networkModel.depots.length}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Customers</TableCell>
              <TableCell>Demand nodes</TableCell>
              <TableCell>{networkModel.customers.length}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
