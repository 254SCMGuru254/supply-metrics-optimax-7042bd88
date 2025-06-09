
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Node } from "@/components/map/MapTypes";

interface ManualConnectionCreatorProps {
  nodes: Node[];
  onCreateConnection: (fromId: string, toId: string, capacity: number, mode: "rail" | "truck" | "air" | "ship") => void;
}

export function ManualConnectionCreator({ nodes, onCreateConnection }: ManualConnectionCreatorProps) {
  const [fromNode, setFromNode] = useState<string>("");
  const [toNode, setToNode] = useState<string>("");
  const [capacity, setCapacity] = useState<number>(1000);
  const [mode, setMode] = useState<"rail" | "truck" | "air" | "ship">("truck");

  const handleCreateConnection = () => {
    if (fromNode && toNode && fromNode !== toNode) {
      onCreateConnection(fromNode, toNode, capacity, mode);
      // Reset form
      setFromNode("");
      setToNode("");
      setCapacity(1000);
      setMode("truck");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Manual Connection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="from-node">From Node</Label>
            <Select value={fromNode} onValueChange={setFromNode}>
              <SelectTrigger>
                <SelectValue placeholder="Select from node" />
              </SelectTrigger>
              <SelectContent>
                {nodes.map((node) => (
                  <SelectItem key={node.id} value={node.id}>
                    {node.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="to-node">To Node</Label>
            <Select value={toNode} onValueChange={setToNode}>
              <SelectTrigger>
                <SelectValue placeholder="Select to node" />
              </SelectTrigger>
              <SelectContent>
                {nodes.filter(node => node.id !== fromNode).map((node) => (
                  <SelectItem key={node.id} value={node.id}>
                    {node.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
            />
          </div>
          
          <div>
            <Label htmlFor="mode">Transportation Mode</Label>
            <Select value={mode} onValueChange={(value: "rail" | "truck" | "air" | "ship") => setMode(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="truck">Truck</SelectItem>
                <SelectItem value="rail">Rail</SelectItem>
                <SelectItem value="air">Air</SelectItem>
                <SelectItem value="ship">Ship</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={handleCreateConnection}
          disabled={!fromNode || !toNode || fromNode === toNode}
          className="w-full"
        >
          Create Connection
        </Button>
      </CardContent>
    </Card>
  );
}
