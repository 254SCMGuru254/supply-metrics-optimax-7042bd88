import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useParams } from 'react-router-dom';
import { Database, Upload, Settings, Package } from 'lucide-react';
import { ComprehensiveDataContent } from '@/components/data-input/ComprehensiveDataContent';
import { GeneralDataContent } from '@/components/data-input/GeneralDataContent';
import { WarehouseConfigContent } from '@/components/warehouse/WarehouseConfigContent';
import { Node } from '@/integrations/supabase/types';

const DataInput = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [nodes, setNodes] = useState<Node[]>([]);

  if (!projectId) {
    return (
      <div className="container mx-auto text-center py-10">
        <Database className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">Project Required</h2>
        <p className="mt-2 text-muted-foreground">Please select a project to begin data input.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2 text-foreground">
          <Database className="h-8 w-8" />
          Data Input & Management
        </h1>
        <p className="text-muted-foreground">
          Configure your supply chain data for optimization models
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="general">General Data</TabsTrigger>
          <TabsTrigger value="comprehensive">Comprehensive Data</TabsTrigger>
          <TabsTrigger value="warehouse">Warehouse Config</TabsTrigger>
          <TabsTrigger value="upload">Data Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralDataContent projectId={projectId} />
        </TabsContent>

        <TabsContent value="comprehensive">
          <ComprehensiveDataContent projectId={projectId} />
        </TabsContent>

        <TabsContent value="warehouse">
          <WarehouseConfigContent 
            projectId={projectId}
            nodes={nodes}
            setNodes={setNodes}
          />
        </TabsContent>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Data Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Upload CSV or Excel files with your supply chain data.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataInput;
