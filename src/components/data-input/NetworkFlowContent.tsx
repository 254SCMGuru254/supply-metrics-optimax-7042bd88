
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const NetworkFlowContent = () => {
  const [nodes] = useState([
    { id: 1, name: "Warehouse A", capacity: 5000 },
    { id: 2, name: "Warehouse B", capacity: 3000 },
    { id: 3, name: "Distribution Center 1", capacity: 2000 },
    { id: 4, name: "Retail Store 1", capacity: 1000 },
    { id: 5, name: "Retail Store 2", capacity: 1500 },
  ]);
  
  const [costs] = useState([
    { from: 1, to: 3, cost: 10 },
    { from: 1, to: 4, cost: 20 },
    { from: 2, to: 3, cost: 15 },
    { from: 2, to: 5, cost: 25 },
    { from: 3, to: 4, cost: 5 },
    { from: 3, to: 5, cost: 8 },
  ]);
  
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Network Flow Data</h2>
      <Tabs defaultValue="capacities">
        <TabsList className="mb-6">
          <TabsTrigger value="capacities">Node Capacities</TabsTrigger>
          <TabsTrigger value="flow-constraints">Flow Constraints</TabsTrigger>
          <TabsTrigger value="cost-matrix">Cost Matrix</TabsTrigger>
        </TabsList>
        <TabsContent value="capacities">
          <p className="text-muted-foreground mb-4">
            Define capacity constraints for each node in the network.
          </p>
          <div className="mb-4 flex justify-between">
            <h3 className="text-lg font-medium">Node Capacities</h3>
            <Button variant="outline" size="sm">Import Data</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Node ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nodes.map((node) => (
                <TableRow key={node.id}>
                  <TableCell>{node.id}</TableCell>
                  <TableCell>{node.name}</TableCell>
                  <TableCell>
                    <Input 
                      type="number" 
                      defaultValue={node.capacity} 
                      className="w-24" 
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="flow-constraints">
          <p className="text-muted-foreground mb-4">
            Set minimum and maximum flow constraints for each route in the network.
          </p>
          <div className="mb-4 flex justify-between">
            <h3 className="text-lg font-medium">Flow Constraints</h3>
            <Button variant="outline" size="sm">Add Constraint</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Min Flow</TableHead>
                <TableHead>Max Flow</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Warehouse A</TableCell>
                <TableCell>Distribution Center 1</TableCell>
                <TableCell>
                  <Input type="number" defaultValue={0} className="w-20" />
                </TableCell>
                <TableCell>
                  <Input type="number" defaultValue={2000} className="w-20" />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Warehouse B</TableCell>
                <TableCell>Distribution Center 1</TableCell>
                <TableCell>
                  <Input type="number" defaultValue={100} className="w-20" />
                </TableCell>
                <TableCell>
                  <Input type="number" defaultValue={1500} className="w-20" />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Distribution Center 1</TableCell>
                <TableCell>Retail Store 1</TableCell>
                <TableCell>
                  <Input type="number" defaultValue={200} className="w-20" />
                </TableCell>
                <TableCell>
                  <Input type="number" defaultValue={1000} className="w-20" />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="cost-matrix">
          <p className="text-muted-foreground mb-4">
            Upload or define a cost matrix for transportation between nodes.
          </p>
          <div className="mb-4 flex justify-between">
            <h3 className="text-lg font-medium">Transportation Cost Matrix</h3>
            <div className="space-x-2">
              <Button variant="outline" size="sm">Import CSV</Button>
              <Button variant="outline" size="sm">Export</Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Cost per Unit</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {costs.map((cost, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {nodes.find(n => n.id === cost.from)?.name || `Node ${cost.from}`}
                  </TableCell>
                  <TableCell>
                    {nodes.find(n => n.id === cost.to)?.name || `Node ${cost.to}`}
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number" 
                      defaultValue={cost.cost} 
                      className="w-24"
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
