
import { useParams } from "react-router-dom";
import { WarehouseConfigContent } from "@/components/warehouse/WarehouseConfigContent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";
import { useState } from "react";

// Define Node interface locally
interface Node {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  capacity?: number;
  demand?: number;
  fixed_cost?: number;
  variable_cost?: number;
}

const WarehousePage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [nodes, setNodes] = useState<Node[]>([]);

  if (!projectId) {
    return (
        <div className="flex items-center justify-center h-full">
            <p>Please select a project to continue.</p>
        </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Building className="h-6 w-6" />
                    Warehouse Configuration
                </CardTitle>
                <CardDescription>
                    Manage and configure your warehouse nodes for this project.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <WarehouseConfigContent 
                  projectId={projectId} 
                  nodes={nodes}
                  setNodes={setNodes}
                />
            </CardContent>
        </Card>
    </div>
  );
};

export default WarehousePage;
