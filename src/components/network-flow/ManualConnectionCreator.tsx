import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Link } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { Node, Route } from "@/components/map/MapTypes";

interface ManualConnectionCreatorProps {
  nodes: Node[];
  onAddRoute: (route: Omit<Route, "id">) => void;
}

export function ManualConnectionCreator({ nodes, onAddRoute }: ManualConnectionCreatorProps) {
  const [fromNode, setFromNode] = useState<string>("");
  const [toNode, setToNode] = useState<string>("");
  const [volume, setVolume] = useState<number>(50);
  const [transitTime, setTransitTime] = useState<number>(2);
  const [mode, setMode] = useState<"truck" | "rail" | "ship" | "air">("truck");
  const { toast } = useToast();

  const handleAddConnection = () => {
    if (!fromNode || !toNode) {
      toast({
        title: "Missing nodes",
        description: "Please select both origin and destination nodes",
        variant: "destructive"
      });
      return;
    }

    if (fromNode === toNode) {
      toast({
        title: "Invalid connection",
        description: "Origin and destination cannot be the same",
        variant: "destructive"
      });
      return;
    }

    const newRoute: Omit<Route, "id"> = {
      from: fromNode,
      to: toNode,
      volume,
      transitTime,
      mode,
      ownership: 'owned'
    };

    onAddRoute(newRoute);
    toast({
      title: "Connection created",
      description: "New network connection has been added successfully"
    });

    // Reset form after submission
    setVolume(50);
    setTransitTime(2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Create Manual Connection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="fromNode">Origin Node</Label>
            <Select value={fromNode} onValueChange={setFromNode}>
              <SelectTrigger id="fromNode">
                <SelectValue placeholder="Select origin" />
              </SelectTrigger>
              <SelectContent>
                {nodes.map((node) => (
                  <SelectItem key={node.id} value={node.id}>
                    {node.name} ({node.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="toNode">Destination Node</Label>
            <Select value={toNode} onValueChange={setToNode}>
              <SelectTrigger id="toNode">
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                {nodes.map((node) => (
                  <SelectItem key={node.id} value={node.id}>
                    {node.name} ({node.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="volume">Volume (units)</Label>
            <Input
              id="volume"
              type="number"
              min="1"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
            />
          </div>
          
          <div>
            <Label htmlFor="transitTime">Transit Time (hours)</Label>
            <Input
              id="transitTime"
              type="number"
              min="0.1"
              step="0.1"
              value={transitTime}
              onChange={(e) => setTransitTime(Number(e.target.value))}
            />
          </div>
          
          <div>
            <Label htmlFor="mode">Transportation Mode</Label>
            <Select value={mode} onValueChange={(value: "truck" | "rail" | "ship" | "air") => setMode(value)}>
              <SelectTrigger id="mode">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="truck">Truck</SelectItem>
                <SelectItem value="rail">Rail</SelectItem>
                <SelectItem value="ship">Ship</SelectItem>
                <SelectItem value="air">Air</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button className="w-full" onClick={handleAddConnection}>
          <Plus className="h-4 w-4 mr-2" />
          Add Connection
        </Button>
      </CardContent>
    </Card>
  );
}
