
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataInputForm } from '@/components/data/DataInputForm';
import { FileImport } from '@/components/data/FileImport';
import { EditableMapPoints } from '@/components/interactive-editing/EditableMapPoints';

// Define local interface
interface Node {
  id: string;
  name: string;
  type: 'supplier' | 'warehouse' | 'retail' | 'demand' | 'facility';
  latitude: number;
  longitude: number;
  capacity?: number;
  demand?: number;
  fixed_cost?: number;
  variable_cost?: number;
}

const DataInput = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [nodes, setNodes] = useState<Node[]>([]);

  if (!projectId) {
    return (
      <div className="container mx-auto px-4 py-8 text-center bg-background text-foreground">
        <div className="p-8 rounded-lg border border-border bg-card">
          <p className="text-foreground">No project selected. Please go back to the dashboard and select a project.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-background text-foreground min-h-screen">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Data Input & Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="manual" className="space-y-4">
            <TabsList className="bg-muted">
              <TabsTrigger value="manual" className="data-[state=active]:bg-background data-[state=active]:text-foreground">Manual Entry</TabsTrigger>
              <TabsTrigger value="import" className="data-[state=active]:bg-background data-[state=active]:text-foreground">File Import</TabsTrigger>
              <TabsTrigger value="map" className="data-[state=active]:bg-background data-[state=active]:text-foreground">Interactive Map</TabsTrigger>
            </TabsList>

            <TabsContent value="manual">
              <DataInputForm projectId={projectId} />
            </TabsContent>

            <TabsContent value="import">
              <FileImport projectId={projectId} />
            </TabsContent>

            <TabsContent value="map">
              <EditableMapPoints 
                nodes={nodes}
                setNodes={setNodes}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataInput;
